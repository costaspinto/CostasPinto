import type { Metadata } from 'next';
import './globals.css';
import { ScrollEffects } from '@/components/scroll-effects';
import { AppearanceProvider, defaultAppearance, type SiteAppearance } from '@/components/appearance-provider';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: { default: 'Costas Pinto | AI/ML Engineer', template: '%s | Costas Pinto' },
  description: 'Explore Costas Pinto’s AI, machine learning, and generative AI projects. Ask my AI portfolio assistant.',
  applicationName: 'Costas Pinto Portfolio',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let appearance: SiteAppearance = defaultAppearance;
  try {
    const db = await createClient();
    const { data } = await db.from('site_settings').select('setting_value').eq('setting_key', 'appearance').maybeSingle();
    const value = data?.setting_value as Partial<SiteAppearance> | null;
    if (value) appearance = Object.fromEntries(Object.entries(defaultAppearance).map(([key, fallback]) => [key, /^#[0-9a-fA-F]{6}$/.test(String(value[key as keyof SiteAppearance] ?? '')) ? value[key as keyof SiteAppearance] : fallback])) as SiteAppearance;
  } catch { /* Appearance settings are optional until the migration is applied. */ }
  return <html lang="en"><body><AppearanceProvider appearance={appearance}><ScrollEffects />{children}</AppearanceProvider></body></html>;
}
