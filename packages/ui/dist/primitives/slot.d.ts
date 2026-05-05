import * as React from "react";
/** A minimal Slot primitive to forward props to child (like Radix Slot) */
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}
export declare const Slot: React.ForwardRefExoticComponent<SlotProps & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=slot.d.ts.map