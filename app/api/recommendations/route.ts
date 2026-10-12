import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
const schema = z.object({
  reviewer_name: z.string().trim().min(2).max(100),
  reviewer_role: z.string().trim().max(120).default(''),
  organization: z.string().trim().max(120).default(''),
  recommendation: z.string().trim().min(20).max(2000),
  profile_url: z.union([z.literal(''), z.string().url().max(500)]).default(''),
  rating: z.coerce.number().int().min(1).max(5),
  website: z.string().max(0).optional(),
});
export async function POST(request: Request) {
  try {
    const length = Number(request.headers.get('content-length') ?? '0');
    if (length > 12_000) return NextResponse.json({ error: 'Submission is too large.' }, { status: 413 });
    const form = await request.formData();
    const parsed = schema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success) return NextResponse.json({ error: 'Please check the form. Name, a 20-character recommendation, and a valid rating are required.' }, { status: 400 });
    const { reviewer_name, reviewer_role, organization, recommendation, profile_url, rating } = parsed.data;
    const { error } = await createAdminClient().from('recommendations').insert({
      reviewer_name, reviewer_role, organization, recommendation,
      profile_url: profile_url || null, rating, is_approved: false, is_published: false,
    });
    if (error) {
      console.error('Public recommendation insert failed:', error.message);
      return NextResponse.json({ error: 'Recommendations are temporarily unavailable. Please try again later.' }, { status: 503 });
    }
    return NextResponse.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Could not process the recommendation. Please try again.' }, { status: 500 });
  }
}
