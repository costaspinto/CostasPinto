import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { SiteControls } from "@/components/site-controls";

export const dynamic = "force-dynamic";

async function saveEducation(formData: FormData) {
  "use server";
  await requireAdmin();
  const db = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();
  const qualification = String(formData.get("qualification") ?? "").trim();
  const institution = String(formData.get("institution") ?? "").trim();
  if (!qualification || !institution) redirect("/admin/education?status=missing");
  const payload = {
    qualification,
    institution,
    field_of_study: String(formData.get("field_of_study") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    start_date: String(formData.get("start_date") ?? "").trim() || null,
    end_date: String(formData.get("end_date") ?? "").trim() || null,
    is_published: formData.get("is_published") === "on",
  };
  const result = id
    ? await db.from("education").update(payload).eq("id", id)
    : await db.from("education").insert(payload);
  if (result.error) {
    console.error("Education save failed:", result.error);
    redirect("/admin/education?status=error");
  }
  redirect("/admin/education?status=saved");
}

async function deleteEducation(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/education?status=error");
  const { error } = await createAdminClient().from("education").delete().eq("id", id);
  if (error) {
    console.error("Education delete failed:", error);
    redirect("/admin/education?status=error");
  }
  redirect("/admin/education?status=deleted");
}

type EducationRow = {
  id: string; qualification: string; institution: string;
  field_of_study: string | null; description: string | null;
  start_date: string | null; end_date: string | null; is_published: boolean;
};

const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export default async function EducationAdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const { data, error } = await createAdminClient().from("education").select("*").order("end_date", { ascending: false });
  if (error) console.error("Education load failed:", error);
  const rows = (data ?? []) as EducationRow[];
  const notice: Record<string, string> = { saved: "Education saved.", deleted: "Education deleted.", missing: "Qualification and institution are required.", error: "Could not save changes. Check the database schema and logs." };
  return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-8">
    <div className="mx-auto max-w-6xl">
      <Link href="/admin" className="text-sm font-semibold text-emerald-800 hover:underline">← Admin dashboard</Link>
      <header className="mt-6 rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 p-7 text-white sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Portfolio content</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Education manager</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Maintain qualifications shown on your public portfolio. Unpublished records remain in the database but are hidden from visitors.</p>
      </header>
      {status && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{notice[status] ?? "Request completed."}</p>}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-bold">Add education</h2>
        <form action={saveEducation} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><label className={label}>Qualification *</label><input name="qualification" required className={input} placeholder="Master of Computer Applications" /></div>
          <div><label className={label}>Institution *</label><input name="institution" required className={input} placeholder="University or college" /></div>
          <div><label className={label}>Field of study</label><input name="field_of_study" className={input} placeholder="Artificial Intelligence & Machine Learning" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className={label}>Start date</label><input type="date" name="start_date" className={input} /></div><div><label className={label}>End date</label><input type="date" name="end_date" className={input} /></div></div>
          <div className="sm:col-span-2"><label className={label}>Description</label><textarea name="description" rows={3} className={input} placeholder="Optional details" /></div>
          <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="is_published" defaultChecked className="accent-emerald-700" /> Publish on portfolio</label>
          <div className="sm:col-span-2"><button className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">Add education</button></div>
        </form>
      </section>
      <h2 className="mt-9 text-xl font-bold">Existing records <span className="text-sm font-medium text-slate-500">({rows.length})</span></h2>
      <div className="mt-4 space-y-4">
        {rows.map((row) => <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <form action={saveEducation} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={row.id} />
            <div><label className={label}>Qualification *</label><input name="qualification" required defaultValue={row.qualification} className={input} /></div>
            <div><label className={label}>Institution *</label><input name="institution" required defaultValue={row.institution} className={input} /></div>
            <div><label className={label}>Field of study</label><input name="field_of_study" defaultValue={row.field_of_study ?? ""} className={input} /></div>
            <div className="grid grid-cols-2 gap-3"><div><label className={label}>Start date</label><input type="date" name="start_date" defaultValue={row.start_date?.slice(0,10) ?? ""} className={input} /></div><div><label className={label}>End date</label><input type="date" name="end_date" defaultValue={row.end_date?.slice(0,10) ?? ""} className={input} /></div></div>
            <div className="sm:col-span-2"><label className={label}>Description</label><textarea name="description" rows={2} defaultValue={row.description ?? ""} className={input} /></div>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="is_published" defaultChecked={row.is_published} className="accent-emerald-700" /> Published</label>
            <div className="flex flex-wrap gap-2 sm:col-span-2"><button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Save changes</button></div>
          </form>
          <form action={deleteEducation} className="mt-2"><input type="hidden" name="id" value={row.id} /><button className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50" formAction={deleteEducation}>Delete record</button></form>
        </article>)}
        {rows.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500">No education records found. Add your first record above.</p>}
      </div>
    </div>
    <SiteControls />
  </main>;
}
