/**
 * @gratiaos/identity-core
 * Whisper: "a story can be seen without being installed."
 *
 * Ghost-first identity separation engine. This mirrors the M3 Rust protocol
 * closely enough for local UI use, while keeping the adapter boundary open for
 * a future Service Worker or M3 bridge.
 */

export const IDENTITY_API_PATHS = {
  decouple: '/decouple',
} as const;

export type TagSource = 'legacy' | 'external' | 'sovereign';
export type ShadowKind = 'legacy_projection' | 'external_projection';
export type DecoupledKind = 'present_reality' | 'shadow';

export type IdentityTag = {
  label: string;
  source: TagSource;
  is_active: boolean;
};

export type SovereignKernel = {
  id: string;
  tags: IdentityTag[];
  firewall_enabled: boolean;
};

export type IdentityErrorCode = 'empty_tag' | 'permission_denied';

export type IdentityError = {
  code: IdentityErrorCode;
  label?: string;
  source?: TagSource;
  message: string;
};

export type AttachTagResult = {
  kernel: SovereignKernel;
  attached: boolean;
  error?: IdentityError;
};

export type Shadow = {
  kind: 'shadow';
  input: string;
  shadow_kind: ShadowKind;
  markers: string[];
  confidence: number;
  affects_kernel: false;
  whisper: string;
};

export type PresentSignal = {
  kind: 'present_reality';
  input: string;
  markers: string[];
  confidence: number;
  whisper: string;
};

export type DecoupledProjection = PresentSignal | Shadow;

export type IdentityDecouplingAdapter = {
  decouple(input: string): Promise<DecoupledProjection>;
};

export type ShadowArchive = {
  list(): Shadow[];
  save(shadow: Shadow): void;
  clear(): void;
};

const LEGACY_WHISPER = 'Whisper: This belongs to the past. Let it pass the gate.';
const PRESENT_WHISPER = 'Whisper: Stay with what is happening now.';
const SHADOW_STORAGE_KEY = 'gratia.identity.shadows.v1';

const LEGACY_MARKERS = [
  'like your mother',
  'like your father',
  'like_mother_like_son',
  'same as your family',
  'ca mama ta',
  'ca maica_ta',
  'ca tatal tau',
  'ca taica_tu',
  'asa ai fost mereu',
  'așa ai fost mereu',
  'romanian v0',
  'romania v0',
  'românia v0',
  'ca ei',
  'trebuia sa',
  'trebuia să',
  'como tu madre',
  'como tu padre',
  'igual que tu familia',
  'siempre has sido asi',
  'siempre has sido así',
  'tenias que',
  'tenías que',
] as const;

const EXTERNAL_MARKERS = [
  'you always',
  'you never',
  'you are too much',
  'you are broken',
  'you are lazy',
  'esti prea mult',
  'ești prea mult',
  'esti defect',
  'ești defect',
  'esti lenes',
  'ești leneș',
  'iar faci',
  'again you',
  'mereu faci',
  'niciodata nu',
  'niciodată nu',
  'tu siempre',
  'tú siempre',
  'tu nunca',
  'tú nunca',
  'eres demasiado',
  'estas roto',
  'estás roto',
  'eres perezoso',
  'otra vez haces',
] as const;

const PRESENT_MARKERS = [
  'right now',
  'today',
  'present',
  'i feel',
  'i notice',
  'the fact is',
  'acum',
  'azi',
  'observ',
  'simt',
  'faptul este',
  'ahora',
  'hoy',
  'presente',
  'siento',
  'noto',
  'observo',
  'el hecho es',
] as const;

export function createSovereignKernel(id: string): SovereignKernel {
  return {
    id: id.trim(),
    tags: [],
    firewall_enabled: true,
  };
}

export function attachTag(kernel: SovereignKernel, tag: IdentityTag): AttachTagResult {
  const normalizedTag: IdentityTag = {
    ...tag,
    label: normalizeIdentityLabel(tag.label),
  };

  if (!normalizedTag.label) {
    return {
      kernel: cloneKernel(kernel),
      attached: false,
      error: {
        code: 'empty_tag',
        message: 'identity tag cannot be empty',
      },
    };
  }

  if (kernel.firewall_enabled && normalizedTag.source !== 'sovereign') {
    return {
      kernel: cloneKernel(kernel),
      attached: false,
      error: {
        code: 'permission_denied',
        label: normalizedTag.label,
        source: normalizedTag.source,
        message: `permission denied: tag '${normalizedTag.label}' from ${normalizedTag.source} is not sovereign`,
      },
    };
  }

  return {
    kernel: {
      ...kernel,
      tags: [...kernel.tags, normalizedTag],
    },
    attached: true,
  };
}

