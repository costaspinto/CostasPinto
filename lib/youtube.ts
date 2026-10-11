import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type YouTubeVideo = {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  published_at: string | null;
  duration_seconds: number;
  content_type: 'short' | 'video';
  watch_url: string;
};

type YouTubeChannelResponse = {
  items?: Array<{
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
  }>;
};

type YouTubePlaylistResponse = {
  items?: Array<{
    contentDetails?: { videoId?: string };
    snippet?: { resourceId?: { videoId?: string } };
  }>;
};

type YouTubeVideosResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: Record<string, { url: string; width?: number; height?: number }>;
    };
    contentDetails?: { duration?: string };
  }>;
};

function parseIsoDuration(duration: string | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return 0;
  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Number(match[4] ?? 0);
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

async function youtubeApi<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('Missing YOUTUBE_API_KEY. Configure a server-side YouTube Data API v3 key.');

  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [name, value] of Object.entries({ ...params, key })) {
    url.searchParams.set(name, value);
  }

  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`YouTube API ${endpoint} failed (${response.status}):`, text.slice(0, 600));
    throw new Error(`YouTube API request failed with status ${response.status}. Check the API key, quota, and YouTube Data API v3 access.`);
  }

  return (await response.json()) as T;
}

/** Fetches a small public cache of uploads for the portfolio homepage. */
export async function getYouTubeVideos(): Promise<YouTubeVideo[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('video_id,title,description,thumbnail_url,published_at,duration_seconds,content_type,watch_url')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(60);

    if (error) {
      console.error('YouTube content read failed:', error.message);
      return [];
    }

    return (data ?? []) as YouTubeVideo[];
  } catch (error) {
    console.error('YouTube content read failed:', error);
    return [];
  }
}

/** Sync the 50 most recent public uploads for @ArkByteab into Supabase. */
export async function syncYouTubeVideos() {
  const channel = await youtubeApi<YouTubeChannelResponse>('channels', {
    part: 'contentDetails',
    forHandle: '@ArkByteab',
  });
  const uploadsPlaylist = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylist) throw new Error('Could not find the ArkByte channel uploads playlist. Check the YouTube handle.');

  const playlist = await youtubeApi<YouTubePlaylistResponse>('playlistItems', {
    part: 'contentDetails,snippet',
    playlistId: uploadsPlaylist,
    maxResults: '50',
  });
  const ids = Array.from(new Set((playlist.items ?? [])
    .map((item) => item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId)
    .filter((id): id is string => Boolean(id))));

  if (!ids.length) return { fetched: 0, shorts: 0, videos: 0, updated: 0 };

  const detail = await youtubeApi<YouTubeVideosResponse>('videos', {
    part: 'snippet,contentDetails',
    id: ids.join(','),
    maxResults: '50',
  });

  const rows = (detail.items ?? []).map((item) => {
    const duration = parseIsoDuration(item.contentDetails?.duration);
    const thumbnails = item.snippet?.thumbnails ?? {};
    const thumbnail = thumbnails.maxres ?? thumbnails.standard ?? thumbnails.high ?? thumbnails.medium ?? thumbnails.default;
    // Channel-specific convention: <=15 seconds is a Short; all longer uploads go in Videos.
    // This matches the owner's usual format and avoids losing 16–60 second uploads.
    const contentType = duration <= 15 ? 'short' : 'video';
    return {
      video_id: item.id,
      title: item.snippet?.title || 'Untitled video',
      description: item.snippet?.description || '',
      thumbnail_url: thumbnail?.url ?? null,
      published_at: item.snippet?.publishedAt ?? null,
      duration_seconds: duration,
      content_type: contentType,
      watch_url: `https://www.youtube.com/watch?v=${encodeURIComponent(item.id)}`,
      is_published: true,
      synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  const db = createAdminClient();
  const { error } = await db.from('youtube_videos').upsert(rows, { onConflict: 'video_id' });
  if (error) {
    console.error('YouTube sync database write failed:', error.message);
    throw new Error('YouTube videos were retrieved but could not be saved in Supabase. Run the YouTube migration and check the service-role configuration.');
  }

  return {
    fetched: rows.length,
    shorts: rows.filter((row) => row.content_type === 'short').length,
    videos: rows.filter((row) => row.content_type === 'video').length,
    updated: rows.length,
  };
}
