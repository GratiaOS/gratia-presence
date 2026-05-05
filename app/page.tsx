import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-static';

const meta = {
  en: {
    title: 'Gratia - Personal OS',
    description: 'Quiet software for presence, reflection, and rhythm.',
  },
  es: {
    title: 'Gratia - Personal OS',
    description: 'Software tranquilo para presencia, reflexión y ritmo.',
  },
  ro: {
    title: 'Gratia - Personal OS',
    description: 'Software liniștit pentru prezență, reflecție și ritm.',
  },
} as const;

export function generateMetadata(): Metadata {
  return {
    title: meta.en.title,
    description: meta.en.description,
    openGraph: {
      title: meta.en.title,
      description: meta.en.description,
      url: '/',
    },
    twitter: {
      card: 'summary',
      title: meta.en.title,
      description: meta.en.description,
    },
  };
}

export default function Home() {
  return <HomePageClient />;
}
