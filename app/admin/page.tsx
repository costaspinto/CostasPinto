import Link from 'next/link';

import {

  ArrowUpRight,

  Database,

  Github,

  Linkedin,

  Settings2,

  UserRound,

  FolderKanban,

  LogOut,

  Bot,

  Award,

  RefreshCw,

  Sparkles,

  ShieldCheck,

} from 'lucide-react';

import { requireAdmin } from '@/lib/auth/admin';

import { createAdminClient } from '@/lib/supabase/admin';
import { SiteControls } from '@/components/site-controls';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {

  const user = await requireAdmin();

  let projectCount = 0;

  let publishedCount = 0;

  let githubCount = 0;

  let certificationCount = 0;

  try {

    const db = createAdminClient();

    const [all, published, github, certifications] = await Promise.all([

      db.from('projects').select('id', { count: 'exact', head: true }),

      db

        .from('projects')

        .select('id', { count: 'exact', head: true })

        .eq('is_published', true),

      db

        .from('projects')

        .select('id', { count: 'exact', head: true })

        .eq('source', 'github'),

      db

        .from('certifications')

        .select('id', { count: 'exact', head: true }),

    ]);

    projectCount = all.count ?? 0;

    publishedCount = published.count ?? 0;

    githubCount = github.count ?? 0;

    certificationCount = certifications.count ?? 0;

    if (all.error) console.error('Project count:', all.error);

    if (published.error) console.error('Published count:', published.error);

    if (github.error) console.error('GitHub count:', github.error);

    if (certifications.error) {

      console.error('Certification count:', certifications.error);

    }

  } catch (error) {

    console.error('Could not load admin dashboard counts:', error);

  }

  const appearanceShortcut = <Link href="/admin/appearance" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-950 shadow-sm hover:bg-emerald-50"> <Settings2 size={16} /> Site appearance </Link>;
  const analyticsShortcut = <Link href="/admin/analytics" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-950 shadow-sm hover:bg-emerald-50"> <Settings2 size={16} /> Visitor analytics </Link>;
  const recommendationsShortcut = <Link href="/admin/recommendations" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-950 shadow-sm hover:bg-emerald-50"> <Settings2 size={16} /> Review recommendations </Link>;

  const stats = [

    {

      label: 'Projects in database',

      value: projectCount,

      icon: FolderKanban,

      color: 'text-emerald-800',

      background: 'bg-emerald-50',

      detail: 'Total records',

    },

    {

      label: 'Published projects',

      value: publishedCount,

      icon: Sparkles,

      color: 'text-teal-800',

      background: 'bg-teal-50',

      detail: 'Visible to visitors',

    },

    {

      label: 'GitHub imports',

      value: githubCount,

      icon: Github,

      color: 'text-slate-800',

      background: 'bg-slate-100',

      detail: 'Imported projects',

    },

    {

      label: 'Certifications',

      value: certificationCount,

      icon: Award,

      color: 'text-amber-800',

      background: 'bg-amber-50',

      detail: 'Credential records',

    },

  ];

  const cards = [

    {

      href: '/admin/profile',

      title: 'Profile',

      description:

        'Update your professional headline, biography, contact links, profile photo and public resume link.',

      icon: UserRound,

      accent: 'bg-emerald-50 text-emerald-800',

    },

    {

      href: '/admin/projects',

      title: 'Projects',

      description:

        'Manage project descriptions, technologies, featured work and publication status.',

      icon: FolderKanban,

      accent: 'bg-teal-50 text-teal-800',

    },

    {
      href: '/admin/education',
      title: 'Education',
      description: 'Add, edit and publish qualifications, institutions, fields of study and dates.',
      icon: Award,
      accent: 'bg-indigo-50 text-indigo-800',
    },
    {
      href: '/admin/experience',
      title: 'Experience',
      description: 'Manage roles, organizations, descriptions, dates and current positions.',
      icon: UserRound,
      accent: 'bg-blue-50 text-blue-800',
    },
    {

      href: '/admin/certifications',

      title: 'Certifications',

      description:

        'Import credentials from CSV, review records and maintain certification details.',

      icon: Award,

      accent: 'bg-amber-50 text-amber-800',

    },

    {

      href: '/admin/knowledge',

      title: 'AI knowledge',

      description:

        'Maintain verified facts that help your public portfolio assistant answer accurately.',

      icon: Bot,

      accent: 'bg-violet-50 text-violet-800',

    },

    {

      href: '/admin/integrations',

      title: 'Integrations',

      description:

        'Manage GitHub, LinkedIn and connected services, including repository synchronization.',

      icon: Settings2,

      accent: 'bg-sky-50 text-sky-800',

    },

  ];

  return (

    <main className="min-h-screen bg-[#f4f7f5] px-4 py-6 text-slate-900 sm:px-8 sm:py-10">

      <div className="mx-auto max-w-7xl">

        <nav className="flex items-center justify-between gap-4">

          <Link

            href="/"

            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 transition hover:text-emerald-700"

          >

            <span aria-hidden="true">←</span>

            View public portfolio

          </Link>

          <form action="/api/admin/logout" method="post">

            <button

              type="submit"

              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

            >

              <LogOut size={16} />

              Sign out

            </button>

          </form>

        </nav>

        <header className="relative mt-8 overflow-hidden rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:mt-10 sm:p-9">

          <div

            aria-hidden="true"

            className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-100/70 blur-3xl"

          />

          <div

            aria-hidden="true"

            className="pointer-events-none absolute -bottom-28 right-40 h-48 w-48 rounded-full bg-teal-100/60 blur-3xl"

          />

          <div className="relative">

            <div className="flex flex-wrap items-center gap-2">

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-900">

                <ShieldCheck size={14} />

                Private workspace

              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                Admin session active

              </span>

            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">

              Portfolio <span className="text-emerald-800">admin.</span>

            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">

              Welcome back. Manage your portfolio content, credentials,

              AI knowledge and connected services from one workspace.

            </p>

            <p className="mt-4 break-all text-sm text-slate-500">

              Signed in as{' '}

              <span className="font-semibold text-slate-800">

                {user.email}

              </span>

            </p>

          </div>

        </header>

        <div className="mt-6 flex flex-wrap gap-3">{appearanceShortcut}{analyticsShortcut}{recommendationsShortcut}</div>

        <section

          aria-label="Portfolio statistics"

          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"

        >

          {stats.map(

            ({

              label,

              value,

              icon: Icon,

              color,

              background,

              detail,

            }) => (

              <div

                key={label}

                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"

              >

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-600">

                      {label}

                    </p>

                    <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">

                      {value.toLocaleString()}

                    </p>

                  </div>

                  <span className={`rounded-xl p-3 ${background} ${color}`}>

                    <Icon size={21} />

                  </span>

                </div>

                <p className="mt-3 text-xs text-slate-500">{detail}</p>

              </div>

            ),

          )}

        </section>

        <section className="mt-10">

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">

                Workspace

              </p>

              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">

                Manage your portfolio

              </h2>

              <p className="mt-2 text-sm text-slate-600">

                Choose a section to view or update its settings.

              </p>

            </div>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">

              {cards.length} sections

            </span>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {cards.map(

              ({ href, title, description, icon: Icon, accent }) => (

                <Link

                  key={href}

                  href={href}

                  className="group flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

                >

                  <div className="flex items-center justify-between">

                    <span className={`rounded-xl p-3 ${accent}`}>

                      <Icon size={21} />

                    </span>

                    <ArrowUpRight

                      size={19}

                      className="text-slate-400 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-800"

                    />

                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950 transition group-hover:text-emerald-900">

                    {title}

                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">

                    {description}

                  </p>

                </Link>

              ),

            )}

          </div>

        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-6 sm:p-7">

            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-900">

                <Bot size={23} />

              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="font-bold text-slate-950">

                    Portfolio AI assistant

                  </h2>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">

                    AI

                  </span>

                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">

                  The public chatbot uses published portfolio data and

                  published facts from your AI knowledge table. Configure

                  <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">

                    OPENROUTER_API_KEY

                  </code>

                  to enable AI responses.

                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4 text-sm text-slate-600 sm:px-7">

            <span className="inline-flex items-center gap-2">

              <Database size={16} className="text-emerald-800" />

              Supabase

            </span>

            <span className="inline-flex items-center gap-2">

              <Github size={16} className="text-slate-700" />

              GitHub

            </span>

            <span className="inline-flex items-center gap-2">

              <Linkedin size={16} className="text-sky-800" />

              LinkedIn OIDC

            </span>

            <span className="inline-flex items-center gap-2">

              <RefreshCw size={16} className="text-emerald-800" />

              Repository sync

            </span>

          </div>

        </section>

        <footer className="pb-4 pt-6 text-center text-xs text-slate-500">

          Private portfolio workspace · Manage your content with care

        </footer>

      </div>

          <SiteControls />
    </main>

  );

}
