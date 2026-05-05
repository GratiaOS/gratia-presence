import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Today - The Lunar Journal',
  description:
    'A local-first lunar journal page for today, with moon phase guidance and private browser storage.',
  openGraph: {
    title: 'Today - The Lunar Journal',
    description:
      'A local-first lunar journal page for today, with moon phase guidance and private browser storage.',
    url: '/today',
  },
  twitter: {
    card: 'summary',
    title: 'Today - The Lunar Journal',
    description:
      'A local-first lunar journal page for today, with moon phase guidance and private browser storage.',
  },
};

export default function TodayLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
