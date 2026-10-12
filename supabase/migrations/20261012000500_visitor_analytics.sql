-- Add a pseudonymous browser identifier for estimated unique-visitor counts.
-- This is not a person-level identity and can be cleared by the visitor.
alter table public.analytics_events
  add column if not exists visitor_id uuid;
create index if not exists analytics_events_visitor_created_idx
  on public.analytics_events(visitor_id, created_at desc)
  where visitor_id is not null;
