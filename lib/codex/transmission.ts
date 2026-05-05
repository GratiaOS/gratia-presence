export type GlyphTransmission = {
  /** Four-character hex id, e.g., "00A7". */
  id: string;
  /** Raw 32-bit hash. */
  hash: number;
  /** Low byte of the hash for orbit mapping (0–255). */
  orbit: number;
  /** Visual strength indicator, e.g., "●○●". */
  strengthDots: string;
};

/**
 * FNV-1a 32-bit hash — fast and stable for small strings.
 */
function hashSignal(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Turn a text signal into a stable glyph descriptor.
 */
export function createGlyphFromSignal(raw: string): GlyphTransmission {
  const normalized = raw.trim();
  if (!normalized) throw new Error('Signal is empty');

  const lower = normalized.toLowerCase();
  const hash = hashSignal(lower);
  const id = hash.toString(16).padStart(4, '0').slice(0, 4).toUpperCase();
  const orbit = hash & 0xff;

  const strengthLevel = ((hash >>> 8) & 0x03) + 1; // 1..4
  const clamped = Math.min(strengthLevel, 3);
  const strengthDots = Array.from({ length: 3 }, (_, i) => (i < clamped ? '●' : '○')).join('');

  return { id, hash, orbit, strengthDots };
}
