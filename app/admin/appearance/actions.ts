'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const schema = z.object({ accent: color, surface: color, text: color, section: color, card: color, heading: color, border: color, button: color });

export async function saveAppearance(formData: FormData) {
  await requireAdmin();
  const parsed = schema.safeParse({
    accent: formData.get('accent'),
    surface: formData.get('surface'),
    text: formData.get('text'),
    section: formData.get('section'),
    card: formData.get('card'),
    heading: formData.get('heading'),
    border: formData.get('border'),
    button: formData.get('button'),
  });
  if (!parsed.success) redirect('/admin/appearance?status=invalid');

  let failed = false;
  try {
    const { error } = await createAdminClient().from('site_settings').upsert({
      setting_key: 'appearance',
      setting_value: parsed.data,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' });
    failed = Boolean(error);
    if (error) console.error('Appearance save failed:', error.message);
  } catch (error) {
    console.error('Appearance save unavailable:', error);
    failed = true;
  }
  if (failed) redirect('/admin/appearance?status=migration');
  revalidatePath('/');
  revalidatePath('/admin/appearance');
  redirect('/admin/appearance?status=saved');
}
