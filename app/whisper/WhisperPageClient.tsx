'use client';

import { useState } from 'react';
import { useWhisper } from './_useWhisper';
import { WhisperEnergy } from './WhisperEnergy';
import { WhisperState } from './WhisperState';
import { WhisperTimeline } from './WhisperTimeline';
import { useWhisperReceptive } from '@/lib/hooks/useWhisperReceptive';
import { defaultLocale } from '../../i18n/config';
import Link from 'next/link';

export default function WhisperPageClient() {
  const feed = useWhisper();

  // Detect locale from localStorage (aligned with protocol pages)
  const [locale] = useState(() => {
    if (typeof window === 'undefined') return defaultLocale;
    const storedLocale = window.localStorage.getItem('gratia.locale');
    return storedLocale || defaultLocale;
  });

  // Emit receptive signal when entering whisper interface
  useWhisperReceptive(locale);

  return (
    <main className="flex min-h-screen justify-center bg-(--color-surface) text-(--color-text)">
      <div className="w-full max-w-4xl space-y-8 px-4 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-(--color-muted) uppercase">
              M3 · Whisper Interface
            </p>
            <h1 className="mt-1 text-xl font-semibold">
              Field whispers for the current kernel state
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/living" className="text-xs text-(--color-muted) hover:underline">
              Living
            </Link>
            <WhisperState state={feed.kernelState} />
          </div>
        </header>

        <section className="grid items-start gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3">
            <WhisperEnergy energy={feed.energy} />
            <p className="max-w-[14rem] text-center text-xs text-(--color-muted)">
              Pulse, load și drift energetic — snapshot rapid al câmpului.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs tracking-[0.25em] text-(--color-muted) uppercase">
              Recent whispers
            </p>
            <WhisperTimeline items={feed.timeline} />
          </div>
        </section>

        <footer className="border-t border-(--color-border)/40 pt-4 text-[11px] text-(--color-muted)">
          whisper: when the spine is clear, every scene knows where to land. 🌬️
        </footer>
      </div>
    </main>
  );
}
