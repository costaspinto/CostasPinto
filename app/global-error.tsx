'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={{ margin: 0, background: '#080d0a', color: '#f0fdf4', fontFamily: 'system-ui, sans-serif' }}><main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }}><div><h1>Portfolio temporarily unavailable</h1><p>Please retry in a moment.</p><button onClick={() => reset()} style={{ border: 0, borderRadius: 999, padding: '0.85rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>Try again</button></div></main></body></html>;
}
