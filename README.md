# Gratia Presence

Gratia Presence is a public showcase for a sovereign, local-first Personal OS: a calm digital space where reflection, memory, personal patterns, and lightweight tools live close to the user instead of inside a centralized service.

The product direction is intentionally small-infrastructure and privacy-first. The current build runs as a static Next.js application, stores user-owned state in the browser with `localStorage`, and can be deployed on Cloudflare Pages without operating a database, backend server, or tracking layer.

## Product Vision

Gratia treats the browser as a personal sanctuary rather than a thin client for someone else's cloud. Its core product promise is simple:

- Personal reflection should remain personal by default.
- Useful software can feel quiet, human, and durable.
- A Personal OS can begin as a local-first surface before it grows into optional networked features.

Ghost Mode is the product owner's privacy stance made visible: no account requirement, no analytics dependency, no remote memory store, and no hidden backend calls for the core experience.

## Technical Stack

- **Next.js** with App Router and static export.
- **Tailwind CSS** plus Garden UI primitives for the interface system.
- **Cloudflare Pages** as the deployment target.
- **localStorage** for browser-local memory, preferences, and reflection seeds.
- **pnpm workspaces** for keeping the app and `packages/ui` together in one public repository.

## Running Locally

```bash
pnpm install
pnpm dev
```

Build the static Cloudflare Pages output:

```bash
pnpm build
```

Cloudflare Pages settings:

- **Build command:** `pnpm pages:build`
- **Output directory:** `out`
- **Node version:** `20` or newer

## Repository Shape

```text
.
├── app/                # Next.js application
├── i18n/               # Locale resources and provider
├── lib/                # Local-first product logic
├── packages/tokens/    # Garden theme tokens and Tailwind theme exports
├── packages/ui/        # Garden UI primitives and component skins
├── public/             # Static brand and media assets
└── PRODUCT_STRATEGY.md # Product and ROI narrative
```

## Product Owner Choices

The zero-infrastructure cost model is a deliberate product constraint. It keeps the showcase easy to deploy, easy to audit, and inexpensive to operate while proving that the core Personal OS loop does not need a hosted database to feel useful.

This also prioritizes user privacy. In Ghost Mode, personal entries and saved signals stay in the user's browser. Future cloud or fintech integrations should be explicit opt-ins, not ambient defaults.
