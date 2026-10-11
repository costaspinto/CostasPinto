'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  ExternalLink,
  GitFork,
  Search,
  Star,
} from 'lucide-react';
import type { GitHubRepository } from '../lib/data';
import { SectionHeading } from '@/components/section-heading';

type Props = {
  repositories: GitHubRepository[];
};

const INITIAL_REPOSITORY_COUNT = 6;

export function GitHubRepositories({ repositories }: Props) {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('All');
  const [sort, setSort] = useState('stars');
  const [showAll, setShowAll] = useState(false);

  const languages = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          repositories
            .map((repo) => repo.language)
            .filter((item): item is string => Boolean(item)),
        ),
      ).sort(),
    ],
    [repositories],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return repositories
      .filter((repo) => {
        const matchesSearch =
          !query ||
          [
            repo.name,
            repo.full_name,
            repo.description ?? '',
            ...repo.topics,
          ].some((value) => value.toLowerCase().includes(query));

        const matchesLanguage =
          language === 'All' || repo.language === language;

        return matchesSearch && matchesLanguage;
      })
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'forks') return b.forks_count - a.forks_count;
        return b.stargazers_count - a.stargazers_count;
      });
  }, [repositories, search, language, sort]);

  const visibleRepositories = showAll
    ? filtered
    : filtered.slice(0, INITIAL_REPOSITORY_COUNT);

  return (
    <section
      id="github-repositories"
      className="border-y border-slate-100 bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Open source"
          title="Explore my GitHub repositories."
          description="Search projects, explore technologies, and browse my public code."
        />

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_200px_180px]">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowAll(false);
              }}
              placeholder="Search repositories, topics..."
              aria-label="Search repositories"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <select
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setShowAll(false);
            }}
            aria-label="Filter by language"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item === 'All' ? 'All languages' : item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort repositories"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          >
            <option value="stars">Most stars</option>
            <option value="forks">Most forks</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <p className="mt-4 text-sm text-slate-500" aria-live="polite">
          Showing {visibleRepositories.length} of {filtered.length} matching
          repositories
          {filtered.length !== repositories.length &&
            ` (${repositories.length} total)`}
        </p>

        {filtered.length > 0 ? (
          <>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleRepositories.map((repo) => (
                <article
                  key={repo.github_id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-words text-lg font-bold">
                      {repo.name}
                    </h3>
                    {repo.is_featured && (
                      <span className="shrink-0 rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-forest">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {repo.description || 'Public repository on GitHub.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {repo.language && (
                      <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
                        {repo.language}
                      </span>
                    )}
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Star size={15} />
                      {repo.stargazers_count}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <GitFork size={15} />
                      {repo.forks_count}
                    </span>
                    {repo.is_archived && (
                      <span className="text-xs">Archived</span>
                    )}
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-forest"
                  >
                    View on GitHub <ExternalLink size={15} />
                  </a>
                </article>
              ))}
            </div>

            {filtered.length > INITIAL_REPOSITORY_COUNT && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                  aria-expanded={showAll}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  {showAll
                    ? 'Show Less'
                    : `Explore All ${filtered.length} Repositories`}
                  <ArrowUpRight
                    size={16}
                    className={`transition-transform ${
                      showAll ? 'rotate-45' : ''
                    }`}
                  />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No repositories match your search. Try another term or language.
          </div>
        )}
      </div>
    </section>
  );
}