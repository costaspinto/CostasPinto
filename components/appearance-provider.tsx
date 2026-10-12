'use client';
import type { CSSProperties, ReactNode } from 'react';
export type SiteAppearance = { accent: string; surface: string; text: string; section: string; card: string; heading: string; border: string; button: string };
export const defaultAppearance: SiteAppearance = { accent:'#10b981', surface:'#080d0a', text:'#eff7f1', section:'#101813', card:'#151f18', heading:'#ffffff', border:'#294034', button:'#065f46' };
type Props = { children: ReactNode; appearance: SiteAppearance };
export function AppearanceProvider({ children, appearance }: Props) {
  const style = { '--emerald': appearance.accent, '--emerald-bright': appearance.accent, '--canvas': appearance.surface, '--ink': appearance.text, '--section': appearance.section, '--surface': appearance.card, '--surface-raised': appearance.card, '--heading': appearance.heading, '--line-color': appearance.border, '--button-color': appearance.button } as CSSProperties;
  return <div style={style} className="min-h-screen themed-site">{children}</div>;
}
