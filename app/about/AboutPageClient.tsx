'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Card } from '@gratiaos/ui';
import { useLocale } from '../../i18n/useLocale';

const copy = {
  en: {
    eyebrow: 'About Gratia',
    title: 'Heartware, not hurryware.',
    intro: [
      'Most software asks you to move faster.',
      'Gratia asks a better question: what state are you entering from?',
    ],
    sections: [
      {
        title: 'Space to hear yourself again',
        body: [
          'Gratia is quiet software for staying with yourself. It is built around small rituals, local memory, and gentle thresholds.',
          'No account is required. No feed is waiting. No cloud needs to know who you are.',
        ],
      },
      {
        title: 'Your words stay with you',
        body: [
          'Gratia begins in your browser. Your journal entries are stored locally on your device.',
          'Nothing is synced, analyzed, or sent away unless a future version clearly asks your consent. This is digital sovereignty in its simplest form: less capture, more agency.',
        ],
      },
      {
        title: 'Rhythms for ordinary days',
        body: [
          'Firegate is a morning threshold for intention: before the noise enters, choose what you are carrying today.',
          'The Lunar Journal is a moon-phase companion for reflection: the page changes with the cycle, while the writing stays yours.',
          'The Burn Ritual is an evening practice for releasing residue: keep the signal, let the static go.',
        ],
      },
      {
        title: 'Sustaining the quiet',
        body: [
          'Gratia is not built around extraction. It is a living project: software, ritual, language, and care.',
          'If it gives you clarity, support the work. Money is not the point. It is one way value echoes back into the field.',
        ],
        cta: 'Support Gratia',
      },
    ],
    cta: 'Open the Lunar Journal',
  },
  es: {
    eyebrow: 'Sobre Gratia',
    title: 'Heartware, no hurryware.',
    intro: [
      'La mayoría del software te pide ir más rápido.',
      'Gratia hace una pregunta mejor: ¿desde qué estado estás entrando?',
    ],
    sections: [
      {
        title: 'Un espacio para volver a escucharte',
        body: [
          'Gratia es software tranquilo para permanecer contigo. Está construido alrededor de pequeños rituales, memoria local y umbrales suaves.',
          'No hace falta cuenta. No hay feed esperando. Ninguna nube necesita saber quién eres.',
        ],
      },
      {
        title: 'Tus palabras se quedan contigo',
        body: [
          'Gratia empieza en tu navegador. Tus entradas de diario se guardan localmente en tu dispositivo.',
          'Nada se sincroniza, analiza o envía fuera a menos que una versión futura pida claramente tu consentimiento. Soberanía digital en su forma más simple: menos captura, más agencia.',
        ],
      },
      {
        title: 'Ritmos para días ordinarios',
        body: [
          'Firegate es un umbral matinal para la intención: antes de que entre el ruido, elige qué llevas hoy.',
          'The Lunar Journal es un compañero de fases lunares para reflexionar: la página cambia con el ciclo, la escritura permanece tuya.',
          'The Burn Ritual es una práctica de tarde para soltar residuo: conserva la señal, deja ir la estática.',
        ],
      },
      {
        title: 'Sostener el silencio',
        body: [
          'Gratia no está construido alrededor de la extracción. Es un proyecto vivo: software, ritual, lenguaje y cuidado.',
          'Si te da claridad, apoya el trabajo. El dinero no es el punto. Es una forma en que el valor vuelve al campo.',
        ],
        cta: 'Apoyar Gratia',
      },
    ],
    cta: 'Abrir el Lunar Journal',
  },
  ro: {
    eyebrow: 'Despre Gratia',
    title: 'Heartware, nu hurryware.',
    intro: [
      'Majoritatea software-ului îți cere să te miști mai repede.',
      'Gratia pune o întrebare mai bună: din ce stare intri?',
    ],
    sections: [
      {
        title: 'Un spațiu în care să te auzi din nou',
        body: [
          'Gratia este software liniștit pentru a rămâne cu tine. Este construit în jurul ritualurilor mici, memoriei locale și pragurilor blânde.',
          'Nu ai nevoie de cont. Nu te așteaptă niciun feed. Niciun cloud nu trebuie să știe cine ești.',
        ],
      },
      {
        title: 'Cuvintele tale rămân cu tine',
        body: [
          'Gratia începe în browserul tău. Însemnările tale de jurnal sunt salvate local, pe dispozitivul tău.',
          'Nimic nu este sincronizat, analizat sau trimis mai departe fără ca o versiune viitoare să îți ceară clar consimțământul. Suveranitate digitală în forma ei simplă: mai puțină captură, mai multă agenție.',
        ],
      },
      {
        title: 'Ritmuri pentru zile obișnuite',
        body: [
          'Firegate este un prag de dimineață pentru intenție: înainte să intre zgomotul, alegi ce porți azi.',
          'The Lunar Journal este un companion pe fazele lunii pentru reflecție: pagina se schimbă cu ciclul, scrisul rămâne al tău.',
          'The Burn Ritual este o practică de seară pentru eliberarea reziduului: păstrezi semnalul, lași statica să plece.',
        ],
      },
      {
        title: 'Susținerea liniștii',
        body: [
          'Gratia nu este construită în jurul extracției. Es un proiect viu: software, ritual, limbaj și grijă.',
          'Dacă îți aduce claritate, susține munca. Banii nu sunt punctul central. Sunt un fel prin care valoarea se întoarce în câmp.',
        ],
        cta: 'Susține Gratia',
      },
    ],
    cta: 'Deschide Lunar Journal',
  },
} as const;

function AboutContent() {
  const locale = useLocale();
  const t = copy[locale];

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16 sm:px-8">
        <header className="max-w-3xl space-y-5">
          <p className="text-xs tracking-[0.25em] text-[color:var(--color-muted)] uppercase">
            {t.eyebrow}
          </p>
          <h1 className="font-gratia text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            {t.title}
          </h1>
          <div className="space-y-3 text-lg leading-relaxed text-[color:var(--color-muted)]">
            {t.intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
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
              {'cta' in section ? (
                <Link href="/support" className="inline-flex text-sm underline underline-offset-8">
                  {section.cta}
                </Link>
              ) : null}
            </Card>
          ))}
        </section>

        <footer className="border-t border-[color:var(--color-border)] pt-8">
          <Link href="/today" className="text-sm underline underline-offset-8">
            {t.cta}
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default function AboutPageClient() {
  return (
    <Suspense fallback={null}>
      <AboutContent />
    </Suspense>
  );
}
