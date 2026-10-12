'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

const schema = z.object({
  reviewer_name: z.string().trim().min(2).max(100), reviewer_role: z.string().trim().max(120),
  organization: z.string().trim().max(120), recommendation: z.string().trim().min(20).max(2000),
  profile_url: z.union([z.literal(''), z.string().url().max(500)]), rating: z.coerce.number().int().min(1).max(5),
});
const idSchema = z.string().uuid();

export async function createRecommendation(formData: FormData) {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error('Invalid recommendation. Check each field and try again.');
  const db = createAdminClient();
  const { error } = await db.from('recommendations').insert({ ...parsed.data, profile_url: parsed.data.profile_url || null, is_approved: false, is_published: false });
  if (error) throw new Error('Could not save recommendation. Verify the database migration was applied.');
  revalidatePath('/admin/recommendations');
}

export async function setRecommendationVisibility(formData: FormData) {
  await requireAdmin();
  const id = idSchema.safeParse(formData.get('id'));
  const approved = formData.get('is_approved') === 'true';
  const published = formData.get('is_published') === 'true';
  if (!id.success || (published && !approved)) throw new Error('Invalid recommendation status. Published recommendations must be approved.');
  const { error } = await createAdminClient().from('recommendations').update({ is_approved: approved, is_published: published, updated_at: new Date().toISOString() }).eq('id', id.data);
  if (error) throw new Error('Could not update recommendation.');
  revalidatePath('/admin/recommendations'); revalidatePath('/');
}

export async function deleteRecommendation(formData: FormData) {
  await requireAdmin();
  const id = idSchema.safeParse(formData.get('id'));
  if (!id.success) throw new Error('Invalid recommendation ID.');
  const { error } = await createAdminClient().from('recommendations').delete().eq('id', id.data);
  if (error) throw new Error('Could not delete recommendation.');
  revalidatePath('/admin/recommendations'); revalidatePath('/');
}
