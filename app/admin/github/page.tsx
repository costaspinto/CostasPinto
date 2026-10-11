
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const MAX_FEATURED_PROJECTS = 4;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function requireAdminAccess() {
  const { requireAdmin } = await import('@/lib/auth/admin');
  await requireAdmin();
}

async function featureRepository(formData: FormData) {
  'use server';

  await requireAdminAccess();

  const githubId = Number(formData.get('github_id'));

  if (!Number.isFinite(githubId) || githubId <= 0) {
    redirect('/admin/github?error=Invalid+repository');
  }

  const db = createAdminClient();

  const { data: repo, error: repoError } = await db
    .from('github_repos')
    .select('*')
    .eq('github_id', githubId)
    .single();

  if (repoError || !repo) {
    redirect('/admin/github?error=Repository+not+found');
  }

  // Look for a project already imported from this repository.
  const { data: existing, error: existingError } = await db
    .from('projects')
    .select('id, featured, is_published')
    .eq('source', 'github')
    .eq('source_id', String(repo.github_id))
    .maybeSingle();

  if (existingError) {
    redirect('/admin/github?error=Could+not+check+existing+project');
  }

  if (!existing?.featured || !existing?.is_published) {
    const { count, error: countError } = await db
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('featured', true)
      .eq('is_published', true);

    if (countError) {
      redirect('/admin/github?error=Could+not+count+featured+projects');
    }

    if ((count ?? 0) >= MAX_FEATURED_PROJECTS) {
      redirect(
        '/admin/github?error=You+already+have+4+featured+projects.+Remove+one+first.',
      );
    }
  }

  const projectData = {
    name: repo.name,
    slug: slugify(repo.name),
    category: repo.language || 'AI / ML',
    description:
      repo.description || `Explore the ${repo.name} project on GitHub.`,
    technologies: [
      ...(repo.language ? [repo.language] : []),
      ...((repo.topics as string[] | null) ?? []),
    ].filter((value, index, array) => array.indexOf(value) === index),
    repository_url: repo.html_url,
    demo_url: repo.homepage || null,
    featured: true,
    is_published: true,
    source: 'github',
    source_id: String(repo.github_id),
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await db
      .from('projects')
      .update(projectData)
      .eq('id', existing.id);

    if (error) {
      console.error('Could not feature GitHub project:', error.message);
      redirect('/admin/github?error=Could+not+update+project');
    }
  } else {
    const { error } = await db.from('projects').insert(projectData);

    if (error) {
      console.error('Could not import GitHub project:', error.message);
      redirect('/admin/github?error=Could+not+import+project');
    }
  }

  redirect('/admin/github?success=Project+added+to+homepage');
}

async function removeFromHomepage(formData: FormData) {
  'use server';

  await requireAdminAccess();

  const githubId = Number(formData.get('github_id'));

  if (!Number.isFinite(githubId) || githubId <= 0) {
    redirect('/admin/github?error=Invalid+repository');
  }

  const db = createAdminClient();

  const { error } = await db
    .from('projects')
    .update({
      featured: false,
      updated_at: new Date().toISOString(),
    })
    .eq('source', 'github')
    .eq('source_id', String(githubId));

  if (error) {
    console.error('Could not remove featured project:', error.message);
    redirect('/admin/github?error=Could+not+remove+project');
  }

  redirect('/admin/github?success=Project+removed+from+homepage');
}

async function syncGitHub() {
  'use server';

  await requireAdminAccess();

  redirect('/admin/integrations');
}

type GitHubRepository = {
  id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[] | null;
  stargazers_count: number | null;
  forks_count: number | null;
  is_fork: boolean | null;
  is_archived: boolean | null;
  synced_at: string | null;
};

type PortfolioProject = {
  id: string;
  source_id: string | null;
  repository_url: string | null;
  name: string;
  featured: boolean;
  is_published: boolean;
};

