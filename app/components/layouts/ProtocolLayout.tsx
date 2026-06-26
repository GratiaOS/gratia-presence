'use client';

import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@gratiaos/ui';
import { supportedLocales, defaultLocale } from '../../../i18n/config';

export default function ProtocolLayout({
  children,
  hero,
  summary,
  tags,
  updated,
  aside,
}: PropsWithChildren<{
  hero: string;
  summary?: string;
  tags?: string[];
  updated?: string;
  aside?: ReactNode;
}>) {
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

  const formattedDate = updated
    ? new Date(updated).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : undefined;

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-16 sm:px-8">
      <header className="mb-10">
        <h1 className="font-gratia text-4xl leading-tight font-semibold tracking-tight md:text-5xl" suppressHydrationWarning>
          {hero}
        </h1>
        {summary && (
          <p className="text-lg leading-relaxed text-[color:var(--color-muted)]" suppressHydrationWarning>
            {summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tags && tags.length > 0 && (
            <>
              {tags.map((tag) => (
                <Badge key={tag} variant="soft" tone="accent" size="sm">
                  {tag}
                </Badge>
              ))}
            </>
          )}
          {formattedDate && (
            <span className="text-muted text-xs" suppressHydrationWarning>
              {formattedDate}
            </span>
          )}
        </div>
      </header>
      <div className="grid gap-10 md:grid-cols-[1fr_280px]">
        <article className="prose prose-gratia max-w-none">{children}</article>
        <aside className="hidden md:block">{aside}</aside>
      </div>
    </main>
  );
}
