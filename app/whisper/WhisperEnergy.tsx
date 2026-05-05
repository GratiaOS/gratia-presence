"use client";

import type { EnergySnapshot } from './_types';

const ringOpacity: Record<EnergySnapshot['pulse'], string> = {
  low: 'opacity-40',
  med: 'opacity-70',
  high: 'opacity-100',
};

type WhisperEnergyProps = {
  energy: EnergySnapshot;
};

export function WhisperEnergy({ energy }: WhisperEnergyProps) {
  return (
    <div className="relative h-32 w-32">
      <div
        className={`absolute inset-4 rounded-full border border-(--color-accent)/70 ${ringOpacity[energy.pulse]}`}
      />
      <div
        className={`absolute inset-2 rounded-full border border-(--color-border)/70 ${ringOpacity[energy.load]}`}
      />
      <div className="absolute inset-0 rounded-full border border-(--color-muted)/60 opacity-60" />

      <div className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-[0.2em] text-(--color-text)">
        {energy.drift}
      </div>
    </div>
  );
}
