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
export type ToolbarOrientation = 'horizontal' | 'vertical';
export type ToolbarDensity = 'cozy' | 'snug';
export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Layout direction; horizontal by default. */
    orientation?: ToolbarOrientation;
    /** Vertical density; "cozy" = default, "snug" = tighter. */
    density?: ToolbarDensity;
}
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
export declare const Toolbar: React.ForwardRefExoticComponent<ToolbarProps & React.RefAttributes<HTMLDivElement>>;
export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
}
/**
 * Optional group wrapper for logically related controls inside a toolbar.
 *
 *  <Toolbar>
 *    <ToolbarGroup>primary controls…</ToolbarGroup>
 *    <ToolbarGroup>secondary controls…</ToolbarGroup>
 *  </Toolbar>
 */
export declare const ToolbarGroup: React.ForwardRefExoticComponent<ToolbarGroupProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=toolbar.d.ts.map