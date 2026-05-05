'use client';

import React, { useState } from 'react';
import { useSkinField } from '../skin/SkinFieldProvider';

type LightRitualButtonProps = {
  onLight?: () => void;
};

type RitualPhase = 'idle' | 'lighting' | 'invite';

/**
 * Buton ritual „Aprinde lumina” pentru scena Vortex.
 * Faze: idle -> lighting -> invite, cu mică întârziere înainte să pornească ritualul.
 */
export default function LightRitualButton({ onLight }: LightRitualButtonProps) {
  const [phase, setPhase] = useState<RitualPhase>('idle');
  const { skinId, setSkinId } = useSkinField();

  const handleClick = () => {
    if (phase !== 'idle') return;
    if (skinId !== 'SUN') setSkinId('SUN');
    setPhase('lighting');

    // după ~1s invităm mai departe și pornim ritualul din scenă
    window.setTimeout(() => {
      setPhase('invite');
      onLight?.();
    }, 1800);
  };

  const lit = phase !== 'idle';

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-full max-w-xs rounded-[28px] p-[3px] transition-all duration-500"
        style={{
          background: lit
            ? 'radial-gradient(circle at 50% 20%, color-mix(in oklab, var(--color-accent) 40%, transparent), color-mix(in oklab, var(--color-text) 16%, transparent))'
            : 'radial-gradient(circle at 50% 20%, color-mix(in oklab, var(--color-text) 8%, transparent), color-mix(in oklab, var(--color-text) 65%, transparent))',
        }}
      >
        <div
          className="absolute inset-0 rounded-[26px] border border-(--color-border)/40"
          aria-hidden
        />

        <button
          type="button"
          onClick={handleClick}
          disabled={phase !== 'idle'}
          className={`whisper-ring relative z-[1] w-full rounded-[22px] px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-400 shadow-depth-1 ${
            lit
              ? 'bg-(--color-accent)/20 text-(--color-text) shadow-depth-2'
              : 'bg-(--color-elev)/80 text-(--color-text)'
          }`}
        >
          {phase === 'idle' && 'Enciende la luz'}
          {phase === 'lighting' && 'La luz se ha encendido'}
          {phase === 'invite' && 'Respira con Antonio'}
        </button>
      </div>

      <p className="text-xs text-(--color-muted) text-center max-w-sm leading-snug">
        {phase === 'idle' && 'Solo pulsa. Lo demás llega solo.'}
        {phase === 'lighting' && 'La luz se enciende. Solo respira.'}
        {phase === 'invite' && 'Lienzo. Tú puedes imaginarte el próximo paso. Un singur pas e suficient pentru azi.'}
      </p>
    </div>
  );
}