export function purgeLegacyStorage(kernel: SovereignKernel): SovereignKernel {
  return {
    ...kernel,
    tags: kernel.tags.filter((tag) => tag.source === 'sovereign'),
  };
}

export function setFirewall(kernel: SovereignKernel, state: boolean): SovereignKernel {
  return {
    ...kernel,
    firewall_enabled: state,
  };
}

export function activePermissions(kernel: SovereignKernel): IdentityTag[] {
  return kernel.tags.filter((tag) => tag.source === 'sovereign' && tag.is_active);
}

export function decoupleProjection(input: string): DecoupledProjection {
  const trimmed = input.trim();
  const normalized = normalizePhrase(trimmed);

  const legacyMarkers = collectMarkers(normalized, LEGACY_MARKERS);
  const externalMarkers = collectMarkers(normalized, EXTERNAL_MARKERS);
  const presentMarkers = collectMarkers(normalized, PRESENT_MARKERS);
  addUniqueMarker(legacyMarkers, normalized, 'like_mother_like_son');

  const legacyScore = scoreProjection(legacyMarkers, normalized);
  const externalScore = scoreProjection(externalMarkers, normalized);
  const presentScore = presentMarkers.length * 18;

  if (legacyScore >= 35 || externalScore >= 35) {
    const useLegacy = legacyScore >= externalScore;
    return {
      kind: 'shadow',
      input: trimmed,
      shadow_kind: useLegacy ? 'legacy_projection' : 'external_projection',
      markers: useLegacy ? legacyMarkers : externalMarkers,
      confidence: Math.min(useLegacy ? legacyScore : externalScore, 95),
      affects_kernel: false,
      whisper: LEGACY_WHISPER,
    };
  }

  return {
    kind: 'present_reality',
    input: trimmed,
    markers: presentMarkers,
    confidence: clamp(presentScore, 30, 90),
    whisper: PRESENT_WHISPER,
  };
}

export function createLocalIdentityAdapter(): IdentityDecouplingAdapter {
  return {
    async decouple(input: string) {
      return decoupleProjection(input);
    },
  };
}

export function createRemoteIdentityAdapter(baseUrl = '/identity'): IdentityDecouplingAdapter {
  return {
    async decouple(input: string) {
      const response = await fetch(`${baseUrl}${IDENTITY_API_PATHS.decouple}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`identity decouple failed: ${response.status}`);
      }

      const payload = (await response.json()) as { result: DecoupledProjection };
      return payload.result;
    },
  };
}

export function createLocalStorageShadowArchive(key = SHADOW_STORAGE_KEY): ShadowArchive {
  return {
    list() {
      if (typeof window === 'undefined') return [];
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(isShadow) : [];
      } catch {
        return [];
      }
    },
    save(shadow: Shadow) {
      if (typeof window === 'undefined') return;
      const next = [shadow, ...this.list()].slice(0, 120);
      window.localStorage.setItem(key, JSON.stringify(next));
    },
    clear() {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    },
  };
}

export function normalizeIdentityLabel(label: string): string {
  return label.trim().split(/\s+/).filter(Boolean).join('_');
}

function cloneKernel(kernel: SovereignKernel): SovereignKernel {
  return {
    ...kernel,
    tags: [...kernel.tags],
  };
}

function normalizePhrase(input: string): string {
  return input.trim().toLocaleLowerCase().replaceAll('-', '_');
}

function collectMarkers(input: string, markers: readonly string[]): string[] {
  return markers.filter((marker) => input.includes(marker));
}

function addUniqueMarker(markers: string[], input: string, marker: string) {
  if (input.includes(marker) && !markers.includes(marker)) {
    markers.push(marker);
  }
}

function scoreProjection(markers: readonly string[], input: string): number {
  let score = markers.length * 40;
  if (input.includes('always') || input.includes('never') || input.includes('mereu')) {
    score += 18;
  }
  if (input.includes('you are') || input.includes('esti') || input.includes('ești')) {
    score += 12;
  }
  return score;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isShadow(value: unknown): value is Shadow {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Shadow>;
  return candidate.kind === 'shadow' && candidate.affects_kernel === false;
}
