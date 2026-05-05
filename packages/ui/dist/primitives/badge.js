import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/** Compose visual slots and hide icons from assistive tech (text is the name). */
function renderContent(leading, trailing, children) {
    return (_jsxs(_Fragment, { children: [leading ? (
            // Presentational — hidden from AT since the text already conveys the label
            _jsx("span", { "aria-hidden": "true", "data-slot": "icon leading", children: leading })) : null, children, trailing ? (_jsx("span", { "aria-hidden": "true", "data-slot": "icon trailing", children: trailing })) : null] }));
}
export const Badge = React.forwardRef((props, ref) => {
    if (props.as === 'button') {
        const { as, variant = 'soft', tone = 'subtle', size = 'sm', leading, trailing, className, type, children, ...rest } = props;
        return (_jsx("button", { ref: ref, "data-ui": "badge", "data-variant": variant, "data-tone": tone, "data-size": size, className: className, type: type ?? 'button', ...rest, children: renderContent(leading, trailing, children) }));
    }
    if (props.as === 'a') {
        const { as, variant = 'soft', tone = 'subtle', size = 'sm', leading, trailing, className, children, ...rest } = props;
        return (_jsx("a", { ref: ref, "data-ui": "badge", "data-variant": variant, "data-tone": tone, "data-size": size, className: className, ...rest, children: renderContent(leading, trailing, children) }));
    }
    const { as, variant = 'soft', tone = 'subtle', size = 'sm', leading, trailing, className, children, ...rest } = props;
    return (_jsx("span", { ref: ref, "data-ui": "badge", "data-variant": variant, "data-tone": tone, "data-size": size, className: className, ...rest, children: renderContent(leading, trailing, children) }));
});
Badge.displayName = 'Badge';
export default Badge;
//# sourceMappingURL=badge.js.map