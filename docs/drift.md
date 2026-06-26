# Pad drift (M3)

This repo uses a **pad algebra layer** (derived `--pad-*` vars) to keep surfaces, borders, and text coherent across skins.

**Pad drift** is a dev-only toggle that applies the **M3-style tone drift** formulas on top of the base theme tokens. It exists for fast visual comparison and parity checks.

## What “drift” means

Instead of using the raw theme tokens directly as tones, we derive tones by mixing them in **OKLab**.

- `--tone-surface` drifts slightly toward `--color-accent`
- `--tone-ink` drifts slightly toward `white`
- `--tone-accent` drifts slightly toward `white`

This subtly changes perceived warmth/contrast and is the main reason **M3 can feel different** even when `--color-surface` is identical.

## Toggle (dev only)

In development builds, you can toggle drift:

- **Alt/Option + D** → toggle `data-pad-drift="m3"`
- A small **🛰️** glyph appears in the bottom-right while drift is ON
  - Hover: fades from 0.45 → 0.7
  - Click: disables drift

The toggle persists via `localStorage`.

## Where it lives

- UI toggle: `app/components/DevToggles.tsx` (client-only, mounted only in dev)
- CSS formulas: `app/globals.css` under `:root[data-pad-drift='m3']`

## The drift formulas

When `data-pad-drift="m3"` is present on `:root`, these are applied:

```css
:root[data-pad-drift='m3'] {
  --tone-drift-warmth: 0.5;
  --tone-drift-hue: 0;

  --tone-surface: color-mix(
    in oklab,
    var(--color-surface) calc(94% - (var(--tone-drift-warmth) * 6%)),
    var(--color-accent)
  );
  --tone-ink: color-mix(
    in oklab,
    var(--color-text) calc(88% + (var(--tone-drift-warmth) * 6%)),
    white
  );
  --tone-accent: color-mix(
    in oklab,
    var(--color-accent) calc(85% - (var(--tone-drift-warmth) * 5%)),
    white
  );
}
```

These tones then feed the pad algebra (`--pad-bg-0`, `--pad-bg-1`, etc.), which is derived in OKLCH.

## Why OKLab/OKLCH

- **OKLab**: great for perceptual mixing of _tones_ (warmth/contrast drift)
- **OKLCH**: great for deriving _surface steps_ (consistent lightness/chroma ramps)

This combo tends to preserve “feeling” across surfaces without hardcoding colors per component.

## Debug checklist

If things still don’t match M3:

1. Compare computed values (M3 vs Gratia):

```js
const cs = getComputedStyle(document.documentElement);
[
  '--color-surface',
  '--color-text',
  '--color-ink',
  '--color-accent',
  '--tone-surface',
  '--tone-ink',
  '--tone-accent',
  '--pad-bg-0',
  '--pad-bg-1',
  '--pad-surface',
  '--pad-elev',
].forEach((k) => console.log(k, cs.getPropertyValue(k).trim()));
```

2. Ensure you’re comparing **base vs base** (not base vs forced skin).
3. Ensure drift toggle is ON/OFF consistently in both comparisons.

## Notes

- Drift is a **dev tool**. It should not be relied on as a product feature.
- Keep component styling consuming `--pad-*` rather than raw `--color-*` where possible.

🛰️ Quiet debug. No UI pollution.
