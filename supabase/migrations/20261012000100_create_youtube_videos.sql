-- Public YouTube video cache. Sync writes happen server-side with the service-role client.
create table if not exists public.youtube_videos (
  video_id text primary key,
  title text not null,
  description text not null default '',
  thumbnail_url text,
  published_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  content_type text not null check (content_type in ('short', 'video')),
  watch_url text not null,
  is_published boolean not null default true,
  synced_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists youtube_videos_published_date_idx
  on public.youtube_videos (is_published, published_at desc);

alter table public.youtube_videos enable row level security;
grant select on public.youtube_videos to anon, authenticated;
revoke insert, update, delete, truncate on public.youtube_videos from anon, authenticated;

drop policy if exists "public read published youtube videos" on public.youtube_videos;
create policy "public read published youtube videos"
  on public.youtube_videos for select to anon, authenticated
  using (is_published = true);
