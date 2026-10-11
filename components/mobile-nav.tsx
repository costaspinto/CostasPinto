'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  ['About', '#about'],
  ['Projects', '#projects'],
  ['GitHub', '#github-repositories'],
  ['YouTube', '#youtube'],
  ['Skills', '#skills'],
  ['Education', '#education'],
  ['Experience', '#experience'],
  ['Certifications', '#certifications'],
  ['Contact', '#contact'],
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <div className="mobile-nav relative md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-primary-navigation"
        onClick={() => setOpen((value) => !value)}
        className="relative z-[62] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-slate-100 shadow-sm transition hover:border-emerald-300/40 hover:bg-emerald-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
        <span>{open ? 'Close' : 'Menu'}</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            tabIndex={-1}
            onClick={closeMenu}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] z-[60] cursor-default bg-black/50 backdrop-blur-[2px]"
          />

          <nav
            id="mobile-primary-navigation"
            aria-label="Mobile navigation"
            className="mobile-nav-panel fixed right-3 top-[4.75rem] z-[61] grid max-h-[calc(100dvh-5.5rem)] w-[min(22rem,calc(100vw-1.5rem))] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-emerald-100/15 bg-[#0b120e]/[0.98] p-2.5 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:right-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3 pt-1">
              <div>
                <p className="text-sm font-bold tracking-wide text-white">Navigate</p>
                <p className="mt-0.5 text-xs text-slate-400">Explore the portfolio</p>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                aria-label="Close menu"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain py-2">
              {links.map(([label, href], index) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`flex min-h-11 items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors hover:bg-emerald-400/10 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                    href === '#contact'
                      ? 'mt-1 border border-emerald-300/15 bg-emerald-400/[0.07] text-emerald-100'
                      : 'text-slate-200'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="w-5 shrink-0 font-mono text-[10px] text-emerald-400/65">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {label}
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 text-emerald-400/70" aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="border-t border-white/10 px-3 pb-1 pt-3 text-xs text-slate-400">
              AI · Machine Learning · Generative AI
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
