'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { SiteAppearance } from './appearance-provider';

type Props = {
  initial: SiteAppearance;
  saveAction: (formData: FormData) => void | Promise<void>;
  status?: string;
};

const messages: Record<string, { title: string; body: string }> = {
  saved: {
    title: 'Appearance saved',
    body: 'Your selected colors are now active on the portfolio.',
  },
  migration: {
    title: 'Database setup required',
    body: 'Run supabase/migrations/20261012000600_site_appearance.sql in Supabase SQL Editor, then save again.',
  },
  invalid: {
    title: 'Invalid colors',
    body: 'Choose valid colors and try again.',
  },
  unavailable: {
    title: 'Could not save',
    body: 'The settings service is unavailable. Check Supabase configuration and server logs.',
  },
};

const labels: Record<keyof SiteAppearance, string> = {
  surface: 'Main background',
  section: 'Section background',
  card: 'Cards and panels',
  text: 'Body text',
  heading: 'Headings',
  accent: 'Accent / links',
  border: 'Borders and dividers',
  button: 'Primary buttons',
};

const defaults: SiteAppearance = {
  surface: '#190d24',
  section: '#7100b8',
  card: '#101b17',
  text: '#e9e4ef',
  heading: '#ffffff',
  accent: '#b9f5d0',
  border: '#33483d',
  button: '#064e3b',
};

const presets: Record<string, SiteAppearance> = {
  'Purple + green': {
    surface: '#190d24',
    section: '#7100b8',
    card: '#101b17',
    text: '#e9e4ef',
    heading: '#ffffff',
    accent: '#b9f5d0',
    border: '#33483d',
    button: '#064e3b',
  },
  'Forest green': {
    surface: '#071b16',
    section: '#103d30',
    card: '#102820',
    text: '#e5f5ed',
    heading: '#ffffff',
    accent: '#a7f3d0',
    border: '#315d4d',
    button: '#087653',
  },
  'Light minimal': {
    surface: '#ffffff',
    section: '#f0f5f2',
    card: '#ffffff',
    text: '#334155',
    heading: '#0f172a',
    accent: '#047857',
    border: '#dbe4df',
    button: '#065f46',
  },
  Graphite: {
    surface: '#111318',
    section: '#20232b',
    card: '#191c23',
    text: '#e3e7ef',
    heading: '#ffffff',
    accent: '#a5b4fc',
    border: '#393e4b',
    button: '#4f46e5',
  },
};

/**
 * Validate the supplied initial configuration and fill missing fields.
 * This also protects against older or incomplete database records.
 */
function normalizeAppearance(value?: Partial<SiteAppearance> | null): SiteAppearance {
  const result = { ...defaults };

  if (!value) return result;

  for (const key of Object.keys(defaults) as (keyof SiteAppearance)[]) {
    const candidate = value[key];

    if (isValidHex(candidate)) {
      result[key] = candidate;
    }
  }

  return result;
}

