import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
export const Button = React.forwardRef(({ asChild, tone = 'default', variant = 'solid', density = 'cozy', loading = false, loadingMode = 'inline', leadingIcon, trailingIcon, children, type, disabled, onClick, onKeyDown, ...rest }, ref) => {
    const dataAttrs = {
        'data-ui': 'button',
        'data-tone': tone,
        'data-variant': variant,
        'data-density': density,
        'data-state': loading ? 'loading' : disabled ? 'disabled' : 'idle',
        'data-loading-mode': loading ? loadingMode : undefined,
    };
    const content = (_jsxs(_Fragment, { children: [leadingIcon ? (_jsx("span", { "data-slot": "icon leading", "aria-hidden": "true", children: leadingIcon })) : null, children != null ? _jsx("span", { "data-slot": "label", children: children }) : null, trailingIcon ? (_jsx("span", { "data-slot": "icon trailing", "aria-hidden": "true", children: trailingIcon })) : null, loading && loadingMode === 'inline' ? _jsx("span", { "data-slot": "spinner", "aria-hidden": "true" }) : null, loading && loadingMode === 'blocking' ? (_jsx("span", { "data-slot": "overlay", "aria-hidden": "true", children: _jsx("span", { "data-slot": "spinner" }) })) : null] }));
    if (asChild) {
        const handleClick = (e) => {
            if (disabled || loading) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            onClick?.(e);
        };
        const handleKeyDown = (e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented)
                return;
            if (disabled || loading)
                return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.currentTarget.click();
            }
        };
        return (_jsx("span", { ref: ref, role: "button", "aria-busy": loading || undefined, "aria-disabled": disabled || undefined, tabIndex: disabled ? -1 : 0, onClick: handleClick, onKeyDown: handleKeyDown, ...dataAttrs, ...rest, children: content }));
    }
    return (_jsx("button", { ref: ref, type: type ?? 'button', "aria-busy": loading || undefined, disabled: disabled, onClick: onClick, onKeyDown: onKeyDown, ...dataAttrs, ...rest, children: content }));
});
Button.displayName = 'Button';
export default Button;
//# sourceMappingURL=button.js.map