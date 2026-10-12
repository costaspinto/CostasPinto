import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { createRecommendation, deleteRecommendation, setRecommendationVisibility } from './actions';

export const dynamic = 'force-dynamic';
type Row = { id:string; reviewer_name:string; reviewer_role:string; organization:string; recommendation:string; profile_url:string|null; rating:number; is_approved:boolean; is_published:boolean; created_at:string };
export default async function RecommendationsAdminPage() {
  await requireAdmin();
  const { data, error } = await createAdminClient().from('recommendations').select('*').order('created_at',{ascending:false}).limit(100);
  const rows = (data ?? []) as Row[];
  return <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-5xl">
    <Link href="/admin" className="text-sm font-semibold text-emerald-900 hover:underline">← Admin dashboard</Link>
    <h1 className="mt-5 text-3xl font-black">Recommendations</h1><p className="mt-2 text-sm text-slate-600">New entries are hidden until approved and published.</p>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">Database query failed. Apply the included migration and retry.</p>}
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-bold">Add recommendation</h2>
      <form action={createRecommendation} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Reviewer name<input required name="reviewer_name" maxLength={100} className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <label className="text-sm">Role<input name="reviewer_role" maxLength={120} className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <label className="text-sm">Organization<input name="organization" maxLength={120} className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <label className="text-sm">Profile URL<input name="profile_url" type="url" placeholder="https://..." className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <label className="text-sm">Rating<select name="rating" defaultValue="5" className="mt-1 w-full rounded-lg border p-2.5">{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} / 5</option>)}</select></label>
        <label className="text-sm sm:col-span-2">Recommendation<textarea required name="recommendation" minLength={20} maxLength={2000} rows={4} className="mt-1 w-full rounded-lg border p-2.5" /></label>
        <button className="rounded-xl bg-emerald-950 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:col-span-2">Save as pending</button>
      </form></section>
    <section className="mt-8 space-y-4">{rows.map(row=><article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold">{row.reviewer_name}</h2><p className="text-xs text-slate-500">{[row.reviewer_role,row.organization].filter(Boolean).join(' · ')} · {row.rating}/5</p></div><p className="text-xs">{row.is_approved?'Approved':'Pending'} / {row.is_published?'Published':'Hidden'}</p></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{row.recommendation}</p>
      <div className="mt-4 flex flex-wrap gap-2"><form action={setRecommendationVisibility}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="is_approved" value={row.is_approved?'false':'true'}/><input type="hidden" name="is_published" value={row.is_approved?'false':'true'}/><button className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50">{row.is_approved?'Unapprove':'Approve and publish'}</button></form>
      <form action={setRecommendationVisibility}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="is_approved" value="true"/><input type="hidden" name="is_published" value={row.is_published?'false':'true'}/><button className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50">{row.is_published?'Unpublish':'Publish (approved)'}</button></form>
      <form action={setRecommendationVisibility}><input type="hidden" name="id" value={row.id}/><input type="hidden" name="is_approved" value="false"/><input type="hidden" name="is_published" value="false"/><button className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">Reject / hide</button></form>
      <form action={deleteRecommendation}><input type="hidden" name="id" value={row.id}/><button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">Delete</button></form></div></article>)}{!rows.length&&!error&&<p className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">No recommendations yet.</p>}</section>
  </div></main>;
}
