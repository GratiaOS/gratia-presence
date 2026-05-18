import type { EnergyMark, EnergyMarkInput } from '@gratiaos/energy-core';

export const M3_EDGE_DEFAULT_URL = 'https://m3-memory-edge.gratia.workers.dev';

export const M3_EDGE_KEYS = {
  token: 'gratia.m3.edge.token',
  url: 'gratia.m3.edge.url',
} as const;

export type M3EdgeConfig = {
  url: string;
  token: string;
};

export type M3EdgeHealth = {
  ok: boolean;
  service?: string;
  storage?: string;
  whisper?: string;
};

export type M3EdgeSyncResult = {
  ok: boolean;
  status?: number;
  error?: string;
};

export type M3EdgePullResult = {
  ok: boolean;
  imported: number;
  error?: string;
};

type M3EnergyState = {
  marks?: Partial<Record<string, unknown>>;
  lastMark?: unknown;
};

const ENERGY_MARKS_KEY = 'gratia.energy.marks.v1';

export function readM3EdgeUrl(): string {
  if (typeof window === 'undefined') return M3_EDGE_DEFAULT_URL;
  return window.localStorage.getItem(M3_EDGE_KEYS.url)?.trim() || M3_EDGE_DEFAULT_URL;
}

export function readM3EdgeToken(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(M3_EDGE_KEYS.token)?.trim() || '';
}

export function readM3EdgeConfig(): M3EdgeConfig | null {
  const token = readM3EdgeToken();
  if (!token) return null;
  return {
    url: readM3EdgeUrl(),
    token,
  };
}

export function saveM3EdgeConfig(config: { url?: string; token?: string }) {
  if (typeof window === 'undefined') return;
  const url = config.url?.trim() || M3_EDGE_DEFAULT_URL;
  window.localStorage.setItem(M3_EDGE_KEYS.url, url);
  if (typeof config.token === 'string') {
    const token = config.token.trim();
    if (token) {
      window.localStorage.setItem(M3_EDGE_KEYS.token, token);
    }
  }
  window.dispatchEvent(new CustomEvent('gratia:m3edge:change'));
}

export function clearM3EdgeToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(M3_EDGE_KEYS.token);
  window.dispatchEvent(new CustomEvent('gratia:m3edge:change'));
}

export async function checkM3EdgeHealth(url = readM3EdgeUrl()): Promise<M3EdgeHealth> {
  const response = await fetch(`${normalizeUrl(url)}/health`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`M3 Edge health failed with ${response.status}`);
  return response.json() as Promise<M3EdgeHealth>;
}

export async function checkM3EdgeWriteAuth(config = readM3EdgeConfig()): Promise<boolean> {
  if (!config) return false;
  const response = await fetch(`${normalizeUrl(config.url)}/auth/check`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  return response.ok;
}

export function syncEnergyMarkWithM3Edge(input: EnergyMarkInput) {
  const config = readM3EdgeConfig();
  if (!config) return;

  postEnergyMark(config, input).catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[M3 Edge] Energy sync failed silently:', error);
    }
  });
}

export async function syncLatestEnergyMarkWithM3Edge(): Promise<M3EdgeSyncResult> {
  const config = readM3EdgeConfig();
  if (!config) return { ok: false, error: 'missing_token' };

  const mark = readLatestLocalEnergyMark();
  if (!mark) return { ok: false, error: 'missing_local_mark' };

  try {
    const response = await postEnergyMark(config, {
      kind: mark.kind,
      level: mark.level,
      who: mark.who,
      note: mark.note,
      ts: mark.ts,
    });
    return { ok: response.ok, status: response.status };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'sync_failed',
    };
  }
}

export async function pullEnergyStateFromM3Edge(): Promise<M3EdgePullResult> {
  const config = readM3EdgeConfig();
  if (!config) return { ok: false, imported: 0, error: 'missing_token' };

  try {
    const response = await fetch(`${normalizeUrl(config.url)}/energy/state`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) return { ok: false, imported: 0, error: `status_${response.status}` };

    const remote = (await response.json()) as M3EnergyState;
    const remoteMarks = collectRemoteMarks(remote);
    if (remoteMarks.length === 0) return { ok: true, imported: 0 };

    const localMarks = readLocalEnergyMarks();
    const byId = new Map(localMarks.map((mark) => [mark.id, mark]));
    let imported = 0;

    for (const mark of remoteMarks) {
      if (!byId.has(mark.id)) imported += 1;
      byId.set(mark.id, mark);
    }

    const merged = [...byId.values()].sort((a, b) => a.ts.localeCompare(b.ts));
    window.localStorage.setItem(ENERGY_MARKS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('gratia:energy:remote-sync', { detail: { imported } }));
    return { ok: true, imported };
  } catch (error) {
    return {
      ok: false,
      imported: 0,
      error: error instanceof Error ? error.message : 'pull_failed',
    };
  }
}

async function postEnergyMark(config: M3EdgeConfig, input: EnergyMarkInput) {
  const response = await fetch(`${normalizeUrl(config.url)}/energy/mark`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    keepalive: true,
  });
  if (!response.ok) throw new Error(`M3 Edge mark failed with ${response.status}`);
  return response;
}

function readLatestLocalEnergyMark(): EnergyMark | null {
  const marks = readLocalEnergyMarks();
  return marks.at(-1) ?? null;
}

function readLocalEnergyMarks(): EnergyMark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ENERGY_MARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const marks = parsed.filter(isEnergyMark).sort((a, b) => a.ts.localeCompare(b.ts));
    return marks;
  } catch {
    return [];
  }
}

function collectRemoteMarks(remote: M3EnergyState): EnergyMark[] {
  const fromMap = remote.marks && typeof remote.marks === 'object' ? Object.values(remote.marks) : [];
  const candidates = [...fromMap, remote.lastMark];
  const byId = new Map<string, EnergyMark>();
  for (const candidate of candidates) {
    if (isEnergyMark(candidate)) byId.set(candidate.id, candidate);
  }
  return [...byId.values()].sort((a, b) => a.ts.localeCompare(b.ts));
}

function isEnergyMark(value: unknown): value is EnergyMark {
  if (!value || typeof value !== 'object') return false;
  const mark = value as Partial<EnergyMark>;
  return (
    typeof mark.id === 'string' &&
    typeof mark.ts === 'string' &&
    typeof mark.who === 'string' &&
    typeof mark.kind === 'string' &&
    ['crown', 'dragon', 'play', 'life', 'void'].includes(mark.kind) &&
    typeof mark.level === 'number'
  );
}

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, '');
}
