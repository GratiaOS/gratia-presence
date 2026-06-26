'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import GratiaMark from '@/components/GratiaMark';
import { Badge } from '@gratiaos/ui';
import { supportedLocales, defaultLocale } from '../../../i18n/config';

export default function NoteLayout({
  children,
  hero,
  updated,
}: PropsWithChildren<{
  hero: string;
  updated?: string;
}>) {
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    const langParam = searchParams.get('lang');
    const storedLocale = window.localStorage.getItem('gratia.locale');
    const detectedLocale = langParam || storedLocale || defaultLocale;
    const finalLocale = supportedLocales.includes(detectedLocale) ? detectedLocale : defaultLocale;
    if (finalLocale !== locale) {
      setLocale(finalLocale);
    }
  }, [searchParams, locale]);

  const formattedDate = updated
    ? new Date(updated).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : undefined;

  return (
    <div className="min-h-screen">
      <header className="bg-surface px-6 py-20 text-center" data-layer="surface">
        <div className="mx-auto max-w-2xl flex flex-col gap-6 items-center">
          <GratiaMark className="text-accent h-16 w-auto" />
          <h1 className="font-gratia text-accent relative z-10 text-3xl leading-tight font-semibold tracking-tight">
            {hero}
          </h1>
          {formattedDate && (
            <Badge variant='subtle'>{formattedDate}</Badge>
          )}
        </div>
      </header >

      <section className="bg-midstream px-6 py-16" data-layer="midstream">
        <div className="mx-auto max-w-2xl">
          <article className="prose prose-gratia max-w-none text-lg leading-relaxed text-[color:var(--color-text)]">
            {children}
          </article>
        </div>
      </section>
    </div >
  );
}
