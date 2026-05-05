/**
 * Garden UI — Toast primitive (headless)
 * --------------------------------------
 * Rendering is data-attribute driven; visuals live in styles/toast.css.
 * Emit with `showToast(...)` (CustomEvent), render with `<Toaster/>`.
 *
 * A11y
 *  • Each item is `role="status"` with `aria-atomic="true"` so screen readers
 *    announce the toast as a single unit.
 *  • Items are focusable by default (tabIndex=0). Focus/hover pauses auto‑dismiss;
 *    blur/mouseleave resumes. Keyboard: Enter/Space dismiss (when dismissOnClick),
 *    Escape always dismisses.
 *
 * Theming
 *  • Duration prefers `--dur-toast`; otherwise derives from `--dur-pulse` with a
 *    generous hold. Colors/shape come from tokens: `--elev`, `--text`, `--border`,
 *    and `--color-*` accents.
 *
 *
 * UI data‑states (handled by the primitive)
 *  • Each toast mounts with `data-state="entering"` and clears it on next frame
 *    so CSS can ease in.
 *  • On dismiss, we set `data-state="leaving"` and remove the node after the
 *    tokenized transition (see styles/toast.css).
 *
 * Event API (headless, global)
 *  • showToast("Saved ✓", { variant: "positive" })
 *  • showToast({ key: "sync", title: "Syncing…", variant: "neutral" }) // keyed upsert
 *  • clearToast()                     // remove all
 *  • clearToast("sync")               // remove item(s) with key
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useRef, useState } from 'react';
// Detect dev mode without importing Node types (works in browser ESM).
function isDevEnvironment() {
    const globalProcess = globalThis.process;
    const env = globalProcess && typeof globalProcess === 'object' ? globalProcess.env : undefined;
    const mode = env && typeof env === 'object' && 'NODE_ENV' in env ? env.NODE_ENV : undefined;
    return mode !== 'production';
}
/**
 * Dev helper — `useToasterTest()`
 * --------------------------------
 * Whisper: "debug should feel playful, not noisy." 🌬️
 *
 * Purpose
 *  • Tiny opt‑in hook to exercise the toast stack during development.
 *  • Provides a keyboard hotkey (Alt+T) that cycles demo toasts and Alt+Y to clear.
 *  • Exposes helpers to fire, clear, and run an interval-based "auto" demo.
 *
 * Usage
 *  import { Toaster, useToasterTest } from '@gratiaos/ui';
 *  ...
 *  function DevRoot() {
 *    useToasterTest(); // Alt+T to push a demo toast, Alt+Y to clear
 *    return <Toaster />;
 *  }
 */
