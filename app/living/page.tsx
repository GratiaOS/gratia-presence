import type { ComponentProps } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@gratiaos/ui';
import { scenes } from '@/lib/scenes';

export const metadata: Metadata = {
  title: 'Living · Gratia',
  description: 'A gentle feed of witnessed scenes.',
};

const splitBody = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const hashText = (text: string) =>
  text
    .split('')
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
    .toString(36);

type BadgeTone = ComponentProps<typeof Badge>['tone'];
type BadgeVariant = ComponentProps<typeof Badge>['variant'];

const toneFallback: { tone: BadgeTone; variant: BadgeVariant } = {
  tone: 'accent',
  variant: 'subtle',
};

const toneBadgeMap: Record<string, { tone: BadgeTone; variant: BadgeVariant }> = {
  calm: { tone: 'accent', variant: 'subtle' },
  open: { tone: 'accent', variant: 'soft' },
  ritual: { tone: 'warning', variant: 'soft' },
  vortex: { tone: 'danger', variant: 'soft' },
  flow: { tone: 'positive', variant: 'soft' },
  integration: { tone: 'positive', variant: 'subtle' },
};

export default function LivingPage() {
  return (
    <main className="min-h-screen bg-(--pad-surface) text-(--pad-text)">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
        <header className="space-y-2">
          <p className="text-[11px] font-medium tracking-[0.12em] text-(--pad-text-muted)">
            living feed
          </p>
          <h1 className="text-2xl font-semibold">Living</h1>
          <p className="text-sm text-(--pad-text-muted)">What breathes, without urgency.</p>
          <div className="text-xs text-(--pad-text-muted)">
            <Link href="/whisper" className="hover:underline">
              Whisper
            </Link>
          </div>
        </header>

        <section className="space-y-12 lg:space-y-14">
          {scenes.map((scene, index) => (
            <article
              key={scene.id}
              className="animate-scene-in shadow-depth-2 rounded-3xl border border-(--pad-border) bg-(--pad-elev) p-7"
              style={{
                animationDelay: `${index * 120}ms`,
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-2 text-[11px] text-(--pad-text-muted)">
                    <Badge variant="subtle" size="sm">
                      {scene.kind}
                    </Badge>
                    <Badge variant="subtle" size="sm">
                      {scene.breathKind}
                    </Badge>
                    {(() => {
                      const toneCfg = toneBadgeMap[scene.tone] ?? toneFallback;
                      return (
                        <Badge tone={toneCfg.tone} variant={toneCfg.variant} size="sm">
                          {scene.tone}
                        </Badge>
                      );
                    })()}
                    <Badge variant="subtle" size="sm">
                      last breath: {scene.lastBreath}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-semibold">{scene.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scene.witnessedBy.map((witness) => (
                    <Badge key={witness} tone="accent" variant="soft" size="sm">
                      {witness}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-relaxed text-(--pad-text)">
                {splitBody(scene.body).map((paragraph) => (
                  <p key={`${scene.id}-${hashText(paragraph)}`}>{paragraph}</p>
                ))}
              </div>

              {scene.roots.length > 0 && (
                <footer className="mt-5 flex flex-wrap gap-2 text-[11px] text-(--pad-text-muted)">
                  {scene.roots.map((root) => (
                    <Badge key={root} tone="accent" variant="subtle" size="sm">
                      {root}
                    </Badge>
                  ))}
                </footer>
              )}
            </article>
          ))}
        </section>

        <div className="pt-2 text-sm text-(--pad-text-muted)">
          <Link href="/" className="hover:underline">
            Înapoi în Grădină
          </Link>
        </div>
      </div>
    </main>
  );
}
