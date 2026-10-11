
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  RefreshCw,
  Settings2,
  Youtube,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const errors: Record<string, string> = {
  invalid_state:
    'Authorization could not be verified. Please start the connection again.',
  missing_credentials:
    'LinkedIn OAuth credentials are missing from the server environment.',
  token_exchange:
    'LinkedIn rejected the authorization code. Verify that the redirect URL exactly matches your LinkedIn app.',
  missing_token: 'LinkedIn did not return an access token.',
  token_storage:
    'The LinkedIn token could not be saved to Supabase.',
  userinfo:
    'LinkedIn authorization succeeded, but the OpenID Connect profile could not be read. Verify the approved OpenID Connect product and scopes.',
  profile_sync:
    'The token was saved, but profile claims could not be synchronized. Confirm that the avatar_url database migration was applied.',
  callback_failed:
    'The LinkedIn connection failed. Check the server logs for details.',
  access_denied: 'You declined LinkedIn authorization.',
};

type SearchParams = {
  linkedin_connected?: string;
  linkedin_error?: string;
  github_synced?: string;
  github_failed?: string;
  github_fetched?: string;
  github_imported?: string;
  github_updated?: string;
  youtube_synced?: string;
  youtube_fetched?: string;
  youtube_shorts?: string;
  youtube_videos?: string;
  youtube_error?: string;
};

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;

  let linkedInConnected = false;
  let expiresAt: string | null = null;
  let scopeList: string[] = [];
  let statusError = false;

  try {
    const db = createAdminClient();

    const { data, error } = await db
      .from('integration_credentials')
      .select('provider,expires_at,scopes')
      .eq('provider', 'linkedin')
      .maybeSingle();

    if (error) {
      statusError = true;
    } else if (data) {
      linkedInConnected = true;
      expiresAt = data.expires_at;
      scopeList = data.scopes ?? [];
    }
  } catch {
    statusError = true;
  }

  const githubSyncSucceeded = params.github_synced !== undefined;

  return (
    <main className="min-h-screen bg-paper px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <header className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest">
            Connected services
          </p>
          <h1 className="mt-2 text-3xl font-black">Integrations</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Connect external services, synchronize repository data, and
            manage the information used by your portfolio.
          </p>
        </header>

        {params.linkedin_connected === '1' && (
          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            <CheckCircle2 size={19} className="shrink-0" />
            <p>
              LinkedIn was authorized and the available OpenID Connect
              claims were synchronized.
            </p>
          </div>
        )}

        {params.linkedin_error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
          >
            <XCircle size={19} className="shrink-0" />
            <p>
              {errors[params.linkedin_error] ??
                'LinkedIn connection failed.'}
            </p>
          </div>
        )}


        {params.youtube_synced === '1' && (
          <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-bold">YouTube sync completed.</p>
            <p className="mt-1">Fetched {params.youtube_fetched ?? '0'} uploads | {params.youtube_shorts ?? '0'} Shorts | {params.youtube_videos ?? '0'} Videos.</p>
          </div>
        )}
        {params.youtube_error && (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            {params.youtube_error === 'missing_key'
              ? 'YouTube API key is missing. Configure YOUTUBE_API_KEY in your local and Vercel server environment, then retry.'
              : 'YouTube sync failed. Check the server logs, API key restrictions/quota, and whether the Supabase migration has been applied.'}
          </div>
        )}
        {githubSyncSucceeded && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 size={23} className="text-emerald-700" />
              </span>
              <div>
                <h2 className="font-bold">GitHub sync completed</h2>
                <p className="text-sm text-emerald-800">
                  Repository synchronization finished.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-emerald-200 bg-white/70 p-3">
                <p className="text-xs text-emerald-800">Fetched</p>
                <p className="mt-1 text-2xl font-black">
                  {params.github_fetched ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white/70 p-3">
                <p className="text-xs text-emerald-800">New imports</p>
                <p className="mt-1 text-2xl font-black">
                  {params.github_imported ?? params.github_synced ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white/70 p-3">
                <p className="text-xs text-emerald-800">Updated</p>
                <p className="mt-1 text-2xl font-black">
                  {params.github_updated ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white/70 p-3">
                <p className="text-xs text-emerald-800">Failed</p>
                <p className="mt-1 text-2xl font-black">
                  {params.github_failed ?? '0'}
                </p>
              </div>
            </div>

            {params.github_failed !== undefined &&
              Number(params.github_failed) > 0 && (
                <p className="mt-4 text-sm font-medium text-amber-800">
                  Some repositories failed to sync. Check your server logs.
                </p>
              )}
          </div>
        )}

        {statusError && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            Could not read LinkedIn connection status. Check the
            integration_credentials table and server environment.
          </div>
        )}

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">
              Repository integration
            </p>
            <h2 className="mt-2 text-xl font-bold">
              GitHub repositories
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Sync repositories here. Choose and customize the projects
              displayed on your portfolio from the Projects page.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="rounded-xl bg-slate-100 p-3 text-slate-800">
                  <Github size={25} />
                </span>
                <div>
                  <h3 className="text-lg font-bold">GitHub</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Account: {process.env.GITHUB_USERNAME ?? 'costaspinto'}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 size={14} />
                Public repository sync
              </span>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-forest"
                />
                <div className="text-sm leading-6 text-slate-600">
                  <p className="font-semibold text-slate-800">
                    How repository sync works
                  </p>
                  <p className="mt-1">
                    Eligible public repositories are imported into Supabase.
                    Existing records are updated, while new records are
                    imported. Publication choices remain managed under Projects.
                  </p>
                </div>
              </div>
            </div>

            <form
              action="/api/sync/github"
              method="post"
              className="mt-6 flex flex-wrap gap-3"
            >
              <input
                type="hidden"
                name="returnTo"
                value="/admin/integrations"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <RefreshCw size={16} />
                Sync GitHub repositories
              </button>

              <Link
                href="/admin/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-forest"
              >
                Manage projects
                <ArrowRight size={16} />
              </Link>
            </form>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Creator integration</p>
            <h2 className="mt-2 text-xl font-bold">YouTube Shorts &amp; Videos</h2>
            <p className="mt-1 text-sm text-slate-600">Sync the latest public uploads from ArkByte. Videos up to 15 seconds are grouped as Shorts; longer uploads are shown as Videos.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-red-50 p-3 text-red-600"><Youtube size={24} /></span>
                <div><h3 className="font-bold">ArkByte on YouTube</h3><p className="mt-1 text-sm text-slate-600">@ArkByteab | Latest public uploads</p></div>
              </div>
              <a href="https://www.youtube.com/@ArkByteab" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-red-700 hover:text-red-800">Open channel ↗</a>
            </div>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-slate-800">Automatic sync</p>
              <p className="mt-1">The integration caches recent public uploads in Supabase so your homepage does not call YouTube on every visit. Vercel is configured to refresh the list daily; use Sync Now to refresh it immediately.</p>
              <p className="mt-2">Classification rule: 15 seconds or less = Short; anything longer defaults to Videos. Your usual longer uploads exceed one minute; any 16-60 second uploads will also appear under Videos.</p>
            </div>
            <form action="/api/sync/youtube" method="post" className="mt-5">
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                <Youtube size={16} /> Sync YouTube Shorts &amp; Videos
              </button>
            </form>
          </div>
        </section>
        <section className="mt-10">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">
              Profile integration
            </p>
            <h2 className="mt-2 text-xl font-bold">LinkedIn</h2>
            <p className="mt-1 text-sm text-slate-600">
              Manage your LinkedIn OpenID Connect connection.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[#0a66c2] p-3 text-white">
                  <Linkedin size={23} />
                </span>
                <div>
                  <h3 className="font-bold">LinkedIn OpenID Connect</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Profile, picture and email when approved by LinkedIn.
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  linkedInConnected
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {linkedInConnected ? 'Connected' : 'Not connected'}
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              The app synchronizes claims returned by LinkedIn&apos;s
              OpenID Connect userinfo endpoint. Standard OIDC access does
              not provide unrestricted access to headline, connections,
              activity, experience, education or certifications. Those
              require separately approved products and permissions.
            </p>

            {linkedInConnected && (
              <div className="mt-4 space-y-1 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
                <p>
                  <strong className="text-slate-800">Token expiry:</strong>{' '}
                  {expiresAt
                    ? new Date(expiresAt).toLocaleString()
                    : 'Not reported by provider'}
                </p>
                <p>
                  <strong className="text-slate-800">Granted scopes:</strong>{' '}
                  {scopeList.length
                    ? scopeList.join(', ')
                    : 'Not reported'}
                </p>
              </div>
            )}

            <a
              href="/api/auth/linkedin"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a66c2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0757a5]"
            >
              <Linkedin size={16} />
              {linkedInConnected ? 'Reconnect LinkedIn' : 'Connect LinkedIn'}
            </a>
          </div>
        </section>

        <p className="mt-8 flex items-start gap-2 text-xs leading-5 text-slate-500">
          <Settings2 size={15} className="mt-0.5 shrink-0" />
          Integration credentials remain server-side and should never be
          exposed to public pages.
        </p>
      </div>
    </main>
  );
}
