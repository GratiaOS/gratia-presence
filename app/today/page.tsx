'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Field } from '@gratiaos/ui';
import SunCalc from 'suncalc';
import { I18nProvider, useTranslation } from '../../i18n/I18nProvider';
import type { Locale } from '../../i18n/resources';
import { getContent, type LunarPage, type LunarPhase } from '../../lib/lunar-journal/content';
import {
  createLunarEntry,
  deleteLunarEntry,
  listLunarEntries,
  type LunarJournalEntry,
} from '../../lib/lunar-journal/storage';

const LUNAR_CYCLE_DAYS = 29.530588853;

type Recommendation = {
  phase: LunarPhase;
  age: number;
  primary: LunarPage;
};

function phaseFromAge(age: number): LunarPhase {
  if (age < 4.5 || age >= 28) return 'new-moon';
  if (age < 13.5) return 'waxing-moon';
  if (age < 18.5) return 'full-moon';
  return 'waning-moon';
}

function moonMarkFromAge(age: number) {
  if (age < 1.5 || age >= 28.5) return '🌑';
  if (age < 4.5) return '🌒';
  if (age < 11) return '🌓';
  if (age < 13.5) return '🌔';
  if (age < 16.5) return '🌕';
  if (age < 19) return '🌖';
  if (age < 25) return '🌗';
  return '🌘';
}

function pickPageIndex(phase: LunarPhase, age: number, pageCount: number) {
  if (pageCount <= 1) return 0;

  if (phase === 'new-moon') {
    const start = 28;
    const end = 4.5;
    const duration = LUNAR_CYCLE_DAYS - start + end;
    const progress = age >= start ? age - start : LUNAR_CYCLE_DAYS - start + age;
    return Math.min(pageCount - 1, Math.floor((progress / duration) * pageCount));
  }

  const windows: Record<Exclude<LunarPhase, 'new-moon'>, [number, number]> = {
    'waxing-moon': [4.5, 13.5],
    'full-moon': [13.5, 18.5],
    'waning-moon': [18.5, 28],
  };
  const [start, end] = windows[phase];
  const duration = end - start;
  const progress = Math.min(duration, Math.max(0, age - start));
  return Math.min(pageCount - 1, Math.floor((progress / duration) * pageCount));
}

function getRecommendation(date: Date, locale: Locale): Recommendation {
  const content = getContent(locale);
  const age = SunCalc.getMoonIllumination(date).phase * LUNAR_CYCLE_DAYS;
  const phase = phaseFromAge(age);
  const pages = content.phases[phase].pages;
  const index = pickPageIndex(phase, age, pages.length);
  const primary = pages[index] ?? pages[0];

  return { phase, age, primary };
}

function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getLocalJournalDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
}

function getDelayUntilNextLocalDay() {
  const now = new Date();
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  return nextDay.getTime() - now.getTime();
}

function TodayJournal() {
  const { locale } = useTranslation('lunar');
  const content = getContent(locale);
  const [journalDate, setJournalDate] = useState(() => getLocalJournalDate());
  const recommendation = useMemo(
    () => getRecommendation(journalDate, locale),
    [journalDate, locale]
  );
  const phaseInfo = content.phases[recommendation.phase];
  const [draft, setDraft] = useState('');
  const [entries, setEntries] = useState<LunarJournalEntry[]>([]);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const refreshJournalDate = () => setJournalDate(getLocalJournalDate());
    const timeoutId = window.setTimeout(refreshJournalDate, getDelayUntilNextLocalDay());

    const refreshOnVisible = () => {
      if (document.visibilityState === 'visible') refreshJournalDate();
    };

    window.addEventListener('focus', refreshJournalDate);
    document.addEventListener('visibilitychange', refreshOnVisible);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('focus', refreshJournalDate);
      document.removeEventListener('visibilitychange', refreshOnVisible);
    };
  }, [journalDate]);

  useEffect(() => {
    setEntries(listLunarEntries());
  }, []);

  const saveEntry = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    createLunarEntry({
      locale,
      phase: recommendation.phase,
      pageKey: recommendation.primary.key,
      pageTitle: recommendation.primary.title,
      content: trimmed,
    });
    setDraft('');
    setEntries(listLunarEntries());
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1600);
  };

  const removeEntry = (id: string) => {
    deleteLunarEntry(id);
    setEntries(listLunarEntries());
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 p-5 pb-16 sm:px-8 sm:py-16">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-[color:var(--color-muted)] uppercase">
              {content.ui.eyebrow}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span aria-hidden="true" className="text-5xl/7">
                {moonMarkFromAge(recommendation.age)}
              </span>
              <div className="mt-1">
                <h1 className="text-body">{phaseInfo.title}</h1>
                <Badge variant="subtle">{formatDate(journalDate, locale)}</Badge>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,14rem)]">
          <article>
            <h2 className="font-gratia text-2xl font-medium tracking-tight md:text-3xl">
              {recommendation.primary.title}
            </h2>

            {recommendation.primary.intro.length > 0 ? (
              <div className="mt-3 max-w-2xl space-y-2 text-[color:var(--color-muted)]">
                {recommendation.primary.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {recommendation.primary.prompts.length > 0 ? (
              <ol className="mt-8 grid list-inside list-decimal gap-3 font-serif italic">
                {recommendation.primary.prompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ol>
            ) : null}

            <section className="mt-8 space-y-3">
              <Field id="lunar-entry" label={content.ui.writingLabel}>
                {(fieldProps) => (
                  <textarea
                    {...fieldProps}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={content.ui.writingPlaceholder}
                    rows={6}
                  />
                )}
              </Field>
              <div className="flex flex-wrap items-center gap-3">
                <Button tone="accent" onClick={saveEntry} disabled={!draft.trim()}>
                  {content.ui.save}
                </Button>
                {savedNotice ? (
                  <span className="text-sm text-[color:var(--color-muted)]">
                    {content.ui.saved}
                  </span>
                ) : null}
              </div>
            </section>
          </article>

          <aside className="space-y-5">
            <section className="space-y-3">
              <h2 className="text-xs tracking-[0.25em] text-[color:var(--color-muted)] uppercase">
                {content.ui.saved}
              </h2>
              {entries.length === 0 ? (
                <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                  {content.ui.empty}
                </p>
              ) : (
                <div className="grid gap-3">
                  {entries.slice(0, 6).map((entry) => (
                    <Card as="article" key={entry.id} variant="plain">
                      <div className="flex items-start justify-between gap-3">
                        <Badge variant="subtle">
                          {formatDate(new Date(entry.createdAt), entry.locale)}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => removeEntry(entry.id)}
                          className="text-xs text-[color:var(--color-muted)] underline-offset-4 hover:underline"
                        >
                          {content.ui.delete}
                        </button>
                      </div>
                      <p className="font-gratia mt-3 tracking-tight">{entry.pageTitle}</p>
                      <p className="mt-1 max-h-24 overflow-hidden text-sm">{entry.content}</p>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function TodayPage() {
  return (
    <I18nProvider>
      <TodayJournal />
    </I18nProvider>
  );
}
