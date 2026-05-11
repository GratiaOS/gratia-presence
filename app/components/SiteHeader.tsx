'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Sheet } from '@gratiaos/ui';
import GratiaMark from '@/components/GratiaMark';
import EnergySystemClient from '@/components/energy/EnergySystemClient';
import { defaultLocale, supportedLocales } from '../../i18n/config';
import type { Locale } from '../../i18n/resources';
import LanguageToggle from './LanguageToggle';
import SkinToggle from './SkinToggle';

const LOCALE_STORAGE_KEY = 'gratia.locale';
const LOCALE_QUERY_KEY = 'lang';

const labels: Record<
  Locale,
  { home: string; journal: string; about: string; support: string; openNav: string; closeNav: string }
> = {
  en: {
    home: 'Gratia home',
    journal: 'Lunar Journal',
    about: 'About',
    support: 'Support',
    openNav: 'Open navigation',
    closeNav: 'Close navigation',
  },
  es: {
    home: 'Inicio Gratia',
    journal: 'Diario Lunar',
    about: 'Acerca de',
    support: 'Apoyar',
    openNav: 'Abrir navegación',
    closeNav: 'Cerrar navegación',
  },
  ro: {
    home: 'Acasă Gratia',
    journal: 'Jurnal Lunar',
    about: 'Despre',
    support: 'Susține',
    openNav: 'Deschide navigarea',
    closeNav: 'Închide navigarea',
  },
};

function normalizeLocale(value?: string | null): Locale {
  if (value && supportedLocales.includes(value)) return value as Locale;
  return defaultLocale as Locale;
}

export default function SiteHeader() {
  const searchParams = useSearchParams();
  const [navOpen, setNavOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(() =>
    normalizeLocale(searchParams?.get(LOCALE_QUERY_KEY))
  );
  const t = labels[locale] ?? labels.en;

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

  return (
    <header className="w-full border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/88">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={t.home}>
          <span className="inline-block h-8 w-8 shrink-0 text-[color:var(--color-accent)]">
            <GratiaMark />
          </span>
          <span className="hidden font-semibold tracking-wide sm:inline">GratiaOS</span>
        </Link>

        <nav className="hidden items-center text-sm md:flex">
          <Link href="/today" className="p-3 underline-offset-4 hover:underline">
            {t.journal}
          </Link>
          <Link href="/about" className="p-3 underline-offset-4 hover:underline">
            {t.about}
          </Link>
          <Link href="/support" className="p-3 underline-offset-4 hover:underline">
            {t.support}
          </Link>
        </nav>
        <div className="ml-auto"></div>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <SkinToggle />
          <EnergySystemClient variant="capsule" />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <EnergySystemClient variant="capsule" />
          <Button
            type="button"
            variant="ghost"
            density="snug"
            aria-label={t.openNav}
            onClick={() => setNavOpen(true)}>
            ☰
          </Button>
        </div>
      </div>
      <Sheet open={navOpen} onOpenChange={setNavOpen} side="right" title="Gratia" closeLabel={t.closeNav}>
        <nav className="grid gap-1 text-base">
          <Link href="/today" className="py-3 underline-offset-4 hover:underline" onClick={() => setNavOpen(false)}>
            {t.journal}
          </Link>
          <Link href="/about" className="py-3 underline-offset-4 hover:underline" onClick={() => setNavOpen(false)}>
            {t.about}
          </Link>
          <Link href="/support" className="py-3 underline-offset-4 hover:underline" onClick={() => setNavOpen(false)}>
            {t.support}
          </Link>
        </nav>
        <div className="mt-6 grid gap-4 border-t border-[color:var(--color-border)] pt-5">
          <LanguageToggle />
          <SkinToggle />
        </div>
      </Sheet>
    </header>
  );
}
