'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    if (!window.isSecureContext) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA registration is best-effort; Gratia stays local-first without it.
    });
  }, []);

  return null;
}
