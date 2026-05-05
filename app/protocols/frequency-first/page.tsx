'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProtocolLayout from '@/components/layouts/ProtocolLayout';
import ContentEs from './content.es.mdx';
import ContentRo from './content.ro.mdx';
import ContentEn from './content.en.mdx';
import frontmatters from '../frontmatters.json';
import { supportedLocales, defaultLocale } from '../../../i18n/config';
import { useProtocolCoherence } from '@/lib/hooks/useProtocolCoherence';

const contentMap = {
  es: ContentEs,
  ro: ContentRo,
  en: ContentEn,
};

function PageContent() {
  const searchParams = useSearchParams();
  // Start with defaultLocale to match server render
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    // Detect locale client-side only (after hydration)
    const langParam = searchParams.get('lang');
    const storedLocale = window.localStorage.getItem('gratia.locale');
    const detectedLocale = langParam || storedLocale || defaultLocale;
    const finalLocale = supportedLocales.includes(detectedLocale) ? detectedLocale : defaultLocale;
    if (finalLocale !== locale) {
      setLocale(finalLocale);
    }
  }, [searchParams, locale]);

  const fm =
    frontmatters['frequency-first'][locale as keyof (typeof frontmatters)['frequency-first']] ||
    frontmatters['frequency-first'][defaultLocale];
  const Content = contentMap[locale as keyof typeof contentMap] || contentMap[defaultLocale];
  // Emit coherence signal when reading protocol
  useProtocolCoherence('frequency-first', locale);
  return (
    <ProtocolLayout hero={fm.title} summary={fm.summary} tags={fm.tags} updated={fm.updated}>
      <Content />
    </ProtocolLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
