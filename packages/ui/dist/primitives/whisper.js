import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Garden UI — Whisper primitive (headless)
 * ---------------------------------------
 * Whisper: "gentle cues keep motion kind." 🌬️
 *
 * Purpose
 *   • Surface soft guidance copy without stealing layout focus.
 *   • Provide a micro pulse when the message changes so humans notice calmly.
 *
 * Data API
 *   • [data-ui="whisper"] — root element for skins.
 *   • [data-tone="intimate|collaborative|presence|…"] — drives color and typography.
 *   • [data-pulsing="true"] — short-lived flag to animate tone shifts.
 *
 * A11y
 *   • Renders a neutral <div>; copy should remain descriptive (no buttons hidden inside).
 *   • Pulse uses non-blocking CSS animation and never toggles aria-live regions.
 *
 * Theming
 *   • Skins read tone + pulsing to set color, glow, and micro motion.
 *
 * Notes
 *   • Keep pulses short (<300ms) so it feels like a breath, not a notification.
 *   • Export stays headless — visuals live in styles/whisper.css.
 */
import * as React from 'react';
/**
 * Whisper — soft text cue with micro pulse when content shifts.
 */
export const Whisper = React.forwardRef(function Whisper({ text, children, tone = 'intimate', pulseOnChange = true, className, onChange }, ref) {
    const content = children ?? text;
    const [pulsing, setPulsing] = React.useState(false);
    const lastContent = React.useRef(content);
    React.useEffect(() => {
        if (content === lastContent.current)
            return;
        lastContent.current = content;
        onChange?.();
        if (!pulseOnChange)
            return;
        setPulsing(true);
        const id = window.setTimeout(() => setPulsing(false), 260);
        return () => window.clearTimeout(id);
    }, [content, pulseOnChange, onChange]);
    return (_jsx("div", { ref: ref, "data-ui": "whisper", "data-tone": tone, "data-pulsing": pulsing ? 'true' : undefined, className: className, children: content }));
});
Whisper.displayName = 'Whisper';
//# sourceMappingURL=whisper.js.map