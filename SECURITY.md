# SECURITY

### Gratia — Quiet by Design

This document describes how Gratia handles safety, privacy, and data.
It is intentionally minimal.

Security in Gratia is achieved primarily through **absence**:
absence of capture, absence of storage, absence of centralization.

---

## Core Principle

> **What is not collected cannot be leaked.**

---

## Data Handling

Gratia is designed to minimize data at every layer.

- No mandatory accounts
- No identity requirements
- No behavioral profiling
- No attention metrics

Where possible, data remains:

- local
- ephemeral
- user-controlled

---

## Sealed Content

Sealed content is treated as inviolable.

- Stored locally only
- Never exported
- Never logged
- Never reused
- Never inspected

The system does not retain memory of Sealed interactions.

---

## Logs and Telemetry

- No session recording
- No content logging
- No replay of private interactions

Operational logs, if present, must:

- exclude user content
- be time-limited
- exist only for system health

---

## Third-Party Services

Gratia avoids third-party dependencies where possible.

When external services are used:

- inputs are minimized
- outputs are treated as transient
- no identifiers are shared

Sealed content is never sent to third parties.

---

## Failure Modes

If a component fails:

- the system degrades gracefully
- neutral or sample responses may be returned
- user experience remains intact

Failure must never expose private data.

---

## Reporting Concerns

If you discover a security or privacy issue:

- do not disclose it publicly
- contact the maintainers privately
- include only necessary details

Reports are handled quietly and respectfully.

---

## Non-Goals

Gratia does not aim to:

- collect analytics
- track engagement
- personalize through surveillance
- retain long-term user data

If an implementation moves in these directions, it is rejected.

---

## Closing

Security in Gratia is not an added feature.
It is a consequence of restraint.

When in doubt:

- collect less
- store nothing
- prefer silence
