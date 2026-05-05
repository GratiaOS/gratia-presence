import * as React from 'react';
/** Keeps prior scene theme values so we can restore them on cleanup. */
function snapshotTheme(root) {
    return {
        scene: root.dataset.sceneTheme,
        depth: root.dataset.sceneDepth,
        base: root.style.getPropertyValue('--scene-base'),
        accent: root.style.getPropertyValue('--scene-accent'),
    };
}
function applyTheme(root, scene, options) {
    root.dataset.sceneTheme = scene;
    if (options.depth !== undefined) {
        root.dataset.sceneDepth = String(options.depth);
    }
    if (options.base !== undefined) {
        root.style.setProperty('--scene-base', options.base);
    }
    if (options.accent !== undefined) {
        root.style.setProperty('--scene-accent', options.accent);
    }
    if (options.vars) {
        for (const [key, value] of Object.entries(options.vars)) {
            root.style.setProperty(`--${key}`, String(value));
        }
    }
}
function restoreTheme(root, snapshot, customVars) {
    if (snapshot.scene) {
        root.dataset.sceneTheme = snapshot.scene;
    }
    else {
        delete root.dataset.sceneTheme;
    }
    if (snapshot.depth) {
        root.dataset.sceneDepth = snapshot.depth;
    }
    else {
        delete root.dataset.sceneDepth;
    }
    if (snapshot.base) {
        root.style.setProperty('--scene-base', snapshot.base);
    }
    else {
        root.style.removeProperty('--scene-base');
    }
    if (snapshot.accent) {
        root.style.setProperty('--scene-accent', snapshot.accent);
    }
    else {
        root.style.removeProperty('--scene-accent');
    }
    if (customVars) {
        for (const key of Object.keys(customVars)) {
            root.style.removeProperty(`--${key}`);
        }
    }
}
/**
 * Scene theming hook
 * ------------------
 * Applies scene-specific CSS variables / data attributes at the document level.
 *
 * Call inside scene components to tint the Garden for the current mood.
 */
export function useSceneTheme(scene, options = {}) {
    const optionsRef = React.useRef(options);
    optionsRef.current = options;
    React.useEffect(() => {
        if (typeof document === 'undefined' || !scene)
            return;
        const root = document.documentElement;
        const snapshot = snapshotTheme(root);
        const opts = optionsRef.current;
        applyTheme(root, scene, opts);
        return () => {
            restoreTheme(root, snapshot, opts.vars);
        };
    }, [scene]);
}
//# sourceMappingURL=useSceneTheme.js.map