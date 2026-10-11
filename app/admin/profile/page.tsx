
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { saveProfile } from './actions';

export const dynamic = 'force-dynamic';

type ProfileRow = {
  full_name?: string | null;
  headline?: string | null;
  hero_title?: string | null;
  hero_description?: string | null;
  about_title?: string | null;
  summary?: string | null;
  location?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  resume_path?: string | null;
  projects_eyebrow?: string | null;
  projects_title?: string | null;
  projects_description?: string | null;
};

const inputClass =
  'mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-forest';

export default async function ProfileAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  let profile: ProfileRow = {};
  let loadError = false;

  try {
    const db = createAdminClient();

    const { data, error } = await db
      .from('profile')
      .select(
        'full_name,headline,hero_title,hero_description,about_title,summary,location,email,linkedin_url,github_url,resume_path,projects_eyebrow,projects_title,projects_description',
      )
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Profile load failed:', error.message);
      loadError = true;
    } else {
      profile = data ?? {};
    }
  } catch (error) {
    console.error('Profile load failed:', error);
    loadError = true;
  }

  return (
    <main className="min-h-screen bg-paper px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="text-sm font-semibold text-forest"
        >
          ← Dashboard
        </Link>

        <header className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest">
            Portfolio content
          </p>
          <h1 className="mt-2 text-3xl font-black">Edit profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Update your public profile and homepage section content.
            Changes are saved in Supabase.
          </p>
        </header>

        {params.status === 'saved' && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            Profile and project section content saved successfully.
          </p>
        )}

        {params.status === 'invalid' && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
          >
            Please check the fields and enter valid URLs and email addresses.
          </p>
        )}

        {(params.status === 'error' || loadError) && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            The profile could not be loaded or saved. Check the Supabase
            schema and service-role configuration.
          </p>
        )}

        <form
          action={saveProfile}
          className="mt-7 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold">Profile details</h2>

          <label className="block text-sm font-semibold">
            Full name
            <input
              name="full_name"
              required
              maxLength={120}
              defaultValue={profile.full_name ?? 'Costas Pinto'}
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-semibold">
            Professional tagline
            <input
              name="headline"
              maxLength={180}
              defaultValue={
                profile.headline ??
                'AI/ML Engineer | Generative AI | LLM Applications'
              }
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">Shown in the small label above your main homepage heading.</span>
          </label>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Homepage hero</p>
            <h2 className="mt-2 text-xl font-bold">Main heading and introduction</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Edit the large hero heading and its supporting paragraph separately from your About Me section. The headline uses one consistent text color on the homepage.</p>
          </div>

          <label className="block text-sm font-semibold">
            Hero heading
            <textarea
              name="hero_title"
              required
              rows={2}
              maxLength={180}
              defaultValue={profile.hero_title ?? 'I build AI that\ndoes useful things.'}
              className={`${inputClass} leading-6`}
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">Use a new line if you want to control where the headline wraps.</span>
          </label>

          <label className="block text-sm font-semibold">
            Hero description
            <textarea
              name="hero_description"
              required
              rows={4}
              maxLength={1200}
              defaultValue={profile.hero_description ?? 'I build practical AI and machine learning applications, with a focus on generative AI, LLM-powered tools, and turning experiments into useful products.'}
              className={`${inputClass} leading-6`}
            />
          </label>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">About me section</p>
            <h2 className="mt-2 text-xl font-bold">About heading and story</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This content is independent of the homepage hero. Changes here will not replace your main headline or hero introduction.</p>
          </div>

          <label className="block text-sm font-semibold">
            About Me heading
            <input
              name="about_title"
              required
              maxLength={180}
              defaultValue={profile.about_title ?? 'Curious by nature. Practical by design.'}
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-semibold">
            About Me description
            <textarea
              name="summary"
              required
              rows={5}
              maxLength={3000}
              defaultValue={profile.summary ?? 'I build practical AI and machine learning applications, with a focus on generative AI, LLM-powered tools, and turning experiments into useful products.'}
              className={`${inputClass} leading-6`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Location
            <input
              name="location"
              maxLength={160}
              defaultValue={profile.location ?? 'Maharashtra, India'}
              className={inputClass}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Public email
              <input
                name="email"
                type="email"
                defaultValue={profile.email ?? ''}
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-semibold">
              LinkedIn URL
              <input
                name="linkedin_url"
                type="url"
                defaultValue={
                  profile.linkedin_url ??
                  'https://www.linkedin.com/in/costaspinto/'
                }
                className={inputClass}
              />
            </label>
          </div>

          <label className="block text-sm font-semibold">
            GitHub URL
            <input
              name="github_url"
              type="url"
              defaultValue={
                profile.github_url ?? 'https://github.com/costaspinto'
              }
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-semibold">
            Resume Google Drive share link
            <input
              name="resume_path"
              type="url"
              maxLength={1000}
              defaultValue={profile.resume_path ?? ''}
              placeholder="https://drive.google.com/file/d/.../view"
              className={inputClass}
            />
            <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
              Paste the share link for your resume PDF. In Google Drive, set General access to “Anyone with the link — Viewer” if visitors should be able to preview and download it. Leave empty to hide the public resume buttons.
            </span>
            {profile.resume_path && (
              <a
                href={profile.resume_path}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-xs font-semibold text-forest underline underline-offset-4"
              >
                Test current resume link
              </a>
            )}
          </label>
          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">
              Homepage section
            </p>
            <h2 className="mt-2 text-xl font-bold">
              Projects section content
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              These fields control the three lines above your featured
              projects on the homepage. You can change them at any time.
            </p>
          </div>

          <label className="block text-sm font-semibold">
            Section label
            <input
              name="projects_eyebrow"
              required
              maxLength={100}
              defaultValue={profile.projects_eyebrow ?? 'Selected work'}
              placeholder="e.g. Featured projects"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-semibold">
            Section heading
            <input
              name="projects_title"
              required
              maxLength={180}
              defaultValue={
                profile.projects_title ?? 'Projects with a purpose.'
              }
              placeholder="e.g. AI projects built to solve real problems."
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-semibold">
            Section description
            <textarea
              name="projects_description"
              required
              rows={3}
              maxLength={500}
              defaultValue={
                profile.projects_description ??
                'Explore selected AI/ML applications and featured projects.'
              }
              placeholder="Describe the projects visitors will find here."
              className={`${inputClass} leading-6`}
            />
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-ink"
            >
              Save profile and section
            </button>

            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:border-forest"
            >
              View site
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
