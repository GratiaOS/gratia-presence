import * as React from 'react';
/**
 * Garden UI — Button primitive (headless)
 * ---------------------------------------
 * Whisper: "action should feel grounded, never frantic." 🌬️
 *
 * Purpose
 *  • Accessible trigger for primary/secondary actions.
 *  • Headless: visuals live in styles/button.css; this file emits structure + data-attrs.
 *
 * Data API
 *  • [data-ui="button"] root
 *  • [data-variant="solid|outline|ghost|subtle"] [data-tone] [data-density]
 *  • [data-state="idle|loading|disabled"]
 *  • [data-loading-mode="inline|blocking"] (when loading)
 *  • [data-slot="icon leading|label|icon trailing|spinner|overlay"] parts for skins
 *
 * A11y
 *  • Native <button> covers keyboard/role by default.
 *  • When `asChild` renders a <span>, we emulate button behavior:
 *    role="button", tabIndex, Space/Enter→click and respect disabled/loading.
 *  • Spinner/overlay are presentational and marked `aria-hidden`.
 *
 * Theming
 *  • Skin reads tokens: --color-*, --radius-*, --shadow-*.
 *
 * Notes
 *  • “blocking” overlays the content for long ops; avoid overuse.
 */
/** Visual tone (mapped by the skin). */
export type ButtonTone = 'default' | 'accent' | 'positive' | 'warning' | 'danger';
/** Visual weight (see skin for rendering). */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'subtle';
/** Vertical density (compact vs roomy). */
export type ButtonDensity = 'cozy' | 'snug';
/** Loading presentation. */
export type ButtonLoadingMode = 'inline' | 'blocking';
type ButtonOwnProps = {
    /** Render as a span that mimics a button (role/keys). Defaults to false. */
    asChild?: boolean;
    /** Color tone. Defaults to "default". */
    tone?: ButtonTone;
    /** Visual weight. Defaults to "solid". */
    variant?: ButtonVariant;
    /** Vertical density. Defaults to "cozy". */
    density?: ButtonDensity;
    /** Show progress affordance. */
    loading?: boolean;
    /** Loading presentation: "inline" (default) or "blocking". */
    loadingMode?: ButtonLoadingMode;
    /** Optional leading adornment (icon). */
    leadingIcon?: React.ReactNode;
    /** Optional trailing adornment (icon). */
    trailingIcon?: React.ReactNode;
};
/** Public props for Button (native button attrs + headless options). */
export type ButtonProps = ButtonOwnProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
export declare const Button: React.ForwardRefExoticComponent<ButtonOwnProps & React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export default Button;
//# sourceMappingURL=button.d.ts.map