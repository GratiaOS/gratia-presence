import type { Locale } from '../../i18n/resources';
import type { LunarPhase } from './content';

const STORAGE_KEY = 'gratia.lunarJournal.entries.v1';

export type LunarJournalEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  locale: Locale;
  phase: LunarPhase;
  pageKey: string;
  pageTitle: string;
  content: string;
};

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readRaw(): LunarJournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(entries: LunarJournalEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function listLunarEntries() {
  return readRaw().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function createLunarEntry(
  input: Omit<LunarJournalEntry, 'id' | 'createdAt' | 'updatedAt'>
) {
  const now = new Date().toISOString();
  const entry: LunarJournalEntry = {
    ...input,
    id: makeId(),
    createdAt: now,
    updatedAt: now,
  };
  writeRaw([entry, ...readRaw()]);
  return entry;
}

export function deleteLunarEntry(id: string) {
  writeRaw(readRaw().filter((entry) => entry.id !== id));
}
