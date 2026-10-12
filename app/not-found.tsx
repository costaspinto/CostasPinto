'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

export default function NotFound() {
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); setPosition((current) => Math.min(8, current + 1)); setScore((current) => current + 1); setRunning(true); }
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); setPosition((current) => Math.max(0, current - 1)); setScore((current) => current + 1); setRunning(true); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  function move(direction: number) {
    setPosition((current) => Math.max(0, Math.min(8, current + direction)));
    setScore((current) => current + 1);
    setRunning(true);
  }
  return <main className="not-found-page min-h-[100dvh] overflow-hidden px-5 py-12 text-white sm:px-8 sm:py-20">
    <div className="not-found-glow" aria-hidden="true" />
    <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-200">Error 404 · Lost in the model space</span>
      <p className="mt-7 font-mono text-8xl font-black tracking-[-.09em] text-transparent sm:text-9xl" style={{ WebkitTextStroke: '2px #6ee7b7' }}>404</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">This page went off-script.</h1>
      <p className="mt-4 max-w-xl leading-7 text-emerald-50/70">The link may be outdated, or the page may have moved. While you are here, try a tiny portfolio-themed navigation game.</p>
      <section className="mt-9 w-full max-w-xl rounded-3xl border border-emerald-200/15 bg-white/[.045] p-5 text-left shadow-2xl backdrop-blur sm:p-7" aria-label="Mini navigation game">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold">Find the signal</p><p className="mt-1 text-xs text-emerald-50/60">Move the signal to the green node. Use arrows or buttons.</p></div><span className="rounded-full bg-black/20 px-3 py-1.5 text-xs font-bold text-emerald-200">Score {score}</span></div>
        <div className="mt-6 grid grid-cols-9 gap-1.5 sm:gap-2" role="img" aria-label={`Signal position ${position + 1} of 9; target at position 9`}>
          {Array.from({ length: 9 }, (_, index) => <div key={index} className={`flex aspect-square items-center justify-center rounded-xl border text-lg transition ${index === position ? 'border-white bg-emerald-300 text-emerald-950 shadow-[0_0_25px_rgba(110,231,183,.35)]' : index === 8 ? 'border-emerald-300/50 bg-emerald-400/15 text-emerald-200' : 'border-white/10 bg-black/20 text-white/20'}`}>{index === position ? <Sparkles size={19}/> : index === 8 ? '◎' : '·'}</div>)}
        </div>
        <p className="mt-3 min-h-5 text-xs text-emerald-100/70" aria-live="polite">{position === 8 ? 'Signal found. Nice navigation!' : running ? 'Keep going — the signal is waiting at the last node.' : 'Ready when you are.'}</p>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => move(-1)} disabled={position === 0} className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-35">← Left</button><button type="button" onClick={() => move(1)} disabled={position === 8} className="rounded-full bg-emerald-300 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-200 disabled:opacity-35">Right →</button><button type="button" onClick={() => { setPosition(0); setScore(0); setRunning(false); }} className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"><RotateCcw size={14}/> Restart</button></div>
      </section>
      <Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-100"><ArrowLeft size={16}/> Back to portfolio</Link>
    </div>
  </main>;
}
