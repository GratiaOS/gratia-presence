export type PatternMirrorLocale = 'en' | 'es' | 'ro';

export type PatternMirrorRequest = {
  content: string;
  source?: 'medium' | 'youtube' | 'other';
  lang?: PatternMirrorLocale;
  locale?: PatternMirrorLocale;
};

export type PatternMirrorResponse = {
  reflectionBullets: string[];
  patternChips: string[];
  energyTone: string;
  nextTrueStepPrompt: string;
  meta?: {
    source?: 'sample-fallback' | 'sample-lang-guard' | 'model';
  };
};

export type PatternMirrorError = {
  error: 'EMPTY_CONTENT' | 'INTERNAL_ERROR';
};
