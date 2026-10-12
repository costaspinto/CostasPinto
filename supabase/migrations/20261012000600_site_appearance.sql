create table if not exists public.site_settings (
  setting_key text primary key,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon, authenticated;
drop policy if exists "public read appearance setting" on public.site_settings;
create policy "public read appearance setting" on public.site_settings for select to anon, authenticated using (setting_key = 'appearance');
insert into public.site_settings(setting_key, setting_value)
values ('appearance', '{"accent":"#10b981","surface":"#080d0a","text":"#eff7f1"}'::jsonb)
on conflict (setting_key) do nothing;
