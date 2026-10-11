
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  private: boolean;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
};

function redirectWithResults(
  request: Request,
  result: {
    ok: boolean;
    username: string;
    fetched: number;
    imported: number;
    updated: number;
    failed: number;
  },
) {
  const url = new URL('/admin/integrations', request.url);

  // A success indicator, even when every repository was already present.
  url.searchParams.set('github_synced', '1');
  url.searchParams.set('github_fetched', String(result.fetched));
  url.searchParams.set('github_imported', String(result.imported));
  url.searchParams.set('github_updated', String(result.updated));
  url.searchParams.set('github_failed', String(result.failed));

  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const isCron =
    !!secret &&
    request.headers.get('authorization') === `Bearer ${secret}`;

  if (!isCron) {
    const { requireAdmin } = await import('@/lib/auth/admin');
    await requireAdmin();
  }

  const username = process.env.GITHUB_USERNAME ?? 'costaspinto';

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const allRepos: GitHubRepo[] = [];
    const perPage = 100;

    for (let page = 1; ; page++) {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&per_page=${perPage}&page=${page}`,
        {
          headers,
          cache: 'no-store',
          signal: AbortSignal.timeout(20000),
        },
      );

      if (!response.ok) {
        console.error(
          'GitHub API request failed:',
          response.status,
          await response.text(),
        );

        return NextResponse.json(
          {
            ok: false,
            error: 'GitHub API request failed',
            status: response.status,
          },
          { status: 502 },
        );
      }

      const raw: unknown = await response.json();

      if (!Array.isArray(raw)) {
        return NextResponse.json(
          { ok: false, error: 'Unexpected GitHub response' },
          { status: 502 },
        );
      }

      const pageRepos = (raw as GitHubRepo[]).filter(
        (repo) => !repo.private && !repo.disabled,
      );

      allRepos.push(...pageRepos);

      if (raw.length < perPage) break;

      // Prevent an unexpectedly long pagination loop.
      if (page >= 20) break;
    }

    const db = createAdminClient();

    let imported = 0;
    let updated = 0;
    let failed = 0;

    for (const repo of allRepos) {
      const record = {
        github_id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language,
        topics: repo.topics ?? [],
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        is_fork: repo.fork,
        is_archived: repo.archived,
        created_at_github: repo.created_at,
        updated_at_github: repo.updated_at,
        synced_at: new Date().toISOString(),
      };

      const { data: existing, error: lookupError } = await db
        .from('github_repos')
        .select('id')
        .eq('github_id', repo.id)
        .maybeSingle();

      if (lookupError) {
        console.error(
          `Could not look up GitHub repository ${repo.full_name}:`,
          lookupError.message,
        );
        failed++;
        continue;
      }

      const result = existing
        ? await db
            .from('github_repos')
            .update(record)
            .eq('github_id', repo.id)
        : await db.from('github_repos').insert(record);

      if (result.error) {
        console.error(
          `Could not save GitHub repository ${repo.full_name}:`,
          result.error.message,
        );
        failed++;
      } else if (existing) {
        updated++;
      } else {
        imported++;
      }
    }

    const result = {
      ok: failed === 0,
      username,
      fetched: allRepos.length,
      imported,
      updated,
      failed,
    };

    const { error: logError } = await db.from('sync_runs').insert({
      provider: 'github',
      status: failed === 0 ? 'success' : 'partial_failure',
      records_seen: allRepos.length,
      records_changed: imported + updated,
      message: `GitHub sync for ${username}: ${imported} imported, ${updated} updated, ${failed} failed.`,
      finished_at: new Date().toISOString(),
    });

    if (logError) {
      console.error('Could not log GitHub sync:', logError.message);
    }

    // Scheduled jobs and API callers receive the JSON result.
    if (isCron) {
      return NextResponse.json(result, {
        status: failed === 0 ? 200 : 207,
      });
    }

    // Admin form submissions return to the dashboard with all counts.
    return redirectWithResults(request, result);
  } catch (error) {
    console.error('GitHub sync failed:', error);

    return NextResponse.json(
      { ok: false, error: 'GitHub synchronization failed.' },
      { status: 500 },
    );
  }
}
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (
    !secret ||
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return POST(request);
}