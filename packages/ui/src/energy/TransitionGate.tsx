import * as React from 'react';
import type { ExitRitual } from '@gratiaos/energy-core';
import { Button } from '../primitives/button.js';
import { Card } from '../primitives/card.js';
import { Whisper } from '../primitives/whisper.js';

export type TransitionGateProps = {
  ritual: ExitRitual;
  open: boolean;
  onClose: () => void;
  copy?: TransitionGateCopy;
  autoStart?: boolean;
  className?: string;
};

export type TransitionGateCopy = {
  secondsRemaining: (seconds: number) => string;
  close: string;
};

const DEFAULT_COPY: TransitionGateCopy = {
  secondsRemaining: (seconds) => `${seconds} seconds remaining`,
  close: 'Close',
};

export function TransitionGate({
  ritual,
  open,
  onClose,
  copy = DEFAULT_COPY,
  autoStart = true,
  className,
}: TransitionGateProps) {
  const [remaining, setRemaining] = React.useState<number>(ritual.durationSeconds);

  React.useEffect(() => {
    if (!open) {
      setRemaining(ritual.durationSeconds);
      return;
    }
    if (!autoStart) return;
    setRemaining(ritual.durationSeconds);
    const id = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          onClose();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [autoStart, onClose, open, ritual.durationSeconds]);

  if (!open) return null;

  return (
    <div data-ui="transition-gate" className={className} role="dialog" aria-modal="true">
      <Card as="section" variant="elev" padding="lg" data-slot="gate-panel">
        <div data-slot="gate-topbar">
          <div data-slot="gate-timer" aria-label={copy.secondsRemaining(remaining)}>
            {remaining}
          </div>
          <Button type="button" variant="ghost" tone="default" density="snug" onClick={onClose}>
            {copy.close}
          </Button>
        </div>
        <h2>{ritual.title}</h2>
        <Whisper tone="presence" pulseOnChange text={ritual.whisper} />
        <ol>
          {ritual.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

export default TransitionGate;
