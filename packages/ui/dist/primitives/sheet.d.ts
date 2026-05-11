import * as React from 'react';
export type SheetSide = 'left' | 'right' | 'bottom';
export type SheetProps = {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: SheetSide;
    title?: React.ReactNode;
    closeLabel?: string;
    children?: React.ReactNode;
    className?: string;
};
export declare function Sheet({ open, onOpenChange, side, title, closeLabel, children, className, }: SheetProps): import("react/jsx-runtime").JSX.Element | null;
export default Sheet;
//# sourceMappingURL=sheet.d.ts.map