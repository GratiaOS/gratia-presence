'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { defaultLocale, supportedLocales } from '../../i18n/config';
import type { Locale } from '../../i18n/resources';

const LOCALE_STORAGE_KEY = 'gratia.locale';
const LOCALE_QUERY_KEY = 'lang';

function normalizeLocale(value?: string | null): Locale {
  if (value && supportedLocales.includes(value)) return value as Locale;
  return defaultLocale as Locale;
}

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryLocale = searchParams?.get(LOCALE_QUERY_KEY);
  const [locale, setLocale] = useState<Locale>(() => normalizeLocale(queryLocale));

  useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? window.localStorage.getItem(LOCALE_STORAGE_KEY) : null;
    const next = normalizeLocale(queryLocale ?? stored);
    setLocale(next);
  }, [queryLocale]);

  const options = useMemo(() => supportedLocales as Locale[], []);

  const selectLocale = (next: Locale) => {
    setLocale(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.documentElement.lang = next;
      window.dispatchEvent(new CustomEvent('gratia:localechange', { detail: { locale: next } }));
    }
    const params = new URLSearchParams(searchParams?.toString());
    if (next === defaultLocale) {
      params.delete(LOCALE_QUERY_KEY);
    } else {
      params.set(LOCALE_QUERY_KEY, next);
    }
    router.push(`${pathname || '/'}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div
      role="group"
      aria-label="Language selector"
      className="inline-flex items-center gap-1 text-xs"
    >
      {options.map((option) => {
        const active = option === locale;
        return (
          <button
            key={option}
            type="button"
            onClick={() => selectLocale(option)}
            aria-pressed={active}
            className={[
              'px-1.5 py-1 uppercase underline-offset-4 transition',
              active
                ? 'font-semibold text-[color:var(--color-text)] underline'
                : 'text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]',
            ].join(' ')}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageToggle;
