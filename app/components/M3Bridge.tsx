/**
 * Local Ledger Bridge
 * -------------------
 *
 * Purpose
 *  • Silent component (renders nothing) that listens for UI signals
 *  • Intercepts gratia:coherence and gratia:receptive CustomEvents
 *  • Bridges volatile UI events to browser-local ledger entries
 *
 * Architecture
 *  • Mounted at root layout level (always active)
 *  • Non-blocking: failures don't crash UI
 *  • Development logs show bridge activity
 *
 * Signal Translation
 *  • gratia:coherence → kind: 'coherence', intensity: 0.9, band: 'coherence'
 *  • gratia:receptive → kind: 'receptive', intensity: 0.3, band: 'open'
 *
 * Privacy
 *  • All signals are sealed: true (witnessed, not exposed)
 *  • Privacy level: 'sealed' (visible to mirrors, not public)
 */

'use client';

import { useEffect } from 'react';
import { logEmotionToM3 } from '@/lib/m3/client';

export function M3Bridge() {
  useEffect(() => {
    // Handler for Protocol Coherence signals (active alignment)
    const handleCoherence = async (event: Event) => {
      const ce = event as CustomEvent;
      const signal = ce.detail;

      await logEmotionToM3({
        who: 'local-user',
        kind: 'coherence',
        band: 'coherence',
        intensity: signal.intensity || 0.9,
        sealed: true,
        privacy: 'sealed',
        details: `Protocol: ${signal.protocolId} (${signal.locale})`,
        archetype: 'gardener',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Local Ledger Bridge] Coherence logged:', signal);
      }
    };

    // Handler for Whisper Receptive signals (passive observation)
    const handleReceptive = async (event: Event) => {
      const ce = event as CustomEvent;
      const signal = ce.detail;

      await logEmotionToM3({
        who: 'local-user',
        kind: 'receptive',
        band: 'open',
        intensity: signal.intensity || 0.3,
        sealed: true,
        privacy: 'sealed',
        details: `Whisper interface listening (${signal.locale})`,
        archetype: 'gardener',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Local Ledger Bridge] Receptive state logged:', signal);
      }
    };

    // Subscribe to CustomEvents on window
    if (typeof window !== 'undefined') {
      window.addEventListener('gratia:coherence', handleCoherence);
      window.addEventListener('gratia:receptive', handleReceptive);
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('gratia:coherence', handleCoherence);
        window.removeEventListener('gratia:receptive', handleReceptive);
      }
    };
  }, []);

  // Silent component — no UI, only signal bridge
  return null;
}
