import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

function finish(request: Request, path: string) {
  const trustedBase = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const response = NextResponse.redirect(new URL(path, trustedBase));
  response.cookies.delete('linkedin_oauth_state');
  return response;
}

function safeProviderError(value: string | null) {
  if (value === 'access_denied') return 'access_denied';
  return 'callback_failed';
}

type LinkedInUserInfo = {
  sub?: string;
  name?: string;
  headline?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
};

export async function GET(request: Request) {
  // Both initiation and callback require an authorized admin session.
  await requireAdmin();

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');
  const cookieStore = await cookies();
  const savedState = cookieStore.get('linkedin_oauth_state')?.value;

  if (oauthError) return finish(request, `/admin/integrations?linkedin_error=${safeProviderError(oauthError)}`);
  if (!code || !returnedState || !savedState || returnedState !== savedState) {
    return finish(request, '/admin/integrations?linkedin_error=invalid_state');
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    return finish(request, '/admin/integrations?linkedin_error=missing_credentials');
  }

  try {
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code', code, client_id: clientId,
        client_secret: clientSecret, redirect_uri: redirectUri,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!tokenResponse.ok) {
      console.error('LinkedIn token exchange failed with status:', tokenResponse.status);
      return finish(request, '/admin/integrations?linkedin_error=token_exchange');
    }

    const token = await tokenResponse.json() as { access_token?: string; expires_in?: number; scope?: string };
    if (!token.access_token) return finish(request, '/admin/integrations?linkedin_error=missing_token');

    // Fetch only fields available through the approved OpenID Connect userinfo endpoint.
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    if (!profileResponse.ok) {
      console.error('LinkedIn userinfo request failed with status:', profileResponse.status);
      return finish(request, '/admin/integrations?linkedin_error=userinfo');
    }
    const linkedInProfile = await profileResponse.json() as LinkedInUserInfo;
    if (!linkedInProfile.sub) return finish(request, '/admin/integrations?linkedin_error=userinfo');

    const db = createAdminClient();
    const scopes = (token.scope ?? 'openid profile email').split(/\s+/).filter(Boolean);
    const expiresAt = typeof token.expires_in === 'number'
      ? new Date(Date.now() + token.expires_in * 1000).toISOString()
      : null;

    const { error: tokenError } = await db.from('integration_credentials').upsert({
      provider: 'linkedin',
      access_token: token.access_token,
      expires_at: expiresAt,
      scopes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'provider' });
    if (tokenError) {
      console.error('LinkedIn token storage failed:', tokenError.message);
      return finish(request, '/admin/integrations?linkedin_error=token_storage');
    }

    // Only sync OIDC user claims; other LinkedIn fields require separate approved API access.
    const { data: existingProfile, error: profileLookupError } = await db
      .from('profile')
      .select('id,full_name,headline,summary,location,email,linkedin_url,github_url,source')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (profileLookupError) {
      console.error('LinkedIn profile lookup failed:', profileLookupError.message);
      return finish(request, '/admin/integrations?linkedin_error=profile_sync');
    }

    const profilePatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (linkedInProfile.name) profilePatch.full_name = linkedInProfile.name;
    if (linkedInProfile.headline) profilePatch.headline = linkedInProfile.headline;
    if (linkedInProfile.email) profilePatch.email = linkedInProfile.email;
    if (linkedInProfile.picture) profilePatch.avatar_url = linkedInProfile.picture;
    profilePatch.linkedin_url = existingProfile?.linkedin_url || 'https://www.linkedin.com/in/costaspinto/';
    profilePatch.source = 'linkedin';

    const profileSave = existingProfile
      ? await db.from('profile').update(profilePatch).eq('id', existingProfile.id)
      : await db.from('profile').insert({
          slug: 'main',
          full_name: linkedInProfile.name || 'Costas Pinto',
          headline: 'AI/ML Engineer | Generative AI | LLM Applications',
          summary: 'I build practical AI and machine learning applications, with a focus on generative AI, LLM-powered tools, and turning experiments into useful products.',
          location: 'Maharashtra, India',
          email: linkedInProfile.email || null,
          avatar_url: linkedInProfile.picture || null,
          linkedin_url: 'https://www.linkedin.com/in/costaspinto/',
          github_url: 'https://github.com/costaspinto',
          is_published: true,
          source: 'linkedin',
          updated_at: new Date().toISOString(),
        });

    if (profileSave.error) {
      console.error('LinkedIn profile sync failed:', profileSave.error.message);
      return finish(request, '/admin/integrations?linkedin_error=profile_sync');
    }

    return finish(request, '/admin/integrations?linkedin_connected=1');
  } catch (error) {
    console.error('LinkedIn callback failed:', error instanceof Error ? error.name : 'unknown error');
    return finish(request, '/admin/integrations?linkedin_error=callback_failed');
  }
}
