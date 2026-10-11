'use client';
import Link from "next/link";
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center px-5"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-soft"><Link href="/" className="text-sm font-semibold text-forest">← Back to portfolio</Link><h1 className="mt-6 text-3xl font-black">Admin sign in</h1><p className="mt-2 text-sm leading-6 text-slate-600">Private access for managing the portfolio. Only user IDs configured in ADMIN_USER_IDS are authorized.</p><label className="mt-6 block text-sm font-semibold">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border px-3 py-3 font-normal"/></label><label className="mt-4 block text-sm font-semibold">Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border px-3 py-3 font-normal"/></label>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<button disabled={busy} className="mt-6 w-full rounded-xl bg-forest px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
