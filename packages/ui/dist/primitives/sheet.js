import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button } from './button.js';
export function Sheet({ open, onOpenChange, side = 'right', title, closeLabel = 'Close', children, className, }) {
    React.useEffect(() => {
        if (!open || typeof document === 'undefined')
            return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape')
                onOpenChange?.(false);
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onOpenChange]);
    if (!open)
        return null;
    return (_jsxs("div", { "data-ui": "sheet", "data-side": side, className: className, role: "presentation", children: [_jsx("button", { type: "button", "data-slot": "sheet-backdrop", "aria-label": closeLabel, onClick: () => onOpenChange?.(false) }), _jsxs("section", { "data-slot": "sheet-panel", role: "dialog", "aria-modal": "true", "aria-label": typeof title === 'string' ? title : undefined, children: [_jsxs("div", { "data-slot": "sheet-header", children: [title ? _jsx("h2", { "data-slot": "sheet-title", children: title }) : _jsx("span", {}), _jsx(Button, { type: "button", "data-slot": "sheet-close", variant: "ghost", density: "snug", onClick: () => onOpenChange?.(false), "aria-label": closeLabel, children: "\u00D7" })] }), _jsx("div", { "data-slot": "sheet-body", children: children })] })] }));
}
export default Sheet;
//# sourceMappingURL=sheet.js.map