"use client";

import type { KernelState } from './_types';

const stateColor: Record<KernelState, string> = {
  CALM: 'text-(--color-accent)',
  OPEN: 'text-(--color-accent)',
  VORTEX: 'text-(--color-accent)',
  RITUAL: 'text-(--color-accent)',
  FLOW: 'text-(--color-accent)',
  INTEGRATION: 'text-(--color-accent)',
};

type WhisperStateProps = {
  state: KernelState;
};

export function WhisperState({ state }: WhisperStateProps) {
  const color = stateColor[state] ?? 'text-(--color-text)';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-(--color-border)/60 bg-(--color-elev)/70 px-3 py-1 ${color}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="text-[11px] uppercase tracking-[0.2em]">{state}</span>
    </div>
  );
}
