-- Additive migration for existing installations. Safe to apply more than once.
alter table public.profile add column if not exists avatar_url text;

create table if not exists public.integration_credentials (
  provider text primary key check (provider in ('linkedin')),
  access_token text not null,
  expires_at timestamptz,
  scopes text[] not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.integration_credentials enable row level security;
revoke all privileges on public.integration_credentials from anon, authenticated;

create unique index if not exists projects_source_source_id_key
  on public.projects (source, source_id) where source_id is not null;
