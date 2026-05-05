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
const COOKIE_KEY = 'gratiaSkinId';

export function SkinFieldProvider({ children }: { children: React.ReactNode }) {
  const [skinId, setSkinIdState] = useState<KernelSkinId>('MOON');

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as KernelSkinId | null;
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
    document.documentElement.dataset.skinId = next;
    if (stored !== next) {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(next)}; path=/; max-age=31536000; samesite=lax`;

    // ascultăm schimbarea sistemului light/dark și sincronizăm doar pentru perechea SUN/MOON
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSkinIdState((current) => {
        // dacă userul a ales alt skin (GARDEN/STELLAR/OFF), nu-l forțăm
        if (current !== 'SUN' && current !== 'MOON') return current;
        const next = event.matches ? 'MOON' : 'SUN';
        window.localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.dataset.skinId = next;
        document.cookie = `${COOKIE_KEY}=${encodeURIComponent(next)}; path=/; max-age=31536000; samesite=lax`;
        return next;
      });
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const setSkinId = (id: KernelSkinId) => {
    setSkinIdState((prev) => {
      if (prev === id) return prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, id);
        document.documentElement.dataset.skinId = id;
        document.cookie = `${COOKIE_KEY}=${encodeURIComponent(id)}; path=/; max-age=31536000; samesite=lax`;
      }
      return id;
    });
  };

  return (
    <SkinFieldContext.Provider value={{ skinId, setSkinId }}>{children}</SkinFieldContext.Provider>
  );
}
