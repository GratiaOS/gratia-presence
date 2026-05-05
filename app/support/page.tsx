import type { Metadata } from 'next';
import SupportPageClient from './SupportPageClient';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  return {
    title: 'Support Gratia',
    description:
      'Support the Gratia node and help keep quiet, local-first software alive.',
    openGraph: {
      title: 'Support Gratia',
      description:
        'Support the Gratia node and help keep quiet, local-first software alive.',
      url: '/support',
    },
    twitter: {
      card: 'summary',
      title: 'Support Gratia',
      description:
        'Support the Gratia node and help keep quiet, local-first software alive.',
    },
  };
}

export default function SupportPage() {
  return <SupportPageClient />;
}
