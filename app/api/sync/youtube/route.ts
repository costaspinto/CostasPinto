import { NextResponse } from 'next/server';
import { syncYouTubeVideos } from '@/lib/youtube';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const isCron = Boolean(secret) && request.headers.get('authorization') === `Bearer ${secret}`;

  if (!isCron) {
    const { requireAdmin } = await import('@/lib/auth/admin');
    await requireAdmin();
  }

  try {
    const result = await syncYouTubeVideos();

    if (isCron) return NextResponse.json({ ok: true, ...result });

    const url = new URL('/admin/integrations', request.url);
    url.searchParams.set('youtube_synced', '1');
    url.searchParams.set('youtube_fetched', String(result.fetched));
    url.searchParams.set('youtube_shorts', String(result.shorts));
    url.searchParams.set('youtube_videos', String(result.videos));
    return NextResponse.redirect(url, 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'YouTube synchronization failed.';
    console.error('YouTube synchronization failed:', message);

    if (isCron) return NextResponse.json({ ok: false, error: message }, { status: 502 });

    const url = new URL('/admin/integrations', request.url);
    url.searchParams.set('youtube_error', message.includes('YOUTUBE_API_KEY') ? 'missing_key' : 'sync_failed');
    return NextResponse.redirect(url, 303);
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