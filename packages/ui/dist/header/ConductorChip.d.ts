import * as React from 'react';
import { type KernelAuthority } from '@gratiaos/presence-kernel';
/**
 * Garden UI — ConductorChip primitive (headless)
 * ---------------------------------------------
 * Whisper: "name the conductor softly." 🌬️
 *
 * Purpose
 *  • Display the active presence authority as a compact HUD chip.
 *  • Mirrors kernel signals without requiring a kernel instance.
 *
 * Data API
 *  • [data-ui="conductor-chip"] — root hook for skins.
 *  • [data-authority="…"]       — matches KernelAuthority enum.
 *
 * A11y
 *  • Title defaults to "Authority: …" unless overridden via props.
 *
 * Theming
 *  • Reads tone tokens (--tone-accent, --tone-ink) for visuals.
 *
 * Notes
 *  • Headless: visuals live in styles/header.css.
 */
export interface ConductorChipProps extends React.ComponentPropsWithoutRef<'span'> {
    /** Optional custom label formatter. Receives the raw authority string. */
    formatLabel?: (authority: KernelAuthority) => React.ReactNode;
}
export declare const ConductorChip: React.FC<ConductorChipProps>;
//# sourceMappingURL=ConductorChip.d.ts.map