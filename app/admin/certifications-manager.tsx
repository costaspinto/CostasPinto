
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { importCertificationsCsv } from './certifications/actions';

type CertificationRow = {
  id: string;
  name: string;
  issuer: string;
  credential_url: string | null;
  issued_at: string | null;
  is_published: boolean;
  source: string;
};

type Props = {
  rows: CertificationRow[];
  loadError: boolean;
  statusMessage: string | null;
};

const PAGE_SIZE = 10;

export function CertificationsManager({
  rows,
  loadError,
  statusMessage,
}: Props) {
  const [isImporting, setIsImporting] = useState(false);
  const [search, setSearch] = useState('');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [page, setPage] = useState(1);

  const issuers = useMemo(
    () =>
      Array.from(
        new Set(rows.map((row) => row.issuer.trim()).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.issuer.toLowerCase().includes(query);

      const matchesIssuer =
        issuerFilter === 'all' || row.issuer === issuerFilter;

      return matchesSearch && matchesIssuer;
    });
  }, [rows, search, issuerFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = filteredRows.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateIssuer(value: string) {
    setIssuerFilter(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-paper px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <header className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest">
            Portfolio data
          </p>
          <h1 className="mt-2 text-3xl font-black">
            Certifications
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Import certification credentials and manage your stored
            records. Search by certification name or issuer to find
            records quickly.
          </p>
        </header>

        {statusMessage && (
          <p
            role="status"
            className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            <CheckCircle2 size={18} className="shrink-0" />
            {statusMessage}
          </p>
        )}

        {loadError && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            Could not load certifications. Verify your Supabase setup.
          </p>
        )}

        <form
  action={importCertificationsCsv}
  onSubmit={() => setIsImporting(true)}
>
          <h2 className="text-xl font-bold">
            Upload certification CSV
          </h2>

          <label className="block text-sm font-semibold">
            CSV file
            <input
              name="file"
              type="file"
              accept=".csv,text/csv"
              required
              disabled={isImporting}
              className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm font-normal file:mr-4 file:rounded-lg file:border-0 file:bg-mint file:px-3 file:py-2 file:font-semibold file:text-forest disabled:opacity-50"
            />
          </label>

          <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-800">
              Supported CSV columns
            </p>
            <p>
              Name, Issuing Organization, Issue Date, Expiration Date,
              Credential ID, Credential URL.
            </p>
            <p className="mt-2">
              Maximum file size: 2 MB, up to 500 records per upload.
            </p>
          </div>

          {isImporting && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-blue-200 bg-blue-50 p-4"
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-blue-900">
                <LoaderCircle
                  className="animate-spin"
                  size={20}
                />
                Importing certifications…
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-600" />
              </div>

              <p className="mt-2 text-xs text-blue-800">
                Please keep this page open while the file is processed.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isImporting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isImporting ? (
              <>
                <LoaderCircle
                  className="animate-spin"
                  size={17}
                />
                Importing…
              </>
            ) : (
              <>
                <Upload size={17} />
                Import certifications
              </>
            )}
          </button>
        </form>

        <section className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Stored certifications
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {filteredRows.length === rows.length
                  ? `${rows.length} total records`
                  : `${filteredRows.length} of ${rows.length} records`}
              </p>
            </div>
          </div>

          {rows.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_240px]">
              <label className="relative block">
                <span className="sr-only">
                  Search certifications
                </span>
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search name or issuer..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-forest"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => updateSearch('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    <X size={17} />
                  </button>
                )}
              </label>

              <label className="block">
                <span className="sr-only">Filter by issuer</span>
                <select
                  value={issuerFilter}
                  onChange={(event) => updateIssuer(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-forest"
                >
                  <option value="all">All issuers</option>
                  {issuers.map((issuer) => (
                    <option key={issuer} value={issuer}>
                      {issuer}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {rows.length === 0 && !loadError && (
            <p className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              No certifications stored yet. Upload a CSV to get started.
            </p>
          )}

          {rows.length > 0 && filteredRows.length === 0 && (
            <p className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              No certifications match your search. Try another name or issuer.
            </p>
          )}

          <div className="mt-4 space-y-3">
            {visibleRows.map((row) => (
              <article
                key={row.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold">{row.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {row.issuer || 'Issuer not provided'}
                      {row.issued_at
                        ? ` · ${row.issued_at.slice(0, 7)}`
                        : ''}
                    </p>

                    {row.credential_url && (
                      <a
                        href={row.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm font-semibold text-forest underline"
                      >
                        View credential
                      </a>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row.is_published
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {row.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {filteredRows.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">
                Showing {startIndex + 1}–
                {Math.min(
                  startIndex + PAGE_SIZE,
                  filteredRows.length,
                )}{' '}
                of {filteredRows.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((previous) => previous - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="px-2 text-sm tabular-nums text-slate-600">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((previous) => previous + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
