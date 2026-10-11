'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BrandMark } from '@/components/brand-mark';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      window.location.assign('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8f5] px-4 py-8 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-[30rem] w-[30rem] rounded-full bg-teal-100/80 blur-3xl" />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 shadow-[0_30px_100px_-38px_rgba(6,78,59,0.28)] backdrop-blur-xl lg:min-h-[610px] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#06281e] via-emerald-950 to-teal-900 p-10 text-white lg:flex xl:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-4 h-40 w-40 rounded-full border border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-2xl" />

          <Link href="/" className="relative inline-flex w-fit items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner"><BrandMark inverse /></span>
            <span>
              <span className="block text-sm font-bold tracking-wide">COSTAS PINTO</span>
              <span className="mt-0.5 block text-xs text-emerald-100/70">AI / ML Portfolio</span>
            </span>
          </Link>

          <div className="relative max-w-md py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-emerald-100">
              <Sparkles size={14} /> Private workspace
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight xl:text-5xl">Your work.<br /><span className="bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">Your control.</span></h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-emerald-50/75 xl:text-base">
              Manage projects, skills, experience, certifications, and the knowledge behind your AI portfolio from one secure workspace.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200"><ShieldCheck size={20} /></span>
              <span><span className="block text-sm font-semibold">Protected admin access</span><span className="mt-1 block text-xs leading-5 text-emerald-100/65">Only authorized administrator accounts can continue.</span></span>
            </div>
          </div>

          <p className="relative text-xs text-emerald-100/45">Designed for a focused, secure portfolio workflow.</p>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8 lg:p-10 xl:p-12">
          <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 lg:hidden">
              <ArrowLeft size={16} /> Back to portfolio
            </Link>

            <div className="mb-8 mt-7 lg:mt-0">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100">
                <LockKeyhole size={22} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Administrator sign-in</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to manage your portfolio. Only user IDs configured in <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">ADMIN_USER_IDS</code> are authorized.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-800">Email address</label>
                <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
                  <Mail size={17} className="shrink-0 text-slate-400 transition-colors group-focus-within:text-emerald-800" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="min-w-0 w-full bg-transparent py-3.5 text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-800">Password</label>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400"><LockKeyhole size={12} /> Secure sign-in</span>
                </div>
                <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
                  <LockKeyhole size={17} className="shrink-0 text-slate-400 transition-colors group-focus-within:text-emerald-800" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="min-w-0 w-full bg-transparent py-3.5 text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !email.trim() || !password}
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 to-emerald-800 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-900 hover:to-teal-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {busy ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Signing in…</>
                ) : (
                  <>Sign in to dashboard <ArrowLeft size={16} className="rotate-180 transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
            </form>

            <div className="mt-7 flex items-start gap-2.5 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-400">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-700" />
              <p>Authentication is handled by Supabase. Successful sign-in alone does not grant admin access unless the account is authorized in the server configuration.</p>
            </div>

            <Link href="/" className="mt-6 hidden w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 lg:inline-flex">
              <ArrowLeft size={15} /> Return to public portfolio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