export function useToasterTest(opts) {
    const enabled = opts?.enabled ?? isDevEnvironment();
    const intervalMs = Math.max(800, opts?.intervalMs ?? 3200);
    const idxRef = React.useRef(0);
    const autoRef = React.useRef(null);
    const fireDemo = React.useCallback(() => {
        if (typeof window === 'undefined')
            return;
        // A small sequence that shows: neutral → positive → warning → danger,
        // plus a keyed upsert pair ("sync" → "synced").
        const sequence = [
            { message: 'A little breeze — hello there', icon: '🪁', variant: 'neutral' },
            { title: 'Saved', desc: 'Your note is tucked in the timeline.', icon: '🌈', variant: 'positive' },
            { message: 'Heads up — something wobbled', icon: '🪶', variant: 'warning' },
            { key: 'sync', title: 'Syncing…', desc: 'Holding steady', icon: '🪁', variant: 'neutral' },
            { key: 'sync', title: 'Synced', desc: 'All good', icon: '🌈', variant: 'positive' },
            { title: 'Plot twist', desc: 'We rolled back the change.', icon: '🎭', variant: 'danger' },
        ];
        const i = idxRef.current++ % sequence.length;
        showToast(sequence[i]);
    }, []);
    const clearDemo = React.useCallback(() => {
        clearToast();
    }, []);
    const startAuto = React.useCallback(() => {
        if (typeof window === 'undefined')
            return;
        if (autoRef.current != null)
            return; // already running
        autoRef.current = window.setInterval(() => {
            fireDemo();
        }, intervalMs);
    }, [fireDemo, intervalMs]);
    const stopAuto = React.useCallback(() => {
        if (autoRef.current != null) {
            clearInterval(autoRef.current);
            autoRef.current = null;
        }
    }, []);
    React.useEffect(() => {
        if (!enabled || typeof window === 'undefined')
            return;
        const onKey = (e) => {
            // Alt+T → demo toast, Alt+Y → clear
            const key = (e.key || '').toLowerCase();
            if (e.altKey && key === 't') {
                e.preventDefault();
                fireDemo();
            }
            else if (e.altKey && key === 'y') {
                e.preventDefault();
                clearDemo();
            }
        };
        window.addEventListener('keydown', onKey);
        // Friendly console hint (non-fatal if console is blocked)
        try {
            // eslint-disable-next-line no-console
            console.info('[garden/ui] useToasterTest — Alt+T: demo toast · Alt+Y: clear · startAuto()/stopAuto() available');
        }
        catch {
            /* noop */
        }
        return () => {
            window.removeEventListener('keydown', onKey);
            stopAuto();
        };
    }, [enabled, fireDemo, clearDemo, stopAuto]);
    return {
        fireDemo,
        clearDemo,
        startAuto,
        stopAuto,
        get running() {
            return autoRef.current != null;
        },
    };
}
export function showToast(messageOrOpts, opts = {}) {
    try {
        // SSR-safe: silently no-op when window is missing
        if (typeof window === 'undefined')
            return;
        const detail = typeof messageOrOpts === 'string' ? { message: messageOrOpts, ...opts } : messageOrOpts ?? {};
        // Ensure at least one renderable field is present
        if (!detail.message && !detail.title && !detail.desc)
            return;
        window.dispatchEvent(new CustomEvent('garden:toast', { detail }));
    }
    catch {
        /* noop */
    }
}
/** Clear by key or all. */
export function clearToast(key) {
    try {
        if (typeof window === 'undefined')
            return;
        window.dispatchEvent(new CustomEvent('garden:toast:clear', { detail: { key } }));
    }
    catch {
        /* noop */
    }
}
function readToastBaseMs() {
    try {
        const css = getComputedStyle(document.documentElement);
        // 1) Prefer explicit toast duration token if present
        const t = css.getPropertyValue('--dur-toast').trim();
        if (t) {
            if (t.endsWith('ms'))
                return Math.max(1800, parseFloat(t));
            if (t.endsWith('s'))
                return Math.max(1800, parseFloat(t) * 1000);
            const n = parseFloat(t);
            if (Number.isFinite(n))
                return Math.max(1800, n);
        }
        // 2) Fallback: derive from pulse duration with a bigger hold
        const raw = css.getPropertyValue('--dur-pulse').trim();
        if (raw) {
            if (raw.endsWith('ms'))
                return Math.max(3600, parseFloat(raw) * 5);
            if (raw.endsWith('s'))
                return Math.max(3600, parseFloat(raw) * 1000 * 5);
            const n = parseFloat(raw);
            if (Number.isFinite(n))
                return Math.max(3600, n * 5);
        }
        // 3) Final fallback
        return 4200; // a touch longer than before
    }
    catch {
        return 4200;
    }
}
function readTransitionMs() {
    try {
        const css = getComputedStyle(document.documentElement);
        const t = css.getPropertyValue('--duration-snug').trim();
        if (t.endsWith('ms'))
            return Math.max(120, parseFloat(t));
        if (t.endsWith('s'))
            return Math.max(120, parseFloat(t) * 1000);
        const n = parseFloat(t);
        return Number.isFinite(n) ? Math.max(120, n) : 180;
    }
    catch {
        return 180;
    }
}
/**
 * Toaster — headless renderer using data attributes only.
 * Visuals are provided by styles/toast.css.
 */
