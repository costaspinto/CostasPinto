import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
export const dynamic='force-dynamic';
type EventRow={event_name:string;path:string;referrer_host:string|null;created_at:string;visitor_id:string|null};
export default async function AnalyticsPage(){
 await requireAdmin(); const db=createAdminClient(); const now=new Date(); const start7=new Date(now);start7.setDate(now.getDate()-7);const start30=new Date(now);start30.setDate(now.getDate()-30);
 const [week,month,recent,visitors]=await Promise.all([
  db.from('analytics_events').select('id',{count:'exact',head:true}).gte('created_at',start7.toISOString()),
  db.from('analytics_events').select('id',{count:'exact',head:true}).gte('created_at',start30.toISOString()),
  db.from('analytics_events').select('event_name,path,referrer_host,created_at,visitor_id').gte('created_at',start30.toISOString()).order('created_at',{ascending:false}).limit(100),
  db.from('analytics_events').select('visitor_id').eq('event_name','page_view').gte('created_at',start30.toISOString()).not('visitor_id','is',null).limit(10000)
 ]);
 const uniqueVisitors = new Set((visitors.data ?? []).map((event) => event.visitor_id).filter((id): id is string => Boolean(id))).size;
 return <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-5xl"><Link href="/admin" className="text-sm font-semibold text-emerald-900 hover:underline">← Admin dashboard</Link><h1 className="mt-5 text-3xl font-black">Portfolio analytics</h1><p className="mt-2 text-sm text-slate-600">Privacy-conscious event counts. Referrer host only; no raw IP or query string is stored.</p>
 {week.error||month.error||recent.error||visitors.error?<p role="alert" className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Analytics table is unavailable. Apply the included migration.</p>:<><div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">Events · last 7 days</p><p className="mt-2 text-4xl font-black">{(week.count??0).toLocaleString()}</p></div><div className="rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">Estimated unique visitors · last 30 days</p><p className="mt-2 text-4xl font-black">{uniqueVisitors.toLocaleString()}</p><p className="mt-1 text-xs text-slate-500">Based on recent visitor IDs</p></div><div className="rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">Events · last 30 days</p><p className="mt-2 text-4xl font-black">{(month.count??0).toLocaleString()}</p></div></div><div className="mt-7 overflow-x-auto rounded-2xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Event</th><th className="p-3">Path</th><th className="p-3">Referrer host</th><th className="p-3">Time</th></tr></thead><tbody>{((recent.data??[]) as EventRow[]).map((e,i)=><tr key={`${e.created_at}-${i}`} className="border-t"><td className="p-3">{e.event_name}</td><td className="p-3">{e.path}</td><td className="p-3">{e.referrer_host??'—'}</td><td className="p-3">{new Date(e.created_at).toLocaleString()}</td></tr>)}</tbody></table></div></>}
 </div></main>;
}
