import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { ENERGY_BANDS, ENERGY_ORDER } from '@gratiaos/energy-core';
import { Sheet } from '../primitives/sheet.js';
import { Whisper } from '../primitives/whisper.js';
const DEFAULT_LEVELS = {
    crown: 0.92,
    dragon: 0.7,
    play: 0.46,
    life: 0.26,
    void: 0.1,
};
const DEFAULT_COPY = {
    ariaLabel: 'Energy management',
    marksLabel: 'Silent energy marks',
    markSilently: (label) => `Mark ${label} silently`,
    startRitual: (title) => `Start ${title}`,
    changeBand: 'Change energy band',
    ritualCta: '30s',
    bands: {
        crown: { label: 'Crown (E4)', shortLabel: 'Crown' },
        dragon: { label: 'Dragon (E3)', shortLabel: 'Dragon' },
        play: { label: 'Play (E2)', shortLabel: 'Play' },
        life: { label: 'Life Force (E1)', shortLabel: 'Life' },
        void: { label: 'Void (E0)', shortLabel: 'Void' },
    },
};
export function EnergyHeader({ state, prediction, copy = DEFAULT_COPY, pulseOnChange = true, className, onMark, onStartRitual, }) {
    const ritual = prediction.exit.ritual;
    const urgent = prediction.exit.urgency === 'now';
    const whisper = urgent ? ritual.whisper : `${ritual.title}. ${ritual.whisper}`;
    const current = copy.bands[state.currentBand];
    return (_jsxs("section", { "data-ui": "energy-header", "data-energy-band": state.currentBand, "data-exit-urgency": prediction.exit.urgency, className: className, "aria-label": copy.ariaLabel, children: [_jsxs("div", { "data-slot": "energy-current", children: [_jsx("span", { "data-slot": "energy-code", children: ENERGY_BANDS[state.currentBand].code }), _jsx("span", { "data-slot": "energy-label", children: current.shortLabel }), _jsxs("span", { "data-slot": "energy-level", children: [Math.round(state.currentLevel * 100), "%"] })] }), _jsxs("details", { "data-slot": "energy-marker", children: [_jsx("summary", { "aria-label": copy.changeBand, children: _jsx("span", { children: ENERGY_BANDS[state.currentBand].code }) }), _jsx("div", { "data-slot": "energy-marks", "aria-label": copy.marksLabel, children: ENERGY_ORDER.map((band) => {
                            const active = band === state.currentBand;
                            const definition = copy.bands[band];
                            return (_jsxs("button", { type: "button", "data-energy-choice": band, "data-active": active ? 'true' : undefined, onClick: (event) => {
                                    onMark?.(band, DEFAULT_LEVELS[band]);
                                    event.currentTarget.closest('details')?.removeAttribute('open');
                                }, "aria-pressed": active, "aria-label": copy.markSilently(definition.label), children: [_jsx("span", { children: ENERGY_BANDS[band].code }), _jsx("span", { children: definition.shortLabel })] }, band));
                        }) })] }), _jsx("div", { "data-slot": "energy-actions", children: _jsx("button", { type: "button", "data-slot": "energy-ritual", onClick: onStartRitual, "aria-label": copy.startRitual(ritual.title), children: copy.ritualCta }) }), _jsx(Whisper, { tone: urgent ? 'presence' : 'collaborative', pulseOnChange: pulseOnChange, text: whisper, className: "energy-header-whisper" })] }));
}
export function EnergyCapsule({ state, prediction, copy = DEFAULT_COPY, pulseOnChange = true, className, onMark, onStartRitual, sheetTitle, closeLabel = 'Close', }) {
    const [open, setOpen] = React.useState(false);
    const current = copy.bands[state.currentBand];
    const ritual = prediction.exit.ritual;
    const urgent = prediction.exit.urgency === 'now';
    return (_jsxs(_Fragment, { children: [_jsxs("button", { type: "button", "data-ui": "energy-capsule", "data-energy-band": state.currentBand, "data-exit-urgency": prediction.exit.urgency, className: className, onClick: () => setOpen(true), "aria-label": copy.changeBand, children: [_jsx("span", { "data-slot": "energy-code", children: ENERGY_BANDS[state.currentBand].code }), _jsx("span", { "data-slot": "energy-label", children: current.shortLabel }), _jsxs("span", { "data-slot": "energy-level", children: [Math.round(state.currentLevel * 100), "%"] })] }), _jsx(Sheet, { open: open, onOpenChange: setOpen, side: "bottom", title: sheetTitle ?? copy.ariaLabel, closeLabel: closeLabel, children: _jsxs("div", { "data-ui": "energy-sheet", "data-energy-band": state.currentBand, "data-exit-urgency": prediction.exit.urgency, children: [_jsxs("div", { "data-slot": "energy-sheet-current", children: [_jsx("span", { "data-slot": "energy-code", children: ENERGY_BANDS[state.currentBand].code }), _jsx("span", { children: current.label }), _jsxs("span", { "data-slot": "energy-level", children: [Math.round(state.currentLevel * 100), "%"] })] }), _jsx("div", { "data-slot": "energy-sheet-marks", "aria-label": copy.marksLabel, children: ENERGY_ORDER.map((band) => {
                                const active = band === state.currentBand;
                                const definition = copy.bands[band];
                                return (_jsxs("button", { type: "button", "data-energy-choice": band, "data-active": active ? 'true' : undefined, onClick: () => {
                                        onMark?.(band, DEFAULT_LEVELS[band]);
                                        setOpen(false);
                                    }, "aria-pressed": active, "aria-label": copy.markSilently(definition.label), children: [_jsx("span", { children: ENERGY_BANDS[band].code }), _jsx("span", { children: definition.shortLabel })] }, band));
                            }) }), _jsx("button", { type: "button", "data-slot": "energy-sheet-ritual", onClick: () => {
                                setOpen(false);
                                onStartRitual?.();
                            }, "aria-label": copy.startRitual(ritual.title), children: copy.ritualCta }), _jsx(Whisper, { tone: urgent ? 'presence' : 'collaborative', pulseOnChange: pulseOnChange, text: urgent ? ritual.whisper : `${ritual.title}. ${ritual.whisper}` })] }) })] }));
}
export default EnergyHeader;
//# sourceMappingURL=EnergyHeader.js.map