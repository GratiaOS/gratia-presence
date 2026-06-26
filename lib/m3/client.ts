/**
 * M3 Client — Emotional Ledger Bridge
 * ------------------------------------
 * Whisper: "presence writes itself into memory." 🌬️
 *
 * Purpose
 *  • Clean wrapper over M3 /emotions endpoints
 *  • Type-safe payload construction for ledger entries
 *  • Silent failure handling (logs but doesn't break UI)
 *
 * Usage (Write)
 *  import { logEmotionToM3 } from '@/lib/m3/client';
 *
 *  await logEmotionToM3({
 *    who: 'Razvan',
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

const API_URL = process.env.NEXT_PUBLIC_M3_API_URL || 'http://localhost:3033';

/**
 * Log an emotion signal to M3 Emotional Ledger.
 * Returns true on success, false on failure (non-blocking).
 */
export async function logEmotionToM3(payload: M3EmotionPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/emotions/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '(no body)');
      throw new Error(`M3 responded with ${res.status}: ${errorText}`);
    }

    const data = await res.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('🛰️ [M3 Client] Emotion logged:', data);
    }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🌬️ [M3 Client] Failed to log emotion:', error);
    }
    // Silent failure — UI should not break if M3 is down
    return false;
  }
}

/**
 * Fetch recent emotions from M3 Emotional Ledger.
 * Returns array of emotions (last 20), or empty array on failure.
 */
export async function getEmotions(): Promise<M3Emotion[]> {
  try {
    const res = await fetch(`${API_URL}/emotions/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable cache for fresh data
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '(no body)');
      throw new Error(`M3 responded with ${res.status}: ${errorText}`);
    }

    const data: M3Emotion[] = await res.json();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🛰️ [M3 Client] Fetched ${data.length} emotions`);
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🌬️ [M3 Client] Failed to fetch emotions:', error);
    }
    // Silent failure — return empty array
    return [];
  }
}
