/**
 * @gratiaos/energy-core
 * Whisper: "name the battery before the system spends it."
 *
 * Local-first engine for the five canonical Gratia energy bands.
 */

export type EnergyBand = 'crown' | 'dragon' | 'play' | 'life' | 'void';
export type EnergyCode = 'E4' | 'E3' | 'E2' | 'E1' | 'E0';
export type EnergyDirection = 'up' | 'down' | 'flat';
export type ExitUrgency = 'none' | 'soon' | 'now';

export type EnergyBandDefinition = {
  band: EnergyBand;
  code: EnergyCode;
  label: string;
  shortLabel: string;
  level: 0 | 1 | 2 | 3 | 4;
  intent: string;
};

export type EnergyMark = {
  id: string;
  ts: string;
  who: string;
  kind: EnergyBand;
  level: number;
  note?: string;
  source: 'ghost' | 'm3' | 'db' | (string & {});
};

export type EnergyMarkInput = {
  who?: string;
  kind: EnergyBand;
  level?: number;
  note?: string;
  ts?: string;
};

export type EnergyState = {
  currentBand: EnergyBand;
  currentLevel: number;
  label: string;
  lastMark?: EnergyMark;
  marks: Partial<Record<EnergyBand, EnergyMark>>;
  updatedAt: string;
};

export type EnergyTrend = {
  kind: EnergyBand;
  label: string;
  current: number;
  avg24h: number;
  direction: EnergyDirection;
  samples24h: number;
};

export type EnergyPredictInput = {
  kind?: EnergyBand;
  lookbackDays?: number;
  forecastHours?: number;
  now?: Date;
  taskBand?: EnergyBand;
  taskThreshold?: number;
  thresholds?: Partial<EnergyThresholds>;
};

export type EnergyPrediction = {
  kind: EnergyBand;
  label: string;
  currentLevel: number;
  predictedLevel: number;
  confidence: number;
  trend: EnergyDirection;
  reasoning: string;
  forecastWindow: string;
  samplesAnalyzed: number;
  exit: {
    urgency: ExitUrgency;
    ritual: ExitRitual;
  };
};

export type EnergyMarkResult = {
  mark: EnergyMark;
  state: EnergyState;
  prediction: EnergyPrediction;
  shouldTriggerRitual: boolean;
};

export type ExitRitual = {
  id: string;
  title: string;
  durationSeconds: 30;
  steps: [string, string, string];
  whisper: string;
};

export type EnergyThresholds = {
  lowBattery: number;
  dropDelta: number;
  taskMinimums: Record<EnergyBand, number>;
};

export type EnergyEngineOptions = {
  source?: EnergyMark['source'];
  now?: () => Date;
  thresholds?: Partial<EnergyThresholds>;
};

export type EnergyApiClientOptions = {
  baseUrl?: string;
  fetcher?: typeof fetch;
  headers?: HeadersInit | (() => HeadersInit);
};

export interface EnergyStorageAdapter {
  list(): EnergyMark[];
  write(marks: EnergyMark[]): void;
}

export type EnergyEngine = {
  mark(input: EnergyMarkInput): EnergyMarkResult;
  state(): EnergyState;
  trends(): EnergyTrend[];
  predict(input?: EnergyPredictInput): EnergyPrediction;
  clear(): void;
};

export type EnergyClient = {
  mark(input: EnergyMarkInput): EnergyMark;
  state(): EnergyState;
  trends(): EnergyTrend[];
  predict(input?: EnergyPredictInput): EnergyPrediction;
  clear(): void;
};

export type EnergyApiClient = {
  mark(input: EnergyMarkInput): Promise<EnergyMarkResult>;
  state(): Promise<EnergyState>;
  trends(): Promise<EnergyTrend[]>;
  predict(input?: EnergyPredictInput): Promise<EnergyPrediction>;
};

export const ENERGY_API_PATHS = {
  mark: '/mark',
  state: '/state',
  trends: '/trends',
  predict: '/predict',
} as const;

export const ENERGY_BANDS: Record<EnergyBand, EnergyBandDefinition> = {
  crown: {
    band: 'crown',
    code: 'E4',
    label: 'Crown (E4)',
    shortLabel: 'Crown',
    level: 4,
    intent: 'architecture, strategy, naming',
  },
  dragon: {
    band: 'dragon',
    code: 'E3',
    label: 'Dragon (E3)',
    shortLabel: 'Dragon',
    level: 3,
    intent: 'deep work, coding, analysis',
  },
  play: {
    band: 'play',
    code: 'E2',
    label: 'Play (E2)',
    shortLabel: 'Play',
    level: 2,
    intent: 'reviews, pairing, drafting',
  },
  life: {
    band: 'life',
    code: 'E1',
    label: 'Life Force (E1)',
    shortLabel: 'Life',
    level: 1,
    intent: 'chores, admin, grooming',
  },
  void: {
    band: 'void',
    code: 'E0',
    label: 'Void (E0)',
    shortLabel: 'Void',
    level: 0,
    intent: 'rest, breathwork, sleep',
  },
};

