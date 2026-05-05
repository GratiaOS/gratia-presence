type UseMissingScrewOptions = {
    /** Optional stable ID used to bind aria-describedby to your tip element */
    id?: string;
    /** Transform nudged state; keep it tiny so it’s playful and not disruptive */
    nudgeTransform?: string;
    /** Respect prefers-reduced-motion for transitions (recommended) */
    respectReducedMotion?: boolean;
    /** Live region element ID; if provided, we’ll politely announce on discovery */
    liveRegionId?: string;
    /** Callback when screw is found */
    onFound?: () => void;
    /** Transition CSS value for the wink */
    transition?: string;
};
/**
 * Headless helper for a playful “Missing Screw” interaction.
 *
 * Pattern:
 * - Start with a tiny visual nudge (e.g., translateY(2px))
 * - When the user clicks, remove the nudge and reveal a tip/shortcut
 * - Optionally announce via an existing live region
 *
 * Usage:
 * const { found, targetProps, tipId } = useMissingScrew({ liveRegionId: 'garden-live' });
 * <Button {...targetProps} aria-describedby={found ? tipId : undefined}>Save</Button>
 * {found && <div id={tipId}>Pro-tip: Press ⌘S to quick-save. 🌿</div>}
 */
export declare function useMissingScrew(options?: UseMissingScrewOptions): {
    /** whether the user discovered the screw (nudge cleared) */
    found: boolean;
    /** props to spread on the misaligned target element (e.g., a Button) */
    targetProps: {
        onClick: () => void;
        style: import("react").CSSProperties;
    };
    /** id you can assign to the revealed tip and bind with aria-describedby */
    tipId: string;
};
export default useMissingScrew;
//# sourceMappingURL=useMissingScrew.d.ts.map