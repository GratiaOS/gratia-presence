'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useLocale } from '../i18n/useLocale';

const messages = {
  en: {
    title: 'A calm place to think.',
    line1: 'Quiet software for presence, reflection, and rhythm.',
    line2: 'No account. No feed. No pressure to become someone else.',
    line3: 'Just enough space to hear yourself again.',
    cta: 'Begin where you are',
    footer: 'Heartware for ordinary days.',
  },
  es: {
    title: 'Un lugar tranquilo para pensar.',
    line1: 'Software sereno para la presencia, la reflexión y el ritmo.',
    line2: 'Sin cuenta. Sin feed. Sin presión para convertirte en otra persona.',
    line3: 'El espacio justo para volver a escucharte.',
    cta: 'Empieza donde estás',
    footer: 'Heartware para los días ordinarios.',
  },
  ro: {
    title: 'Un loc liniștit în care să gândești.',
    line1: 'Software liniștit pentru prezență, reflecție și ritm.',
    line2: 'Fără cont. Fără feed. Fără presiunea de a deveni altcineva.',
    line3: 'Doar suficient spațiu cât să te auzi din nou.',
    cta: 'Începe de unde ești',
    footer: 'Heartware pentru zile obișnuite.',
  },
} as const;

function HomeContent() {
  const locale = useLocale();
  const t = messages[locale];

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-20"
      dir="ltr"
    >
      <section className="max-w-2xl text-center">
        <h1 className="font-gratia text-5xl leading-tight font-semibold tracking-tight md:text-6xl">
          {t.title}
        </h1>

        <p className="mt-6 mx-auto max-w-xl text-lg leading-relaxed text-[color:var(--color-muted)] md:text-xl">
          {t.line1}
        </p>

        <div className="mt-16 mx-auto max-w-lg space-y-4">
          <p className="leading-relaxed text-[color:var(--color-muted)]">
            {t.line2}
          </p>

          <p className="leading-relaxed text-[color:var(--color-muted)]">
            {t.line3}
          </p>
        </div>

        <Link
          href="/today"
          className="mt-16 block p-2 text-sm underline underline-offset-8 transition-opacity hover:opacity-70"
        >
          {t.cta}
        </Link>

        <p className="mt-28 text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
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