export const ENERGY_ORDER: EnergyBand[] = ['crown', 'dragon', 'play', 'life', 'void'];

export const DEFAULT_ENERGY_THRESHOLDS: EnergyThresholds = {
  lowBattery: 0.18,
  dropDelta: 0.12,
  taskMinimums: {
    crown: 0.82,
    dragon: 0.58,
    play: 0.36,
    life: 0.18,
    void: 0,
  },
};

const STORAGE_KEY = 'gratia.energy.marks.v1';
const DAY_MS = 24 * 60 * 60 * 1000;

export function normalizeEnergyLevel(level: number | undefined, kind: EnergyBand): number {
  if (typeof level === 'number' && Number.isFinite(level)) return clamp01(level);
  if (kind === 'void') return 0.1;
  return Math.max(0.15, ENERGY_BANDS[kind].level / 4);
}

export function createLocalStorageEnergyAdapter(key = STORAGE_KEY): EnergyStorageAdapter {
  return {
    list() {
      if (typeof window === 'undefined') return [];
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(isEnergyMark) : [];
      } catch {
        return [];
      }
    },
    write(marks) {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, JSON.stringify(marks));
    },
  };
}

export function createMemoryEnergyAdapter(seed: EnergyMark[] = []): EnergyStorageAdapter {
  let marks = [...seed];
  return {
    list: () => [...marks],
    write: (next) => {
      marks = [...next];
    },
  };
}

export function createEnergyEngine(
  adapter: EnergyStorageAdapter,
  options: EnergyEngineOptions = {}
): EnergyEngine {
  const now = options.now ?? (() => new Date());
  const source = options.source ?? 'ghost';
  const baseThresholds = mergeThresholds(options.thresholds);
  const readSorted = () => adapter.list().filter(isEnergyMark).sort((a, b) => a.ts.localeCompare(b.ts));

  const state = (): EnergyState => {
    const latest: Partial<Record<EnergyBand, EnergyMark>> = {};
    for (const entry of readSorted()) latest[entry.kind] = entry;
    const lastMark = Object.values(latest)
      .filter(isEnergyMark)
      .sort((a, b) => a.ts.localeCompare(b.ts))
      .at(-1);
    const currentBand = lastMark?.kind ?? 'void';
    const currentLevel = lastMark?.level ?? 0.1;
    return {
      currentBand,
      currentLevel,
      label: ENERGY_BANDS[currentBand].label,
      lastMark,
      marks: latest,
      updatedAt: lastMark?.ts ?? now().toISOString(),
    };
  };

  const trends = (): EnergyTrend[] => {
    const marks = readSorted();
    const since = now().getTime() - DAY_MS;
    return ENERGY_ORDER.map((kind) => {
      const kindMarks = marks.filter((entry) => entry.kind === kind);
      const recent = kindMarks.filter((entry) => Date.parse(entry.ts) >= since);
      const current = kindMarks.at(-1)?.level ?? (kind === 'void' ? 0.1 : 0);
      const avg24h = average(recent.map((entry) => entry.level), current);
      const previousAvg = average(kindMarks.slice(-6, -3).map((entry) => entry.level), current);
      return {
        kind,
        label: ENERGY_BANDS[kind].label,
        current,
        avg24h,
        direction: directionFrom(current - previousAvg),
        samples24h: recent.length,
      };
    });
  };

  const predict = (input: EnergyPredictInput = {}): EnergyPrediction => {
    const thresholds = mergeThresholds(input.thresholds, baseThresholds);
    const snapshot = state();
    const kind = input.kind ?? snapshot.currentBand;
    const marks = readSorted().filter((entry) => entry.kind === kind);
    const lookbackDays = input.lookbackDays ?? 7;
    const forecastHours = input.forecastHours ?? 24;
    const referenceNow = input.now ?? now();
    const cutoff = referenceNow.getTime() - lookbackDays * DAY_MS;
    const scoped = marks.filter((entry) => Date.parse(entry.ts) >= cutoff);
    const currentLevel = marks.at(-1)?.level ?? (kind === 'void' ? 0.1 : 0);
    const slopePerHour = hourlySlope(scoped, currentLevel);
    const weightedLevel = weightedAverage(scoped.map((entry) => entry.level), currentLevel);
    const projectedFromSlope = currentLevel + slopePerHour * forecastHours;
    const predictedLevel = clamp01(projectedFromSlope * 0.65 + weightedLevel * 0.35);
    const trend = directionFrom(predictedLevel - currentLevel);
    const exit = exitFor(kind, currentLevel, predictedLevel, trend, {
      thresholds,
      taskBand: input.taskBand,
      taskThreshold: input.taskThreshold,
    });

    return {
      kind,
      label: ENERGY_BANDS[kind].label,
      currentLevel,
      predictedLevel,
      confidence: confidenceFor(scoped, lookbackDays),
      trend,
      reasoning: reasoningFor(scoped.length, lookbackDays, forecastHours, input.taskBand),
      forecastWindow: `${forecastHours}h`,
      samplesAnalyzed: scoped.length,
      exit,
    };
  };

  const mark = (input: EnergyMarkInput): EnergyMarkResult => {
    const kind = input.kind;
    const ts = input.ts ?? now().toISOString();
    const entry: EnergyMark = {
      id: makeId(ts, kind),
      ts,
      who: input.who ?? 'self',
      kind,
      level: normalizeEnergyLevel(input.level, kind),
      note: input.note,
      source,
    };
    adapter.write([...readSorted(), entry]);
    const nextState = state();
    const prediction = predict({ kind: nextState.currentBand, now: new Date(ts) });
    return {
      mark: entry,
      state: nextState,
      prediction,
      shouldTriggerRitual: prediction.exit.urgency === 'now',
    };
  };

  return {
    mark,
    state,
    trends,
    predict,
    clear() {
      adapter.write([]);
    },
  };
}

