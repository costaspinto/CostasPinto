
import type { Metadata } from 'next';
import './globals.css';
import { ScrollEffects } from '@/components/scroll-effects';

export const metadata: Metadata = {
  title: { default: 'Costas Pinto', template: '%s | Costas Pinto' },
  description: "Explore Costas Pinto's AI, machine learning, and generative AI projects. Ask my AI portfolio assistant.",
  applicationName: 'Costas Pinto Portfolio',
  verification: {
    google: 'CbFkQT_1v3JIj-rlHsOW00C-b8CK6RpfUqW8YWQmptU',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ScrollEffects />{children}</body></html>;
}
