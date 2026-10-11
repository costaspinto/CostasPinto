
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { saveProfile } from './actions';

export const dynamic = 'force-dynamic';

type ProfileRow = {
  full_name?: string | null;
  headline?: string | null;
  summary?: string | null;
  location?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
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
        'full_name,headline,summary,location,email,linkedin_url,github_url,projects_eyebrow,projects_title,projects_description',
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
            Headline
            <input
              name="headline"
              maxLength={180}
              defaultValue={
                profile.headline ??
                'AI/ML Engineer | Generative AI | LLM Applications'
              }
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-semibold">
            About / summary
            <textarea
              name="summary"
              rows={5}
              maxLength={3000}
              defaultValue={profile.summary ?? ''}
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
