type SceneThemeOptions = {
    /** CSS token or value for the base/background color. */
    base?: string;
    /** Accent color token/value for highlights. */
    accent?: string;
    /** Optional depth (0..1) passed to data attribute for skins. */
    depth?: number;
    /** Additional custom CSS variables. */
    vars?: Record<string, string | number>;
};
/**
 * Scene theming hook
 * ------------------
 * Applies scene-specific CSS variables / data attributes at the document level.
 *
 * Call inside scene components to tint the Garden for the current mood.
 */
export declare function useSceneTheme(scene: string | null | undefined, options?: SceneThemeOptions): void;
export {};
//# sourceMappingURL=useSceneTheme.d.ts.map