'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

const newKnowledgeSchema = z.object({
  title: z.string().trim().min(1).max(180),
  category: z.string().trim().min(1).max(80),
  content: z.string().trim().min(1).max(8000),
  sort_order: z.coerce.number().int().min(0).max(100000),
  is_published: z.enum(['true', 'false']),
});

const statusSchema = z.object({ id: z.string().uuid(), is_published: z.enum(['true', 'false']) });
const deleteSchema = z.object({ id: z.string().uuid() });

export async function createKnowledge(formData: FormData) {
  await requireAdmin();
  const parsed = newKnowledgeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect('/admin/knowledge?status=invalid');
  const db = createAdminClient();
  const { error } = await db.from('ai_knowledge').insert({
    ...parsed.data,
    source: 'manual',
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error('Knowledge insert failed:', error.message);
    redirect('/admin/knowledge?status=error');
  }
  redirect('/admin/knowledge?status=saved');
}

export async function updateKnowledgeStatus(formData: FormData) {
  await requireAdmin();
  const parsed = statusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect('/admin/knowledge?status=invalid');
  const db = createAdminClient();
  const { error } = await db.from('ai_knowledge').update({
    is_published: parsed.data.is_published === 'true',
    updated_at: new Date().toISOString(),
  }).eq('id', parsed.data.id);
  if (error) {
    console.error('Knowledge update failed:', error.message);
    redirect('/admin/knowledge?status=error');
  }
  redirect('/admin/knowledge?status=saved');
}

export async function deleteKnowledge(formData: FormData) {
  await requireAdmin();
  const parsed = deleteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect('/admin/knowledge?status=invalid');
  const db = createAdminClient();
  const { error } = await db.from('ai_knowledge').delete().eq('id', parsed.data.id);
  if (error) {
    console.error('Knowledge delete failed:', error.message);
    redirect('/admin/knowledge?status=error');
  }
  redirect('/admin/knowledge?status=deleted');
}
