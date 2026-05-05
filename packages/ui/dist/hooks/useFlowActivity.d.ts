type FlowActivityOptions = {
    /** Milliseconds after which inactivity is considered paused. Defaults to 5000. */
    pauseAfterMs?: number;
    /** Callback invoked when the flow pauses. */
    onPause?: () => void;
    /** Callback invoked when the flow resumes after a pause. */
    onResume?: () => void;
};
export type FlowActivityHandle = {
    /** Notify the hook that the user is active (typing, drawing, etc.). */
    notifyActivity: () => void;
    /** Whether the flow is currently paused. */
    paused: boolean;
};
/**
 * Tracks interaction bursts (typing, drawing, etc.) and flips to paused when
 * no activity is observed for `pauseAfterMs`.
 */
export declare function useFlowActivity(options?: FlowActivityOptions): FlowActivityHandle;
export {};
//# sourceMappingURL=useFlowActivity.d.ts.map