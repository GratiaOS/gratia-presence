import * as React from 'react';
/**
 * Garden UI — Badge primitive (headless)
 * --------------------------------------
 * Whisper: "small truths, softly visible." 🌬️
 *
 * Purpose
 *  • Compact status/metadata label (denser than Pill, squarer radius).
 *  • Headless: emits data-attributes only; visuals live in styles/badge.css.
 *
 * Data API
 *  • [data-ui="badge"]                      — root hook
 *  • [data-variant="soft|solid|outline|subtle"]
 *  • [data-tone="subtle|accent|positive|warning|danger"]
 *  • [data-size="sm|md"]                    — default: sm
 *
 * A11y
 *  • Content is the accessible label; leading/trailing are aria-hidden.
 *  • When rendered as <button>, defaults type="button" (no accidental submits).
 *
 * Theming
 *  • Colors, borders, radius are defined in styles/badge.css via tokens.
 *
 * When to use
 *  • Inline facts (e.g., "Car", "Bridge", counts) where space is tight.
 *  • Use Pill when you want a rounder / more prominent chip.
 */
/** Visual tone (mapped by the skin). */
export type BadgeTone = 'subtle' | 'accent' | 'positive' | 'warning' | 'danger' | (string & {});
/** Visual weight (see skin for rendering). */
export type BadgeVariant = 'soft' | 'solid' | 'outline' | 'subtle' | (string & {});
/** Component size scale. Defaults to "sm". */
export type BadgeSize = 'sm' | 'md' | (string & {});
type BaseProps = {
    /** Visual weight. Defaults to "soft". */
    variant?: BadgeVariant;
    /** Color tone. Defaults to "subtle". */
    tone?: BadgeTone;
    /** Component size. Defaults to "sm". */
    size?: BadgeSize;
    /** Optional leading adornment (icon, dot, avatar). */
    leading?: React.ReactNode;
    /** Optional trailing adornment (icon, counter, close). */
    trailing?: React.ReactNode;
    /** Additional class names forwarded to the root. */
    className?: string;
    /** Visible label/content (accessible name). */
    children?: React.ReactNode;
};
/** Render as a different element. Defaults to span. */
type BadgeSpanProps = BaseProps & React.ComponentPropsWithoutRef<'span'> & {
    as?: 'span';
};
/** Render as a button element. */
type BadgeButtonProps = BaseProps & React.ComponentPropsWithoutRef<'button'> & {
    as: 'button';
};
/** Render as a link element. */
type BadgeAnchorProps = BaseProps & React.ComponentPropsWithoutRef<'a'> & {
    as: 'a';
};
/** Discriminated union of supported render targets (defaults to <span>). */
type BadgeProps = BadgeSpanProps | BadgeButtonProps | BadgeAnchorProps;
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLElement>>;
export default Badge;
//# sourceMappingURL=badge.d.ts.map