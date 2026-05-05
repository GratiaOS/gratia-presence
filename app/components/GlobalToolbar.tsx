'use client';

import SkinToggle from './SkinToggle';

export function GlobalToolbar() {
  return (
    <div
      className="fixed right-6 bottom-6 z-40 transition-opacity hover:opacity-100 md:opacity-90"
      role="complementary"
      aria-label="Global settings"
    >
      <SkinToggle />
    </div>
  );
}
