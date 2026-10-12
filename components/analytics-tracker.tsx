'use client';

import { useEffect } from 'react';

export function AnalyticsTracker() {
  useEffect(() => {
    const path = window.location.pathname;
    const key = `portfolio-view:${path}:${new Date().toISOString().slice(0, 10)}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch { /* Analytics is optional when storage is disabled. */ }
    let visitorId = '';
    try {
      visitorId = localStorage.getItem('costas-visitor-id') ?? '';
      if (!visitorId) { visitorId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`; localStorage.setItem('costas-visitor-id', visitorId); }
    } catch { /* No persistent ID; count this as a page view only. */ }
    void fetch('/api/analytics', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'page_view', path, referrer: document.referrer, visitor_id: visitorId || undefined }), keepalive: true,
    }).catch(() => { /* A failed analytics request must not affect the page. */ });
  }, []);
  return null;
}
