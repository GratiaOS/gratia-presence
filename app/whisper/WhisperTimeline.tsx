"use client";

import type { WhisperEvent, WhisperLevel } from './_types';

const levelClass: Record<WhisperLevel, string> = {
  info: 'text-(--color-text)',
  warn: 'text-(--color-accent)',
  calm: 'text-(--color-text)',
  ritual: 'text-(--color-accent)',
};

type WhisperTimelineProps = {
  items: WhisperEvent[];
};

export function WhisperTimeline({ items }: WhisperTimelineProps) {
  return (
    <div className="space-y-3 text-sm">
      {items.map((ev) => (
        <div key={ev.id} className="flex items-start gap-3">
          <span className="w-12 shrink-0 text-xs text-(--color-muted)">{ev.ts}</span>
          <div className="flex-1">
            <p className={levelClass[ev.level] ?? 'text-(--color-text)'}>{ev.message}</p>
            {ev.tags && ev.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-(--color-muted)">
                {ev.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-(--color-border)/50 bg-(--color-elev)/70 px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
