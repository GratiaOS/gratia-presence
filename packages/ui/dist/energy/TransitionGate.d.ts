import type { ExitRitual } from '@gratiaos/energy-core';
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
export declare function TransitionGate({ ritual, open, onClose, copy, autoStart, className, }: TransitionGateProps): import("react/jsx-runtime").JSX.Element | null;
export default TransitionGate;
//# sourceMappingURL=TransitionGate.d.ts.map