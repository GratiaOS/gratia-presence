import React from 'react';
export type ToastVariant = 'neutral' | 'positive' | 'warning' | 'danger';
export type ToastOptions = {
    /** Visual style (maps to data-variant for the skin). */
    variant?: ToastVariant;
    /** Override auto-dismiss duration in ms. Falls back to CSS tokens. */
    durationMs?: number;
    /** Optional stable key: upserts (replace/resets) an existing toast with the same key. */
    key?: string;
    /** Optional title to render on the first line (see styles/toast.css). */
    title?: string;
    /** Optional description to render on the second line. */
    desc?: string;
    /** Optional plain message (single-line). If title/desc are present, message is ignored in UI. */
    message?: string;
    /** Optional simple icon glyph (emoji / short text). For richer icons, use Toaster's renderIcon(). */
    icon?: string;
    /** Optional hook called when the toast is dismissed (timeout/click/Escape/clear). */
    onDismiss?: () => void;
    /** Optional click handler — runs before dismiss (if enabled). */
    onClick?: () => void;
};
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
export declare function useToasterTest(opts?: {
    enabled?: boolean;
    intervalMs?: number;
}): {
    fireDemo: () => void;
    clearDemo: () => void;
    startAuto: () => void;
    stopAuto: () => void;
    readonly running: boolean;
};
/**
 * Headless event API — emit a toast from anywhere in the app.
 * Overloads:
 *   showToast('Saved ✓', { variant: 'positive' })
 *   showToast({ title: 'Saved', desc: 'Your note is now in the timeline.', variant: 'positive' })
 */
export declare function showToast(message: string, opts?: ToastOptions): void;
export declare function showToast(opts: ToastOptions): void;
/** Clear by key or all. */
export declare function clearToast(key?: string): void;
export type ToastItemLike = {
    id: number;
    variant: ToastVariant;
    durationMs: number;
    key?: string;
    title?: string;
    desc?: string;
    message?: string;
    icon?: string;
    onDismiss?: () => void;
    onClick?: () => void;
    uiState?: 'entering' | 'leaving';
};
export type ToastRenderIcon = (item: Omit<ToastItemLike, 'id' | 'durationMs'>) => React.ReactNode;
export type ToasterProps = {
    /** Where to pin the stack. Defaults to bottom-center. */
    position?: 'bottom-center' | 'top-right' | 'top-center' | 'bottom-right';
    /** Max visible toasts at once. Older ones drop first. Default: 3 */
    max?: number;
    /** Click to dismiss. Default: true */
    dismissOnClick?: boolean;
    /** Optional className; styles live in CSS under [data-ui="toast"]. */
    className?: string;
    /** Optional render function for a richer leading icon. */
    renderIcon?: ToastRenderIcon;
    /** Whether toast items can receive focus for keyboard users. Default: true */
    focusable?: boolean;
};
/**
 * Toaster — headless renderer using data attributes only.
 * Visuals are provided by styles/toast.css.
 */
export declare const Toaster: React.FC<ToasterProps>;
//# sourceMappingURL=toast.d.ts.map