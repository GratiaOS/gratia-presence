import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button } from '../primitives/button.js';
import { Card } from '../primitives/card.js';
import { Whisper } from '../primitives/whisper.js';
const DEFAULT_COPY = {
    secondsRemaining: (seconds) => `${seconds} seconds remaining`,
    close: 'Close',
};
export function TransitionGate({ ritual, open, onClose, copy = DEFAULT_COPY, autoStart = true, className, }) {
    const [remaining, setRemaining] = React.useState(ritual.durationSeconds);
    React.useEffect(() => {
        if (!open) {
            setRemaining(ritual.durationSeconds);
            return;
        }
        if (!autoStart)
            return;
        setRemaining(ritual.durationSeconds);
        const id = window.setInterval(() => {
            setRemaining((current) => {
                if (current <= 1) {
                    window.clearInterval(id);
                    onClose();
                    return 0;
                }
                return current - 1;
            });
        }, 1000);
        return () => window.clearInterval(id);
    }, [autoStart, onClose, open, ritual.durationSeconds]);
    if (!open)
        return null;
    return (_jsx("div", { "data-ui": "transition-gate", className: className, role: "dialog", "aria-modal": "true", children: _jsxs(Card, { as: "section", variant: "elev", padding: "lg", "data-slot": "gate-panel", children: [_jsxs("div", { "data-slot": "gate-topbar", children: [_jsx("div", { "data-slot": "gate-timer", "aria-label": copy.secondsRemaining(remaining), children: remaining }), _jsx(Button, { type: "button", variant: "ghost", tone: "default", density: "snug", onClick: onClose, children: copy.close })] }), _jsx("h2", { children: ritual.title }), _jsx(Whisper, { tone: "presence", pulseOnChange: true, text: ritual.whisper }), _jsx("ol", { children: ritual.steps.map((step) => (_jsx("li", { children: step }, step))) })] }) }));
}
export default TransitionGate;
//# sourceMappingURL=TransitionGate.js.map