export default async function AdminGitHubPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
}) {
  await requireAdminAccess();

  const params = (await searchParams) ?? {};
  const db = createAdminClient();

  const [
    { data: repositories, error: repositoriesError },
    { data: projects, error: projectsError },
  ] = await Promise.all([
    db
      .from('github_repos')
      .select('*')
      .order('updated_at_github', { ascending: false }),
    db
      .from('projects')
      .select('id, source_id, repository_url, name, featured, is_published')
      .eq('source', 'github'),
  ]);

  const repos = (repositories ?? []) as GitHubRepository[];
  const portfolioProjects = (projects ?? []) as PortfolioProject[];

  const projectByGithubId = new Map<string, PortfolioProject>();

  for (const project of portfolioProjects) {
    if (project.source_id) {
      projectByGithubId.set(project.source_id, project);
    }
  }

  const featuredCount = portfolioProjects.filter(
    (project) => project.featured && project.is_published,
  ).length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Admin dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            GitHub repositories
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Choose which repositories appear in the featured projects section
            of your homepage. You can feature up to four projects.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Back to admin
          </Link>

          <form action={syncGitHub}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Open integrations
            </button>
          </form>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Synced repositories</p>
          <p className="mt-2 text-3xl font-bold">{repos.length}</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Featured projects</p>
          <p className="mt-2 text-3xl font-bold">
            {featuredCount} / {MAX_FEATURED_PROJECTS}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Available slots</p>
          <p className="mt-2 text-3xl font-bold">
            {Math.max(0, MAX_FEATURED_PROJECTS - featuredCount)}
          </p>
        </div>
      </section>

      {params.success && (
        <div
          role="status"
          className="rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm"
        >
          {params.success}
        </div>
      )}

      {params.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm"
        >
          {params.error}
        </div>
      )}

      {repositoriesError && (
        <div className="rounded-lg border border-red-600/30 p-4 text-sm">
          Could not load GitHub repositories: {repositoriesError.message}
        </div>
      )}

      {projectsError && (
        <div className="rounded-lg border border-red-600/30 p-4 text-sm">
          Could not load existing portfolio projects: {projectsError.message}
        </div>
      )}

      {!repositoriesError && repos.length === 0 && (
        <section className="rounded-xl border p-8 text-center">
          <h2 className="text-lg font-semibold">No repositories synced yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sync your GitHub account first. Your repositories will appear here
            after the synchronization completes.
          </p>
          <Link
            href="/admin/integrations"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to integrations
          </Link>
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">All repositories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select Feature on a repository to publish it on your homepage.
            Remove an existing selection before adding another if all four
            slots are occupied.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {repos.map((repo) => {
            const project = projectByGithubId.get(String(repo.github_id));
            const isFeatured = Boolean(
              project?.featured && project?.is_published,
            );

            return (
              <article
                key={repo.github_id}
                className="flex min-w-0 flex-col rounded-xl border p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold">
                      {repo.name}
                    </h3>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {repo.full_name}
                    </p>
                  </div>

                  {isFeatured ? (
                    <span className="shrink-0 rounded-full border border-green-600/40 px-2.5 py-1 text-xs font-medium">
                      On homepage
                    </span>
                  ) : project ? (
                    <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs">
                      Imported
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 min-h-12 text-sm text-muted-foreground">
                  {repo.description || 'No repository description provided.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {repo.language && (
                    <span className="rounded-md bg-muted px-2 py-1">
                      {repo.language}
                    </span>
                  )}
                  <span className="rounded-md bg-muted px-2 py-1">
                    {repo.stargazers_count ?? 0} stars
                  </span>
                  <span className="rounded-md bg-muted px-2 py-1">
                    {repo.forks_count ?? 0} forks
                  </span>
                  {repo.is_archived && (
                    <span className="rounded-md border px-2 py-1">
                      Archived
                    </span>
                  )}
                  {repo.is_fork && (
                    <span className="rounded-md border px-2 py-1">Fork</span>
                  )}
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {repo.topics.slice(0, 6).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md border px-2 py-1 text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium underline underline-offset-4"
                  >
                    View on GitHub
                  </a>

                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      Live demo
                    </a>
                  )}

                  <div className="flex-1" />

                  {isFeatured ? (
                    <form action={removeFromHomepage}>
                      <input
                        type="hidden"
                        name="github_id"
                        value={repo.github_id}
                      />
                      <button
                        type="submit"
                        className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        Remove
                      </button>
                    </form>
                  ) : (
                    <form action={featureRepository}>
                      <input
                        type="hidden"
                        name="github_id"
                        value={repo.github_id}
                      />
                      <button
                        type="submit"
                        disabled={featuredCount >= MAX_FEATURED_PROJECTS}
                        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Feature on homepage
                      </button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
