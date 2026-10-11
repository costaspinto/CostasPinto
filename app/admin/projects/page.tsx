import Link from 'next/link';
import { SiteControls } from '@/components/site-controls';

import {

  ArrowLeft,

  Bot,

  CheckCircle2,

  ExternalLink,

  Github,

  Layers3,

  RefreshCw,

  Sparkles,

  Star,

  Workflow,

} from 'lucide-react';

import { requireAdmin } from '@/lib/auth/admin';

import { createAdminClient } from '@/lib/supabase/admin';

import {

  removeGitHubProjectFromHomepage,

  runAutomaticGitHubProjectSync,

  selectAndEnrichGitHubProject,

} from './github-actions';

export const dynamic = 'force-dynamic';

const MAX_FEATURED_PROJECTS = 4;

type SearchParams = {

  status?: string;

  q?: string;

};

type ProjectRow = {

  id: string;

  name: string;

  slug: string;

  category: string | null;

  description: string | null;

  technologies: string[] | null;

  repository_url: string | null;

  demo_url: string | null;

  featured: boolean;

  is_published: boolean;

  source: string | null;

  updated_at: string;

};

const messages: Record<string, { text: string; success: boolean }> = {

  'ai-added': {

    text: 'Project selected and enriched with AI successfully.',

    success: true,

  },

  'ai-config': {

    text: 'OpenRouter is not configured. Add OPENROUTER_API_KEY to your server environment.',

    success: false,

  },

  'ai-error': {

    text: 'AI enrichment failed. Check your OpenRouter configuration and server logs.',

    success: false,

  },

  added: {

    text: 'Project added successfully.',

    success: true,

  },

  saved: {

    text: 'Your featured projects are already up to date.',

    success: true,

  },

  removed: {

    text: 'Project removed from the homepage. Its record was preserved.',

    success: true,

  },

  error: {

    text: 'The operation failed. Check the server logs and Supabase configuration.',

    success: false,

  },

  invalid: {

    text: 'The submitted request was invalid.',

    success: false,

  },

  'feature-limit': {

    text: 'The homepage already has four featured projects.',

    success: false,

  },

};

async function runAutomaticSelectionAction(_formData: FormData) {

  'use server';

  await runAutomaticGitHubProjectSync();

}

function StatCard({

  label,

  value,

  detail,

  icon: Icon,

}: {

  label: string;

  value: string | number;

  detail: string;

  icon: typeof Layers3;

}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between gap-3">

        <p className="text-sm font-medium text-slate-500">{label}</p>

        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-800">

          <Icon size={19} />

        </div>

      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">

        {value}

      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>

    </div>

  );

}

