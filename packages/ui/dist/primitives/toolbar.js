import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Garden UI — Toolbar primitive (headless)
 * ---------------------------------------
 * Whisper: "tools should feel near, not loud." 🌬️
 *
 * Purpose
 *  • Structural container for icon/text controls (filters, view toggles, etc.).
 *  • Headless: visuals live in `styles/toolbar.css`; this file emits structure + data-attrs.
 *  • Works with <Button>, <Select>, and other Garden primitives inside.
 *
 * Data API
 *  • [data-ui="toolbar"]                      — root
 *  • [data-orientation="horizontal|vertical"] — layout hint; default: "horizontal"
 *  • [data-density="cozy|snug"]               — vertical padding; default: "cozy"
 *  • [data-part="group"]                      — optional sub-group wrapper
 *
 * A11y
 *  • Renders role="toolbar" on the root.
 *  • Pass `aria-label` or `aria-labelledby` so screen readers know what this toolbar does.
 *
 * Theming
 *  • Skin reads Garden tokens only (no hard-coded colors) in `styles/toolbar.css`.
 *  • Typical pattern: place ghost/subtle Buttons inside so toolbar feels calm by default.
 */
import * as React from 'react';
/**
 * Root toolbar container.
 *
 * Example:
 *  <Toolbar aria-label="Presence view tools">
 *    <ToolbarGroup>
 *      <Button variant="ghost" tone="default">Today</Button>
 *      <Button variant="ghost" tone="default">Week</Button>
 *    </ToolbarGroup>
 *    <ToolbarGroup>
 *      <Select>...</Select>
 *    </ToolbarGroup>
 *  </Toolbar>
 */
export const Toolbar = React.forwardRef(function Toolbar({ orientation = 'horizontal', density = 'cozy', className, role, ...rest }, ref) {
    const dataAttrs = {
        'data-ui': 'toolbar',
        'data-orientation': orientation,
        'data-density': density,
    };
    return (_jsx("div", { ...rest, ...dataAttrs, ref: ref, role: role ?? 'toolbar', className: className }));
});
/**
 * Optional group wrapper for logically related controls inside a toolbar.
 *
 *  <Toolbar>
 *    <ToolbarGroup>primary controls…</ToolbarGroup>
 *    <ToolbarGroup>secondary controls…</ToolbarGroup>
 *  </Toolbar>
 */
export const ToolbarGroup = React.forwardRef(function ToolbarGroup({ className, ...rest }, ref) {
    return (_jsx("div", { ...rest, ref: ref, "data-part": "group", className: className }));
});
Toolbar.displayName = 'Toolbar';
ToolbarGroup.displayName = 'ToolbarGroup';
//# sourceMappingURL=toolbar.js.map