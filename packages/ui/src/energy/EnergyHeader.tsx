import * as React from 'react';
import type { EnergyBand, EnergyPrediction, EnergyState } from '@gratiaos/energy-core';
import { ENERGY_BANDS, ENERGY_ORDER } from '@gratiaos/energy-core';
import { Whisper } from '../primitives/whisper.js';

export type EnergyHeaderProps = {
  state: EnergyState;
  prediction: EnergyPrediction;
  copy?: EnergyHeaderCopy;
  pulseOnChange?: boolean;
  className?: string;
  onMark?: (band: EnergyBand, level: number) => void;
  onStartRitual?: () => void;
};

export type EnergyHeaderCopy = {
  ariaLabel: string;
  marksLabel: string;
  markSilently: (label: string) => string;
  startRitual: (title: string) => string;
  changeBand: string;
  ritualCta: string;
  bands: Record<EnergyBand, { label: string; shortLabel: string }>;
};

const DEFAULT_LEVELS: Record<EnergyBand, number> = {
  crown: 0.92,
  dragon: 0.7,
  play: 0.46,
  life: 0.26,
  void: 0.1,
};

const DEFAULT_COPY: EnergyHeaderCopy = {
  ariaLabel: 'Energy management',
  marksLabel: 'Silent energy marks',
  markSilently: (label) => `Mark ${label} silently`,
  startRitual: (title) => `Start ${title}`,
  changeBand: 'Change energy band',
  ritualCta: '30s',
  bands: {
    crown: { label: 'Crown (E4)', shortLabel: 'Crown' },
    dragon: { label: 'Dragon (E3)', shortLabel: 'Dragon' },
    play: { label: 'Play (E2)', shortLabel: 'Play' },
    life: { label: 'Life Force (E1)', shortLabel: 'Life' },
    void: { label: 'Void (E0)', shortLabel: 'Void' },
  },
};

export function EnergyHeader({
  state,
  prediction,
  copy = DEFAULT_COPY,
  pulseOnChange = true,
  className,
  onMark,
  onStartRitual,
}: EnergyHeaderProps) {
  const ritual = prediction.exit.ritual;
  const urgent = prediction.exit.urgency === 'now';
  const whisper = urgent ? ritual.whisper : `${ritual.title}. ${ritual.whisper}`;
  const current = copy.bands[state.currentBand];

  return (
    <section
      data-ui="energy-header"
      data-energy-band={state.currentBand}
      data-exit-urgency={prediction.exit.urgency}
      className={className}
      aria-label={copy.ariaLabel}>
      <div data-slot="energy-current">
        <span data-slot="energy-code">{ENERGY_BANDS[state.currentBand].code}</span>
        <span data-slot="energy-label">{current.shortLabel}</span>
        <span data-slot="energy-level">{Math.round(state.currentLevel * 100)}%</span>
      </div>

      <details data-slot="energy-marker">
        <summary aria-label={copy.changeBand}>
          <span>{ENERGY_BANDS[state.currentBand].code}</span>
        </summary>
        <div data-slot="energy-marks" aria-label={copy.marksLabel}>
          {ENERGY_ORDER.map((band) => {
            const active = band === state.currentBand;
            const definition = copy.bands[band];
            return (
              <button
                key={band}
                type="button"
                data-energy-choice={band}
                data-active={active ? 'true' : undefined}
                onClick={(event) => {
                  onMark?.(band, DEFAULT_LEVELS[band]);
                  event.currentTarget.closest('details')?.removeAttribute('open');
                }}
                aria-pressed={active}
                aria-label={copy.markSilently(definition.label)}>
                <span>{ENERGY_BANDS[band].code}</span>
                <span>{definition.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </details>

      <div data-slot="energy-actions">
        <button
          type="button"
          data-slot="energy-ritual"
          onClick={onStartRitual}
          aria-label={copy.startRitual(ritual.title)}>
          {copy.ritualCta}
        </button>
      </div>

      <Whisper
        tone={urgent ? 'presence' : 'collaborative'}
        pulseOnChange={pulseOnChange}
        text={whisper}
        className="energy-header-whisper"
      />
    </section>
  );
}

export default EnergyHeader;
