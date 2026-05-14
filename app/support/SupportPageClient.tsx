'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@gratiaos/ui';
import { defaultLocale } from '../../i18n/config';

const copy = {
  en: {
    eyebrow: 'Support the Node',
    title: 'Help keep Gratia quiet, local, and alive.',
    subtitle:
      'Gratia is a living project: software, ritual, language, and care. If it gives you clarity, you can help sustain the work.',
    sections: [
      {
        title: 'What your support holds',
        body: [
          'Focused development time for Gratia, the Lunar Journal, local-first tools, and Garden Core.',
          'Infrastructure, domains, hardware, testing, writing, and the slow maintenance that keeps a project coherent.',
        ],
      },
      {
        title: 'How value returns',
        body: [
          'Money is not the point. It is one way value echoes back into the field.',
          'You are not buying access or unlocking a tier. You are helping a small node keep building without turning the work into extraction.',
        ],
      },
      {
        title: 'Other ways to help',
        body: [
          'Use the tools. Share what feels true. Open an issue. Improve the docs. Send a note when something brings clarity.',
          'Presence, attention, code, writing, testing, and practical support all count.',
        ],
      },
    ],
    supportCta: 'Support directly',
    emailCta: 'Write to us',
    note: 'Transparent operating notes will be added as the support flow matures.',
  },
  es: {
    eyebrow: 'Sostén el nodo',
    title: 'Ayuda a mantener Gratia tranquila, local y viva.',
    subtitle:
      'Gratia es un proyecto vivo: software, ritual, lenguaje y cuidado. Si te da claridad, puedes ayudar a sostener el trabajo.',
    sections: [
      {
        title: 'Qué sostiene tu apoyo',
        body: [
          'Tiempo de desarrollo profundo para Gratia, The Lunar Journal, herramientas local-first y Garden Core.',
          'Infraestructura, dominios, hardware, pruebas, escritura y el mantenimiento lento que mantiene coherente un proyecto.',
        ],
      },
      {
        title: 'Cómo vuelve el valor',
        body: [
          'El dinero no es el punto. Es una forma en que el valor vuelve al campo.',
          'No estás comprando acceso ni desbloqueando un nivel. Estás ayudando a que un nodo pequeño siga construyendo sin convertir el trabajo en extracción.',
        ],
      },
      {
        title: 'Otras formas de ayudar',
        body: [
          'Usa las herramientas. Comparte lo que se siente verdadero. Abre un issue. Mejora la documentación. Envía una nota cuando algo te aporte claridad.',
          'Presencia, atención, código, escritura, pruebas y apoyo práctico también cuentan.',
        ],
      },
    ],
    supportCta: 'Apoyar directamente',
    emailCta: 'Escríbenos',
    note: 'Añadiremos notas operativas transparentes a medida que madure el flujo de apoyo.',
  },
  ro: {
    eyebrow: 'Susține nodul',
    title: 'Ajută Gratia să rămână liniștită, locală și vie.',
    subtitle:
      'Gratia este un proiect viu: software, ritual, limbaj și grijă. Dacă îți aduce claritate, poți susține munca.',
    sections: [
      {
        title: 'Ce ține sprijinul tău',
        body: [
          'Timp de dezvoltare profundă pentru Gratia, The Lunar Journal, unelte local-first și Garden Core.',
          'Infrastructură, domenii, hardware, testare, scris și întreținerea lentă care păstrează coerența unui proiect.',
        ],
      },
      {
        title: 'Cum se întoarce valoarea',
        body: [
          'Banii nu sunt punctul central. Sunt un fel prin care valoarea se întoarce în câmp.',
          'Nu cumperi acces și nu deblochezi un nivel. Ajuți un nod mic să construiască fără să transforme munca în extracție.',
        ],
      },
      {
        title: 'Alte feluri de a ajuta',
        body: [
          'Folosește uneltele. Dă mai departe ce se simte adevărat. Deschide un issue. Îmbunătățește documentația. Trimite un semn când ceva aduce claritate.',
          'Prezența, atenția, codul, scrisul, testarea și sprijinul practic contează toate.',
        ],
      },
    ],
    supportCta: 'Susține direct',
    emailCta: 'Scrie-ne',
    note: 'Vom adăuga note operaționale transparente pe măsură ce fluxul de sprijin se maturizează.',
  },
} as const;

type LangCode = keyof typeof copy;

function resolveLang(raw?: string | null): LangCode {
  if (!raw) return defaultLocale as LangCode;
  const lower = raw.toLowerCase();
  return lower in copy ? (lower as LangCode) : (defaultLocale as LangCode);
}

function SupportContent() {
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

  const t = copy[activeLang];

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16 sm:px-8">
        <header className="max-w-3xl space-y-5">
          <p className="text-xs tracking-[0.25em] text-[color:var(--color-muted)] uppercase">
            {t.eyebrow}
          </p>
          <h1 className="font-gratia text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
            {t.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--color-muted)]">
            {t.subtitle}
          </p>
        </header>

        <section className="grid gap-5">
          {t.sections.map((section) => (
            <Card key={section.title} as="article" variant="plain" className="space-y-4">
              <h2 className="font-gratia text-2xl font-medium tracking-tight">{section.title}</h2>
              <div className="space-y-3 leading-relaxed text-[color:var(--color-muted)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Card>
          ))}
        </section>

        <section className="flex flex-wrap gap-3 border-t border-[color:var(--color-border)] pt-8">
          <a
            href="https://revolut.me/gratiaos"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/10 px-5 py-2.5 text-sm font-medium text-[color:var(--color-accent)] transition hover:bg-[color:var(--color-accent)]/15"
          >
            {t.supportCta}
          </a>
          <a
            href="mailto:contact@gratia.space"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-5 py-2.5 text-sm transition hover:border-[color:var(--color-accent)]"
          >
            {t.emailCta}
          </a>
        </section>

        <p className="text-xs leading-relaxed text-[color:var(--color-muted)]">{t.note}</p>
      </div>
    </main>
  );
}

export default function SupportPageClient() {
  return (
    <Suspense fallback={null}>
      <SupportContent />
    </Suspense>
  );
}
