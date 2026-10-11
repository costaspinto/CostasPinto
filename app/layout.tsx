import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Costas Pinto | AI/ML Engineer',
  description: 'Explore Costas Pinto’s AI, machine learning, and generative AI projects. Ask my AI portfolio assistant.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
