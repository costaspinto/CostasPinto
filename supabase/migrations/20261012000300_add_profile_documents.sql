-- Add optional related-document metadata to education and experience records.
-- Existing rows are preserved; the new fields default to empty JSON arrays.
ALTER TABLE public.education
  ADD COLUMN IF NOT EXISTS documents jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS documents jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Keep the expected document shape as an array. Application validation also
-- limits titles/descriptions and permits only public HTTP(S) links.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'education_documents_is_array'
      AND conrelid = 'public.education'::regclass
  ) THEN
    ALTER TABLE public.education
      ADD CONSTRAINT education_documents_is_array
      CHECK (jsonb_typeof(documents) = 'array');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'experiences_documents_is_array'
      AND conrelid = 'public.experiences'::regclass
  ) THEN
    ALTER TABLE public.experiences
      ADD CONSTRAINT experiences_documents_is_array
      CHECK (jsonb_typeof(documents) = 'array');
  END IF;
END $$;
