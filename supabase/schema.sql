-- Costas AI Portfolio schema. Safe to re-run: tables, columns, indexes and policies are idempotent.
-- Run with a privileged Supabase SQL Editor connection. RLS protects public content reads;
-- admin mutations are performed server-side only after requireAdmin().

create extension if not exists pgcrypto;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null default 'costas',
  full_name text not null default 'Costas Pinto',
  headline text not null default '',
  summary text not null default '',
  location text not null default '',
  email text,
  linkedin_url text,
  github_url text,
  resume_path text,
  avatar_url text,
  is_published boolean not null default true,
  source text not null default 'manual',
  updated_at timestamptz not null default now()
);
alter table public.profile add column if not exists avatar_url text;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null default 'AI/ML',
  description text not null default '',
  technologies text[] not null default '{}',
  repository_url text,
  demo_url text,
  image_path text,
  featured boolean not null default false,
  is_published boolean not null default false,
  source text not null default 'manual',
  source_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  role text not null,
  description text not null default '',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  is_published boolean not null default false,
  source text not null default 'manual',
  source_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  qualification text not null,
  field_of_study text,
  start_date date,
  end_date date,
  description text,
  is_published boolean not null default true,
  source text not null default 'manual',
  source_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text not null default 'Technical',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  source text not null default 'manual',
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null default '',
  credential_url text,
  issued_at date,
  expires_at date,
  is_published boolean not null default false,
  source text not null default 'manual',
  source_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_post_id text not null,
  post_url text,
  content text not null default '',
  published_at timestamptz,
  is_published boolean not null default false,
  imported_at timestamptz not null default now(),
  unique(provider, provider_post_id)
);

create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null,
  records_seen integer not null default 0,
  records_changed integer not null default 0,
  message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.chat_feedback (
  id uuid primary key default gen_random_uuid(),
  session_hash text,
  rating smallint check (rating between 1 and 5),
  feedback text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_knowledge (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null default 'general',
  source text not null default 'manual',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integration_credentials (
  provider text primary key check (provider in ('linkedin')),
  access_token text not null,
  expires_at timestamptz,
  scopes text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_featured_updated_idx
  on public.projects (is_published, featured desc, updated_at desc);
create index if not exists projects_source_idx on public.projects (source);
create unique index if not exists projects_source_source_id_key
  on public.projects (source, source_id) where source_id is not null;
create index if not exists ai_knowledge_published_sort_idx
  on public.ai_knowledge (is_published, sort_order);

-- RLS is enabled for every table. Public reads are limited to published portfolio content.
alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.social_posts enable row level security;
alter table public.sync_runs enable row level security;
alter table public.chat_feedback enable row level security;
alter table public.ai_knowledge enable row level security;
alter table public.integration_credentials enable row level security;

grant select on public.profile, public.projects, public.experiences, public.education,
  public.skills, public.certifications, public.social_posts, public.ai_knowledge
  to anon, authenticated;
revoke insert, update, delete, truncate on public.profile, public.projects, public.experiences,
  public.education, public.skills, public.certifications, public.social_posts, public.ai_knowledge
  from anon, authenticated;
revoke all privileges on public.sync_runs, public.chat_feedback, public.integration_credentials
  from anon, authenticated;

-- DROP/CREATE makes this policy section safe to rerun and keeps the named policies consistent.
drop policy if exists "public read published profile" on public.profile;
create policy "public read published profile" on public.profile for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published experiences" on public.experiences;
create policy "public read published experiences" on public.experiences for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published education" on public.education;
create policy "public read published education" on public.education for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published skills" on public.skills;
create policy "public read published skills" on public.skills for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published certifications" on public.certifications;
create policy "public read published certifications" on public.certifications for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published posts" on public.social_posts;
create policy "public read published posts" on public.social_posts for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published ai knowledge" on public.ai_knowledge;
create policy "public read published ai knowledge" on public.ai_knowledge for select to anon, authenticated using (is_published = true);

-- No public or ordinary authenticated-user policy exists for credentials, sync logs or chat feedback.
-- Server-side mutations must call requireAdmin() before creating the service-role client operation.
