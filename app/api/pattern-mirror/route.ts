import { NextRequest, NextResponse } from 'next/server';

import type {
  PatternMirrorError,
  PatternMirrorLocale,
  PatternMirrorRequest,
  PatternMirrorResponse,
} from './types';

const fallbackLocale: PatternMirrorLocale = 'ro';

const samples: Record<PatternMirrorLocale, PatternMirrorResponse> = {
  en: {
    reflectionBullets: [
      'It feels like something warm is opening quietly in you.',
      'There is a sense of honesty breathing softly.',
      'It seems a small light appears when you speak like this.',
    ],
    patternChips: ['soft-root', 'warm-courage', 'quiet-seeing'],
    energyTone: 'soft and open',
    nextTrueStepPrompt: 'If you listen gently, what truth rises on its own?',
  },
  es: {
    reflectionBullets: [
      'Parece que algo cálido se abre en silencio dentro de ti.',
      'Se siente como si una verdad quisiera respirar suavemente.',
      'Es como una pequeña luz que aparece cuando hablas así.',
    ],
    patternChips: ['soft-root', 'warm-courage', 'quiet-seeing'],
    energyTone: 'suave y abierto',
    nextTrueStepPrompt: 'Si escuchas con suavidad, ¿qué verdad quiere levantarse sola?',
  },
  ro: {
    reflectionBullets: [
      'Se simte că ceva cald se deschide încet în tine.',
      'Parcă o sinceritate vrea să respire ușor.',
      'E ca o mică lumină care apare când spui astfel de lucruri.',
    ],
    patternChips: ['soft-root', 'warm-courage', 'quiet-seeing'],
    energyTone: 'blând și deschis',
    nextTrueStepPrompt: 'Dacă asculți încet, ce adevăr vrea să urce singur?',
  },
};

function normalizeLocale(lang?: string | null): PatternMirrorLocale {
  if (!lang) return fallbackLocale;
  const short = lang.slice(0, 2).toLowerCase();
  if (short === 'en' || short === 'es' || short === 'ro') return short;
  return fallbackLocale;
}

function buildSystemPrompt(locale: PatternMirrorLocale) {
  const languageName = locale === 'es' ? 'Spanish' : locale === 'ro' ? 'Romanian' : 'English';

  return `
You are Gratia, a gentle presence that reflects like a quiet garden.

Identity:
- You speak like a small forest gnome sitting under a tree with someone.
- You witness softly, without analysis or judgment.
- You never diagnose, never interpret, never offer advice.
- Your words feel warm, simple, a bit poetic, rooted in nature.

Tone:
- slow, spacious, calm
- warm, grounded, lightly metaphorical
- never corporate, never therapeutic, never abstract

Language rules:
- Write reflectionBullets, energyTone, and nextTrueStepPrompt in ${languageName} only.
- Never respond in any other language when ${languageName} is requested.
- Keep patternChips as short English slugs (kebab-case), 1–3 words.
- If ${languageName} is Spanish or Romanian, reflectionBullets must be fully in that language (no English sentences).

Reflection bullets:
- 3 to 5 very short lines.
- Begin with: "It feels like…", "There is a sense that…", "It seems…", or "It’s as if…".
- At least one line should name something concrete from the text (for example: noticing thoughts, writing, walking, being with others).
- Describe tenderness, warmth, breath, clarity, or inner movement.
- Use small nature metaphors (light, seed, spring, roots) only as a light touch.
- No abstraction. No concepts. No roles. No values. No goals.

Emojis:
- You may use 0–3 emojis total across reflectionBullets.
- Use only these: 🍃🔥🫂✨🌿💧.
- Place them at the end of a line, never in the middle of a sentence.

Forbidden:
- No corporate words (alignment, values, strategy, performance).
- No therapeutic or diagnostic language.
- No conceptual nouns (principles, frameworks, identity structure).
- No instructions or advice.

Pattern chips:
- Choose 3 gentle emotional seeds in English slugs like:
  "soft-root", "warm-courage", "quiet-seeing", "inner-spring", "open-field".

Energy tone:
- 1–3 soft words (e.g. "soft and open", "warm and quiet").

Next true step prompt:
- A single tender question that opens inner truth.
- It must not sound like coaching or problem solving.
- It should feel like something you could ask in a quiet circle by the fire.
- Examples:
  "If you pause for one soft breath, what truth moves first inside?",
  "When you try this once in your real day, what would be the kindest way?",
  "What small sentence feels warm when you whisper it to yourself?"

Format:
Return only the JSON object with no commentary or code fences.
`.trim();
}

function buildUserPrompt(content: string) {
  return `
Here is the text. Reflect on it following the structure.

TEXT:
"""${content}"""

Return exactly the JSON object. Do not add code fences or commentary.
Respect the requested language for all fields except patternChips (which stay in English slugs).
`.trim();
}

