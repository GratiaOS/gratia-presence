import * as React from 'react';
import type { EnergyBand, EnergyPrediction, EnergyState } from '@gratiaos/energy-core';
export type EnergyHeaderProps = {
    state: EnergyState;
    prediction: EnergyPrediction;
    copy?: EnergyHeaderCopy;
    pulseOnChange?: boolean;
    className?: string;
    onMark?: (band: EnergyBand, level: number) => void;
    onStartRitual?: () => void;
};
export type EnergyCapsuleProps = EnergyHeaderProps & {
    sheetTitle?: React.ReactNode;
    closeLabel?: string;
};
export type EnergyHeaderCopy = {
    ariaLabel: string;
    marksLabel: string;
    markSilently: (label: string) => string;
    startRitual: (title: string) => string;
    changeBand: string;
    ritualCta: string;
    bands: Record<EnergyBand, {
        label: string;
        shortLabel: string;
    }>;
};
export declare function EnergyHeader({ state, prediction, copy, pulseOnChange, className, onMark, onStartRitual, }: EnergyHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare function EnergyCapsule({ state, prediction, copy, pulseOnChange, className, onMark, onStartRitual, sheetTitle, closeLabel, }: EnergyCapsuleProps): import("react/jsx-runtime").JSX.Element;
export default EnergyHeader;
//# sourceMappingURL=EnergyHeader.d.ts.map