'use client';

import { useEffect, useState } from 'react';

const PAD_DRIFT_KEY = 'gratia.padDrift';

export default function DevToggles() {
  const [isDriftOn, setIsDriftOn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const root = document.documentElement;
    const stored = window.localStorage.getItem(PAD_DRIFT_KEY);
    if (stored === 'm3') {
      root.setAttribute('data-pad-drift', 'm3');
      setIsDriftOn(true);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const isKeyD = event.code === 'KeyD' || event.key.toLowerCase() === 'd';
      if (!isKeyD) return;

      event.preventDefault();
      const isOn = root.getAttribute('data-pad-drift') === 'm3';
      if (isOn) {
        root.removeAttribute('data-pad-drift');
        window.localStorage.removeItem(PAD_DRIFT_KEY);
        setIsDriftOn(false);
      } else {
        root.setAttribute('data-pad-drift', 'm3');
        window.localStorage.setItem(PAD_DRIFT_KEY, 'm3');
        setIsDriftOn(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!isDriftOn) return null;

  return (
    <div
      title="M3 drift (Alt/Option + D). docs/drift.md"
      onClick={() => {
        const root = document.documentElement;
        root.removeAttribute('data-pad-drift');
        window.localStorage.removeItem(PAD_DRIFT_KEY);
        setIsDriftOn(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        fontSize: '14px',
        opacity: isHovered ? 0.7 : 0.45,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'opacity 160ms ease',
        zIndex: 9999,
      }}
    >
      🛰️
    </div>
  );
}
