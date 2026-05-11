'use client';

import { useEffect, useState } from 'react';
import { useSkinField, type KernelSkinId } from '@/skin/SkinFieldProvider';

const SKINS: {
  id: KernelSkinId;
  label: string;
  title: string;
}[] = [
  { id: 'SUN', label: '☀︎', title: 'Sun' },
  { id: 'MOON', label: '☽', title: 'Moon' },
  { id: 'GARDEN', label: '☘︎', title: 'Garden' },
  { id: 'STELLAR', label: '✦', title: 'Stellar' },
];

export function SkinToggle() {
  const { skinId, setSkinId } = useSkinField();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      role="group"
      aria-label="Skin selector"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: 'var(--control-cluster-padding, 0.25rem)',
        borderRadius: 'var(--control-cluster-radius, var(--radius-md, 0.5rem))',
        border:
          'var(--control-cluster-border, 1px solid color-mix(in oklab, var(--color-border) 60%, transparent))',
        background:
          'var(--control-cluster-bg, color-mix(in oklab, var(--color-elev) 92%, var(--surface) 8%))',
        fontSize: '1rem',
        lineHeight: '1rem',
      }}
    >
      {SKINS.map((skin) => {
        const active = mounted && skinId === skin.id;
        return (
          <button
            key={skin.id}
            type="button"
            onClick={() => setSkinId(skin.id)}
            aria-pressed={active}
            aria-label={skin.title}
            title={skin.title}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.75rem',
              height: '1.75rem',
              padding: 0,
              borderRadius: 'var(--control-item-radius, calc(0.5rem - 0.25rem))',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 160ms ease-out',
              background: active
                ? 'color-mix(in oklab, var(--color-accent) 18%, var(--surface))'
                : 'transparent',
              color: active ? 'var(--color-text)' : 'var(--text-subtle)',
              boxShadow: active
                ? '0 0 0 1.5px color-mix(in oklab, var(--color-accent) 35%, transparent), 0 1px 3px color-mix(in oklab, var(--color-accent) 20%, transparent)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background =
                  'var(--control-cluster-bg-hover, color-mix(in oklab, var(--color-elev) 70%, var(--surface) 30%))';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {skin.label}
          </button>
        );
      })}
    </div>
  );
}

export default SkinToggle;
