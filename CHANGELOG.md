# Changelog

## March 2026

- **Living feed expanded with moon-through-mesh night scene**
  - Added the new `/living` scene "Nightfall · The Moon Through The Mesh"
  - Captures the Bastarás night photo as observation, pixel texture, and held light

- **Living feed updated for March**
  - Added the new `/living` scene "March 2026 · The Cinnamon Roll Alliance"
  - Captures the Sabadell glitch, Bastarás privacy pact, and Lunar Journal becoming a physical object

🌬️ whisper: „trial by fire is over. the bread is rising.”

## February 2026

- **Next.js upgraded to 16.1.6**
  - Security and compatibility update
  - App Router verified, build and dev tested
- **MDX migration (native)**
  - Removed custom plugins, switched to Next.js native MDX
  - Adapted pages to use default MDX export
- **Drift toggle (🛰️) improved**
  - Alt+D shortcut enables 'drift' palette for dev/testing
  - 🛰️ icon appears in dev mode, click to disable
- **Codebase cleanup**
  - Removed legacy MDX config and plugin logic
  - Updated layout and DevToggles for new drift logic

🌬️ whisper: „grădina devine mai curată, driftul e calm, iar culoarea se simte în siguranță.”

## December 2025

- **About page added** in `app/about/` (calm tone, no CTAs), using `@gratiaos/ui` + token classes and `useSkinField` (Sun/Moon).
- **i18n for About**:
  - `AboutPageClient.tsx` uses `I18nProvider` + `useTranslation('about')`.
  - New locale bundles: `locales/en|es|ro/about.json`.
  - Wiring updated: `i18n/config.js` (adds `about` namespace) + `i18n/resources.ts` (imports + fallbacks, types accept namespace).
- **Pattern Mirror locale enforcement tightened**:
  - Prompts explicitly require the requested language.
  - Runtime guard detects language drift and falls back to localized samples (`meta.source: "sample-lang-guard"`).
  - Types updated for the new `meta.source`.
- **Medium comment locale sync fixed** in `app/pattern-mirror/PatternMirrorPageClient.tsx`:
  - Tracks `mediumCommentLocale`.
  - Resets comment state on locale switch / new fetch.
  - Only shows preview when it matches current locale.

- **Published package deps**: switched Gratia to npm versions (no local links):
  - `@gratiaos/tokens` → `^1.0.7`
  - `@gratiaos/ui` → `^1.3.0`
  - `@gratiaos/presence-kernel` → `^1.1.4`
  - `@gratiaos/icons` resolved via npm (lockfile)
- **SkinFieldProvider initialization fixed** in `app/skin/SkinFieldProvider.tsx`:
  - Always sets `dataset.skinId` on first mount to avoid flash
  - Default respects system preference (Sun for light, Moon for dark) when no stored value
  - Persists corrected value when system dark forces Sun → Moon
- **Theme + tokens tuning**:
  - Moon skin refined toward a warmer, lower‑chroma “semineu / slow burn” palette
  - Reduced neon tone colors (green/amber/red) for Moon
- **Pattern Mirror UX refinements**:
  - Toolbar toggles moved to Pill buttons and hydration mismatch fixed for typography mode
  - Mirror Room copy updated across `en/es/ro` (anchored by “This is us.” / “Așa suntem noi.”)
  - Idle whisper bubble uses rotating `presence_whispers` (emoji‑only, no named entity)
- **Site footer links updated**:
  - Removed Vortex link
  - Separator switched to `⟡`
  - Links use subtle opacity reveal on hover/focus
