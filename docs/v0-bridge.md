# v0 ↔ Gratia bridge

v0 is an **atelier** for layout and copy. **Gratia is the source of truth** that compiles, runs, and ships.

This repo’s rules:

## What v0 is for

- Drafting **page structure** (sections, hierarchy, spacing intent)
- Drafting **copy** (Public / Shared / Sealed wording)
- Proposing **token-class styling** (e.g. `bg-surface`, `text-on-surface`, `border-border`)
- Producing a **patch intent**: “edit these files, insert this TSX + this copy”

## What v0 is NOT for

- Creating providers, app scaffolding, or replacing global styles
- Rebuilding the project from scratch (“workspace empty” loops)
- Guessing our monorepo packages or inventing `@gratiaos/*` implementations
- Git operations inside v0’s sandbox (we commit in Gratia)

## Why

v0 runs in a separate sandbox. Even if our packages are public on npm, v0 **won’t see local workspace code** unless the packages are **installed as dependencies** inside the v0 project.

So we have two valid workflows:

- **Atelier mode (recommended):** v0 produces _patch intent_ (TSX + copy + token classes). We apply it in Gratia and validate with `pnpm dev`.
- **Runnable prototype mode (optional):** v0 installs the published packages from npm and can render a working page in its sandbox.

In both cases, **Gratia remains the source of truth**.

## Using published @gratiaos packages inside v0 (optional)

Because `@gratiaos/ui` and `@gratiaos/tokens` are published on npm, v0 _can_ use them **if** we tell it to add them to `package.json` (or run an install).

Ask v0 to:

- add dependencies (pin versions), e.g.
  - `@gratiaos/ui`: `^x.y.z`
  - `@gratiaos/tokens`: `^x.y.z`
- then use the real imports in the generated TSX.

Still keep these guardrails:

- don’t create providers/scaffolding unless explicitly requested
- don’t replace globals
- if something is missing, write a TODO instead of inventing implementations

If v0 still fails to resolve packages, fall back to **Atelier mode** and apply the patch in Gratia.
