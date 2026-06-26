'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { defaultLocale, supportedLocales } from './config.js';
import type { Locale } from './resources';

const LOCALE_STORAGE_KEY = 'gratia.locale';
const LOCALE_QUERY_KEY = 'lang';

function normalizeLocale(value?: string | null): Locale {
  if (value && supportedLocales.includes(value)) return value as Locale;
  return defaultLocale as Locale;
}

export function useLocale(): Locale {
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>(defaultLocale as Locale);

  useEffect(() => {
    const syncLocale = (event?: Event) => {
      const eventLocale =
        event instanceof CustomEvent && typeof event.detail?.locale === 'string'
          ? event.detail.locale
          : null;
      const queryLocale = searchParams?.get(LOCALE_QUERY_KEY);
      const stored =
        typeof window !== 'undefined' ? window.localStorage.getItem(LOCALE_STORAGE_KEY) : null;
      setLocale(normalizeLocale(eventLocale ?? queryLocale ?? stored));
    };

    syncLocale();
    window.addEventListener('gratia:localechange', syncLocale);
    return () => window.removeEventListener('gratia:localechange', syncLocale);
  }, [searchParams]);

  return locale;
}