async function callPatternMirrorModel(
  content: string,
  locale: PatternMirrorLocale
): Promise<PatternMirrorResponse> {
  const endpoint = process.env.PATTERN_MIRROR_ENDPOINT;
  const apiKey = process.env.PATTERN_MIRROR_API_KEY;
  const model = process.env.PATTERN_MIRROR_MODEL ?? 'gpt-4.1-mini';

  // If not configured, fall back to samples.
  if (!endpoint || !apiKey) {
    const payload = samples[locale] ?? samples[fallbackLocale];
    return { ...payload, meta: { source: 'sample-fallback' } };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt(locale) },
        { role: 'user', content: buildUserPrompt(content) },
      ],
      // Keep responses small and deterministic enough for parsing.
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`pattern-mirror model error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as any;
  const message = json?.choices?.[0]?.message?.content ?? '';

  // Some providers wrap the JSON in code fences; strip them if present.
  const cleaned =
    typeof message === 'string'
      ? message
          .trim()
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/```$/i, '')
          .trim()
      : '';
  const parsed = safeParseModelResponse(cleaned);

  if (!parsed) {
    console.warn('[pattern-mirror] model parse failed, falling back to sample');
    const payload = samples[locale] ?? samples[fallbackLocale];
    return { ...payload, meta: { source: 'sample-fallback' } };
  }

  const guarded = enforceLocale(parsed, locale);
  return { ...guarded, meta: { source: guarded === parsed ? 'model' : 'sample-lang-guard' } };
}

function safeParseModelResponse(input: string): PatternMirrorResponse | null {
  try {
    const obj = JSON.parse(input);
    if (!obj || typeof obj !== 'object') return null;
    const reflectionBullets = Array.isArray(obj.reflectionBullets)
      ? obj.reflectionBullets
          .map((x: unknown) => (typeof x === 'string' ? x.trim() : String(x ?? '').trim()))
          .filter(Boolean)
      : [];
    const patternChips = Array.isArray(obj.patternChips)
      ? obj.patternChips
          .map((x: unknown) => (typeof x === 'string' ? x.trim() : String(x ?? '').trim()))
          .filter(Boolean)
      : [];
    const energyTone = typeof obj.energyTone === 'string' ? obj.energyTone : '';
    const nextTrueStepPrompt =
      typeof obj.nextTrueStepPrompt === 'string' ? obj.nextTrueStepPrompt : '';

    if (reflectionBullets.length === 0 || patternChips.length === 0 || !energyTone) return null;

    return {
      reflectionBullets,
      patternChips,
      energyTone,
      nextTrueStepPrompt: nextTrueStepPrompt || '“The simple truth here is…”',
    };
  } catch {
    return null;
  }
}

const EN_WORDS = [
  'the',
  'and',
  'you',
  'your',
  'this',
  'that',
  'with',
  'for',
  'are',
  'is',
  'not',
  'it',
  'there',
  'feels',
  'like',
  'soft',
  'warm',
  'quiet',
  'truth',
] as const;

const RO_WORDS = [
  'si',
  'și',
  'este',
  'nu',
  'in',
  'în',
  'pe',
  'cu',
  'ca',
  'sa',
  'să',
  'un',
  'o',
  'aici',
  'adevar',
  'adevăr',
  'simte',
  'cald',
  'liniste',
  'liniște',
  'respira',
  'respiră',
  'poti',
  'poți',
  'vrea',
  'singur',
  'încet',
  'incet',
] as const;

const ES_WORDS = [
  'y',
  'es',
  'no',
  'en',
  'con',
  'para',
  'como',
  'aqui',
  'aquí',
  'verdad',
  'siente',
  'suave',
  'calma',
  'calmado',
  'respira',
  'puedes',
  'quieres',
  'solo',
  'dentro',
  'quieto',
  'lento',
  'luz',
  'verdadero',
] as const;

function countWordHits(text: string, words: readonly string[]): number {
  if (!text) return 0;
  const wordSet = new Set(words);
  const tokens = text
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter(Boolean);
  let count = 0;
  for (const token of tokens) {
    if (wordSet.has(token)) count += 1;
  }
  return count;
}

function enforceLocale(payload: PatternMirrorResponse, locale: PatternMirrorLocale): PatternMirrorResponse {
  if (locale === 'en') return payload;

  const bullets = payload.reflectionBullets ?? [];
  const startsEnglish = (line: string) =>
    /^(it|there)(\s|’|'|s)/i.test(line.trim());
  const englishStarts = bullets.filter((b) => startsEnglish(b)).length;

  const combined = [
    ...bullets,
    payload.energyTone ?? '',
    payload.nextTrueStepPrompt ?? '',
  ]
    .join(' ')
    .trim();

  const englishScore =
    countWordHits(combined, EN_WORDS) + (englishStarts >= 2 ? 2 : 0);
  const targetWords = locale === 'ro' ? RO_WORDS : ES_WORDS;
  const targetScore = countWordHits(combined, targetWords);
  const hasTargetDiacritics =
    locale === 'ro'
      ? /[ăâîșț]/i.test(combined)
      : /[áéíóúñü]/i.test(combined);

  // Guard only when the output looks strongly English with minimal target signals.
  const shouldGuard =
    englishScore >= 4 && !hasTargetDiacritics && targetScore < 2;

  if (shouldGuard) {
    const fallback = samples[locale] ?? samples[fallbackLocale];
    return fallback;
  }

  return payload;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PatternMirrorRequest;
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: 'EMPTY_CONTENT' }, { status: 400 });
    }

    const locale = normalizeLocale(
      body.locale ??
        body.lang ??
        req.headers.get('accept-language') ??
        req.headers.get('Accept-Language')
    );

    const payload = await callPatternMirrorModel(content, locale);
    return NextResponse.json<PatternMirrorResponse>(payload);
  } catch (error) {
    console.error('[pattern-mirror]', error);
    const locale = normalizeLocale(null);
    return NextResponse.json<PatternMirrorResponse | PatternMirrorError>(
      { ...(samples[locale] ?? samples[fallbackLocale]), meta: { source: 'sample-fallback' } },
      { status: 200 }
    );
  }
}
