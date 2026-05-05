'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { defaultLocale } from '../i18n/config';

const messages = {
  en: {
    title: 'Gratia ✧ Personal OS',
    line1: 'Quiet software for presence, reflection, and rhythm.',
    line2: 'No account. No feed. No pressure to become someone else.',
    cta: 'Begin where you are',
    footer: 'Heartware for ordinary days.',
  },
  es: {
    title: 'Gratia ✧ Personal OS',
    line1: 'Software tranquilo para presencia, reflexión y ritmo.',
    line2: 'Sin cuenta. Sin feed. Sin presión para convertirte en otra persona.',
    cta: 'Empieza donde estás',
    footer: 'Heartware para los días ordinarios.',
  },
  ro: {
    title: 'Gratia ✧ Personal OS',
    line1: 'Software liniștit pentru prezență, reflecție și ritm.',
    line2: 'Fără cont. Fără feed. Fără presiunea de a deveni altcineva.',
    cta: 'Începe unde ești',
    footer: 'Heartware pentru zile obișnuite.',
  },
} as const;

type LangCode = keyof typeof messages;

function resolveLang(raw?: string | null): LangCode {
  if (!raw) return defaultLocale as LangCode;
  const lower = raw.toLowerCase();
  return lower in messages ? (lower as LangCode) : (defaultLocale as LangCode);
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [activeLang, setActiveLang] = useState<LangCode>(defaultLocale as LangCode);

  useEffect(() => {
    const syncLocale = (event?: Event) => {
      const eventLocale =
        event instanceof CustomEvent && typeof event.detail?.locale === 'string'
          ? event.detail.locale
          : null;
      const langParam = searchParams.get('lang');
      const stored = window.localStorage.getItem('gratia.locale');
      setActiveLang(resolveLang(eventLocale || langParam || stored || defaultLocale));
    };
    syncLocale();
    window.addEventListener('gratia:localechange', syncLocale);
    return () => window.removeEventListener('gratia:localechange', syncLocale);
  }, [searchParams]);

  const t = messages[activeLang];

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16" dir="ltr">
      <section className="landing-hero max-w-3xl space-y-8 text-center">
        <div className="space-y-5">
          <h1 className="font-gratia text-4xl leading-tight font-semibold md:text-6xl">
            {t.title}
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-[color:var(--color-muted)] md:text-xl">
            {t.line1}
          </p>
          <p className="mx-auto max-w-lg leading-relaxed text-[color:var(--color-muted)]">
            {t.line2}
          </p>
        </div>

        <Link href="/today" className="inline-flex text-sm underline underline-offset-8">
          {t.cta}
        </Link>

        <p className="text-xs tracking-[0.18em] text-[color:var(--color-muted)] uppercase">
          {t.footer}
        </p>
      </section>
    </main>
  );
}

export default function HomePageClient() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
