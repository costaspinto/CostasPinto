-- Master portfolio upgrade: recommendations, project media, privacy-conscious analytics.
create extension if not exists pgcrypto;

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null check (char_length(reviewer_name) between 2 and 100),
  reviewer_role text not null default '' check (char_length(reviewer_role) <= 120),
  organization text not null default '' check (char_length(organization) <= 120),
  recommendation text not null check (char_length(recommendation) between 20 and 2000),
  profile_url text,
  rating smallint not null default 5 check (rating between 1 and 5),
  is_approved boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.recommendations enable row level security;
revoke all on public.recommendations from anon, authenticated;
grant select on public.recommendations to anon, authenticated;
drop policy if exists "public read approved recommendations" on public.recommendations;
create policy "public read approved recommendations" on public.recommendations for select to anon, authenticated using (is_approved = true and is_published = true);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null check (char_length(alt_text) between 3 and 240),
  caption text not null default '' check (char_length(caption) <= 300),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists project_media_project_sort_idx on public.project_media(project_id, sort_order, created_at);
alter table public.project_media enable row level security;
revoke all on public.project_media from anon, authenticated;
grant select on public.project_media to anon, authenticated;
drop policy if exists "public read media for published projects" on public.project_media;
create policy "public read media for published projects" on public.project_media for select to anon, authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.is_published = true)
);

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null check (event_name in ('page_view','project_click','resume_click','contact_click')),
  path text not null check (char_length(path) <= 300),
  referrer_host text check (referrer_host is null or char_length(referrer_host) <= 200),
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_created_event_idx on public.analytics_events(created_at desc, event_name);
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon, authenticated;

-- Existing sync_runs is expected by the GitHub sync route. Ensure required columns exist.
create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(), provider text not null, status text not null,
  records_seen integer not null default 0, records_changed integer not null default 0,
  message text, started_at timestamptz not null default now(), finished_at timestamptz
);
alter table public.sync_runs add column if not exists started_at timestamptz not null default now();
alter table public.sync_runs add column if not exists finished_at timestamptz;
alter table public.sync_runs enable row level security;
revoke all on public.sync_runs from anon, authenticated;

-- Create a private bucket for admin uploads. Public image delivery is via controlled public object URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-project-media','portfolio-project-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;
-- No anonymous upload/update/delete policies are created. Service-role operations must follow requireAdmin().
