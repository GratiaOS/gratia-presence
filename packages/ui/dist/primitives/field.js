import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const defaultOptionalText = null; // default: do not show optional text; mark required via CSS using [data-required]
// Join non-empty id parts into a single space-separated string for aria-describedby.
function joinIds(...parts) {
    return parts.filter(Boolean).join(' ') || undefined;
}
function normalizeIds(ids) {
    if (!ids)
        return undefined;
    return Array.isArray(ids) ? ids.filter(Boolean).join(' ') || undefined : ids || undefined;
}
// Narrow unknown to a string (safely) when reading potential child props.
function toString(value) {
    return typeof value === 'string' ? value : undefined;
}
function hasAriaLabel(props) {
    if (!props)
        return false;
    const a = props['aria-label'];
    const b = props['aria-labelledby'];
    return (typeof a === 'string' && a.trim().length > 0) || (typeof b === 'string' && b.trim().length > 0);
}
// Detect dev mode without importing Node types (works in browser ESM).
function isDevEnvironment() {
    const globalProcess = globalThis.process;
    const env = globalProcess && typeof globalProcess === 'object' ? globalProcess.env : undefined;
    const mode = env && typeof env === 'object' && 'NODE_ENV' in env ? env.NODE_ENV : undefined;
    return mode !== 'production';
}
// Tiny class join helper (no runtime deps).
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
export const Field = React.forwardRef(function Field({ id: idProp, label, description, hint, error, required, optionalText = defaultOptionalText, tone, children, labelProps, className, disabled, extraDescribedBy, labelVisuallyHidden, }, ref) {
    const generatedId = React.useId();
    const childElement = React.isValidElement(children) ? children : null;
    const childProps = childElement?.props ?? {};
    const childId = toString(childProps.id);
    const controlId = idProp ?? childId ?? generatedId;
    const descriptionId = description ? `${controlId}-description` : undefined;
    const hintId = hint ? `${controlId}-hint` : undefined;
    const errorId = error ? `${controlId}-error` : undefined;
    const computedTone = tone ?? (error ? 'danger' : 'subtle');
    const controlRenderProps = {
        id: controlId,
        'aria-describedby': joinIds(descriptionId, hintId, errorId, normalizeIds(extraDescribedBy)),
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
        'aria-disabled': disabled ? true : undefined,
        disabled: disabled ? true : undefined,
    };
    let control;
    if (isDevEnvironment()) {
        const isFn = typeof children === 'function';
        const isElement = !!childElement;
        if (!isFn && !isElement) {
            // Intentionally gentle — helps catch misuse without throwing.
            // eslint-disable-next-line no-console
            console.warn('[Field] `children` should be a React element or a render function. Received:', children);
        }
        const hasLabelNode = !!label;
        const hasChildName = hasAriaLabel(childProps);
        if (!hasLabelNode && !hasChildName) {
            // eslint-disable-next-line no-console
            console.warn('[Field] Accessible name missing: provide `label` or give the control `aria-label`/`aria-labelledby`.');
        }
    }
    if (typeof children === 'function') {
        control = children(controlRenderProps);
    }
    else if (childElement) {
        const mergedDescribedBy = joinIds(toString(childProps['aria-describedby']), descriptionId, hintId, errorId, normalizeIds(extraDescribedBy));
        control = React.cloneElement(childElement, {
            id: childProps.id ?? controlId,
            'aria-describedby': mergedDescribedBy,
            'aria-invalid': childProps['aria-invalid'] ?? (error ? true : undefined),
            'aria-required': childProps['aria-required'] ?? (required ? true : undefined),
            'aria-disabled': childProps['aria-disabled'] ?? (disabled ? true : undefined),
            // @ts-ignore: not all elements accept `disabled`, that's OK — consumers control the tag.
            disabled: childProps.disabled ?? (disabled ? true : undefined),
        });
    }
    else {
        control = children;
    }
    const state = error ? 'invalid' : 'valid';
    const { className: labelClassName, ...restLabelProps } = labelProps ?? {};
    const optionalIndicator = !required && optionalText != null ? (_jsx("span", { "data-part": "optional", "aria-hidden": "true", children: optionalText })) : null;
    return (_jsxs("div", { ref: ref, "data-ui": "field", "data-state": state, "data-tone": computedTone, "data-disabled": disabled ? '' : undefined, className: className, children: [label ? (_jsxs("label", { htmlFor: controlId, "data-part": "label", "data-required": required ? '' : undefined, className: labelVisuallyHidden ? [labelClassName, 'sr-only'].filter(Boolean).join(' ') : labelClassName, ...restLabelProps, children: [_jsx("span", { children: label }), optionalIndicator] })) : null, _jsx("div", { "data-part": "control", children: control }), error ? (
            // a11y: We use role="alert" on the error message for assertive announcement and
            // do not set aria-live on the wrapper to avoid duplicate reads by screen readers.
            _jsx("div", { id: errorId, "data-part": "error", role: "alert", children: error })) : null, description ? (_jsx("div", { id: descriptionId, "data-part": "description", children: description })) : null, hint ? (_jsx("div", { id: hintId, "data-part": "hint", children: hint })) : null] }));
});
Field.displayName = 'Field';
//# sourceMappingURL=field.js.map