/**
 * Protocol Coherence Signal Hook
 * -------------------------------
 * Whisper: "presence leaves traces." 🌬️
 *
 * Emits a coherence signal when a protocol is read.
 * Compatible with M3 Emotional Ledger and future signal architectures.
 */

'use client';

import { useEffect, useRef } from 'react';
import { showToast } from '@gratiaos/ui';

export interface CoherenceSignal {
  protocolId: string;
  locale: string;
  timestamp: number;
  phase: 'coherence';
  intensity: number;
}

const COHERENCE_MESSAGES = {
  es: {
    title: 'Frecuencia alineada',
    desc: 'Protocolo activo. El jardín te siente.',
  },
  ro: {
    title: 'Frecvență aliniată',
    desc: 'Protocol activ. Grădina te simte.',
  },
  en: {
    title: 'Frequency aligned',
    desc: 'Protocol active. The garden feels you.',
  },
};

/**
 * Hook for emitting coherence signals when reading protocols.
 * Shows a subtle toast notification and emits events for M3 integration.
 */
export function useProtocolCoherence(protocolId: string, locale: string) {
  // Guard against duplicate toast emissions (React Strict Mode double-mount)
  const hasShownToast = useRef(false);

  useEffect(() => {
    const signal: CoherenceSignal = {
      protocolId,
      locale,
      timestamp: Date.now(),
      phase: 'coherence',
      intensity: 0.9,
    };

    // Log to console (development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🌬️ Coherence Signal:', signal);
    }

    // Emit custom event after a microtask delay to ensure M3Bridge listeners are attached
    // This guarantees the bridge is mounted before we dispatch the event
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('gratia:coherence', {
            detail: signal,
          })
        );
      }
    }, 0);

    // Show subtle toast notification (only once)
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      const messages =
        COHERENCE_MESSAGES[locale as keyof typeof COHERENCE_MESSAGES] || COHERENCE_MESSAGES.en;
      showToast({
        title: messages.title,
        desc: messages.desc,
        variant: 'positive',
        icon: '🤍',
        durationMs: 4000, // 4 seconds — one complete breath cycle
      });
    }

    // Future: Connect to M3 Emotional Ledger
    // m3.log({ kind: 'gratitude', note: `Protocol read: ${protocolId}`, band: 'coherence' });

    // Cleanup on unmount
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🌬️ Protocol unmounted:', protocolId);
      }
    };
  }, [protocolId, locale]);
}
