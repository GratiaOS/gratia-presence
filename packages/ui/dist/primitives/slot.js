import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
export const Slot = React.forwardRef(function Slot({ children, ...rest }, ref) {
    if (React.isValidElement(children)) {
        return React.cloneElement(children, { ref, ...rest });
    }
    return _jsx("span", { ref: ref, ...rest, children: children });
});
//# sourceMappingURL=slot.js.map