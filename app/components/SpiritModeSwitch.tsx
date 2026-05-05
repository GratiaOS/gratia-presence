'use client';

import { SPIRIT_MODES, type SpiritMode } from '@/lib/spirit-mode';
import { useSpiritMode } from './SpiritModeProvider';

const ORDER: SpiritMode[] = ['bear', 'wolf', 'lion'];

export function SpiritModeSwitch() {
  const { mode, setMode } = useSpiritMode();

  return (
    <section className="mt-6 space-y-3">
      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-(--color-subtle)">
        Spirit mode
      </p>

      <div className="mood-glow inline-flex w-full max-w-xl items-center justify-between rounded-full bg-(--color-surface)/75 px-1 py-1 shadow-depth-1 backdrop-blur-md">
        {ORDER.map((id) => {
          const meta = SPIRIT_MODES[id];
          const active = mode === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={[
                'flex-1 rounded-full px-3 py-1.5 text-xs sm:text-[0.8rem] font-medium transition whisper-ring',
                'flex items-center justify-center gap-1.5',
                active
                  ? 'bg-(--color-accent) text-(--color-on-accent) shadow-depth-1'
                  : 'text-(--color-subtle)',
              ].join(' ')}
            >
              <span className="text-base">{meta.emoji}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-(--color-muted)">{SPIRIT_MODES[mode].whisper}</p>
    </section>
  );
}
