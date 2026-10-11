
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  headline: z.string().trim().max(180),
  summary: z.string().trim().max(3000),
  location: z.string().trim().max(160),
  email: z.union([z.string().trim().email().max(254), z.literal('')]),
  linkedin_url: z.union([
    z.string().trim().url().max(500),
    z.literal(''),
  ]),
  github_url: z.union([
    z.string().trim().url().max(500),
    z.literal(''),
  ]),
  projects_eyebrow: z.string().trim().min(1).max(100),
  projects_title: z.string().trim().min(1).max(180),
  projects_description: z.string().trim().min(1).max(500),
});

export async function saveProfile(formData: FormData) {
  await requireAdmin();

  const parsed = profileSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    redirect('/admin/profile?status=invalid');
  }

  const db = createAdminClient();

  const { data: existing, error: findError } = await db
    .from('profile')
    .select('id,slug,avatar_url')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) {
    console.error('Profile lookup failed:', findError.message);
    redirect('/admin/profile?status=error');
  }

  const values = {
    ...parsed.data,
    email: parsed.data.email || null,
    linkedin_url: parsed.data.linkedin_url || null,
    github_url: parsed.data.github_url || null,
    slug: existing?.slug || 'main',
    avatar_url: existing?.avatar_url || null,
    is_published: true,
    source: 'manual',
    updated_at: new Date().toISOString(),
  };

  const result = existing
    ? await db.from('profile').update(values).eq('id', existing.id)
    : await db.from('profile').insert(values);

  if (result.error) {
    console.error('Profile save failed:', result.error.message);
    redirect('/admin/profile?status=error');
  }

  redirect('/admin/profile?status=saved');
}
