'use client';

import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  ['About', '#about'],
  ['Projects', '#projects'],
  ['GitHub', '#github-repositories'],
  ['YouTube', '#youtube'],
  ['Skills & tools', '#skills'],
  ['Education', '#education'],
  ['Experience', '#experience'],
  ['Certifications', '#certifications'],
  ['Contact', '#contact'],
  ['Feedback', '/feedback'],
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusFrame = window.requestAnimationFrame(() => firstLinkRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const panel = document.getElementById('mobile-primary-navigation');
        const focusable = panel?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const handleResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const panel = open && mounted ? createPortal(
    <div className="mobile-nav-overlay" data-mobile-nav-overlay>
      <button
        type="button"
        aria-label="Close navigation menu"
        className="mobile-nav-backdrop"
        onClick={closeMenu}
        tabIndex={-1}
      />
      <nav
        id="mobile-primary-navigation"
        aria-label="Mobile navigation"
        className="mobile-nav-panel"
      >
        <div className="mobile-nav-panel__header">
          <div>
            <p className="mobile-nav-panel__eyebrow">COSTAS PINTO</p>
            <p className="mobile-nav-panel__title">Explore portfolio</p>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="mobile-nav-close"
            aria-label="Close menu"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="mobile-nav-panel__links">
          {links.map(([label, href], index) => (
            <a
              key={href}
              ref={index === 0 ? firstLinkRef : undefined}
              href={href}
              onClick={closeMenu}
              className="mobile-nav-link"
            >
              <span className="mobile-nav-link__number">{String(index + 1).padStart(2, '0')}</span>
              <span className="mobile-nav-link__label">{label}</span>
              <ArrowUpRight size={17} aria-hidden="true" className="mobile-nav-link__arrow" />
            </a>
          ))}
        </div>
        <div className="mobile-nav-panel__footer">
          <span>AI Â· Machine Learning Â· Generative AI</span>
          <span className="mobile-nav-status"><span /> Portfolio online</span>
        </div>
      </nav>
    </div>,
    document.body,
  ) : null;

  return (
    <div className="mobile-nav-trigger md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-primary-navigation"
        onClick={() => setOpen((value) => !value)}
        className="mobile-nav-toggle"
      >
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        <span>{open ? 'Close' : 'Menu'}</span>
      </button>
      {panel}
    </div>
  );
}

