'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge, Button, Card, Pill, Toolbar, ToolbarGroup, Whisper } from '@gratiaos/ui';
import { Leaf } from '@gratiaos/icons';

import type { PatternMirrorLocale, PatternMirrorResponse } from '../api/pattern-mirror/types';
import { I18nProvider, useTranslation } from '../../i18n/I18nProvider';
import { resources } from '../../i18n/resources';
import { defaultLocale } from '../../i18n/config.js';
import { useSkinField } from '../skin/SkinFieldProvider';

type Stage = 'idle' | 'ready' | 'listening' | 'reflection' | 'trueStep' | 'error';
type PatternMeta = { label: string; description?: string; tone?: string; emoji?: string };
type TruthSeed = { text: string; createdAt: string; locale: PatternMirrorLocale };

const TRUTH_SEEDS_KEY = 'pattern-mirror.truth-seeds';
const TOOLBAR_NOZZLE_KEY = 'pattern-mirror.toolbar-nozzle';
const TOOLBAR_HINT_KEY = 'pattern-mirror.toolbar-hint-seen';
const reflectionLocales: PatternMirrorLocale[] = ['en', 'es', 'ro'];
const normalizePatternKey = (chip: string) => chip.trim().toLowerCase().replace(/\s+/g, '-');

function PatternMirrorContent() {
  const { t, locale: translationLocale, setLocale } = useTranslation('reflection');
  const { t: tCommon } = useTranslation('common');
  const { skinId, setSkinId } = useSkinField();
  const searchParams = useSearchParams();
  const mirrorLocale: PatternMirrorLocale =
    translationLocale === 'es' ? 'es' : translationLocale === 'ro' ? 'ro' : 'en';

  const [text, setText] = React.useState('');
  const [stage, setStage] = React.useState<Stage>('idle');
  const [reflectionBullets, setReflectionBullets] = React.useState<string[]>([]);
  const [patternChips, setPatternChips] = React.useState<string[]>([]);
  const [energyTone, setEnergyTone] = React.useState<string | null>(null);
  const [trueStepPrompt, setTrueStepPrompt] = React.useState<string | null>(null);
  const [savedTruth, setSavedTruth] = React.useState<string | null>(null);
  const [showWritingPad, setShowWritingPad] = React.useState(false);
  const [writingPadValue, setWritingPadValue] = React.useState('');
  const [activePattern, setActivePattern] = React.useState<string | null>(null);
  const [payloadMetaSource, setPayloadMetaSource] = React.useState<string | null>(null);
  const [mediumComment, setMediumComment] = React.useState<string | null>(null);
  const [mediumCommentLocale, setMediumCommentLocale] = React.useState<PatternMirrorLocale | null>(
    null
  );
  const [mediumCopied, setMediumCopied] = React.useState(false);
  const [typoMode, setTypoMode] = React.useState<'ui' | 'mono'>('ui');
  const [toolbarDepth, setToolbarDepth] = React.useState<1 | 2>(1);
  const [toolbarNozzle, setToolbarNozzle] = React.useState<1 | 2 | 3>(1);
  const [toolbarHintSeen, setToolbarHintSeen] = React.useState(false);
  const hasText = text.trim().length > 0;
  const toolbarDepthTimer = React.useRef<number | null>(null);
  const stageRef = React.useRef<Stage>(stage);
  // Pause-detect (idle nudge after a quiet moment — does NOT auto-submit)
  // Trigger = first pause (~1.6–2.0s idle) OR max 9s from first character.
  const PAUSE_IDLE_MS = 1800;
  const FIRST_CHAR_MAX_MS = 9000;
  const PAUSE_MIN_CHARS = 18;
  const pauseTimerRef = React.useRef<number | null>(null);
  const firstCharTimerRef = React.useRef<number | null>(null);
  const firstCharAtRef = React.useRef<number | null>(null);
  const textRef = React.useRef<string>('');
  const suppressAutoRevealRef = React.useRef(false);

  // G 📻 — local ambient tone bed (no external streams; user-initiated)
  const [radioOn, setRadioOn] = React.useState(false);
  const [radioHz, setRadioHz] = React.useState<number>(528);
  const [radioVolume, setRadioVolume] = React.useState<number>(0.06);
  const [radioMode, setRadioMode] = React.useState<'single' | 'binaural'>('single');
  const [radioBeatHz, setRadioBeatHz] = React.useState<number>(6);

  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const oscRef = React.useRef<OscillatorNode | null>(null);
  const osc2Ref = React.useRef<OscillatorNode | null>(null);
  const gainRef = React.useRef<GainNode | null>(null);
  const filterRef = React.useRef<BiquadFilterNode | null>(null);
  const panLRef = React.useRef<StereoPannerNode | null>(null);
  const panRRef = React.useRef<StereoPannerNode | null>(null);

  const RADIO_PRESETS = React.useMemo(
    () => [
      { hz: 432, label: '432 Hz' },
      { hz: 528, label: '528 Hz' },
      { hz: 639, label: '639 Hz' },
      { hz: 741, label: '741 Hz' },
      { hz: 852, label: '852 Hz' },
    ],
    []
  );

  const [idleNudgeVisible, setIdleNudgeVisible] = React.useState(false);
  const [presenceIdle, setPresenceIdle] = React.useState(false);
  const [presenceWhisper, setPresenceWhisper] = React.useState<string>('');

  const [inputFocused, setInputFocused] = React.useState(false);
  const [resultsHovered, setResultsHovered] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = React.useState(false);
  const [toolbarHover, setToolbarHover] = React.useState(false);
  const [toolbarPinnedOpen, setToolbarPinnedOpen] = React.useState(false);
  const toolbarRef = React.useRef<HTMLDivElement | null>(null);

  const resultsRef = React.useRef<HTMLDivElement | null>(null);

  // Textarea auto-grow (bounded)
  const TEXTAREA_MAX_PX_MOBILE = 240;
  const TEXTAREA_MAX_PX_DESKTOP = 360;
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const patternPack =
    (resources as any)[mirrorLocale]?.patterns ??
    (resources as any)[defaultLocale as PatternMirrorLocale]?.patterns ??
    {};

  const isResultsStage = stage === 'reflection' || stage === 'trueStep' || stage === 'error';
  const visibleTrueStepPrompt = trueStepPrompt ?? t('trueStep_phrase');
  const canShowReflection = stage === 'reflection' || stage === 'trueStep';
  const hintKey: 'hint_idle' | 'hint_ready' | 'hint_listening' | 'hint_results' =
    stage === 'ready'
      ? 'hint_ready'
      : stage === 'listening'
        ? 'hint_listening'
        : isResultsStage
          ? 'hint_results'
          : 'hint_idle';
  const localeLabels: Record<PatternMirrorLocale, string> = {
    en: tCommon('locales.en'),
    es: tCommon('locales.es'),
    ro: tCommon('locales.ro'),
  };
  const nozzleMood: 'soft' | 'focused' | 'celebratory' =
    toolbarNozzle === 1 ? 'soft' : toolbarNozzle === 2 ? 'focused' : 'celebratory';
  const nozzleLabels: Record<'soft' | 'focused' | 'celebratory', string> = {
    soft: tCommon('nozzle.soft'),
    focused: tCommon('nozzle.focused'),
    celebratory: tCommon('nozzle.celebratory'),
  };

  // Reveal gating: allow full mirror only after the text has a real "paragraph",
  // unless the input is a link (links can be mirrored immediately).
  const trimmedText = text.trim();
  const isLinkInput = /^https?:\/\//i.test(trimmedText);
  const hasParagraph = trimmedText.includes('\n') || trimmedText.length >= 140;
  const canReveal = isLinkInput || hasParagraph;

  // Idle whisper should feel like a tiny reflection, not a CTA.
  const idleWhisperText = React.useMemo(() => {
    if (!trimmedText) return '';
    // If it's a link, keep it soft + simple.
    if (isLinkInput) {
      return t('whisper_line');
    }

    // Take the last meaningful line/sentence and mirror it back gently.
    const lines = trimmedText
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    const lastLine = lines[lines.length - 1] ?? trimmedText;

    // If there’s enough material, offer a micro-mirror rather than an instruction.
    if (trimmedText.length >= PAUSE_MIN_CHARS) {
      const snippet = lastLine.length > 84 ? lastLine.slice(0, 84).trimEnd() + '…' : lastLine;
      return `“${snippet}”`;
    }

    // Not enough yet → keep it as presence.
    return t('mirror_whisper');
  }, [trimmedText, isLinkInput, t]);

  const presenceWhispers = React.useMemo(() => {
    const fromLocale = (resources as any)[mirrorLocale]?.reflection?.presence_whispers;
    const fromDefault = (resources as any)[defaultLocale as PatternMirrorLocale]?.reflection
      ?.presence_whispers;
    const list = Array.isArray(fromLocale) && fromLocale.length ? fromLocale : fromDefault;
    const normalized = Array.isArray(list)
      ? list.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
      : [];
    return normalized.length ? normalized : [t('mirror_whisper')];
  }, [mirrorLocale, t]);

  const pickPresenceWhisper = React.useCallback(() => {
    if (!presenceWhispers.length) return;
    const next = presenceWhispers[Math.floor(Math.random() * presenceWhispers.length)];
    setPresenceWhisper(next);
  }, [presenceWhispers]);

  const seedsForLocale = React.useMemo(
    () => loadTruthSeeds().filter((s) => s.locale === mirrorLocale),
    [mirrorLocale]
  );
  const prefillValue = React.useMemo(
    () => searchParams.get('text') ?? searchParams.get('url'),
    [searchParams]
  );
  // Removed buttonGlow, no longer used.
  const skinGroups = [
    {
      id: 'warm',
      options: [
        { id: 'SUN', label: `☀️ ${tCommon('skins.sun')}` },
        { id: 'GARDEN', label: `🌿 ${tCommon('skins.garden')}` },
      ],
    },
    {
      id: 'night',
      options: [
        { id: 'MOON', label: `🌙 ${tCommon('skins.moon')}` },
        { id: 'STELLAR', label: `🟣 ${tCommon('skins.stellar')}` },
      ],
    },
  ] as const;

  React.useEffect(() => {
    const incoming = prefillValue?.trim();
    if (incoming && !text) {
      textRef.current = incoming;
      setText(incoming);
      setStage('ready');
    }
  }, [prefillValue, text]);

  React.useEffect(() => {
    setMediumComment(null);
    setMediumCommentLocale(null);
    setMediumCopied(false);
  }, [mirrorLocale]);

  React.useEffect(() => {
    const hasText = text.length > 0;
    if (hasText) {
      setToolbarCollapsed(true);
    } else {
      setToolbarCollapsed(false);
      setToolbarPinnedOpen(false);
    }
  }, [hasText]);

  React.useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  React.useEffect(() => {
    if (stage === 'listening' || isResultsStage) {
      if (presenceIdle) setPresenceIdle(false);
      return;
    }

    if (trimmedText) {
      if (presenceIdle) setPresenceIdle(false);
      return;
    }

    const timer = window.setTimeout(() => {
      pickPresenceWhisper();
      setPresenceIdle(true);
    }, 9000);

    return () => window.clearTimeout(timer);
  }, [stage, isResultsStage, trimmedText, presenceIdle, pickPresenceWhisper]);

  React.useEffect(() => {
    if (!presenceWhispers.length) return;
    setPresenceWhisper((prev) =>
      prev && presenceWhispers.includes(prev) ? prev : presenceWhispers[0]
    );
  }, [presenceWhispers]);

  React.useEffect(() => {
    if (!presenceIdle || trimmedText) return;
    const interval = window.setInterval(() => {
      pickPresenceWhisper();
    }, 12000);
    return () => window.clearInterval(interval);
  }, [presenceIdle, trimmedText, pickPresenceWhisper]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('gratia.typo');
    const dataset = document.documentElement.dataset.typo;
    const next = stored === 'mono' || dataset === 'mono' ? 'mono' : 'ui';
    setTypoMode((prev) => (prev === next ? prev : next));
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // migration: legacy simple/advanced -> nozzle (1..3)
    const legacyMode = window.localStorage.getItem('pattern-mirror.toolbar-mode');
    const storedNozzle = window.localStorage.getItem(TOOLBAR_NOZZLE_KEY);
    let nextNozzle: 1 | 2 | 3 = 1;
    if (storedNozzle === '2') nextNozzle = 2;
    if (storedNozzle === '3') nextNozzle = 3;
    if (!storedNozzle && legacyMode === 'advanced') nextNozzle = 3;
    setToolbarNozzle(nextNozzle);

    const seen = window.localStorage.getItem(TOOLBAR_HINT_KEY) === '1';
    setToolbarHintSeen(seen);
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.typo = typoMode;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gratia.typo', typoMode);
    }
  }, [typoMode]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOOLBAR_NOZZLE_KEY, String(toolbarNozzle));
  }, [toolbarNozzle]);

  React.useEffect(() => {
    return () => {
      if (toolbarDepthTimer.current) {
        window.clearTimeout(toolbarDepthTimer.current);
      }
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      if (firstCharTimerRef.current) window.clearTimeout(firstCharTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    if (!radioOn || !ctx || !gain) return;

    try {
      // Longer ramp = more "suave" + less clicky
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, radioVolume), ctx.currentTime + 0.25);
    } catch {}
  }, [radioOn, radioVolume]);

  React.useEffect(() => {
    const ctx = audioCtxRef.current;
    const osc = oscRef.current;
    if (!radioOn || !ctx || !osc) return;

    try {
      if (radioMode === 'binaural' && osc2Ref.current) {
        const half = Math.max(0.5, radioBeatHz / 2);
        osc.frequency.setValueAtTime(Math.max(1, radioHz - half), ctx.currentTime);
        osc2Ref.current.frequency.setValueAtTime(Math.max(1, radioHz + half), ctx.currentTime);
      } else {
        osc.frequency.setValueAtTime(radioHz, ctx.currentTime);
      }
    } catch {}
  }, [radioOn, radioHz, radioMode, radioBeatHz]);

  const stopRadio = React.useCallback(() => {
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;

    // Fade out to avoid a hard cut click
    if (ctx && gain) {
      try {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      } catch {}
    }

    const stopAt = ctx ? ctx.currentTime + 0.21 : undefined;

    try {
      if (oscRef.current) {
        if (stopAt) oscRef.current.stop(stopAt);
        else oscRef.current.stop();
        oscRef.current.disconnect();
      }
    } catch {}
    oscRef.current = null;

    try {
      if (osc2Ref.current) {
        if (stopAt) osc2Ref.current.stop(stopAt);
        else osc2Ref.current.stop();
        osc2Ref.current.disconnect();
      }
    } catch {}
    osc2Ref.current = null;

    try {
      if (panLRef.current) panLRef.current.disconnect();
    } catch {}
    panLRef.current = null;

    try {
      if (panRRef.current) panRRef.current.disconnect();
    } catch {}
    panRRef.current = null;

    try {
      if (filterRef.current) filterRef.current.disconnect();
    } catch {}
    filterRef.current = null;

    try {
      if (gainRef.current) gainRef.current.disconnect();
    } catch {}
    gainRef.current = null;
  }, []);

  const startRadio = React.useCallback(
    async (hz: number) => {
      // Must be user-initiated to satisfy autoplay policies.
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as
        | typeof AudioContext
        | undefined;
      if (!Ctx) return;

      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();

      try {
        if (audioCtxRef.current.state === 'suspended') {
          await audioCtxRef.current.resume();
        }
      } catch {}

      stopRadio();

      const ctx = audioCtxRef.current;

      // Gain (with softer attack)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, radioVolume), ctx.currentTime + 0.25);

      // Gentle low-pass to soften the pure sine and reduce perceived sharpness
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(0.7, ctx.currentTime);

      filterRef.current = filter;
      gainRef.current = gain;

      if (radioMode === 'binaural') {
        const half = Math.max(0.5, radioBeatHz / 2);
        const leftHz = Math.max(1, hz - half);
        const rightHz = Math.max(1, hz + half);

        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.type = 'sine';
        oscR.type = 'sine';
        oscL.frequency.setValueAtTime(leftHz, ctx.currentTime);
        oscR.frequency.setValueAtTime(rightHz, ctx.currentTime);

        const panL = ctx.createStereoPanner();
        const panR = ctx.createStereoPanner();
        panL.pan.setValueAtTime(-0.6, ctx.currentTime);
        panR.pan.setValueAtTime(0.6, ctx.currentTime);

        // L/R oscillators -> panners -> filter -> gain -> destination
        oscL.connect(panL);
        oscR.connect(panR);
        panL.connect(filter);
        panR.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        oscRef.current = oscL;
        osc2Ref.current = oscR;
        panLRef.current = panL;
        panRRef.current = panR;

        oscL.start();
        oscR.start();
      } else {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(hz, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        oscRef.current = osc;
        osc2Ref.current = null;

        osc.start();
      }
    },
    [radioVolume, radioMode, radioBeatHz, stopRadio]
  );

  const setRadioEnabled = React.useCallback(
    async (nextOn: boolean, nextHz: number = radioHz) => {
      setRadioOn(nextOn);
      if (nextOn) {
        await startRadio(nextHz);
      } else {
        stopRadio();
      }
    },
    [radioHz, startRadio, stopRadio]
  );

  const pulseToolbarDepth = (level: 1 | 2 = 2, ms = 520) => {
    if (toolbarDepthTimer.current) {
      window.clearTimeout(toolbarDepthTimer.current);
    }
    setToolbarDepth(level);
    toolbarDepthTimer.current = window.setTimeout(() => setToolbarDepth(1), Math.max(200, ms));
  };

  const latestSkinIdRef = React.useRef(skinId);

  React.useEffect(() => {
    latestSkinIdRef.current = skinId;
  }, [skinId]);

  React.useEffect(() => {
    if (!savedTruth && seedsForLocale.length > 0) {
      setSavedTruth(seedsForLocale[0]?.text ?? null);
    }
  }, [savedTruth, seedsForLocale]);

  React.useEffect(() => {
    if (isResultsStage) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isResultsStage]);

  React.useEffect(() => {
    // Match M3: force base palette by removing skin + pinning tone vars.
    const root = document.documentElement;
    const previous = root.getAttribute('data-skin-id');
    const prevPadDrift = root.getAttribute('data-pad-drift');
    const prevToneSurface = root.style.getPropertyValue('--tone-surface');
    const prevToneInk = root.style.getPropertyValue('--tone-ink');
    const prevToneAccent = root.style.getPropertyValue('--tone-accent');
    const prevToneBorder = root.style.getPropertyValue('--tone-border');

    root.removeAttribute('data-skin-id');
    root.setAttribute('data-pad-drift', 'm3');

    return () => {
      const next = latestSkinIdRef.current;
      if (next) {
        root.setAttribute('data-skin-id', next);
      } else if (previous) {
        root.setAttribute('data-skin-id', previous);
      } else {
        root.removeAttribute('data-skin-id');
      }
      if (prevPadDrift) root.setAttribute('data-pad-drift', prevPadDrift);
      else root.removeAttribute('data-pad-drift');
      if (prevToneSurface) root.style.setProperty('--tone-surface', prevToneSurface);
      else root.style.removeProperty('--tone-surface');
      if (prevToneInk) root.style.setProperty('--tone-ink', prevToneInk);
      else root.style.removeProperty('--tone-ink');
      if (prevToneAccent) root.style.setProperty('--tone-accent', prevToneAccent);
      else root.style.removeProperty('--tone-accent');
      if (prevToneBorder) root.style.setProperty('--tone-border', prevToneBorder);
      else root.style.removeProperty('--tone-border');
      stopRadio();
      try {
        audioCtxRef.current?.suspend();
      } catch {}
    };
    // Intentional empty deps: run only on mount/unmount with initial skinId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Keep base palette even if a skin toggle updates the dataset.
    const root = document.documentElement;
    if (root.hasAttribute('data-skin-id')) {
      root.removeAttribute('data-skin-id');
    }
  }, [skinId]);

  const resizeTextarea = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Determine cap by viewport (mobile vs desktop)
    const isMobile =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 640px)').matches;
    const maxPx = isMobile ? TEXTAREA_MAX_PX_MOBILE : TEXTAREA_MAX_PX_DESKTOP;

    // Reset height so scrollHeight is accurate, then clamp.
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, maxPx);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxPx ? 'auto' : 'hidden';
  }, []);

  React.useEffect(() => {
    resizeTextarea();
  }, [text, resizeTextarea]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia?.('(max-width: 640px)');
    const update = () => {
      setIsMobile(Boolean(mq ? mq.matches : window.innerWidth <= 640));
    };

    const onResize = () => {
      resizeTextarea();
      update();
    };

    update();
    window.addEventListener('resize', onResize);

    if (mq?.addEventListener) {
      mq.addEventListener('change', update);
      return () => {
        window.removeEventListener('resize', onResize);
        mq.removeEventListener('change', update);
      };
    }

    return () => window.removeEventListener('resize', onResize);
  }, [resizeTextarea]);

  const handleChange = (value: string) => {
    textRef.current = value;
    suppressAutoRevealRef.current = false;

    if (pauseTimerRef.current) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    // Any new typing hides the nudge; we only show it after a pause.
    setIdleNudgeVisible(false);
    setPresenceIdle(false);

    const trimmed = value.trim();
    if (trimmed && !firstCharAtRef.current && stage !== 'listening') {
      firstCharAtRef.current = Date.now();
      if (firstCharTimerRef.current) window.clearTimeout(firstCharTimerRef.current);
      firstCharTimerRef.current = window.setTimeout(() => {
        firstCharTimerRef.current = null;
        const latest = (textRef.current || '').trim();
        if (!latest) return;
        if (suppressAutoRevealRef.current) return;
        if (stageRef.current === 'listening') return;
        setIdleNudgeVisible(true);
      }, FIRST_CHAR_MAX_MS);
    }

    if (trimmed && stage !== 'listening') {
      pauseTimerRef.current = window.setTimeout(() => {
        pauseTimerRef.current = null;
        const latest = (textRef.current || '').trim();
        if (!latest) return;
        if (suppressAutoRevealRef.current) return;
        if (stageRef.current === 'listening') return;
        if (latest.length < PAUSE_MIN_CHARS) return;
        setIdleNudgeVisible(true);
      }, PAUSE_IDLE_MS);
    }

    setText(value);
    if (!value.trim()) {
      firstCharAtRef.current = null;
      if (firstCharTimerRef.current) {
        window.clearTimeout(firstCharTimerRef.current);
        firstCharTimerRef.current = null;
      }
      setStage('idle');
      return;
    }
    if (stage !== 'listening') {
      setStage('ready');
    }
  };

  const handleRevealReflection = async () => {
    const current = (textRef.current || text).trim();
    if (!current || stage === 'listening') return;

    if (pauseTimerRef.current) {
      window.clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    setIdleNudgeVisible(false);
    setPresenceIdle(false);
    firstCharAtRef.current = null;
    if (firstCharTimerRef.current) {
      window.clearTimeout(firstCharTimerRef.current);
      firstCharTimerRef.current = null;
    }

    // Gate: only reveal the full mirror after a paragraph (unless it’s a link).
    if (!canReveal) {
      setStage(current ? 'ready' : 'idle');
      return;
    }

    setStage('listening');
    setMediumComment(null);
    setMediumCommentLocale(null);
    setMediumCopied(false);

    try {
      const res = await fetch('/api/pattern-mirror', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': mirrorLocale,
        },
        body: JSON.stringify({
          content: current,
          lang: mirrorLocale,
          locale: mirrorLocale,
          mood: nozzleMood,
        }),
      });

      const data = (await res.json()) as PatternMirrorResponse;

      setReflectionBullets(data.reflectionBullets ?? []);
      setPatternChips(data.patternChips ?? []);
      setEnergyTone(data.energyTone ?? null);
      setTrueStepPrompt(data.nextTrueStepPrompt ?? null);
      setPayloadMetaSource(data.meta?.source ?? null);

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[pattern-mirror] source:', data.meta?.source ?? 'unknown');
      }

      setStage('reflection');
    } catch (error) {
      console.error('[pattern-mirror]', error);
      setPayloadMetaSource('sample-fallback');
      setStage('error');
    } finally {
      // nothing to do here
    }
  };

  // Removed handleSelectTab; no longer needed due to single-flow UI.

  const openWritingPad = () => {
    setWritingPadValue('');
    setShowWritingPad(true);
  };

  const saveWritingPad = () => {
    const trimmed = writingPadValue.trim();
    if (trimmed) {
      setSavedTruth(trimmed);
      persistTruthSeed({
        text: trimmed,
        locale: mirrorLocale,
        createdAt: new Date().toISOString(),
      });
    }
    setShowWritingPad(false);
  };

  const getPatternMeta = (chip: string): { key: string; meta?: PatternMeta } => {
    const key = normalizePatternKey(chip);
    return { key, meta: patternPack?.[key] as PatternMeta | undefined };
  };

  const activePatternMeta = activePattern
    ? (patternPack?.[activePattern] as PatternMeta | undefined)
    : null;

  const buildMediumComment = () => {
    const seedsLine = patternChips
      .slice(0, 3)
      .map((chip) => {
        const { key, meta } = getPatternMeta(chip);
        const emoji = meta?.emoji ?? '🌱';
        const label = meta?.label ?? key;
        return `${emoji} ${label}`;
      })
      .filter(Boolean)
      .join(' · ');

    const lines: string[] = [];
    lines.push(t('section_reflection_title'));
    lines.push('');
    reflectionBullets.forEach((b) => {
      const line = typeof b === 'string' ? b.trim() : String(b ?? '').trim();
      if (line) lines.push(`• ${line}`);
    });
    lines.push('');

    if (seedsLine) {
      lines.push(t('section_patterns_title'));
      lines.push('');
      lines.push(seedsLine);
      lines.push('');
    }

    if (energyTone) {
      lines.push(`${t('tone_label')} ${energyTone}.`);
      lines.push('');
    }

    if (visibleTrueStepPrompt) {
      lines.push(t('trueStep_title'));
      lines.push('');
      lines.push(`*${visibleTrueStepPrompt.trim()}*`);
      lines.push('');
      lines.push(t('trueStep_hint'));
      lines.push('');
    }

    lines.push('🪷');
    lines.push(t('whisper_line'));

    return lines.join('\n');
  };

  const handleGenerateMediumComment = async () => {
    if (
      reflectionBullets.length === 0 &&
      patternChips.length === 0 &&
      !energyTone &&
      !visibleTrueStepPrompt
    ) {
      return;
    }

    const comment = buildMediumComment();
    setMediumComment(comment);
    setMediumCommentLocale(mirrorLocale);

    try {
      await navigator.clipboard.writeText(comment);
      setMediumCopied(true);
      setTimeout(() => setMediumCopied(false), 2500);
    } catch (err) {
      console.error('[pattern-mirror] failed to copy medium comment', err);
    }
  };

  // Toolbar sigil open/close helpers
  const openToolbar = () => {
    setToolbarPinnedOpen(true);
    // pulse depth so it feels alive but only on interaction
    pulseToolbarDepth(2, 520);
    // focus first button for keyboard users
    requestAnimationFrame(() => {
      const el = toolbarRef.current;
      const first = el?.querySelector('button') as HTMLButtonElement | null;
      first?.focus();
    });
  };

  const closeToolbar = () => {
    setToolbarPinnedOpen(false);
  };

  const setNozzle = (level: 1 | 2 | 3) => {
    setToolbarNozzle(level);
    pulseToolbarDepth(2, 520);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOOLBAR_HINT_KEY, '1');
    }
    setToolbarHintSeen(true);
  };

  return (
    <main
      className="pm-page"
      data-pm-has-text={hasText}
      data-pm-idle={Boolean(idleNudgeVisible || presenceIdle)}
      data-input-focused={inputFocused}
      data-results-hovered={resultsHovered}
      data-nozzle-mood={nozzleMood}
    >
      <div className="pm-page-inner">
        <div className="pm-hero">
          <div className="pm-lotus-shell">
            <span className="pm-lotus-mark">🪷</span>
          </div>
          <p className="pm-mirror-whisper">{t('mirror_whisper')}</p>
        </div>

        <div className="pm-toolbar-shell">
          {toolbarCollapsed && !toolbarPinnedOpen && (
            <button
              type="button"
              className="pm-sigil whisper-ring"
              aria-label="Open controls"
              onClick={openToolbar}
              onFocus={openToolbar}
            >
              ⟡
            </button>
          )}

          <Toolbar
            ref={(node) => {
              toolbarRef.current = node as HTMLDivElement | null;
            }}
            aria-label="Pattern Mirror controls"
            data-depth={toolbarDepth}
            data-collapsed={toolbarCollapsed && !toolbarHover && !toolbarPinnedOpen}
            data-open={toolbarPinnedOpen}
            onMouseEnter={() => setToolbarHover(true)}
            onMouseLeave={() => setToolbarHover(false)}
            onFocusCapture={() => setToolbarHover(true)}
            onBlurCapture={(e) => {
              // close only when focus leaves the whole toolbar
              const next = e.relatedTarget as Node | null;
              const root = toolbarRef.current;
              if (root && next && root.contains(next)) return;
              setToolbarHover(false);
              closeToolbar();
            }}
            density="snug"
            className="pm-toolbar pm-toolbar-auto"
          >
            <ToolbarGroup>
              {reflectionLocales.map((code) => {
                const active = code === mirrorLocale;
                return (
                  <Pill
                    key={code}
                    as="button"
                    data-active={active}
                    className="pm-pill"
                    variant={active ? 'soft' : 'subtle'}
                    tone="subtle"
                    density="snug"
                    onClick={() => setLocale(code)}
                  >
                    {localeLabels[code] ?? code.toUpperCase()}
                  </Pill>
                );
              })}

              <span className="pm-sep" aria-hidden="true">
                ⟡
              </span>

              {skinGroups.map((group, groupIdx) => (
                <React.Fragment key={group.id}>
                  {group.options.map((option) => {
                    const active = skinId === option.id;
                    return (
                      <Pill
                        key={option.id}
                        as="button"
                        data-active={active}
                        className="pm-pill"
                        variant={active ? 'soft' : 'subtle'}
                        tone="subtle"
                        density="snug"
                        onClick={() => {
                          setSkinId(option.id);
                          pulseToolbarDepth();
                        }}
                      >
                        {option.label}
                      </Pill>
                    );
                  })}

                  {groupIdx < skinGroups.length - 1 && (
                    <span className="pm-sep" aria-hidden="true">
                      ⟡
                    </span>
                  )}
                </React.Fragment>
              ))}

              {toolbarNozzle >= 2 && (
                <>
                  <span className="pm-sep" aria-hidden="true">
                    ⟡
                  </span>

                  {(
                    [
                      { id: 'ui', label: tCommon('types.default') },
                      { id: 'mono', label: tCommon('types.vienna') },
                    ] as const
                  ).map((opt) => {
                    const active = typoMode === opt.id;
                    return (
                      <Pill
                        key={opt.id}
                        as="button"
                        data-active={active}
                        className="pm-pill"
                        variant={active ? 'soft' : 'subtle'}
                        tone="subtle"
                        density="snug"
                        onClick={() => {
                          setTypoMode(opt.id);
                          pulseToolbarDepth();
                        }}
                      >
                        {opt.label}
                      </Pill>
                    );
                  })}

                  {toolbarNozzle === 3 && (
                    <>
                      <span className="pm-sep" aria-hidden="true">
                        ⟡
                      </span>

                      <div className="pm-radio-controls" data-radio-on={radioOn}>
                        <Pill
                          as="button"
                          className="pm-pill"
                          variant={radioOn ? 'soft' : 'subtle'}
                          tone={radioOn ? 'accent' : 'subtle'}
                          density="snug"
                          data-active={radioOn}
                          onClick={async () => {
                            pulseToolbarDepth();
                            await setRadioEnabled(!radioOn, radioHz);
                          }}
                          title="G 📻 — ambient tone bed"
                        >
                          G 📻
                        </Pill>

                        <select
                          aria-label="G Radio mode"
                          className="pm-radio-select"
                          value={radioMode}
                          onChange={async (e) => {
                            const next = (e.target.value as 'single' | 'binaural') || 'single';
                            setRadioMode(next);
                            pulseToolbarDepth();
                            if (radioOn) await startRadio(radioHz);
                          }}
                        >
                          <option value="single">1x</option>
                          <option value="binaural">2x</option>
                        </select>

                        {radioMode === 'binaural' && (
                          <input
                            aria-label="Binaural beat Hz"
                            className="pm-radio-range"
                            type="range"
                            min={1}
                            max={12}
                            step={1}
                            value={radioBeatHz}
                            onChange={async (e) => {
                              const next = Number(e.target.value);
                              setRadioBeatHz(next);
                              pulseToolbarDepth();
                              if (radioOn) await startRadio(radioHz);
                            }}
                            title={`${radioBeatHz} Hz beat`}
                          />
                        )}

                        <select
                          aria-label="G Radio frequency"
                          className="pm-radio-select"
                          value={radioHz}
                          onChange={async (e) => {
                            const next = Number(e.target.value);
                            setRadioHz(next);
                            pulseToolbarDepth();
                            if (radioOn) await startRadio(next);
                          }}
                        >
                          {RADIO_PRESETS.map((preset) => (
                            <option key={preset.hz} value={preset.hz}>
                              {preset.label}
                            </option>
                          ))}
                        </select>

                        <input
                          aria-label="G Radio volume"
                          className="pm-radio-range"
                          type="range"
                          min={0.0}
                          max={0.18}
                          step={0.005}
                          value={radioVolume}
                          onChange={(e) => setRadioVolume(Number(e.target.value))}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </ToolbarGroup>
          </Toolbar>
        </div>

        <div className="pm-input">
          <div className="pm-input-wrap">
            {isMobile ? (
              <div className="pm-mobile-stack">
                {(stage === 'ready' || stage === 'idle') && !suppressAutoRevealRef.current ? (
                  <button
                    type="button"
                    className="pm-idle-whisper pm-idle-whisper--mobile"
                    aria-label="Presence whisper"
                    onClick={() => {
                      if (!trimmedText) return;
                      suppressAutoRevealRef.current = true;
                      void handleRevealReflection();
                    }}
                  >
                    <span className="pm-idle-whisper-icon" aria-hidden>
                      🐸
                    </span>
                    <span className="pm-idle-whisper-text">
                      {trimmedText ? idleWhisperText : presenceWhisper}
                    </span>
                  </button>
                ) : null}

                <textarea
                  ref={(node) => {
                    textareaRef.current = node;
                  }}
                  value={text}
                  onChange={(e) => {
                    handleChange(e.target.value);
                    // resize after React state updates
                    requestAnimationFrame(() => resizeTextarea());
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      suppressAutoRevealRef.current = true;
                      if (pauseTimerRef.current) {
                        window.clearTimeout(pauseTimerRef.current);
                        pauseTimerRef.current = null;
                      }
                      setIdleNudgeVisible(false);
                      setPresenceIdle(false);
                      firstCharAtRef.current = null;
                      if (firstCharTimerRef.current) {
                        window.clearTimeout(firstCharTimerRef.current);
                        firstCharTimerRef.current = null;
                      }
                      setStage(textRef.current.trim() ? 'ready' : 'idle');
                    }
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  rows={5}
                  autoFocus
                  disabled={stage === 'listening'}
                  aria-label={t('mirror_whisper')}
                  data-focused={inputFocused}
                  className="pm-textarea"
                />

                <div className="pm-mobile-cta">
                  <button
                    type="button"
                    className="pm-mood-chip"
                    aria-label={nozzleLabels[nozzleMood]}
                    title={nozzleLabels[nozzleMood]}
                    onClick={() => {
                      const next = toolbarNozzle === 1 ? 2 : toolbarNozzle === 2 ? 3 : 1;
                      setNozzle(next);
                    }}
                    disabled={stage === 'listening'}
                  >
                    <span className="pm-mood-chip-icon" aria-hidden>
                      🌸
                    </span>
                    <span className="pm-mood-chip-steps" aria-hidden>
                      {toolbarNozzle === 1 ? '⟡' : toolbarNozzle === 2 ? '⟡⟡' : '⟡⟡⟡'}
                    </span>
                  </button>

                  <Button
                    variant="ghost"
                    tone="accent"
                    disabled={!text.trim() || stage === 'listening' || !canReveal}
                    loading={stage === 'listening'}
                    className="pm-reveal-btn"
                    onClick={() => {
                      suppressAutoRevealRef.current = true;
                      void handleRevealReflection();
                    }}
                  >
                    <span aria-hidden>🪷</span> {t('button_reveal')}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <textarea
                  ref={(node) => {
                    textareaRef.current = node;
                  }}
                  value={text}
                  onChange={(e) => {
                    handleChange(e.target.value);
                    // resize after React state updates
                    requestAnimationFrame(() => resizeTextarea());
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      suppressAutoRevealRef.current = true;
                      if (pauseTimerRef.current) {
                        window.clearTimeout(pauseTimerRef.current);
                        pauseTimerRef.current = null;
                      }
                      setIdleNudgeVisible(false);
                      setPresenceIdle(false);
                      firstCharAtRef.current = null;
                      if (firstCharTimerRef.current) {
                        window.clearTimeout(firstCharTimerRef.current);
                        firstCharTimerRef.current = null;
                      }
                      setStage(textRef.current.trim() ? 'ready' : 'idle');
                    }
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  rows={5}
                  autoFocus
                  disabled={stage === 'listening'}
                  aria-label={t('mirror_whisper')}
                  data-focused={inputFocused}
                  className="pm-textarea"
                />

                <div className="pm-input-footer pm-reveal-sticky">
                  {(stage === 'ready' || stage === 'idle') && !suppressAutoRevealRef.current ? (
                    <button
                      type="button"
                      className="pm-idle-whisper"
                      aria-label="Presence whisper"
                      onClick={() => {
                        if (!trimmedText) return;
                        suppressAutoRevealRef.current = true;
                        void handleRevealReflection();
                      }}
                    >
                      <span className="pm-idle-whisper-icon" aria-hidden>
                        🐸
                      </span>
                      <span className="pm-idle-whisper-text">
                        {trimmedText ? idleWhisperText : presenceWhisper}
                      </span>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className="pm-mood-chip"
                    aria-label={nozzleLabels[nozzleMood]}
                    title={nozzleLabels[nozzleMood]}
                    onClick={() => {
                      // cycle 1 → 2 → 3 → 1
                      const next = toolbarNozzle === 1 ? 2 : toolbarNozzle === 2 ? 3 : 1;
                      setNozzle(next);
                    }}
                    disabled={stage === 'listening'}
                  >
                    <span className="pm-mood-chip-icon" aria-hidden>
                      🌸
                    </span>
                    <span className="pm-mood-chip-steps" aria-hidden>
                      {toolbarNozzle === 1 ? '⟡' : toolbarNozzle === 2 ? '⟡⟡' : '⟡⟡⟡'}
                    </span>
                  </button>

                  <Button
                    variant="ghost"
                    tone="accent"
                    disabled={!text.trim() || stage === 'listening' || !canReveal}
                    loading={stage === 'listening'}
                    className="pm-reveal-btn"
                    onClick={() => {
                      suppressAutoRevealRef.current = true;
                      void handleRevealReflection();
                    }}
                  >
                    <span aria-hidden>🪷</span> {t('button_reveal')}
                  </Button>
                </div>
              </>
            )}

            {process.env.NODE_ENV === 'development' && payloadMetaSource === 'sample-fallback' && (
              <p className="pm-dev-hint">(using sample reflection — model not configured)</p>
            )}
          </div>
        </div>

        {(stage === 'reflection' || stage === 'trueStep' || stage === 'error') && (
          <Card
            ref={resultsRef}
            variant="plain"
            padding="lg"
            onMouseEnter={() => setResultsHovered(true)}
            onMouseLeave={() => setResultsHovered(false)}
            onFocusCapture={() => setResultsHovered(true)}
            onBlurCapture={() => setResultsHovered(false)}
            className="pm-results"
            data-hovered={resultsHovered}
          >
            <div className="pm-results-inner">
              {canShowReflection && (
                <div className="pm-results-body">
                  {patternChips.length > 0 && (
                    <div className="pm-seeds">
                      <p className="pm-seeds-title">{t('section_patterns_title')}</p>
                      <div className="pm-seeds-list">
                        {patternChips.map((chip) => {
                          const { key, meta } = getPatternMeta(chip);
                          if (!meta) return null;
                          const badgeContent = `${meta.emoji ?? ''} ${meta.label ?? key}`.trim();
                          return (
                            <Badge
                              key={chip}
                              tone="default"
                              variant="soft"
                              className="pm-seed-badge"
                              onClick={() =>
                                setActivePattern((prev) => (prev === key ? null : key))
                              }
                            >
                              {badgeContent}
                            </Badge>
                          );
                        })}
                      </div>

                      {activePattern && (
                        <Card variant="plain" padding="sm" className="pm-seed-meta">
                          <div className="pm-seed-meta-head">
                            <p className="pm-seed-meta-title">
                              {activePatternMeta?.label ?? activePattern.replace(/-/g, ' ')}
                            </p>
                            <button
                              type="button"
                              onClick={() => setActivePattern(null)}
                              className="pm-seed-meta-close"
                            >
                              ✕
                            </button>
                          </div>
                          {activePatternMeta?.description && (
                            <p className="pm-seed-meta-desc">{activePatternMeta.description}</p>
                          )}
                          {activePatternMeta?.tone && (
                            <p className="pm-seed-meta-tone">{activePatternMeta.tone}</p>
                          )}
                        </Card>
                      )}
                    </div>
                  )}
                  <div className="pm-reflection">
                    <p className="pm-reflection-title">{t('section_reflection_title')}</p>
                    <ul className="pm-reflection-list">
                      {reflectionBullets.slice(0, 3).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {energyTone && (
                    <div className="pm-tone">
                      {t('tone_label')} <span className="pm-tone-value">{energyTone}</span>
                    </div>
                  )}

                  <Whisper tone="presence" className="pm-cycles-whisper">
                    <span>🜁</span>
                    <span>{t('cycles_whisper')}</span>
                  </Whisper>

                  <div className="pm-true-step">
                    {/* Mirror Room: prompt-first, then the footstep action */}
                    <div className="pm-true-step-head">
                      <p className="pm-true-step-label">{t('trueStep_title')}</p>

                      <p className="pm-true-step-prompt">{visibleTrueStepPrompt}</p>
                    </div>

                    <div className="pm-true-step-actions">
                      <div>
                        <Button
                          variant="subtle"
                          leadingIcon={<Leaf size={18} aria-hidden />}
                          className="pm-true-step-btn"
                          onClick={openWritingPad}
                        >
                          {t('trueStep_button_openPad')}
                        </Button>
                      </div>

                      <p className="pm-true-step-hint">{t('trueStep_hint')}</p>
                    </div>

                    {savedTruth && (
                      <Card variant="plain" padding="sm" className="pm-saved-truth">
                        <p className="pm-saved-truth-label">{t('trueStep_saved_label')}</p>
                        <p className="pm-saved-truth-text">“{savedTruth}”</p>
                      </Card>
                    )}
                  </div>

                  <div className="pm-medium">
                    <div className="pm-medium-row">
                      <p className="pm-medium-helper">{t('medium_helper')}</p>
                      <Button
                        variant="ghost"
                        tone="default"
                        disabled={
                          reflectionBullets.length === 0 &&
                          patternChips.length === 0 &&
                          !energyTone &&
                          !visibleTrueStepPrompt
                        }
                        onClick={handleGenerateMediumComment}
                      >
                        {t('medium_button')}
                      </Button>
                    </div>

                    {mediumCopied && <p className="pm-medium-copied">{t('medium_copied')}</p>}

                    {mediumComment && mediumCommentLocale === mirrorLocale && (
                      <pre className="pm-medium-comment pm-longform">{mediumComment}</pre>
                    )}
                  </div>
                </div>
              )}

              {stage === 'error' && (
                <div className="pm-error">
                  <p className="pm-error-text">{t('error_text')}</p>
                  <Button
                    variant="outline"
                    tone="default"
                    className="pm-error-btn"
                    onClick={() => setStage(text.trim() ? 'ready' : 'idle')}
                  >
                    {t('error_back')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {showWritingPad && (
          <div className="pm-pad-overlay">
            <Card variant="elev" padding="lg" className="pm-pad-card">
              <div className="pm-pad-header">
                <p className="pm-pad-title">{t('pad_title')}</p>
                <Button variant="ghost" tone="default" onClick={() => setShowWritingPad(false)}>
                  ✕
                </Button>
              </div>
              <textarea
                value={writingPadValue}
                onChange={(e) => setWritingPadValue(e.target.value)}
                rows={4}
                className="pm-pad-textarea"
                placeholder={t('pad_placeholder')}
              />
              <div className="pm-pad-actions">
                <Button variant="ghost" tone="default" onClick={() => setShowWritingPad(false)}>
                  {t('pad_cancel')}
                </Button>
                <Button variant="solid" tone="default" onClick={saveWritingPad}>
                  {t('pad_save')}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PatternMirrorPageClient() {
  return (
    <I18nProvider>
      <PatternMirrorContent />
    </I18nProvider>
  );
}

function loadTruthSeeds(): TruthSeed[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TRUTH_SEEDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const text = typeof item.text === 'string' ? item.text : '';
        const locale = typeof item.locale === 'string' ? item.locale : '';
        const createdAt = typeof item.createdAt === 'string' ? item.createdAt : '';
        if (!text || !locale) return null;
        return {
          text,
          locale: locale as PatternMirrorLocale,
          createdAt: createdAt || new Date().toISOString(),
        };
      })
      .filter(Boolean) as TruthSeed[];
  } catch {
    return [];
  }
}

function persistTruthSeed(seed: TruthSeed) {
  if (typeof window === 'undefined') return;
  try {
    const seeds = loadTruthSeeds();
    const next = [{ ...seed, createdAt: new Date().toISOString() }, ...seeds].slice(0, 20);
    window.localStorage.setItem(TRUTH_SEEDS_KEY, JSON.stringify(next));
  } catch {
    // swallow
  }
}
