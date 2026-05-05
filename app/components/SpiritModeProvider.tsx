'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { SPIRIT_MODES, type SpiritMode } from '@/lib/spirit-mode';

type SpiritContextValue = {
  mode: SpiritMode;
  setMode: (next: SpiritMode) => void;
};

const SpiritContext = createContext<SpiritContextValue | undefined>(undefined);
const STORAGE_KEY = 'gratia.spirit-mode';

export function SpiritModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SpiritMode>('bear');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as SpiritMode | null;
    if (stored && SPIRIT_MODES[stored]) {
      setMode(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    const meta = SPIRIT_MODES[mode];
    el.dataset.spirit = mode;
    el.dataset.padMood = meta.mood;
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  return <SpiritContext.Provider value={{ mode, setMode }}>{children}</SpiritContext.Provider>;
}

export function useSpiritMode() {
  const ctx = useContext(SpiritContext);
  if (!ctx) throw new Error('useSpiritMode must be used within <SpiritModeProvider>');
  return ctx;
}
