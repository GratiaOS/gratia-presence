'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { defaultLocale } from './config.js';
import { resources, type Locale } from './resources';

type Resources = typeof resources;
type DefaultLocale = keyof Resources;
type Namespaces = keyof Resources[DefaultLocale];

// helper: produce "a.b.c" unions for nested objects
type LeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, any>
    ? LeafPaths<T[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K}`>
    : `${Prefix}${Prefix extends '' ? '' : '.'}${K}`;
}[keyof T & string];

export type TranslationKey<N extends Namespaces> = LeafPaths<Resources[DefaultLocale][N]>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <N extends Namespaces, K extends TranslationKey<N>>(namespace: N, key: K) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale as Locale,
  setLocale: () => undefined,
  t: (_ns, key) => key,
});

const LOCALE_STORAGE_KEY = 'gratia.locale';
const LOCALE_QUERY_KEY = 'lang';

function normalizeLocale(value?: string | null): Locale {
  const resourceLocales = Object.keys(resources) as Locale[];
  if (value && resourceLocales.includes(value as Locale)) return value as Locale;
  return defaultLocale as Locale;
}

function getNested(obj: any, path: string): unknown {
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) return acc[part];
    return undefined;
  }, obj);
}

function translate<N extends Namespaces, K extends TranslationKey<N>>(
  locale: Locale,
  namespace: N,
  key: K
): string {
  const nsPack = resources[locale]?.[namespace];
  const basePack = resources[defaultLocale as Locale]?.[namespace];

  const fromLocale = nsPack && getNested(nsPack, key as string);
  if (typeof fromLocale === 'string') return fromLocale as string;

  const fromDefault = basePack && getNested(basePack, key as string);
  if (typeof fromDefault === 'string') return fromDefault as string;

  return key as string;
}

type ProviderProps = {
  locale?: string;
  children: React.ReactNode;
};

export function I18nProvider({ locale, children }: ProviderProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>(() => {
    if (locale) return normalizeLocale(locale);
    return defaultLocale as Locale;
  });

  const setLocale = useCallback((next: Locale) => {
    setActiveLocale(normalizeLocale(next));
  }, []);

  React.useEffect(() => {
    if (!locale) return;
    const normalized = normalizeLocale(locale);
    setActiveLocale((prev) => (prev === normalized ? prev : normalized));
  }, [locale]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromQuery = (event?: Event) => {
      const eventLocale =
        event instanceof CustomEvent && typeof event.detail?.locale === 'string'
          ? event.detail.locale
          : null;
      const url = new URL(window.location.href);
      const rawQuery = url.searchParams.get(LOCALE_QUERY_KEY);
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      const normalized = normalizeLocale(eventLocale ?? rawQuery ?? stored);
      setActiveLocale((prev) => (prev === normalized ? prev : normalized));
    };
    syncFromQuery();
    window.addEventListener('popstate', syncFromQuery);
    window.addEventListener('gratia:localechange', syncFromQuery);
    return () => {
      window.removeEventListener('popstate', syncFromQuery);
      window.removeEventListener('gratia:localechange', syncFromQuery);
    };
  }, []);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = activeLocale;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, activeLocale);
      const isDefault = activeLocale === (defaultLocale as Locale);

      const url = new URL(window.location.href);
      if (!isDefault) {
        url.searchParams.set(LOCALE_QUERY_KEY, activeLocale);
      } else {
        url.searchParams.delete(LOCALE_QUERY_KEY);
      }

      const next =
        url.pathname +
        (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') +
        url.hash;
      const current = window.location.pathname + window.location.search + window.location.hash;
      if (next !== current) {
        window.history.replaceState({}, '', next);
      }
    }
  }, [activeLocale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: activeLocale,
      setLocale,
      t: (namespace, key) => translate(activeLocale, namespace, key as any),
    }),
    [activeLocale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation<N extends Namespaces>(namespace: N) {
  const { locale, setLocale, t } = useContext(I18nContext);
  return {
    locale,
    setLocale,
    t: <K extends TranslationKey<N>>(key: K) => t(namespace, key),
  };
}
