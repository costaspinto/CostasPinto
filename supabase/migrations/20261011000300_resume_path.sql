-- Idempotent addition for existing portfolio databases.
-- The base schema already includes this column; this migration safely covers older installations.
alter table public.profile add column if not exists resume_path text;
