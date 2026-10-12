'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Portfolio route error:', error.digest ?? error.name); }, [error]);
  return <main className="flex min-h-[75vh] items-center justify-center bg-[#080d0a] px-5 py-16 text-white"><div className="max-w-lg text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Something went wrong</p><h1 className="mt-4 text-3xl font-black sm:text-4xl">The page hit an unexpected error.</h1><p className="mt-4 leading-7 text-white/65">Your visit is safe. You can retry the page or return to the portfolio.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={() => reset()} className="inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-3 text-sm font-bold text-emerald-950"><RefreshCw size={16}/> Try again</button><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"><Home size={16}/> Home</Link></div></div></main>;
}
