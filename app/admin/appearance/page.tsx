import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { saveAppearance } from './actions';
import { AppearanceEditor } from '@/components/appearance-editor';
import { defaultAppearance, type SiteAppearance } from '@/components/appearance-provider';
export const dynamic = 'force-dynamic';
type Appearance = Partial<SiteAppearance>;
type Props = { searchParams: Promise<{ status?: string }> };
export default async function AppearancePage({ searchParams }: Props) {
 await requireAdmin();
 let value: Appearance = defaultAppearance;
 try { const {data,error}=await createAdminClient().from('site_settings').select('setting_value').eq('setting_key','appearance').maybeSingle(); if(!error) value=(data?.setting_value??{}) as Appearance; }
 catch(error){ console.error('Appearance settings read failed:',error); }
 const params=await searchParams;
 return <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 text-slate-900 sm:px-8"><div className="mx-auto max-w-3xl"><Link href="/admin" className="text-sm font-semibold text-emerald-900 hover:underline">← Admin dashboard</Link><h1 className="mt-5 text-3xl font-black">Site appearance</h1><p className="mt-2 text-sm text-slate-600">Change colors and preview them instantly before saving.</p><AppearanceEditor initial={{...defaultAppearance,...value}} saveAction={saveAppearance} status={params.status}/><p className="mt-4 text-xs leading-5 text-slate-500">Preview is unsaved until you select Save appearance. The palette applies through shared site-wide theme tokens.</p></div></main>;
}
