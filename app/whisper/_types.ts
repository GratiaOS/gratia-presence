export type WhisperLevel = 'info' | 'warn' | 'calm' | 'ritual';

export type KernelState =
  | 'CALM'
  | 'OPEN'
  | 'VORTEX'
  | 'RITUAL'
  | 'FLOW'
  | 'INTEGRATION';

export interface WhisperEvent {
  id: string;
  ts: string;
  message: string;
  level: WhisperLevel;
  tags?: string[];
}

export type EnergyPulse = 'low' | 'med' | 'high';
export type EnergyLoad = 'low' | 'med' | 'high';
export type EnergyDrift = 'inward' | 'stable' | 'outward';

export interface EnergySnapshot {
  pulse: EnergyPulse;
  load: EnergyLoad;
  drift: EnergyDrift;
}

export interface WhisperFeed {
  kernelState: KernelState;
  energy: EnergySnapshot;
  timeline: WhisperEvent[];
}
