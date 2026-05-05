import * as React from 'react';
/**
 * Tracks interaction bursts (typing, drawing, etc.) and flips to paused when
 * no activity is observed for `pauseAfterMs`.
 */
export function useFlowActivity(options = {}) {
    const { pauseAfterMs = 5000 } = options;
    const onPauseRef = React.useRef(options.onPause);
    const onResumeRef = React.useRef(options.onResume);
    onPauseRef.current = options.onPause;
    onResumeRef.current = options.onResume;
    const timerRef = React.useRef(null);
    const [paused, setPaused] = React.useState(true);
    const clearTimer = () => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
    const notifyActivity = React.useCallback(() => {
        clearTimer();
        if (paused) {
            setPaused(false);
            onResumeRef.current?.();
        }
        timerRef.current = window.setTimeout(() => {
            setPaused(true);
            onPauseRef.current?.();
        }, pauseAfterMs);
    }, [pauseAfterMs, paused]);
    React.useEffect(() => {
        return () => clearTimer();
    }, []);
    return { paused, notifyActivity };
}
//# sourceMappingURL=useFlowActivity.js.map