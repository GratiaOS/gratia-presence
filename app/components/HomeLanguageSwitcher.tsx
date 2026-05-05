'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { defaultLocale } from '../../i18n/config';

type LanguageOption = { code: string; label: string };

type Props = {
  activeLang: string;
  languages: readonly LanguageOption[];
  className?: string;
};

const LOCALE_STORAGE_KEY = 'gratia.locale';
const LOCALE_QUERY_KEY = 'lang';

function isKnownLanguage(code: string, languages: readonly LanguageOption[]) {
  return languages.some((lang) => lang.code === code);
}

export default function HomeLanguageSwitcher({ activeLang, languages, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramLang = searchParams?.get(LOCALE_QUERY_KEY);

  const currentLang = useMemo(() => {
    if (paramLang && isKnownLanguage(paramLang, languages)) return paramLang;
    return activeLang;
  }, [activeLang, paramLang, languages]);

  useEffect(() => {
    if (!pathname) return;
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!stored || !isKnownLanguage(stored, languages)) return;

    const params = new URLSearchParams(searchParams?.toString());
    if (stored === defaultLocale) {
      if (!paramLang) return;
      params.delete(LOCALE_QUERY_KEY);
      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`);
      return;
    }

    if (paramLang === stored) return;
    params.set(LOCALE_QUERY_KEY, stored);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, searchParams, router, languages, paramLang]);

  const handleSelect = (code: string) => {
    if (!pathname) return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, code);
    document.documentElement.lang = code;
    window.dispatchEvent(new CustomEvent('gratia:localechange', { detail: { locale: code } }));
    const params = new URLSearchParams(searchParams?.toString());
    if (code === defaultLocale) {
      params.delete(LOCALE_QUERY_KEY);
    } else {
      params.set(LOCALE_QUERY_KEY, code);
    }
    const next = `${pathname}${params.toString() ? `?${params}` : ''}`;
    router.push(next);
  };

  return (
    <div className={className}>
      {languages.map((lang) => {
        const isActive = lang.code === currentLang;
        const params = new URLSearchParams(searchParams?.toString());
        if (lang.code === defaultLocale) {
          params.delete(LOCALE_QUERY_KEY);
        } else {
          params.set(LOCALE_QUERY_KEY, lang.code);
        }
        const href = `${pathname ?? ''}${params.toString() ? `?${params}` : ''}`;

        return (
          <a
            key={lang.code}
            href={href || '/'}
            onClick={(event) => {
              event.preventDefault();
              handleSelect(lang.code);
            }}
            className={
              'underline-offset-4 ' +
              (isActive ? 'font-semibold underline' : 'opacity-85 hover:underline')
            }
          >
            {lang.label}
          </a>
        );
      })}
    </div>
  );
}
