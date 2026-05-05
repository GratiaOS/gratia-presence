import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Garden UI — Constellation primitive (headless)
 * ---------------------------------------------
 * Whisper: "quiet company overhead." 🌬️
 *
 * Purpose
 *  • Minimal belonging indicator — signals presence context without interaction.
 *
 * Data API
 *  • [data-ui="constellation"] — root wrapper hook.
 *
 * Notes
 *  • Static dots; peers are abstract and not tied to live presence counts.
 */
export const Constellation = () => {
    return (_jsxs("div", { "data-ui": "constellation", "aria-hidden": "true", children: [_jsx("span", { className: "dot" }), _jsx("span", { className: "dot" }), _jsx("span", { className: "dot active" }), _jsx("span", { className: "dot" }), _jsx("span", { className: "dot" })] }));
};
//# sourceMappingURL=Constellation.js.map