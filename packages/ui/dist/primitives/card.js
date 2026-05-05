import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
const _Card = React.forwardRef(({ as, variant = 'elev', padding = 'md', className, children, ...rest }, ref) => {
    const Comp = (as || 'div'); // polymorphic root
    return (_jsx(Comp, { ref: ref, "data-ui": "card", "data-variant": variant, "data-padding": padding, className: className, ...rest, children: children }));
});
// Set displayName on the uncast component (avoids TS2339 after casting)
_Card.displayName = 'Card';
// Now cast to the polymorphic callable signature and export
export const Card = _Card;
//# sourceMappingURL=card.js.map