export function createEnergyClient(
  adapter: EnergyStorageAdapter,
  options: EnergyEngineOptions = {}
): EnergyClient {
  const engine = createEnergyEngine(adapter, options);
  return {
    mark(input) {
      return engine.mark(input).mark;
    },
    state: engine.state,
    trends: engine.trends,
    predict: engine.predict,
    clear: engine.clear,
  };
}

export function createRemoteEnergyApiClient(options: EnergyApiClientOptions = {}): EnergyApiClient {
  const baseUrl = options.baseUrl ?? '/api/energy';
  const fetcher = options.fetcher ?? fetch;
  const endpoint = (path: string) => `${baseUrl.replace(/\/$/, '')}${path}`;

  return {
    mark(input) {
      return requestJson(fetcher, endpoint(ENERGY_API_PATHS.mark), 'POST', input, options.headers);
    },
    state() {
      return requestJson(fetcher, endpoint(ENERGY_API_PATHS.state), 'GET', undefined, options.headers);
    },
    trends() {
      return requestJson(fetcher, endpoint(ENERGY_API_PATHS.trends), 'GET', undefined, options.headers);
    },
    predict(input = {}) {
      return requestJson(fetcher, endpoint(ENERGY_API_PATHS.predict), 'POST', input, options.headers);
    },
  };
}

export function getBandForLevel(level: number): EnergyBand {
  if (level >= DEFAULT_ENERGY_THRESHOLDS.taskMinimums.crown) return 'crown';
  if (level >= DEFAULT_ENERGY_THRESHOLDS.taskMinimums.dragon) return 'dragon';
  if (level >= DEFAULT_ENERGY_THRESHOLDS.taskMinimums.play) return 'play';
  if (level >= DEFAULT_ENERGY_THRESHOLDS.taskMinimums.life) return 'life';
  return 'void';
}

function exitFor(
  kind: EnergyBand,
  currentLevel: number,
  predictedLevel: number,
  trend: EnergyDirection,
  options: {
    thresholds: EnergyThresholds;
    taskBand?: EnergyBand;
    taskThreshold?: number;
  }
): { urgency: ExitUrgency; ritual: ExitRitual } {
  const requiredLevel =
    options.taskThreshold ?? (options.taskBand ? options.thresholds.taskMinimums[options.taskBand] : undefined);
  const belowTask = typeof requiredLevel === 'number' && predictedLevel < requiredLevel;
  const lowBattery =
    kind === 'void' ||
    predictedLevel <= options.thresholds.lowBattery ||
    currentLevel <= options.thresholds.lowBattery;
  const sharpDrop = currentLevel - predictedLevel >= options.thresholds.dropDelta;
  const urgency: ExitUrgency = lowBattery ? 'now' : belowTask || sharpDrop || trend === 'down' ? 'soon' : 'none';

  if (lowBattery) return { urgency, ritual: EXIT_RITUALS.lowBattery };
  if (belowTask || sharpDrop || kind === 'dragon' || kind === 'crown') {
    return { urgency, ritual: EXIT_RITUALS.downshift };
  }
  return { urgency, ritual: EXIT_RITUALS.softReset };
}

