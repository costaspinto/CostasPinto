-- Separate editable homepage hero copy from About Me copy. Safe to rerun.
alter table public.profile add column if not exists hero_title text;
alter table public.profile add column if not exists hero_description text;
alter table public.profile add column if not exists about_title text;

-- Preserve the existing homepage appearance for already-populated profiles.
update public.profile
set hero_title = coalesce(nullif(btrim(hero_title), ''), E'I build AI that\ndoes useful things.'),
    hero_description = coalesce(
      nullif(btrim(hero_description), ''),
      nullif(btrim(summary), ''),
      'I build practical AI and machine learning applications, with a focus on generative AI, LLM-powered tools, and turning experiments into useful products.'
    ),
    about_title = coalesce(nullif(btrim(about_title), ''), 'Curious by nature. Practical by design.')
where hero_title is null or btrim(hero_title) = ''
   or hero_description is null or btrim(hero_description) = ''
   or about_title is null or btrim(about_title) = '';

alter table public.profile alter column hero_title set default E'I build AI that\ndoes useful things.';
alter table public.profile alter column hero_description set default 'I build practical AI and machine learning applications, with a focus on generative AI, LLM-powered tools, and turning experiments into useful products.';
alter table public.profile alter column about_title set default 'Curious by nature. Practical by design.';
alter table public.profile alter column hero_title set not null;
alter table public.profile alter column hero_description set not null;
alter table public.profile alter column about_title set not null;

notify pgrst, 'reload schema';
