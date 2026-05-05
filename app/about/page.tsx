import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About - Heartware',
  description:
    'The thinking behind Gratia: local-first heartware for presence, daily rituals, and digital sovereignty.',
  openGraph: {
    title: 'About Gratia - Heartware',
    description:
      'The thinking behind Gratia: local-first heartware for presence, daily rituals, and digital sovereignty.',
    url: '/about',
  },
  twitter: {
    card: 'summary',
    title: 'About Gratia - Heartware',
    description:
      'The thinking behind Gratia: local-first heartware for presence, daily rituals, and digital sovereignty.',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
