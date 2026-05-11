# @gratiaos/identity-core

Ghost-first mirror of the M3 Identity Separation protocol.

Whisper: a story can be seen without being installed.

## Purpose

`identity-core` lets Gratia run the Identity Gate locally in the browser:

- sovereign tags become active permissions
- legacy/external tags are rejected while the firewall is enabled
- projections become inert `shadow` objects with `affects_kernel: false`
- a future Service Worker or M3 adapter can implement the same `IdentityDecouplingAdapter`

## Quick Start

```ts
import { createLocalIdentityAdapter, decoupleProjection } from '@gratiaos/identity-core';

const result = decoupleProjection('Like_mother_like_son');

if (result.kind === 'shadow') {
  // Archive as a shadow, never install as identity.
}

const identity = createLocalIdentityAdapter();
await identity.decouple('Today I notice tension in my shoulders');
```

## Bridge Later

The UI should depend on `IdentityDecouplingAdapter`, not on network details.
Today the adapter is local. Later it can call a Service Worker or M3:

```ts
const identity = createRemoteIdentityAdapter('/identity');
await identity.decouple('you always do this');
```
