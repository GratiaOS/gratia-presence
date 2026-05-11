import * as React from 'react';
import { Button } from './button.js';

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

export function Sheet({
  open,
  onOpenChange,
  side = 'right',
  title,
  closeLabel = 'Close',
  children,
  className,
}: SheetProps) {
  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div data-ui="sheet" data-side={side} className={className} role="presentation">
      <button
        type="button"
        data-slot="sheet-backdrop"
        aria-label={closeLabel}
        onClick={() => onOpenChange?.(false)}
      />
      <section data-slot="sheet-panel" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        <div data-slot="sheet-header">
          {title ? <h2 data-slot="sheet-title">{title}</h2> : <span />}
          <Button
            type="button"
            data-slot="sheet-close"
            variant="ghost"
            density="snug"
            onClick={() => onOpenChange?.(false)}
            aria-label={closeLabel}>
            ×
          </Button>
        </div>
        <div data-slot="sheet-body">{children}</div>
      </section>
    </div>
  );
}

export default Sheet;
