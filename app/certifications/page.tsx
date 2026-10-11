import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  ExternalLink,
} from 'lucide-react';
import { getPortfolioData } from '@/lib/data';
import { BrandMark } from '@/components/brand-mark';

export const dynamic = 'force-dynamic';

export default async function CertificationsPage() {
  const profile = await getPortfolioData();
  const certifications = profile.certifications;

  return (
    <main className="certifications-page min-h-screen bg-[#f8faf8] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight transition-colors hover:text-emerald-800"
          >
            <BrandMark />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-100 via-white to-teal-50 p-7 sm:p-12 lg:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-2 text-sm font-semibold text-emerald-950">
              <Award size={16} />
              Learning and professional development
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Certifications
              <span className="text-emerald-800"> &amp; achievements.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              A collection of professional certifications, technical courses,
              and continuous learning across AI, machine learning, software
              engineering, and related technologies.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 text-white">
                <Award size={22} />
              </div>
              <div>
                <p className="text-2xl font-black">
                  {certifications.length}
                </p>
                <p className="text-sm text-slate-500">
                  Published certifications
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
              The complete collection
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              All certifications
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {certifications.length}{' '}
            {certifications.length === 1
              ? 'certification'
              : 'certifications'}
          </p>
        </div>

        {certifications.length > 0 ? (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((item, index) => (
              <article
                key={`${item.issuer}-${item.name}-${index}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 transition-colors group-hover:bg-amber-100">
                    <Award size={22} />
                  </div>

                  <span className="rounded-full bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold leading-6 text-slate-950">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.issuer}
                </p>

                {item.issuedAt && (
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Issued {item.issuedAt.slice(0, 4)}
                  </p>
                )}

                <div className="mt-auto pt-5">
                  {item.credentialUrl ? (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-emerald-900 transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-4"
                    >
                      View credential
                      <ExternalLink size={15} />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">
                      Credential link unavailable
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Award className="mx-auto text-emerald-800" size={32} />
            <h3 className="mt-4 text-lg font-bold">
              No published certifications yet
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              Certifications will appear here when they are published in the
              admin dashboard. Check that your Supabase configuration is
              correct if you expect to see existing records.
            </p>
          </div>
        )}

        <div className="mt-12 border-t border-slate-200 pt-7">
          <Link
            href="/#certifications"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-900 transition-colors hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Return to homepage certifications
          </Link>
        </div>
      </section>
    </main>
  );
}