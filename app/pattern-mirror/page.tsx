import PatternMirrorPageClient from './PatternMirrorPageClient';
import type { Metadata } from 'next';
import { defaultLocale, isSupportedLocale } from '../../i18n/config.js';

export const dynamic = 'force-static';

const metaByLocale = {
  en: {
    title: 'Mirror Room · Gratia',
    description: 'Paste a text or a link. Gratia holds it softly and returns only what’s alive.',
  },
  es: {
    title: 'Sala del Espejo · Gratia',
    description:
      'Pega un texto o un enlace. Gratia lo sostiene con suavidad y te devuelve solo lo que está vivo.',
  },
  ro: {
    title: 'Camera Oglinzii · Gratia',
    description: 'Lipește un text sau un link. Gratia îl ține blând și îți întoarce doar ce e viu.',
  },
} as const;

type MetaLocale = keyof typeof metaByLocale;
type SearchParams = { lang?: string };

function resolveLocale(raw?: string): MetaLocale {
  if (raw && isSupportedLocale(raw)) {
    const key = raw as MetaLocale;
    if (key in metaByLocale) return key;
  }
  if ((defaultLocale as MetaLocale) in metaByLocale) return defaultLocale as MetaLocale;
  return 'en';
}

export function generateMetadata(): Metadata {
  const locale = resolveLocale(defaultLocale);
  const entry = metaByLocale[locale];

  return {
    title: entry.title,
    description: entry.description,
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: entry.title,
      description: entry.description,
    },
  };
}

export default function PatternMirrorPage() {
  return <PatternMirrorPageClient />;
}
