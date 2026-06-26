'use client';

import { Suspense } from 'react';
import type { ComponentProps } from 'react';
import Link from 'next/link';
import { Card, Badge } from '@gratiaos/ui';
import frontmatters from './frontmatters.json';
import { defaultLocale } from '../../i18n/config';
import { useLocale } from '../../i18n/useLocale';

type BadgeTone = ComponentProps<typeof Badge>['tone'];
type BadgeVariant = ComponentProps<typeof Badge>['variant'];

const toneFallback: { tone: BadgeTone; variant: BadgeVariant } = {
  tone: 'accent',
  variant: 'subtle',
};

const toneBadgeMap: Record<string, { tone: BadgeTone; variant: BadgeVariant }> = {
  // English tags
  note: { tone: 'accent', variant: 'soft' },
  manifesto: { tone: 'warning', variant: 'soft' },
  rhythm: { tone: 'accent', variant: 'subtle' },
  burnout: { tone: 'danger', variant: 'soft' },
  integration: { tone: 'positive', variant: 'subtle' },
  productivity: { tone: 'warning', variant: 'subtle' },

  // Spanish tags
  nota: { tone: 'accent', variant: 'soft' },
  manifiesto: { tone: 'warning', variant: 'soft' },
  ritmo: { tone: 'accent', variant: 'subtle' },
  integración: { tone: 'positive', variant: 'subtle' },
  productividad: { tone: 'warning', variant: 'subtle' },

  // Romanian tags
  notă: { tone: 'accent', variant: 'soft' },
  manifest: { tone: 'warning', variant: 'soft' },
  ritm: { tone: 'accent', variant: 'subtle' },
  integrare: { tone: 'positive', variant: 'subtle' },
  productivitate: { tone: 'warning', variant: 'subtle' },
};

const messages = {
  en: {
    title: 'Notes',
    subtitle: 'Unfinished thoughts, personal reflections, and records of our experiments.',
  },
  es: {
    title: 'Notas',
    subtitle: 'Pensamientos inacabados, reflexiones personales y registros de nuestros experimentos.',
  },
  ro: {
    title: 'Note',
    subtitle: 'Gânduri neterminate, reflecții personale și înregistrări ale experimentelor noastre.',
  },
} as const;

function NotesContent() {
  const locale = useLocale();
  const t = messages[locale];

  // Get notes keys from frontmatters json
  const noteKeys = Object.keys(frontmatters) as Array<keyof typeof frontmatters>;

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16 sm:px-8">
        <header className="max-w-3xl space-y-5">
          <h1 className="font-gratia text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            {t.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--color-muted)]">
            {t.subtitle}
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {noteKeys.map((key) => {
            const noteMeta = frontmatters[key][locale] || frontmatters[key][defaultLocale];
            return (
              <Link
                href={`/notes/${key}`}
                key={key}
                className="block group transition-all duration-200 hover:-translate-y-0.5"
              >
                <Card
                  variant="plain"
                  className="h-full flex flex-col justify-between p-5 space-y-4 hover:border-[color:var(--color-accent)]/40 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="subtle">
                        {new Date(noteMeta.updated).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Badge>
                      {noteMeta.tags.map((tag) => {
                        const tagCfg = toneBadgeMap[tag.toLowerCase()] ?? toneFallback;
                        return (
                          <Badge
                            key={tag}
                            tone={tagCfg.tone}
                            variant={tagCfg.variant}
                            size="sm"
                          >
                            {tag}
                          </Badge>
                        );
                      })}
                    </div>
                    <h2 className="font-gratia font-medium tracking-tight text-[color:var(--color-text)] group-hover:text-[color:var(--color-accent)] transition-colors">
                      {noteMeta.title}
                    </h2>
                    <p className="mt-2 text-sm text-[color:var(--color-muted)] line-clamp-3">
                      {noteMeta.summary}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={null}>
      <NotesContent />
    </Suspense>
  );
}
