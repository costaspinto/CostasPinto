import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { createKnowledge, deleteKnowledge, updateKnowledgeStatus } from './actions';

export const dynamic = 'force-dynamic';

type KnowledgeRow = { id: string; title: string; category: string; content: string; is_published: boolean; sort_order: number; updated_at: string };

export default async function KnowledgeAdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  let rows: KnowledgeRow[] = [];
  let loadError = false;
  try {
    const db = createAdminClient();
    const { data, error } = await db.from('ai_knowledge').select('id,title,category,content,is_published,sort_order,updated_at').order('sort_order', { ascending: true }).order('updated_at', { ascending: false });
    if (error) loadError = true;
    else rows = (data ?? []) as KnowledgeRow[];
  } catch { loadError = true; }

  const messages: Record<string, string> = {
    saved: 'Knowledge entry saved.', deleted: 'Knowledge entry deleted.',
    invalid: 'Check the form values and try again.', error: 'The knowledge table could not be updated. Verify the Supabase schema.',
  };
  return <main className="min-h-screen bg-paper px-5 py-10 sm:px-8"><div className="mx-auto max-w-5xl"><Link href="/admin" className="text-sm font-semibold text-forest">← Dashboard</Link><header className="mt-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-forest">AI assistant</p><h1 className="mt-2 text-3xl font-black">Knowledge base</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Add verified facts that the public chatbot is allowed to use. Only published entries are included in its prompt.</p></header>
    {params.status && messages[params.status] && <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{messages[params.status]}</p>}
    {loadError && <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Could not load the knowledge table. Apply the schema/migration first.</p>}
    <form action={createKnowledge} className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-bold">Add a knowledge entry</h2><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Title<input name="title" required maxLength={180} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" placeholder="For example: DocuReadAI"/></label><label className="block text-sm font-semibold">Category<input name="category" required maxLength={80} defaultValue="project" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal"/></label></div><label className="block text-sm font-semibold">Verified facts<textarea name="content" required maxLength={8000} rows={5} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal leading-6" placeholder="Facts the assistant may use to answer visitor questions."/></label><div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="block text-sm font-semibold">Sort order<input name="sort_order" type="number" min={0} max={100000} defaultValue={0} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal"/></label><label className="block text-sm font-semibold">Visibility<select name="is_published" defaultValue="false" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"><option value="false">Draft</option><option value="true">Published</option></select></label><button className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white">Add entry</button></div></form>
    <section className="mt-8"><h2 className="text-xl font-bold">Saved entries ({rows.length})</h2>{rows.length === 0 && !loadError && <p className="mt-3 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">No knowledge entries yet. The chatbot still uses published portfolio content.</p>}<div className="mt-4 space-y-4">{rows.map((row) => <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{row.title}</h3><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{row.category}</span><span className={`rounded-full px-2 py-1 text-xs ${row.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{row.is_published ? 'Published' : 'Draft'}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{row.content}</p></div></div><div className="mt-4 flex flex-wrap gap-3"><form action={updateKnowledgeStatus} className="flex items-center gap-2"><input type="hidden" name="id" value={row.id}/><select name="is_published" defaultValue={String(row.is_published)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="true">Published</option><option value="false">Draft</option></select><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-forest">Update</button></form><form action={deleteKnowledge}><input type="hidden" name="id" value={row.id}/><button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Delete</button></form></div></article>)}</div></section>
  </div></main>;
}
