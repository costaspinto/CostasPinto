'use client';

import { useEffect } from 'react';

/** Lightweight reveal effects using the platform IntersectionObserver API. */
export function ScrollEffects() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main.portfolio-shell section, main.certifications-page article, .admin-app-shell main section, .admin-app-shell main article',
      ),
    );

    if (!targets.length) return;

    targets.forEach((target, index) => {
      target.classList.add('motion-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 5) * 45}ms`);
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('motion-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return null;
}
