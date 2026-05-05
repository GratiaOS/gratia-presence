import * as React from 'react';
/**
 * Garden UI — Pill primitive (headless)
 * -------------------------------------
 * Whisper: "labels should sit light, but speak clearly." 🌬️
 *
 * Purpose
 *  • A tiny, versatile label/chip primitive for counts, states, or tags.
 *  • Headless by design — emits data-attributes only; visuals live in styles/pill.css.
 *
 * Data API
 *  • [data-ui="pill"]                — root
 *  • [data-variant="soft|solid|outline|subtle"]
 *  • [data-tone="accent|positive|warning|danger|subtle(default)"]
 *  • [data-density="cozy|snug"]      — vertical rhythm/size
 *
 * A11y
 *  • Content is the accessible label. Leading/trailing adornments are
 *    `aria-hidden` so screen readers read the text once.
 *  • When rendered as <button>, we default `type="button"` to avoid accidental
 *    form submission — mirrors the Button primitive behaviour.
 *
 * Theming
 *  • Colors, radius and borders are driven by tokens in styles/pill.css.
 *  • No hard-coded hex here; skin chooses the palette via data-attrs.
 *
 * When to use
 *  • For small, inline status or metadata (e.g., "Beta", counters, light tags).
 *  • For interactive chips, render as `as="button"`/`as="a"` and style hover
 *    states in the skin.
 */
/** Visual tone (mapped by the skin). */
type Tone = 'accent' | 'positive' | 'warning' | 'danger' | 'subtle' | (string & {});
/** Visual weight (see styles for exact rendering). */
type Variant = 'soft' | 'solid' | 'outline' | 'subtle' | (string & {});
/** Vertical density (compact vs roomy). */
type Density = 'cozy' | 'snug' | (string & {});
/** Element to render as (defaults to span). */
type AsElement = 'span' | 'button' | 'a';
type PillOwnProps = {
    /** Render as a different element (span | button | a). Defaults to span. */
    as?: AsElement;
    /** Visual weight. Defaults to "soft". */
    variant?: Variant;
    /** Color tone. Defaults to "subtle". */
    tone?: Tone;
    /** Vertical density. Defaults to "cozy". */
    density?: Density;
    /** Optional leading adornment (icon, dot, avatar). */
    leading?: React.ReactNode;
    /** Optional trailing adornment (icon, counter, close). */
    trailing?: React.ReactNode;
};
export type PillProps<TAs extends AsElement = 'span'> = PillOwnProps & Omit<React.ComponentPropsWithoutRef<TAs>, 'color'>;
export declare const Pill: <TAs extends AsElement = "span">(props: PillProps<TAs> & {
    ref?: React.Ref<HTMLElement>;
}) => React.ReactElement | null;
export default Pill;
//# sourceMappingURL=pill.d.ts.map