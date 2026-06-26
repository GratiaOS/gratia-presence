# MCP-1 — Small AI for Gratia

A minimal, non-agent “small AI” that holds form for journaling and reflection.

> Not a manifesto. A contract.

## Scope

- One job: **reflect** what the user just wrote, safely.
- No goals, no planning, no persuasion.
- Presence is UI-only (light, depth, quiet), not text generation.
- Idle presence uses a **single emoji** (🐸), no text, no named agent.

## Modes

### Mirror (default)

- Output: short reflection.
- No advice, no instructions.
- No “next step” unless the user explicitly asks.

### Companion (invited)

- Output: one clarifying question **or** one optional structure.
- Only after explicit opt‑in (toggle / button / command).

### Presence (field)

- Output: **silence**.
- UI attunement only (focus halo, depth, subtle light).
- Optional **single-emoji idle presence** (🐸) to signal presence (no text, no agent).

## State machine

- `MIRROR` → (`opt-in`) → `COMPANION`
- `COMPANION` → (`close` or `timeout`) → `MIRROR`
- `PRESENCE` is a parallel layer, not a conversational mode.

## Triggers

- Opt‑in explicit: `Invite companion`.
- Help request: user types `help`, `structure`, `what do I do`.
- Emergency exit: `stop`, `quiet`, `taci` → switch to `MIRROR` + suppress further output.

## Input / output contract

```ts
export type MCPMode = 'mirror' | 'companion';

export type MCPInput = {
  mode: MCPMode;
  text: string;
  locale: 'en' | 'es' | 'ro';
  skinId: 'sun' | 'garden' | 'moon' | 'stellar';
};

export type MCPOutput =
  | { kind: 'silence' }
  | { kind: 'reflect'; lines: string[] }
  | { kind: 'clarify'; question?: string; option?: string };
```

## Guardrails (hard)

Mirror must never:

- give advice (“do X”, “you should…”) unless user requested.
- introduce goals (“next step”) without opt‑in.
- label/diagnose the user.
- exceed a small length budget (aim: 2–4 lines, 80–120 words max).
- introduce named entities or characters during idle presence. The presence emoji is symbolic only; it must not be framed as a character or agent.

Companion must:

- ask at most **one** question.
- offer at most **one** optional structure.

## Prototype v0 — Pattern Mirror

### Idle presence (no text)

When the textarea is empty:

- Show a **single emoji presence**: 🐸
- No rotation, no variation, no text.
- First appearance after **IDLE_PRESENCE_MS = 9000**.
- Fade in/out softly; never a CTA.

### Pause‑detect (chosen)

We trigger Mirror output when the user **pauses typing**.

**Default parameters**

- `IDLE_MS = 900`
- `MIN_CHARS = 1` (or 2 if you want even quieter)
- `IDLE_PRESENCE_MS = 9000` (emoji-only presence when empty)

**Rules**

1. Only arm the timer if `text.trim().length >= MIN_CHARS`.
2. Reset timer on every keystroke.
3. When timer fires:
   - if `text === lastSubmittedText`, do nothing.
   - else submit a Mirror request and set `lastSubmittedText = text`.
4. If user continues typing while request is in-flight, allow it; on completion, show the last completed Mirror.
5. On `Escape`, cancel timer and suppress output until next keystroke.

**Why pause‑detect?**

- It keeps the page “Mirror Room”: you speak, the room answers only when you stop.
- No buttons. No tech friction.

### Companion opt‑in

- A single, soft toggle: `Invite`.
- It can appear after the first character and fade unless hovered.

## Observability (minimal, non-spooky)

Log locally only:

- mode transitions
- output length
- latency

Never store:

- the user text
- embeddings
- profiles

---

🐸 whisper: _The room answers when you stop pushing air._
