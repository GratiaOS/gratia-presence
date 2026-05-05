/**
 * Garden UI — Field primitive (headless)
 * -------------------------------------
 * Whisper: "clarity first; comfort follows." 🌬️
 *
 * Purpose
 *   • A tiny accessibility wrapper that wires one control to its label & helper text.
 *   • Headless by design — visuals live in the skin (styles/field.css) via data‑attrs.
 *
 * Data API (for skins)
 *   • [data-ui="field"]                — root wrapper
 *   • [data-state="valid|invalid"]     — validation state
 *   • [data-disabled] on root when `disabled` is true
 *   • [data-tone="subtle|accent|positive|warning|danger"] — hint for skins
 *   • [data-part="label|control|error|description|hint|optional"]
 *   • [data-required] on label when `required` is true (skins style this calmly)
 *
 * A11y decisions
 *   • IDs: stable `controlId` from (prop.id || child.id || useId()).
 *   • `aria-describedby`: merges description + hint + error ids.
 *   • Errors: `role="alert"` only on the error node — no wrapper `aria-live` to avoid double reads.
 *   • Disabled: sets `aria-disabled` on the control and `data-disabled` on the wrapper.
 *   • Required: sets `aria-required` on control; we avoid noisy "(Optional)" by default.
 *
 * Children API
 *   • Element:  <Field><input /></Field> — cloned with merged aria/id props.
 *   • Render fn: <Field>{(a) => <input {...a} />}</Field> — you render; we pass wiring.
 *
 * Dev notes / next
 *   • Docs: add README/Storybook examples (Basic, WithHint, WithError, RenderProp, Required).
 *   • Tests: describedby merge; required wiring; error flips data-state + aria-invalid; cloning preserves aria props.
 *   • DX: warn in dev when `children` is neither a function nor a valid element (implemented below).
 *   • Optional UX: default keeps "Optional" hidden; style required via label[data-required].
 */
import * as React from 'react';
export type Tone = 'accent' | 'positive' | 'warning' | 'danger' | 'subtle';
export type State = 'valid' | 'invalid';
type FieldRenderProps = {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: true;
    'aria-required'?: true;
    'aria-disabled'?: true;
    /** Convenience: many HTML controls accept `disabled`; renderers can spread it. */
    disabled?: true;
};
type FieldChild = React.ReactNode | ((control: FieldRenderProps) => React.ReactNode);
export interface FieldProps {
    /** Provide a stable id to wire label + messages. Defaults to an auto-generated id. */
    id?: string;
    /** Primary label rendered inside a <label>. */
    label?: React.ReactNode;
    /** Optional helper text shown beneath the control. */
    description?: React.ReactNode;
    /** Additional hint text (legacy alias for description). */
    hint?: React.ReactNode;
    /** Error message. When present the field is marked invalid. */
    error?: React.ReactNode;
    /** Mark control as required. Also sets aria-required. */
    required?: boolean;
    /** Custom copy for optional indicator (e.g. "Optional"). Set to null to hide. */
    optionalText?: React.ReactNode;
    /** Tone for styling hooks. */
    tone?: Tone;
    /** Rendered control element or render function receiving aria wiring. */
    children: FieldChild;
    /** Additional props spread onto the outer label. */
    labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
    /** Optional class names applied to the outer wrapper. */
    className?: string;
    /** Disable the control and mark the field inert. Applies `data-disabled` on root. */
    disabled?: boolean;
    /** Extra ids to merge into `aria-describedby` (string or array). */
    extraDescribedBy?: string | string[];
    /** Hide the visual label while keeping it for screen readers (adds `sr-only`). */
    labelVisuallyHidden?: boolean;
}
/**
 * Field
 *
 * A lightweight accessibility wrapper that wires a label, helper messages, and
 * error state to a single form control.
 *
 * ### ID strategy
 * - Generates a stable id with `React.useId()`.
 * - If the child element already provides an `id`, that wins.
 * - You can also pass an explicit `id` prop to override both.
 *
 * The resolved control id is used to derive `-description`, `-hint`, and `-error`
 * ids which are merged into `aria-describedby` as needed.
 *
 * ### Children API
 * - **Element**: `<Field><input /></Field>` — The element is cloned and receives
 *   merged `id`, `aria-describedby`, `aria-invalid`, and `aria-required`.
 * - **Render function**: `<Field>{(aria) => <input {...aria} />}</Field>` — You render
 *   the control yourself with the provided ARIA wiring (`id`, `aria-describedby`, etc.).
 *
 * ### Data attributes for skins
 * - `data-ui="field"`, `data-state`, `data-tone`, and `data-part` markers on internal nodes.
 *
 * ### A11y rationale
 * - Error messages use `role="alert"` for assertive announcements.
 * - Wrapper does NOT set `aria-live` to avoid duplicate SR reads.
 */
export declare const Field: React.ForwardRefExoticComponent<FieldProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=field.d.ts.map