function isValidHex(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function AppearanceEditor({ initial, saveAction, status }: Props) {
  const [colors, setColors] = useState<SiteAppearance>(() =>
    normalizeAppearance(initial),
  );

  const [preset, setPreset] = useState('Custom');

  const notice = status ? messages[status] : undefined;

  const update = (key: keyof SiteAppearance, value: string) => {
    if (!isValidHex(value)) return;

    setColors((current) => ({
      ...current,
      [key]: value,
    }));

    setPreset('Custom');
  };

  const reset = () => {
    setColors(normalizeAppearance(initial));
    setPreset('Custom');
  };

  const previewStyle = {
    '--canvas': colors.surface,
    '--section': colors.section,
    '--surface': colors.card,
    '--ink': colors.text,
    '--heading': colors.heading,
    '--emerald': colors.accent,
    '--line-color': colors.border,
    '--button-color': colors.button,
  } as CSSProperties;

  return (
    <div className="mt-7">
      {notice && (
        <div
          role={status === 'saved' ? 'status' : 'alert'}
          className={`mb-4 rounded-xl border p-3 text-sm ${
            status === 'saved'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-950'
          }`}
        >
          <p className="font-bold">{notice.title}</p>
          <p className="mt-1">{notice.body}</p>
        </div>
      )}

      <form action={saveAction} className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7">
        <div>
          <h2 className="font-bold text-slate-900">Palette presets</h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(presets).map(([name, value]) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setColors(normalizeAppearance(value));
                  setPreset(name);
                }}
                className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                  preset === name
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(labels) as (keyof SiteAppearance)[]).map((key) => (
            <label
              key={key}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {labels[key]}
                </span>
                <span className="mt-1 block font-mono text-xs text-slate-500">
                  {colors[key]}
                </span>
              </span>

              <input
                type="color"
                name={key}
                value={colors[key]}
                onChange={(event) => update(key, event.target.value)}
                aria-label={labels[key]}
                className="h-10 w-12 shrink-0 cursor-pointer rounded border-0 bg-transparent"
              />
            </label>
          ))}
        </div>

        <section
          style={previewStyle}
          className="theme-preview overflow-hidden rounded-2xl border p-3 sm:p-5"
          aria-label="Live website theme preview"
        >
          <div
            className="flex items-center justify-between gap-3 border-b pb-3"
            style={{ borderColor: colors.border }}
          >
            <strong style={{ color: colors.heading }}>Costas Pinto</strong>
            <span style={{ color: colors.accent }} className="text-xs">
              About Â· Projects Â· Resume Â· Feedback
            </span>
          </div>

          <section
            className="mt-4 rounded-xl p-4 sm:p-6"
            style={{ background: colors.section }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: colors.accent }}
            >
              AI / ML ENGINEER
            </p>

            <h2
              className="mt-2 text-2xl font-black"
              style={{ color: colors.heading }}
            >
              I build AI that does useful things.
            </h2>

            <p
              className="mt-2 max-w-xl text-sm"
              style={{ color: colors.text }}
            >
              Practical AI systems, LLM applications and machine learning projects.
            </p>

            <button
              type="button"
              className="mt-4 rounded-full px-4 py-2 text-sm font-bold"
              style={{
                background: colors.button,
                color: contrastText(colors.button),
              }}
            >
              Explore projects
            </button>
          </section>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {['DocuReadAI', 'WildScan'].map((name, index) => (
              <article
                key={name}
                className="rounded-xl border p-4"
                style={{
                  background: colors.card,
                  borderColor: colors.border,
                }}
              >
                <h3
                  className="font-bold"
                  style={{ color: colors.heading }}
                >
                  {name}
                </h3>

                <p className="mt-2 text-sm" style={{ color: colors.text }}>
                  {index
                    ? 'Image classification with deep learning'
                    : 'Retrieval-augmented generation'}
                </p>

                <p
                  className="mt-3 text-xs font-semibold"
                  style={{ color: colors.accent }}
                >
                  Learn more â†—
                </p>
              </article>
            ))}
          </div>

          <section
            className="mt-3 rounded-xl border p-4"
            style={{
              background: colors.section,
              borderColor: colors.border,
            }}
          >
            <h3
              className="font-bold"
              style={{ color: colors.heading }}
            >
              Learning is part of the work.
            </h3>

            <p className="mt-1 text-sm" style={{ color: colors.text }}>
              Section, card, text, border and link colours update together.
            </p>
          </section>
        </section>

        <p className="text-xs leading-5 text-slate-500">
          This preview is representative of the portfolio&apos;s design patterns.
          Your choices remain local until you save.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Save appearance
          </button>

          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Reset to saved
          </button>
        </div>
      </form>
    </div>
  );
}

function contrastText(hex?: string): string {
  if (!isValidHex(hex)) {
    return '#ffffff';
  }

  const value = hex.slice(1);

  const channels = [0, 2, 4].map((index) => {
    const channel = parseInt(value.slice(index, index + 2), 16) / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  const luminance =
    0.2126 * channels[0] +
    0.7152 * channels[1] +
    0.0722 * channels[2];

  return luminance > 0.42 ? '#06130d' : '#ffffff';
}
