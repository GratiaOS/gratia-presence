'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

export type KernelSkinId = 'SUN' | 'MOON' | 'GARDEN' | 'STELLAR' | 'OFF';

type SkinFieldContextValue = {
  skinId: KernelSkinId;
  setSkinId: (id: KernelSkinId) => void;
};

const SkinFieldContext = createContext<SkinFieldContextValue | null>(null);

export function useSkinField(): SkinFieldContextValue {
  const ctx = useContext(SkinFieldContext);
  if (!ctx) {
    throw new Error('useSkinField must be used within <SkinFieldProvider>');
  }
  return ctx;
}

const STORAGE_KEY = 'gratia.skinId';

const SKIN_THEME_COLORS: Record<KernelSkinId, string> = {
  SUN: '#f3eee2',
  MOON: '#11100f',
  GARDEN: '#e8f0df',
  STELLAR: '#12131d',
  OFF: '#f3eee2',
};

function normalizeSkinId(value?: string | null): KernelSkinId | null {
  if (value === 'SUN' || value === 'MOON' || value === 'GARDEN' || value === 'STELLAR' || value === 'OFF') {
    return value;
  }
  return null;
}

function readStoredSkinId(): KernelSkinId | null {
  if (typeof window === 'undefined') return null;
  return normalizeSkinId(window.localStorage.getItem(STORAGE_KEY));
}

function writeSkinSideEffects(id: KernelSkinId) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, id);
  document.documentElement.dataset.skinId = id;

  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = SKIN_THEME_COLORS[id];
}

export function SkinFieldProvider({ children }: { children: React.ReactNode }) {
  const [skinId, setSkinIdState] = useState<KernelSkinId>('MOON');

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = readStoredSkinId();
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // dacă sistemul e pe dark și ultimul skin era SUN, folosim MOON ca default de siguranță
    const next = stored
      ? prefersDark && stored === 'SUN'
        ? 'MOON'
        : stored
      : prefersDark
        ? 'MOON'
        : 'SUN';

    setSkinIdState(next);
    writeSkinSideEffects(next);

    // ascultăm schimbarea sistemului light/dark și sincronizăm doar pentru perechea SUN/MOON
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSkinIdState((current) => {
        // dacă userul a ales alt skin (GARDEN/STELLAR/OFF), nu-l forțăm
        if (current !== 'SUN' && current !== 'MOON') return current;
        const next = event.matches ? 'MOON' : 'SUN';
        writeSkinSideEffects(next);
        window.dispatchEvent(new CustomEvent('gratia:skinchange', { detail: { skinId: next } }));
        return next;
      });
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncSkin = (event?: Event) => {
      const detail =
        event instanceof CustomEvent && typeof event.detail?.skinId === 'string'
          ? event.detail.skinId
          : null;
      const next = normalizeSkinId(detail) ?? readStoredSkinId();
      if (!next) return;
      setSkinIdState((prev) => {
        writeSkinSideEffects(next);
        return prev === next ? prev : next;
      });
    };

    const syncStorage = (event: StorageEvent) => {
      if (event.key && event.key !== STORAGE_KEY) return;
      syncSkin();
    };

    window.addEventListener('gratia:skinchange', syncSkin);
    window.addEventListener('storage', syncStorage);
    window.addEventListener('gratia:ghostbackup:imported', syncSkin);
    return () => {
      window.removeEventListener('gratia:skinchange', syncSkin);
      window.removeEventListener('storage', syncStorage);
      window.removeEventListener('gratia:ghostbackup:imported', syncSkin);
    };
  }, []);

  const setSkinId = (id: KernelSkinId) => {
    setSkinIdState((prev) => {
      if (prev === id) return prev;
      if (typeof window !== 'undefined') {
        writeSkinSideEffects(id);
        window.dispatchEvent(new CustomEvent('gratia:skinchange', { detail: { skinId: id } }));
      }
      return id;
    });
  };

  return (
    <SkinFieldContext.Provider value={{ skinId, setSkinId }}>{children}</SkinFieldContext.Provider>
  );
}
