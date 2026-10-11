import Link from 'next/link';

import {

  ArrowDownRight,

  ArrowUpRight,

  Github,

  Linkedin,
  Youtube,
  Mail,

  Sparkles,

  FolderKanban,

  MapPin,

  GraduationCap,

  Code2,

  ExternalLink,

  Award,

} from 'lucide-react';

import {

  getPortfolioData,

  getGitHubRepositories,

} from '@/lib/data';

import { SectionHeading } from '@/components/section-heading';

import { ChatWidget } from '@/components/chat-widget';

import { ResumeActions } from '@/components/resume-actions';
import { GitHubRepositories } from '@/components/github-repositories';
import { SiteControls } from '@/components/site-controls';
import { BrandMark } from '@/components/brand-mark';
import { MobileNav } from '@/components/mobile-nav';
import { YouTubeSection } from '@/components/youtube-section';
import { getYouTubeVideos } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export default async function HomePage() {

  const [profile, repositories] = await Promise.all([

    getPortfolioData(),

    getGitHubRepositories(),

  ]);

  const youtubeVideos = await getYouTubeVideos();

  return (

    <main id="top" className="portfolio-shell overflow-hidden bg-[#f8faf8] text-slate-950 selection:bg-emerald-200 selection:text-emerald-950">

      {/* Navigation */}

      <nav className="portfolio-nav sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <a

            href="#top"

            aria-label={`${profile.name} home`}

            className="group text-xl font-black tracking-tight text-slate-950 transition-colors hover:text-emerald-900"

          >

            <BrandMark />

          </a>

          <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">

            {[

              ['About', '#about'],

              ['Projects', '#projects'],

              ['GitHub', '#github-repositories'],

              ['Skills', '#skills'],

              ['Education', '#education'],
              ['Experience', '#experience'],

            ].map(([label, href]) => (

              <a

                key={label}

                href={href}

                className="relative py-2 transition-colors duration-200 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"

              >

                {label}

              </a>

            ))}

          </div>

          <MobileNav />

          <a

            href="#contact"

            className="hidden md:inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-emerald-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

          >

            Let&apos;s connect

            <ArrowUpRight size={15} />

          </a>

        </div>

      </nav>

      {/* Hero */}

      <section

        id="top"

        className="portfolio-hero relative isolate mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 md:grid-cols-[1.15fr_.85fr]"

      >

        <div

          aria-hidden="true"

          className="pointer-events-none absolute -left-48 top-0 -z-10 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl"

        />

        <div

          aria-hidden="true"

          className="pointer-events-none absolute right-0 top-10 -z-10 h-80 w-80 rounded-full bg-lime-100/40 blur-3xl"

        />

        <div className="animate-[fadeInUp_.7s_ease-out_both]">

          <div className="mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full border border-emerald-200/80 bg-white/90 px-4 py-2 text-xs font-semibold text-emerald-950 shadow-sm sm:text-sm">

            <span className="relative flex h-2.5 w-2.5 shrink-0">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />

            </span>

            <span className="truncate">{profile.headline}</span>

          </div>

          <h1 className="max-w-3xl whitespace-pre-line text-5xl font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
            {profile.heroTitle}
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            {profile.heroDescription}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">

            <a

              href="#projects"

              className="group inline-flex items-center gap-2.5 rounded-full bg-emerald-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-xl hover:shadow-emerald-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

            >

              Explore my work

              <ArrowDownRight

                size={18}

                className="transition-transform duration-200 group-hover:translate-y-0.5 group-hover:translate-x-0.5"

              />

            </a>

            <a

              href={profile.links.linkedin}

              target="_blank"

              rel="noreferrer"

              className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"

            >

              <Linkedin size={17} className="text-sky-800" />

              LinkedIn

              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

            </a>
            <a
              href="https://www.youtube.com/@ArkByteab"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-red-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:bg-red-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
              <Youtube size={18} className="text-red-600" />
              My YouTube
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

          </div>
          <ResumeActions resumeUrl={profile.resumeUrl} />

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">

            <span className="inline-flex items-center gap-2">

              <Sparkles size={16} className="text-emerald-800" />

              GenAI &amp; LLM applications

            </span>

            <span className="inline-flex items-center gap-2">

              <Github size={16} className="text-emerald-800" />

              Hands-on projects

            </span>

          </div>

        </div>

        {/* Profile card */}

        <div className="relative animate-[fadeInUp_.9s_ease-out_both]">

          <div

            aria-hidden="true"

            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-emerald-200/60 via-teal-100/30 to-lime-200/50 opacity-80 blur-2xl transition-opacity duration-500 hover:opacity-100"

          />

          <div className="profile-panel relative overflow-hidden rounded-[2rem] border border-white/90 bg-white/95 p-6 shadow-[0_24px_80px_-32px_rgba(6,78,59,0.28)] backdrop-blur sm:p-8">

            <div

              aria-hidden="true"

              className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-gradient-to-bl from-emerald-50 to-transparent"

            />

            <div className="relative flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm font-medium text-slate-500">

                  Hello, I&apos;m

                </p>

                <h2 className="mt-1 break-words text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">

                  {profile.name}

                </h2>

                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">

                  <MapPin size={14} className="shrink-0 text-emerald-800" />

                  {profile.location}

                </p>

              </div>

              {profile.avatarUrl ? (

                <img

                  src={profile.avatarUrl}

                  alt={`${profile.name} profile`}

                  className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-emerald-50 transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20"

                  referrerPolicy="no-referrer"

                />

              ) : (

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-900 ring-4 ring-emerald-50 sm:h-20 sm:w-20">

                  <Sparkles size={27} />

                </div>

              )}

            </div>

            <div className="my-7 h-px bg-gradient-to-r from-emerald-200 via-slate-100 to-transparent" />

            <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-900">

              Current focus

            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              {profile.skills.slice(0, 8).map((skill) => (

                <span

                  key={skill}

                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-950"

                >

                  {skill}

                </span>

              ))}

            </div>

            <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-5 text-white sm:p-6">

              <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">

                <Code2 size={16} />

                A little more about me

              </div>

              <p className="mt-3 text-lg font-semibold leading-7">

                From machine learning experiments to AI applications people can actually use.

              </p>

              <a

                href="#about"

                className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"

              >

                Get to know me

                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

              </a>

            </div>

          </div>

        </div>

      </section>

      {/* About */}

      <section id="about" className="border-y border-slate-200/70 bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <SectionHeading

            eyebrow="About me"

            title={profile.aboutTitle}

            description={profile.summary}

          />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">

            {[

              {

                title: 'Build',

                description:

                  'End-to-end projects that connect models, data, and usable interfaces.',

                icon: Code2,

              },

              {

                title: 'Experiment',

                description:

                  'Explore ML, computer vision, LLMs, and retrieval-based systems.',

                icon: Sparkles,

              },

              {

                title: 'Improve',

                description:

                  'Iterate on reliability, evaluation, and the experience around the model.',

                icon: ArrowUpRight,

              },

            ].map(({ title, description, icon: Icon }, index) => (

              <article

                key={title}

                className="group rounded-2xl border border-slate-100 bg-[#f8faf8] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-950/5"

              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900 transition-all duration-300 group-hover:bg-emerald-900 group-hover:text-white">

                  <Icon size={20} />

                </div>

                <p className="mt-5 text-lg font-bold text-slate-950">

                  {title}

                </p>

                <p className="mt-2 text-sm leading-7 text-slate-600">

                  {description}

                </p>

                <span className="mt-5 block text-xs font-bold tracking-widest text-emerald-800">

                  0{index + 1}

                </span>

              </article>

            ))}

          </div>

        </div>

      </section>

      {/* Featured projects */}

      <section id="projects" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">

        <SectionHeading

          eyebrow="Selected work"

          title="Projects with a purpose."

          description="Explore selected AI/ML applications and featured projects."

        />

        {profile.projects.length > 0 ? (

          <div className="mt-10 grid gap-5 md:grid-cols-2">

            {profile.projects.map((project, index) => (

              <article

                key={project.id ?? project.name}

                className="group relative isolate flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/10 focus-within:ring-2 focus-within:ring-emerald-700 sm:p-8"

              >

                <div

                  aria-hidden="true"

                  className="pointer-events-none absolute -right-20 -top-20 -z-10 h-56 w-56 rounded-full bg-emerald-100/70 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"

                />

                <div className="flex items-center justify-between gap-3">

                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-950">

                    {project.category}

                  </span>

                  <span className="font-mono text-sm text-slate-400 transition-colors group-hover:text-emerald-800">

                    {String(index + 1).padStart(2, '0')}

                  </span>

                </div>

                <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-950 transition-colors duration-200 group-hover:text-emerald-900">

                  {project.name}

                </h3>

                <p className="mt-3 min-h-14 leading-7 text-slate-600">

                  {project.description}

                </p>

                {project.stack.length > 0 && (

                  <div className="mt-5 flex flex-wrap gap-2">

                    {project.stack.map((technology) => (

                      <span

                        key={technology}

                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors duration-200 group-hover:border-emerald-100 group-hover:bg-white"

                      >

                        {technology}

                      </span>

                    ))}

                  </div>

                )}

                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 mt-7">

                  <a

                    href={project.href}

                    target="_blank"

                    rel="noreferrer"

                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-900 transition-all duration-200 hover:gap-3 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-4"

                  >

                    View project

                    <ArrowUpRight

                      size={16}

                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"

                    />

                  </a>

                  {project.demoUrl && (

                    <a

                      href={project.demoUrl}

                      target="_blank"

                      rel="noreferrer"

                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-4"

                    >

                      Live demo

                      <ExternalLink size={14} />

                    </a>

                  )}

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">

              <FolderKanban size={22} />

            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-950">

              Projects coming soon

            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">

              Published projects will appear here once they are added and published through the portfolio admin dashboard.

            </p>

          </div>

        )}

      </section>

      {/* Searchable GitHub repositories */}

      <GitHubRepositories repositories={repositories} />

      <YouTubeSection videos={youtubeVideos} />

      {/* Skills */}

      <section id="skills" className="relative isolate overflow-hidden bg-[#071e18] py-20 text-white sm:py-24">

        <div

          aria-hidden="true"

          className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-700/20 blur-3xl"

        />

        <div

          aria-hidden="true"

          className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-80 w-80 rounded-full bg-teal-700/15 blur-3xl"

        />

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <SectionHeading

            eyebrow="Toolbox"

            title="The tools I use to turn ideas into products."

            description="A working snapshot of my technical interests."

            inverted

          />

          <div className="mt-10 flex flex-wrap gap-3">

            {profile.skills.map((skill) => (

              <span

                key={skill}

                className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-emerald-50 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/50 hover:bg-emerald-400/10 hover:text-white"

              >

                {skill}

              </span>

            ))}

          </div>

        </div>

      </section>

      {/* Education */}

      <section id="education" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">

        <SectionHeading

          eyebrow="Education"

          title="Learning is part of the work."

        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">

          {profile.education.map((item) => (

            <article

              key={`${item.institution}-${item.name}`}

              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5 sm:p-7"

            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900 transition-colors group-hover:bg-emerald-900 group-hover:text-white">

                  <GraduationCap size={21} />

                </div>

                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">

                  {item.period}

                </span>

              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-950">

                {item.name}

              </h3>

              <p className="mt-2 text-slate-600">{item.detail}</p>

              <p className="mt-4 text-sm font-medium text-slate-500">

                {item.institution}

              </p>

            </article>

          ))}
          {profile.education.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center md:col-span-2">
              <h3 className="text-lg font-bold text-slate-900">Education details are being updated</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Published qualifications will appear here once you add them in the admin dashboard.
              </p>
            </div>
          )}

        </div>

      </section>

      {/* Experience */}

      <section id="experience" className="border-y border-slate-200/70 bg-white py-20 sm:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-8">

            <SectionHeading

              eyebrow="Experience"

              title="Experience and impact."

            />

            <div className="mt-10 grid gap-4 md:grid-cols-2">

              {profile.experience.map((item) => (

                <article

                  key={`${item.organization}-${item.role}`}

                  className="rounded-2xl border border-slate-200 bg-[#f8faf8] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg"

                >

                  <p className="text-sm font-bold text-emerald-800">

                    {item.period}

                  </p>

                  <h3 className="mt-3 text-xl font-bold">{item.role}</h3>

                  <p className="mt-1 text-slate-600">{item.organization}</p>

                  <p className="mt-4 text-sm leading-7 text-slate-500">

                    {item.description}

                  </p>

                </article>

              ))}

            </div>
            {profile.experience.length === 0 && (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <h3 className="text-lg font-bold text-slate-900">Experience details are being updated</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Professional experience will appear here once a published record is added in the admin dashboard.
                </p>
              </div>
            )}
          </div>
        </section>

      {/* Certifications */}

      {profile.certifications.length > 0 && (

        <section

          id="certifications"

          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24"

        >

          <SectionHeading

            eyebrow="Certifications"

            title="Learning with proof."

            description="A selection of professional certifications and continuous learning."

          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {profile.certifications.slice(0, 6).map((item) => (

              <article

                key={`${item.issuer}-${item.name}`}

                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5"

              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800 transition-colors group-hover:bg-amber-100">

                  <Award size={20} />

                </div>

                <h3 className="mt-4 font-bold leading-6 text-slate-950">

                  {item.name}

                </h3>

                <p className="mt-2 text-sm text-slate-500">

                  {item.issuer}

                  {item.issuedAt ? ` · ${item.issuedAt.slice(0, 4)}` : ''}

                </p>

                {item.credentialUrl && (

                  <a

                    href={item.credentialUrl}

                    target="_blank"

                    rel="noreferrer"

                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-900 transition-all hover:gap-2.5 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"

                  >

                    View credential

                    <ArrowUpRight size={15} />

                  </a>

                )}

              </article>

            ))}

          </div>

          {profile.certifications.length > 6 && (

            <div className="mt-8 flex flex-col items-center gap-3">

              <p className="text-sm text-slate-500">

                Showing 6 of {profile.certifications.length} certifications

              </p>

              <Link

                href="/certifications"

                className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

              >

                View all certifications

                <ArrowUpRight size={16} />

              </Link>

            </div>

          )}

        </section>

      )}

      {/* Contact and footer */}

      <section id="contact" className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">

        <div className="contact-panel relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-100 via-[#e6f3eb] to-teal-100 p-7 sm:p-12 lg:p-14">

          <div

            aria-hidden="true"

            className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-white/60 blur-3xl"

          />

          <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-900">

            Contact

          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">

            Have an interesting AI problem? Let&apos;s talk.

          </h2>

          <p className="mt-5 max-w-xl leading-7 text-slate-600">

            I&apos;m interested in practical AI/ML work, thoughtful engineering,

            and building things that solve real problems.

          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <a

              href={profile.links.linkedin}

              target="_blank"

              rel="noreferrer"

              className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

            >

              <Linkedin size={18} />

              Connect on LinkedIn

              <ArrowUpRight size={15} />

            </a>

            <a

              href={profile.links.github}

              target="_blank"

              rel="noreferrer"

              className="inline-flex items-center gap-2 rounded-full border border-emerald-900/20 bg-white/70 px-5 py-3.5 text-sm font-bold text-emerald-950 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-800 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

            >

              <Github size={18} />

              GitHub

              <ArrowUpRight size={15} />

            </a>

            {profile.email && (

              <a

                href={`mailto:${profile.email}`}

                className="inline-flex items-center gap-2 rounded-full border border-emerald-900/20 bg-white/70 px-5 py-3.5 text-sm font-bold text-emerald-950 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-800 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"

              >

                <Mail size={18} />

                Email me

              </a>

            )}

          </div>
          <ResumeActions resumeUrl={profile.resumeUrl} />

        </div>

        <footer className="flex flex-col justify-between gap-3 py-8 text-sm text-slate-500 sm:flex-row">

          <span>

            © {new Date().getFullYear()} {profile.name}

          </span>

          <a

            href="#top"

            className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"

          >

            Back to top

            <ArrowUpRight size={14} />

          </a>

          <span>Built with curiosity and code.</span>

          <Link
            href="/admin/login"
            className="text-xs font-medium text-slate-400 transition-colors hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            Admin
          </Link>

        </footer>

      </section>

      <ChatWidget />

          <SiteControls />
    </main>

  );

}