export const Toaster = ({ position = 'bottom-center', max = 3, dismissOnClick = true, className, renderIcon, focusable = true, }) => {
    const [items, setItems] = useState([]);
    const idRef = useRef(1);
    const baseDuration = useMemo(() => readToastBaseMs(), []);
    const transitionMs = useMemo(() => readTransitionMs(), []);
    const timersRef = useRef(new Map());
    // Stack ref for burst auto-scroll
    const stackRef = useRef(null);
    const hoveringStackRef = useRef(false);
    const pinnedScrollRef = useRef(false); // true when user has scrolled away from the edge
    // Dev visibility for auto-scroll state (pinned|free)
    const [autoscrollPinned, setAutoscrollPinned] = useState(false);
    function atTop(el) {
        return el.scrollTop <= 12;
    }
    function atBottom(el) {
        return el.scrollHeight - el.scrollTop - el.clientHeight <= 12;
    }
    // Dismiss helper that also clears timer state
    const dismiss = (id) => {
        // snapshot callback before state changes
        const target = items.find((t) => t.id === id);
        const onDismissCb = target?.onDismiss;
        // clear timer bookkeeping first
        const info = timersRef.current.get(id);
        if (info?.timeoutId != null)
            clearTimeout(info.timeoutId);
        timersRef.current.delete(id);
        // flag leaving to trigger CSS exit; then hard-remove after tokenized delay
        setItems((prev) => prev.map((t) => (t.id === id ? { ...t, uiState: 'leaving' } : t)));
        window.setTimeout(() => {
            setItems((prev) => prev.filter((t) => t.id !== id));
            try {
                onDismissCb?.();
            }
            catch {
                /* ignore */
            }
        }, Math.max(120, transitionMs));
    };
    // Schedule/clear/pause/resume helpers
    const clearTimer = (id) => {
        const info = timersRef.current.get(id);
        if (info?.timeoutId != null)
            clearTimeout(info.timeoutId);
    };
    const schedule = (id, delay) => {
        clearTimer(id);
        const startedAt = Date.now();
        const timeoutId = window.setTimeout(() => dismiss(id), Math.max(0, delay));
        timersRef.current.set(id, { timeoutId, startedAt, remainingMs: delay });
    };
    const pause = (id) => {
        const info = timersRef.current.get(id);
        if (!info)
            return;
        const elapsed = Date.now() - info.startedAt;
        const remaining = Math.max(0, info.remainingMs - elapsed);
        clearTimer(id);
        timersRef.current.set(id, { timeoutId: null, startedAt: Date.now(), remainingMs: remaining });
    };
    const resume = (id) => {
        const info = timersRef.current.get(id);
        if (!info)
            return;
        const delay = info.remainingMs;
        if (delay <= 0) {
            dismiss(id);
        }
        else {
            schedule(id, delay);
        }
    };
    useEffect(() => {
        function onToast(ev) {
            const ce = ev;
            const d = ce?.detail ?? {};
            const hasContent = Boolean(d.title || d.desc || d.message);
            if (!hasContent)
                return;
            const variant = d.variant ?? 'neutral';
            const durationMs = Number(d.durationMs ?? baseDuration);
            // Upsert by key when provided
            if (d.key) {
                setItems((prev) => {
                    const idx = prev.findIndex((x) => x.key === d.key);
                    if (idx >= 0) {
                        const existing = prev[idx];
                        const updated = {
                            ...existing,
                            variant,
                            durationMs,
                            title: d.title ?? existing.title,
                            desc: d.desc ?? existing.desc,
                            message: d.message ?? existing.message,
                            icon: d.icon ?? existing.icon,
                            onDismiss: d.onDismiss ?? existing.onDismiss,
                            onClick: d.onClick ?? existing.onClick,
                        };
                        const next = [...prev];
                        next[idx] = updated;
                        // reschedule timer for the existing id
                        schedule(existing.id, Math.max(800, durationMs));
                        return next.slice(Math.max(0, next.length - max));
                    }
                    else {
                        const id = idRef.current++;
                        const item = {
                            id,
                            key: d.key,
                            variant,
                            durationMs,
                            title: d.title,
                            desc: d.desc,
                            message: d.message,
                            icon: d.icon,
                            onDismiss: d.onDismiss,
                            onClick: d.onClick,
                            uiState: 'entering',
                        };
                        const next = [...prev, item];
                        // clear entering pose on next frame so CSS can ease to settled state
                        queueMicrotask?.(() => {
                            requestAnimationFrame(() => {
                                setItems((curr) => curr.map((t) => (t.id === id ? { ...t, uiState: undefined } : t)));
                            });
                        });
                        schedule(id, Math.max(800, durationMs));
                        return next.slice(Math.max(0, next.length - max));
                    }
                });
                return;
            }
            // Normal append (no key)
            const id = idRef.current++;
            const item = {
                id,
                variant,
                durationMs,
                title: d.title,
                desc: d.desc,
                message: d.message,
                icon: d.icon,
                onDismiss: d.onDismiss,
                onClick: d.onClick,
                uiState: 'entering',
            };
            setItems((prev) => {
                const next = [...prev, item];
                return next.slice(Math.max(0, next.length - max));
            });
            // clear entering pose on the next frame; then set up auto-dismiss
            queueMicrotask?.(() => {
                requestAnimationFrame(() => {
                    setItems((curr) => curr.map((t) => (t.id === id ? { ...t, uiState: undefined } : t)));
                });
            });
            const hold = Math.max(800, durationMs);
            schedule(id, hold);
        }
        function onClear(ev) {
            const ce = ev;
            const key = ce?.detail?.key;
            const targets = key ? items.filter((it) => it.key === key) : items.slice();
            for (const it of targets) {
                dismiss(it.id);
            }
        }
        window.addEventListener('garden:toast', onToast);
        window.addEventListener('garden:toast:clear', onClear);
        return () => {
            window.removeEventListener('garden:toast', onToast);
            window.removeEventListener('garden:toast:clear', onClear);
            // cleanup all timers on unmount
            for (const info of timersRef.current.values()) {
                if (info.timeoutId != null)
                    clearTimeout(info.timeoutId);
            }
            timersRef.current.clear();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseDuration, max, items, transitionMs]);
    // Auto-scroll the stack to the newest toast on bursts,
    // but only when the user isn't hovering or manually scrolled away.
    useEffect(() => {
        const el = stackRef.current;
        if (!el)
            return;
        const isBottom = position.startsWith('bottom');
        const nearEdge = isBottom ? atBottom(el) : atTop(el);
        // reflect current pin state for dev visibility
        setAutoscrollPinned(hoveringStackRef.current || pinnedScrollRef.current);
        // Only auto-scroll when we're already near the edge to avoid stealing scroll
        if (hoveringStackRef.current || pinnedScrollRef.current || !nearEdge)
            return;
        // Defer until items are laid out
        requestAnimationFrame(() => {
            const node = stackRef.current;
            if (!node)
                return;
            if (isBottom) {
                node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
            }
            else {
                node.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }, [items, position]);
    return (_jsx("div", { "data-ui": "toast", "data-position": position, "aria-live": "polite", className: className, children: _jsx("div", { "data-role": "stack", "data-autoscroll": autoscrollPinned ? 'pinned' : 'free', ref: stackRef, onMouseEnter: () => {
                hoveringStackRef.current = true;
                setAutoscrollPinned(true);
            }, onMouseLeave: () => {
                hoveringStackRef.current = false;
                // reflect whether user has scrolled away from the auto edge
                setAutoscrollPinned(pinnedScrollRef.current);
            }, onScroll: (e) => {
                const el = e.currentTarget;
                const isBottom = position.startsWith('bottom');
                pinnedScrollRef.current = isBottom ? !atBottom(el) : !atTop(el);
                setAutoscrollPinned(pinnedScrollRef.current);
            }, children: items.map((t) => {
                const hasRich = Boolean(t.title || t.desc);
                const renderedIcon = renderIcon
                    ? renderIcon({ variant: t.variant, title: t.title, desc: t.desc, message: t.message, icon: t.icon, key: t.key })
                    : undefined;
                const iconNode = renderedIcon ?? (t.icon ? _jsx("span", { "aria-hidden": true, children: t.icon }) : null);
                const invokeClick = () => {
                    try {
                        t.onClick?.();
                    }
                    catch {
                        /* ignore */
                    }
                    if (dismissOnClick)
                        dismiss(t.id);
                };
                return (_jsxs("div", { role: "status", "aria-atomic": "true", "data-ui": "toast-item", "data-variant": t.variant, "data-state": t.uiState, onClick: t.onClick || dismissOnClick ? invokeClick : undefined, onMouseEnter: () => pause(t.id), onMouseLeave: () => resume(t.id), title: dismissOnClick ? 'Click to dismiss' : undefined, tabIndex: focusable ? 0 : -1, onFocus: () => pause(t.id), onBlur: () => resume(t.id), onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            invokeClick();
                        }
                        else if (e.key === 'Escape') {
                            e.preventDefault();
                            dismiss(t.id);
                        }
                    }, children: [iconNode ? (_jsx("span", { "data-role": "icon", "aria-hidden": true, children: iconNode })) : null, hasRich ? (_jsxs("div", { "data-role": "content", children: [t.title ? _jsx("span", { "data-role": "title", children: t.title }) : null, t.desc ? _jsx("span", { "data-role": "desc", children: t.desc }) : null] })) : (_jsx("span", { "data-role": "message", children: t.message }))] }, t.id));
            }) }) }));
};
//# sourceMappingURL=toast.js.map