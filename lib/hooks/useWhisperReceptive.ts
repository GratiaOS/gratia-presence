/**
 * Whisper Receptive Signal Hook
 * ------------------------------
 * Whisper: "the field listens without asking." 🌬️
 *
 * Emits a low-intensity receptive signal when entering /whisper.
 * Different from protocol coherence — this is passive observation, not active alignment.
 */

'use client';

import { useEffect, useRef } from 'react';
import { showToast } from '@gratiaos/ui';

export interface ReceptiveSignal {
  source: 'whisper-interface';
  locale: string;
  timestamp: number;
  phase: 'open';
  intensity: number;
}

const RECEPTIVE_MESSAGES = {
  es: {
    title: 'Campo receptivo',
    desc: 'El jardín escucha.',
  },
  ro: {
    title: 'Câmp receptiv',
    desc: 'Grădina ascultă.',
  },
  en: {
    title: 'Field receptive',
    desc: 'The garden listens.',
  },
};

/**
 * Hook for emitting receptive signals when entering /whisper interface.
 * Shows a subtle neutral toast and emits low-intensity events for M3 integration.
 */
export function useWhisperReceptive(locale: string) {
  // Guard against duplicate toast emissions (React Strict Mode double-mount)
  const hasShownToast = useRef(false);

  useEffect(() => {
    const signal: ReceptiveSignal = {
      source: 'whisper-interface',
      locale,
      timestamp: Date.now(),
      phase: 'open',
      intensity: 0.3, // Low intensity — whisper, not shout
    };

    // Log to console (development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🌬️ Receptive Signal:', signal);
    }

    // Emit custom event after a microtask delay to ensure M3Bridge listeners are attached
    // This guarantees the bridge is mounted before we dispatch the event
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('gratia:receptive', {
            detail: signal,
          })
        );
      }
    }, 0);

    // Show subtle toast notification (only once)
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      const messages =
        RECEPTIVE_MESSAGES[locale as keyof typeof RECEPTIVE_MESSAGES] || RECEPTIVE_MESSAGES.en;
      showToast({
        title: messages.title,
        desc: messages.desc,
        variant: 'neutral',
        icon: '🌬️',
        durationMs: 4000, // 4 seconds — one complete breath cycle
      });
    }

    // Future: Connect to M3 Emotional Ledger
    // m3.log({ kind: 'observation', note: 'Whisper interface open', band: 'receptive' });

    // Cleanup on unmount
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🌬️ Whisper interface closed');
      }
    };
  }, [locale]);
}
