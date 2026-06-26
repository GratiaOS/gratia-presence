import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-static';

const meta = {
  en: {
    title: 'Gratia - A calm place to think.',
    description: 'Quiet software for presence, reflection, and rhythm.',
  },
  es: {
    title: 'Gratia - Un lugar tranquilo para pensar.',
    description: 'Software sereno para la presencia, la reflexión y el ritmo.',
  },
  ro: {
    title: 'Gratia - Un loc liniștit în care să gândești.',
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
