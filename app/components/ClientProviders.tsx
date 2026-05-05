/**
 * Client Providers — Client-side only component wrapper
 * ------------------------------------------------------
 * Mounts client-only components that use hooks (useEffect, useState, etc.)
 * Rendered inside server component layout.tsx
 */

'use client';

import { M3Bridge } from './M3Bridge';
import { Toaster } from '@gratiaos/ui';
import '@gratiaos/ui/styles/toast.css';
import DevToggles from './DevToggles';

export function ClientProviders() {
  return (
    <>
      <M3Bridge />
      <Toaster position="top-right" />
      {process.env.NODE_ENV === 'development' ? <DevToggles /> : null}
    </>
  );
}