export const EXIT_RITUALS: Record<string, ExitRitual> = {
  lowBattery: {
    id: 'low-battery-shutter',
    title: '30-second low-battery shutter',
    durationSeconds: 30,
    steps: ['Close the next input.', 'Exhale longer than you inhale.', 'Choose one tiny body need.'],
    whisper: 'Ten percent is enough information. Protect the battery.',
  },
  downshift: {
    id: 'dragon-shutter',
    title: '30-second exit from high gear',
    durationSeconds: 30,
    steps: ['Unclench jaw and hands.', 'Look away from the screen.', 'Name what is finished enough.'],
    whisper: 'Seal the thread before the thread spends you.',
  },
  softReset: {
    id: 'soft-reset',
    title: '30-second soft reset',
    durationSeconds: 30,
    steps: ['Put both feet down.', 'Let the shoulders drop.', 'Return to one next true thing.'],
    whisper: 'Small reset, clean signal.',
  },
};

function requestJson<T>(
  fetcher: typeof fetch,
  url: string,
  method: 'GET' | 'POST',
  body?: unknown,
  headers?: HeadersInit | (() => HeadersInit)
): Promise<T> {
  const resolvedHeaders = typeof headers === 'function' ? headers() : headers;
  return fetcher(url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...resolvedHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Energy API ${method} ${url} failed with ${response.status}`);
    return response.json() as Promise<T>;
  });
}

function mergeThresholds(
  override?: Partial<EnergyThresholds>,
  base: EnergyThresholds = DEFAULT_ENERGY_THRESHOLDS
): EnergyThresholds {
  return {
    ...base,
    ...override,
    taskMinimums: {
      ...base.taskMinimums,
      ...override?.taskMinimums,
    },
  };
}

function isEnergyMark(value: unknown): value is EnergyMark {
  if (!value || typeof value !== 'object') return false;
  const mark = value as Partial<EnergyMark>;
  return (
    typeof mark.id === 'string' &&
    typeof mark.ts === 'string' &&
    typeof mark.who === 'string' &&
    typeof mark.kind === 'string' &&
    mark.kind in ENERGY_BANDS &&
    typeof mark.level === 'number'
  );
}

function makeId(ts: string, kind: EnergyBand) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${ts}-${kind}-${Math.random().toString(36).slice(2)}`;
}

function average(values: number[], fallback: number) {
  if (values.length === 0) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function weightedAverage(values: number[], fallback: number) {
  if (values.length === 0) return fallback;
  let total = 0;
  let weightTotal = 0;
  values.forEach((value, index) => {
    const weight = index + 1;
    total += value * weight;
    weightTotal += weight;
  });
  return weightTotal > 0 ? total / weightTotal : fallback;
}

function hourlySlope(marks: EnergyMark[], fallbackLevel: number) {
  if (marks.length < 2) return 0;
  const firstTs = Date.parse(marks[0].ts);
  const xs = marks.map((mark) => (Date.parse(mark.ts) - firstTs) / (60 * 60 * 1000));
  const ys = marks.map((mark) => mark.level);
  const xAvg = average(xs, 0);
  const yAvg = average(ys, fallbackLevel);
  const numerator = xs.reduce((sum, x, index) => sum + (x - xAvg) * (ys[index] - yAvg), 0);
  const denominator = xs.reduce((sum, x) => sum + (x - xAvg) ** 2, 0);
  if (denominator === 0) return 0;
  return numerator / denominator;
}

function confidenceFor(marks: EnergyMark[], lookbackDays: number) {
  if (marks.length === 0) return 0.35;
  const sampleScore = Math.min(0.45, marks.length * 0.07);
  const first = Date.parse(marks[0].ts);
  const last = Date.parse(marks[marks.length - 1].ts);
  const spanDays = Math.max(0, (last - first) / DAY_MS);
  const spanScore = Math.min(0.2, (spanDays / Math.max(1, lookbackDays)) * 0.2);
  return Math.min(0.9, 0.35 + sampleScore + spanScore);
}

function reasoningFor(samples: number, lookbackDays: number, forecastHours: number, taskBand?: EnergyBand) {
  if (samples === 0) {
    return 'Ghost Mode baseline: no stored marks yet, defaulting to low-battery protection.';
  }
  const taskNote = taskBand ? ` Task threshold: ${ENERGY_BANDS[taskBand].label}.` : '';
  return `Based on ${samples} local Ghost Mode marks over ${lookbackDays} days, projected ${forecastHours}h ahead.${taskNote}`;
}

function directionFrom(delta: number): EnergyDirection {
  if (delta > 0.05) return 'up';
  if (delta < -0.05) return 'down';
  return 'flat';
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