export default async function ProjectsAdminPage({

  searchParams,

}: {

  searchParams: Promise<SearchParams>;

}) {

  await requireAdmin();

  const params = await searchParams;

  const db = createAdminClient();

  const [projectResult, repositoryResult] = await Promise.all([

    db

      .from('projects')

      .select(

        'id,name,slug,category,description,technologies,repository_url,demo_url,featured,is_published,source,updated_at',

      )

      .order('featured', { ascending: false })

      .order('updated_at', { ascending: false }),

    db

      .from('github_repos')

      .select(

        'id,github_id,name,full_name,description,html_url,homepage,language,topics,is_fork,is_archived,stargazers_count',

      )

      .order('stargazers_count', { ascending: false })

      .order('name', { ascending: true }),

  ]);

  const loadError = Boolean(projectResult.error || repositoryResult.error);

  if (projectResult.error) {

    console.error('Projects dashboard error:', projectResult.error.message);

  }

  if (repositoryResult.error) {

    console.error('GitHub repository dashboard error:', repositoryResult.error.message);

  }

  const projects = (projectResult.data ?? []) as ProjectRow[];

  const repositories = repositoryResult.data ?? [];

  const searchQuery = (params.q ?? '').trim().toLowerCase();

  const eligibleRepositories = repositories.filter(

    (repo) => !repo.is_fork && !repo.is_archived,

  );

  const filteredRepositories = eligibleRepositories.filter((repo) => {

    if (!searchQuery) return true;

    return [repo.name, repo.full_name, repo.description, repo.language, ...(repo.topics ?? [])]

      .filter(Boolean)

      .some((value) => String(value).toLowerCase().includes(searchQuery));

  }).slice(0, 50);

  const featuredProjects = projects

    .filter((project) => project.featured && project.is_published)

    .slice(0, MAX_FEATURED_PROJECTS);

  const publishedProjects = projects.filter(

    (project) => project.is_published,

  );

  const totalStars = repositories.reduce(

    (sum, repo) => sum + (repo.stargazers_count ?? 0),

    0,

  );

  const statusMessage = params.status ? messages[params.status] : null;

  return (

    <main className="min-h-screen bg-slate-50 text-slate-950">

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">

        <Link

          href="/admin"

          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-800"

        >

          <ArrowLeft size={16} />

          Back to dashboard

        </Link>

        <header className="mt-8 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-9">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-200">

                <Bot size={15} />

                AI-powered portfolio management

              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">

                Project automation

              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">

                Discover GitHub projects, generate project content with AI,

                and manage the four homepage highlights without manually

                editing project details.

              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:min-w-64">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">

                  <Workflow size={23} />

                </div>

                <div>

                  <p className="text-sm font-semibold">Homepage highlights</p>

                  <p className="mt-1 text-xs text-slate-400">

                    Featured projects limit

                  </p>

                </div>

              </div>

              <div className="mt-5 flex items-end justify-between">

                <p className="text-3xl font-bold">

                  {featuredProjects.length}

                  <span className="text-lg font-medium text-slate-400">

                    {' '}/ {MAX_FEATURED_PROJECTS}

                  </span>

                </p>

                <div className="mb-1 flex gap-1.5">

                  {Array.from({ length: MAX_FEATURED_PROJECTS }).map(

                    (_, index) => (

                      <span

                        key={index}

                        className={`h-2 w-7 rounded-full ${

                          index < featuredProjects.length

                            ? 'bg-emerald-400'

                            : 'bg-white/15'

                        }`}

                      />

                    ),

                  )}

                </div>

              </div>

            </div>

          </div>

        </header>

        {statusMessage && (

          <div

            role={statusMessage.success ? 'status' : 'alert'}

            className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${

              statusMessage.success

                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'

                : 'border-amber-200 bg-amber-50 text-amber-900'

            }`}

          >

            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

            <p>{statusMessage.text}</p>

          </div>

        )}

        {loadError && (

          <div

            role="alert"

            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"

          >

            Some dashboard information could not be loaded. Check your

            Supabase tables and server logs before running a sync.

          </div>

        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard

            label="GitHub repositories"

            value={repositories.length}

            detail="Repositories in your latest stored sync"

            icon={Github}

          />

          <StatCard

            label="Eligible repositories"

            value={eligibleRepositories.length}

            detail="Excludes forks and archived repositories"

            icon={CheckCircle2}

          />

          <StatCard

            label="Published projects"

            value={publishedProjects.length}

            detail="Projects currently visible on the website"

            icon={Layers3}

          />

          <StatCard

            label="GitHub stars"

            value={totalStars.toLocaleString()}

            detail="Combined stars across synced repositories"

            icon={Star}

          />

        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-violet-50 p-3 text-violet-700">

                <Sparkles size={22} />

              </div>

              <div className="min-w-0 flex-1">

                <h2 className="text-lg font-bold">Automatic project selection</h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">

                  Rank eligible repositories, generate project descriptions

                  and technologies with AI, and fill available homepage slots.

                  Existing featured projects are preserved.

                </p>

              </div>

            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <div className="flex items-center justify-between gap-3">

                <span className="text-sm text-slate-600">Available slots</span>

                <span className="text-sm font-bold">

                  {Math.max(

                    0,

                    MAX_FEATURED_PROJECTS - featuredProjects.length,

                  )}

                </span>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

                <div

                  className="h-full rounded-full bg-emerald-600 transition-all"

                  style={{

                    width: `${Math.min(

                      100,

                      (featuredProjects.length / MAX_FEATURED_PROJECTS) * 100,

                    )}%`,

                  }}

                />

              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">

                Removing a project frees a slot. Its database record is kept.

              </p>

            </div>

            <form action={runAutomaticSelectionAction} className="mt-5">

              <button

                type="submit"

                disabled={loadError}

                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"

              >

                <RefreshCw size={17} />

                Run automatic selection

              </button>

            </form>

            <p className="mt-3 text-xs leading-5 text-slate-500">

              This runs selection against the repositories already stored in

              the database. It does not itself refresh GitHub repository data.

            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">

                <Github size={22} />

              </div>

              <div>

                <h2 className="text-lg font-bold">Manual project selection</h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">

                  Search your synced GitHub repositories and choose one to feature.

                  AI generates the project description and technology list.

                </p>

              </div>

            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">

              <div className="flex items-center justify-between gap-3">

                <span className="text-sm text-slate-600">Available homepage slots</span>

                <span className="text-sm font-bold">

                  {Math.max(0, MAX_FEATURED_PROJECTS - featuredProjects.length)} of {MAX_FEATURED_PROJECTS}

                </span>

              </div>

              {featuredProjects.length >= MAX_FEATURED_PROJECTS ? (

                <p className="mt-2 text-sm font-medium text-amber-800">

                  All four slots are in use. Remove a featured project before adding another.

                </p>

              ) : (

                <form method="get" className="mt-4 flex flex-col gap-2 sm:flex-row">

                  <input

                    type="search"

                    name="q"

                    defaultValue={params.q ?? ''}

                    placeholder="Search repository name, language, topic..."

                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"

                  />

                  <button

                    type="submit"

                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"

                  >

                    Search repositories

                  </button>

                </form>

              )}

            </div>

            {featuredProjects.length < MAX_FEATURED_PROJECTS && (

              <div className="mt-4 space-y-3">

                {filteredRepositories.length === 0 ? (

                  <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">

                    No eligible repositories match this search. Sync GitHub repositories or try another search.

                  </p>

                ) : (

                  filteredRepositories.map((repo) => {

                    const alreadyFeatured = featuredProjects.some(

                      (project) => project.repository_url === repo.html_url,

                    );

                    return (

                      <div

                        key={repo.id}

                        className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"

                      >

                        <div className="min-w-0">

                          <p className="break-words text-sm font-semibold">{repo.full_name}</p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">

                            {repo.description || 'No GitHub description provided.'}

                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">

                            {repo.language && <span>{repo.language}</span>}

                            <span>{(repo.stargazers_count ?? 0).toLocaleString()} stars</span>

                            {((repo.topics ?? []) as string[]).slice(0, 4).map((topic: string) => (

  <span

    key={topic}

    className="rounded-md bg-slate-100 px-2 py-1"

  >

    {topic}

  </span>

))}

                          </div>

                        </div>

                        {alreadyFeatured ? (

                          <span className="shrink-0 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">

                            Already featured

                          </span>

                        ) : (

                          <form action={selectAndEnrichGitHubProject} className="shrink-0">

                            <input type="hidden" name="repo_id" value={repo.id} />

                            <button

                              type="submit"

                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 sm:w-auto"

                            >

                              <Sparkles size={15} />

                              Select + AI enrich

                            </button>

                          </form>

                        )}

                      </div>

                    );

                  })

                )}

                {eligibleRepositories.length > filteredRepositories.length && (

                  <p className="text-xs text-slate-500">

                    Showing {filteredRepositories.length} repositories. Use search to find others.

                  </p>

                )}

              </div>

            )}

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">Automation workflow</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">

              The project pipeline is designed to keep routine content

              management out of your way.

            </p>

            <ol className="mt-5 space-y-4">

              {[

                ['01', 'GitHub sync', 'Load repository metadata'],

                ['02', 'Repository ranking', 'Prioritize eligible projects'],

                ['03', 'AI enrichment', 'Generate descriptions and technologies'],

                ['04', 'Homepage selection', 'Fill available slots up to four'],

              ].map(([number, title, description]) => (

                <li key={number} className="flex items-start gap-3">

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">

                    {number}

                  </span>

                  <div>

                    <p className="text-sm font-semibold">{title}</p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">

                      {description}

                    </p>

                  </div>

                </li>

              ))}

            </ol>

            <Link

              href="/admin/integrations"

              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline"

            >

              Open integrations

              <ExternalLink size={15} />

            </Link>

          </div>

        </section>

        <section className="mt-10">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">

                Live homepage

              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">

                Featured projects

              </h2>

              <p className="mt-2 text-sm text-slate-600">

                These published projects are currently marked for homepage display.

              </p>

            </div>

            <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">

              {featuredProjects.length} of {MAX_FEATURED_PROJECTS} slots used

            </span>

          </div>

          {featuredProjects.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">

                <Layers3 size={23} />

              </div>

              <h3 className="mt-4 font-bold">No featured projects yet</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                Run automatic selection to find eligible projects and fill

                the available homepage slots.

              </p>

            </div>

          ) : (

            <div className="grid gap-4 xl:grid-cols-2">

              {featuredProjects.map((project, index) => (

                <article

                  key={project.id}

                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:p-6"

                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">

                      {String(index + 1).padStart(2, '0')}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="break-words text-lg font-bold">

                          {project.name}

                        </h3>

                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">

                          Published

                        </span>

                      </div>

                      <p className="mt-1 text-xs text-slate-500">

                        {project.category || 'Project'} | {project.source || 'Portfolio'}

                      </p>

                    </div>

                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">

                    {project.description || 'No project description available.'}

                  </p>

                  {project.technologies && project.technologies.length > 0 && (

                    <div className="mt-4 flex flex-wrap gap-2">

                      {project.technologies.slice(0, 6).map((technology) => (

                        <span

                          key={technology}

                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"

                        >

                          {technology}

                        </span>

                      ))}

                      {project.technologies.length > 6 && (

                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-500">

                          +{project.technologies.length - 6} more

                        </span>

                      )}

                    </div>

                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">

                    {project.repository_url && (

                      <a

                        href={project.repository_url}

                        target="_blank"

                        rel="noreferrer"

                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-800"

                      >

                        <Github size={15} />

                        Repository

                        <ExternalLink size={13} />

                      </a>

                    )}

                    {project.demo_url && (

                      <a

                        href={project.demo_url}

                        target="_blank"

                        rel="noreferrer"

                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-800"

                      >

                        Live demo

                        <ExternalLink size={13} />

                      </a>

                    )}

                    <div className="flex-1" />

                    <form action={removeGitHubProjectFromHomepage}>

                      <input

                        type="hidden"

                        name="project_id"

                        value={project.id}

                      />

                      <button

                        type="submit"

                        className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"

                      >

                        Remove from homepage

                      </button>

                    </form>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        <footer className="mt-10 border-t border-slate-200 py-6">

          <p className="text-xs leading-5 text-slate-500">

            Automatic selection uses the currently synced GitHub repository

            data. Scheduled execution must be configured separately. Hidden

            projects are retained in the database.

          </p>

        </footer>

      </div>

          <SiteControls />
    </main>

  );

}
