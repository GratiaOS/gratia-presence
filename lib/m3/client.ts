/**
 * Local Emotional Ledger
 * ----------------------
 *
 * Purpose
 *  • Clean wrapper over browser-local ledger entries
 *  • Type-safe payload construction for ledger entries
 *  • Silent failure handling (logs but doesn't break UI)
 *
 * Usage (Write)
 *  import { logEmotionToM3 } from '@/lib/m3/client';
 *
 *  await logEmotionToM3({
 *    who: 'local-user',
 *    kind: 'coherence',
 *    intensity: 0.9,
 *    sealed: true,
 *    privacy: 'sealed',
 *    details: 'Protocol: frequency-first (es)',
 *  });
 *
 * Usage (Read)
 *  import { getEmotions } from '@/lib/m3/client';
 *
 *  const emotions = await getEmotions();
 */

export type M3Band = 'coherence' | 'open' | 'flow' | 'heavy';

export type M3Emotion = {
  /** Entry ID in ledger. */
  id: number;
  /** Timestamp (RFC3339). */
  ts: string;
  /** Who emitted this signal. */
  who: string;
  /** Emotion kind: coherence | receptive | gratitude | etc. */
  kind: string;
  /** Signal intensity (0.0 - 1.0). */
  intensity: number;
  /** Mirror tag — true for sealed/witnessed signals. */
  sealed: boolean;
  /** Privacy level: private | sealed | anonymized | public. */
  privacy: string;
  /** Emotional band (derived from kind + intensity). */
  band: M3Band;
  /** Optional context: protocolId, source, or narrative. */
  details?: string;
  /** Optional link to a note/entry in another system. */
  note_id?: number;
  /** Optional archetype tag: gardener | mirror | witness. */
  archetype?: string;
};

export type M3EmotionPayload = {
  /** Who is emitting this signal (user identifier). */
  who: string;
  /** Emotion kind: coherence | receptive | gratitude | panic | joy. */
  kind: string;
  /** Signal intensity (0.0 - 1.0). Protocol: 0.9, Whisper: 0.3. */
  intensity: number;
  /** Mirror tag — true for sealed/witnessed signals. */
  sealed: boolean;
  /** Privacy level: private | sealed | anonymized | public. */
  privacy: string;
  /** Optional context: protocolId, source, or narrative. */
  details?: string;
  /** Optional link to a note/entry in another system. */
  note_id?: number;
  /** Optional archetype tag: gardener | mirror | witness. */
  archetype?: string;
  /** Optional band hint: coherence | open | flow | heavy. */
  band?: string;
};

const STORAGE_KEY = 'gratia.emotional-ledger';

function readLedger(): M3Emotion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Log an emotion signal to the browser-local emotional ledger.
 * Returns true on success, false on failure (non-blocking).
 */
export async function logEmotionToM3(payload: M3EmotionPayload): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    const existing = readLedger();
    const entry: M3Emotion = {
      ...payload,
      id: Date.now(),
      ts: new Date().toISOString(),
      band: (payload.band as M3Band | undefined) ?? 'open',
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 100)));

    if (process.env.NODE_ENV === 'development') {
      console.log('[Local Ledger] Emotion logged:', entry);
    }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Local Ledger] Failed to log emotion:', error);
    }
    // Silent failure: UI should not break if localStorage is unavailable.
    return false;
  }
}

/**
 * Fetch recent emotions from the browser-local emotional ledger.
 * Returns array of emotions (last 20), or empty array on failure.
 */
export async function getEmotions(): Promise<M3Emotion[]> {
  try {
    const data = readLedger().slice(0, 20);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Local Ledger] Fetched ${data.length} emotions`);
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Local Ledger] Failed to fetch emotions:', error);
    }
    // Silent failure: return empty array.
    return [];
  }
}
