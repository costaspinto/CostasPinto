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

create index if not exists ai_knowledge_published_sort_idx
  on public.ai_knowledge (is_published, sort_order);

alter table public.ai_knowledge enable row level security;
grant select on public.ai_knowledge to anon, authenticated;
revoke insert, update, delete, truncate on public.ai_knowledge from anon, authenticated;
drop policy if exists "public read published ai knowledge" on public.ai_knowledge;
create policy "public read published ai knowledge" on public.ai_knowledge
  for select to anon, authenticated using (is_published = true);
