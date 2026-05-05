'use client';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
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
export function useMissingScrew(options = {}) {
    const { id, nudgeTransform = 'translateY(2px)', respectReducedMotion = true, liveRegionId, onFound, transition = 'transform 120ms' } = options;
    const reactId = useId();
    const tipId = useMemo(() => id ?? `ms-tip-${reactId}`, [id, reactId]);
    const [found, setFound] = useState(false);
    const [reduced, setReduced] = useState(false);
    // Track prefers-reduced-motion (SSR safe)
    useEffect(() => {
        if (!respectReducedMotion)
            return;
        if (typeof window === 'undefined' || !('matchMedia' in window))
            return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener?.('change', update);
        return () => mq.removeEventListener?.('change', update);
    }, [respectReducedMotion]);
    const announce = useCallback((msg) => {
        if (!liveRegionId)
            return;
        if (typeof document === 'undefined')
            return;
        const el = document.getElementById(liveRegionId);
        if (!el)
            return;
        // flush then set to ensure AT picks it up
        el.textContent = '';
        // next tick to re-announce even same message
        setTimeout(() => (el.textContent = msg), 0);
    }, [liveRegionId]);
    const handleClick = useCallback(() => {
        if (found)
            return;
        setFound(true);
        announce('Shortcut revealed');
        onFound?.();
    }, [announce, found, onFound]);
    // Provide headless props for the clickable/nudged target
    const styleWhenNudged = {
        transform: nudgeTransform,
        transition: reduced ? undefined : transition,
    };
    const styleWhenFound = {
        transform: 'none',
        transition: reduced ? undefined : transition,
    };
    const targetProps = useMemo(() => ({
        onClick: handleClick,
        style: found ? styleWhenFound : styleWhenNudged,
    }), [found, handleClick, styleWhenFound, styleWhenNudged]);
    return {
        /** whether the user discovered the screw (nudge cleared) */
        found,
        /** props to spread on the misaligned target element (e.g., a Button) */
        targetProps,
        /** id you can assign to the revealed tip and bind with aria-describedby */
        tipId,
    };
}
export default useMissingScrew;
//# sourceMappingURL=useMissingScrew.js.map