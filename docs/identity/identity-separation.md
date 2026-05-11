# Identity Separation

Protocol: Sovereignty over Legacy.

`apps/m3/server/src/identity_separation.rs` keeps the sovereign kernel separate from inherited or conflict-time identity tags. The module treats identity as a set of dynamic permissions, not a fixed verdict.

## Kernel Rules

- `Sovereign` tags may enter kernel space.
- `Legacy` and `External` tags are silently dropped while the firewall is enabled.
- `purge_legacy_storage()` removes imported legacy/external residue and keeps only sovereign tags.
- Projection analysis is pure: it does not mutate `SovereignKernel`.

## Projection Decoupling

`decouple_projection(input: String)` returns one of two shapes:

- `present_reality`: a current, observable signal.
- `shadow`: an inert object for a legacy or external projection.

Shadows include `affects_kernel: false` by design. They can be logged, reflected on, or released, but they do not become identity permissions.

## Ghost-First Mirror

`packages/identity-core` mirrors this protocol in TypeScript for gratia.space. UI code should depend on its `IdentityDecouplingAdapter`:

- `createLocalIdentityAdapter()` runs immediately in the browser.
- `createRemoteIdentityAdapter('/identity')` can later bridge to M3 or a Service Worker.
- `createLocalStorageShadowArchive()` can store inert shadows without installing them as tags.

This keeps the Identity Gate usable offline while preserving the same contract for the future server bridge.

## Locale Coverage

The first-pass detector ships with English, Spanish, and Romanian markers for:

- legacy family comparisons
- external absolute labels
- present-moment reality statements

The markers are heuristic by design. They should catch common identity projections without pretending to be a therapist, judge, or classifier of final truth.

## HTTP Surface

`POST /identity/decouple`

```json
{
  "input": "Like_mother_like_son"
}
```

Projection response:

```json
{
  "result": {
    "kind": "shadow",
    "input": "Like_mother_like_son",
    "shadow_kind": "legacy_projection",
    "markers": ["like_mother_like_son"],
    "confidence": 40,
    "affects_kernel": false,
    "whisper": "Whisper: This belongs to the past. Let it pass the gate."
  }
}
```

Present response:

```json
{
  "result": {
    "kind": "present_reality",
    "input": "Today I notice my shoulders are tense",
    "markers": ["today"],
    "confidence": 30,
    "whisper": "Whisper: Stay with what is happening now."
  }
}
```

Note: the JSON is internally tagged by `kind`, so clients should inspect `result.kind` before reading shadow-specific fields.

🌬️ whisper: _"the gate can notice a story without installing it."_
