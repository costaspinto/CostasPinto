import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
export const dynamic = 'force-dynamic';
const schema = z.object({ event: z.enum(['page_view','project_click','resume_click','contact_click']), path: z.string().trim().min(1).max(300).refine(v=>v.startsWith('/')&&!v.startsWith('//')), referrer: z.string().max(1000).optional(), visitor_id: z.string().uuid().optional() });
export async function POST(request: Request) {
  const length = Number(request.headers.get('content-length') ?? '0');
  if (length > 4096) return NextResponse.json({ok:false}, {status:413});
  try {
    const body = schema.safeParse(await request.json());
    if (!body.success) return NextResponse.json({ok:false}, {status:400});
    let host: string | null = null;
    if (body.data.referrer) { try { host = new URL(body.data.referrer).hostname.slice(0,200) || null; } catch { host = null; } }
    const { error } = await createAdminClient().from('analytics_events').insert({event_name:body.data.event,path:body.data.path,referrer_host:host,visitor_id:body.data.visitor_id ?? null});
    if (error) { console.error('Analytics event insert failed:', error.message); return NextResponse.json({ok:false}, {status:503}); }
    return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  } catch { return NextResponse.json({ok:false},{status:503}); }
}
