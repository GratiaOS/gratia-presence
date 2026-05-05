import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/** Simple class join helper (no runtime deps). */
function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
// Base utility classes — the skin (CSS) handles colors/borders via data-attrs.
/**
 * Headless Pill
 * - Emits `data-ui`, `data-variant`, `data-tone`, `data-density`.
 * - No fixed colors here; styles/pill.css is the single source of truth.
 */
const PillInner = (props, ref) => {
    const { as, variant = 'soft', tone = 'subtle', density = 'cozy', leading, trailing, className, children, ...rest } = props;
    const Comp = as ?? 'span';
    // If rendered as a button, default to type=button to avoid form submission.
    const buttonDefaults = Comp === 'button' && !rest.type ? { type: 'button' } : null;
    return (_jsxs(Comp, { ref: ref, "data-ui": "pill", "data-variant": variant, "data-tone": tone, "data-density": density, className: cx(className) || undefined, ...buttonDefaults, ...rest, children: [leading && (
            // Presentational — hidden from AT since the text already conveys the label
            _jsx("span", { "aria-hidden": "true", "data-slot": "icon leading", children: leading })), children, trailing && (_jsx("span", { "aria-hidden": "true", "data-slot": "icon trailing", children: trailing }))] }));
};
const _Pill = React.forwardRef(PillInner);
_Pill.displayName = 'Pill';
export const Pill = _Pill;
export default Pill;
//# sourceMappingURL=pill.js.map