# @gratiaos/energy-core

Shared Energy Management System for Gratia.

The package has three layers:

- `EnergyEngine`: canonical local logic for E4-E0, trends, prediction, and exit ritual routing.
- `EnergyStorageAdapter`: storage boundary. Ghost Mode uses localStorage today; D1, SQLite, M3, or another DB can slot in later.
- `EnergyApiClient`: remote bridge for a Cloudflare Worker or M3 adapter.

## Canonical Bands

- `crown` / `E4`: architecture, strategy, naming
- `dragon` / `E3`: deep work, coding, analysis
- `play` / `E2`: reviews, pairing, drafting
- `life` / `E1`: chores, admin, grooming
- `void` / `E0`: rest, breathwork, sleep

## Ghost Mode

The default browser adapter is localStorage only: silent writes, no account, no network latency.

```ts
import { createEnergyEngine, createLocalStorageEnergyAdapter } from '@gratiaos/energy-core';

const energy = createEnergyEngine(createLocalStorageEnergyAdapter());
const result = energy.mark({ kind: 'life', level: 0.16 });

if (result.shouldTriggerRitual) {
  // Open the 30-second shutter in the UI.
}
```

## API Shape

The internal paths are:

- `POST /mark`
- `GET /state`
- `GET /trends`
- `POST /predict`

For gratia.space, the remote client defaults to the Cloudflare-ready prefix `/api/energy`, so calls resolve to:

- `POST /api/energy/mark`
- `GET /api/energy/state`
- `GET /api/energy/trends`
- `POST /api/energy/predict`

```ts
import { createRemoteEnergyApiClient } from '@gratiaos/energy-core';

const energy = createRemoteEnergyApiClient();
await energy.mark({ kind: 'dragon', level: 0.72 });
```

## Prediction

`predict()` uses local marks from the selected lookback window, computes a recency-weighted level, estimates an hourly slope, and projects the next window. It returns:

- `predictedLevel`
- `confidence`
- `trend`
- `exit.urgency`
- `exit.ritual`

Task-sensitive calls can pass `taskBand` or `taskThreshold` to suggest a 30-second downshift before the user tries to spend energy they do not have.
