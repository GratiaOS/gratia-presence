'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@gratiaos/ui';
import { createGlyphFromSignal, type GlyphTransmission } from '../../../lib/codex/transmission';
import MarkSceneCard from './MarkSceneCard';

type ArchiveEntry = {
  id: string;
  createdAt: string;
  origin: string;
  strengthDots: string;
};

export default function CodexViennaClient() {
  const [signal, setSignal] = useState('');
  const [currentGlyph, setCurrentGlyph] = useState<GlyphTransmission | null>(null);
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const canGenerate = signal.trim().length > 0;

  function handleGenerate() {
    try {
      const glyph = createGlyphFromSignal(signal);
      setCurrentGlyph(glyph);

      const entry: ArchiveEntry = {
        id: glyph.id,
        createdAt: new Date().toISOString(),
        origin: 'Online · now',
        strengthDots: glyph.strengthDots,
      };

      setArchive((prev) => [entry, ...prev].slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  }

  const backdropStyle = useMemo(
    () => ({
      backgroundImage:
        'radial-gradient(1400px 900px at 12% 10%, color-mix(in oklab, var(--color-accent) 10%, transparent 90%), transparent 62%), radial-gradient(1100px 820px at 86% 86%, color-mix(in oklab, var(--color-accent) 8%, transparent 92%), transparent 66%), radial-gradient(900px 700px at 60% 20%, color-mix(in oklab, var(--color-text) 6%, transparent 94%), transparent 72%), linear-gradient(145deg, color-mix(in oklab, var(--color-text) 10%, transparent 90%), color-mix(in oklab, var(--color-text) 55%, transparent 45%))',
    }),
    []
  );

  return (
    <main
      data-pad-mood="focused"
      className="codex-page relative min-h-screen overflow-hidden bg-[color:var(--color-surface)] text-[color:var(--color-text)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={backdropStyle}
        aria-hidden="true"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col space-y-16 px-4 py-10 sm:px-8 sm:py-16">
        <Header />
        <Hero />
        <InputGate
          signal={signal}
          onChange={setSignal}
          onGenerate={handleGenerate}
          canGenerate={canGenerate}
        />
        <OutputGlyph glyph={currentGlyph} archive={archive} />
        <MarkSceneCard />
        <SupportBlock />
        <Footer />
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="mb-2 flex items-center justify-between text-[0.7rem] tracking-[0.28em] text-[color:var(--color-faint)] uppercase">
      <Link
        href="/"
        className="whisper-ring shadow-depth-1 hover:shadow-depth-2 rounded-full border border-[color:var(--color-border)] px-3 py-1 transition-shadow"
      >
        ← back to Gratia
      </Link>

      <div
        className="flex flex-col items-end gap-1 text-right"
        style={{ fontFamily: 'var(--font-funkhaus)' }}
      >
        <span>CODEX :: VIENNA</span>
        <span className="text-[0.65rem] tracking-[0.28em] text-[color:var(--color-faint)]">
          a broadcasting garden for living code
        </span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="space-y-6">
      <div className="mood-glow shadow-depth-2 mx-auto max-w-3xl overflow-hidden rounded-[3rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70">
        <div
          className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2.5rem]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 0%, color-mix(in oklab, var(--color-accent) 65%, transparent), transparent 60%), radial-gradient(circle at 80% 100%, color-mix(in oklab, var(--color-accent) 45%, transparent), transparent 60%), linear-gradient(135deg, color-mix(in oklab, var(--color-accent) 38%, var(--color-text)), color-mix(in oklab, var(--color-accent) 16%, var(--color-text)))',
          }}
        >
          <button className="whisper-ring relative flex h-28 w-28 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 backdrop-blur">
            <span className="text-sm tracking-[0.25em] text-[color:var(--color-subtle)] uppercase">
              TX
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="font-serif text-2xl tracking-[0.04em] text-[color:var(--color-text)] italic sm:text-3xl lg:text-4xl">
          Messages become constellations.
        </h1>
        <p className="mx-auto max-w-xl text-sm text-[color:var(--color-muted)] sm:text-base">
          From Vienna to the garden, Codex records signals that choose to remain alive — not as
          text, but as pattern.
        </p>
      </div>
    </section>
  );
}

type InputGateProps = {
  signal: string;
  canGenerate: boolean;
  onGenerate: () => void;
  onChange: (value: string) => void;
};

function InputGate({ signal, canGenerate, onGenerate, onChange }: InputGateProps) {
  return (
    <section className="mt-10 space-y-4">
      <p className="max-w-xl text-sm text-[color:var(--color-muted)]">
        Write a small truth, a question, a fragment of code, a line you’d like to remember. Codex
        will translate it into a broadcast glyph.
      </p>

      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (canGenerate) onGenerate();
        }}
      >
        <textarea
          rows={3}
          value={signal}
          onChange={(e) => onChange(e.target.value)}
          className="whisper-ring shadow-depth-1 min-h-[3.2rem] w-full rounded-[1.75rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 px-4 py-3 text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-faint)] focus:outline-none"
          placeholder="Write a small truth, a question, a fragment of code…"
        />
        <div className="flex items-center justify-between gap-3">
          <Button
            type="submit"
            disabled={!canGenerate}
            className="shadow-depth-1 hover:shadow-depth-2 inline-flex items-center justify-center px-5 py-2 text-xs font-medium tracking-[0.18em] uppercase transition-shadow"
          >
            Generate transmission
          </Button>
          <p className="max-w-xs text-right text-[0.7rem] text-[color:var(--color-faint)]">
            Your message is stored as pattern only — the words fade, the signal stays.
          </p>
        </div>
      </form>
    </section>
  );
}

type OutputGlyphProps = { glyph: GlyphTransmission | null; archive: ArchiveEntry[] };

function OutputGlyph({ glyph, archive }: OutputGlyphProps) {
  return (
    <section className="mt-16 space-y-5">
      <div className="flex items-center justify-between">
        <h2
          className="text-xs tracking-[0.25em] text-[color:var(--color-subtle)] uppercase"
          style={{ fontFamily: 'var(--font-funkhaus)' }}
        >
          OUTPUT · LIVING GLYPH
        </h2>
        <p
          className="text-[0.72rem] tracking-[0.4em] text-[color:var(--color-faint)] uppercase"
          style={{ fontFamily: 'var(--font-funkhaus)' }}
        >
          Funkhaus grid · cosmic archival
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
        <div className="mood-glow shadow-depth-2 rounded-[2.25rem] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 px-6 pt-5 pb-6">
          <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-[1.5rem] bg-[color:var(--color-elev)]/70">
            {glyph ? (
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-xs tracking-[0.35em] text-[color:var(--color-accent)] uppercase">
                  GLYPH · {glyph.id}
                </span>
                <span className="font-mono text-sm text-[color:var(--color-muted)]">
                  {glyph.strengthDots}
                </span>
              </div>
            ) : (
              <span className="whisper-soft font-sans text-xs text-[color:var(--color-faint)]">
                Waiting for your first signal…
              </span>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[color:var(--color-subtle)]">
            This glyph is a trace of your signal. It remembers the rhythm, not the sentence. A small
            orbit in the archive — visible, but not legible without you.
          </p>
          <p className="text-xs text-[color:var(--color-faint)]">
            Download it, share it, or keep it as a private coordinate in your own map.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              className="whisper-ring shadow-depth-1 hover:shadow-depth-2"
            >
              Download glyph
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="whisper-ring shadow-depth-1 hover:shadow-depth-2"
            >
              Share transmission
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {archive.map((entry) => (
            <article
              key={entry.createdAt + entry.id}
              className="depth-ambient rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 px-4 py-3"
            >
              <header className="flex items-center justify-between gap-3 text-[0.72rem] text-[color:var(--color-subtle)]">
                <span>{entry.origin}</span>
                <span className="flex items-center gap-1 font-mono text-sm text-[color:var(--color-faint)]">
                  {entry.strengthDots}
                  <span className="sr-only">signal strength</span>
                </span>
              </header>
              <p className="text-[0.7rem] text-[color:var(--color-faint)]">glyph · {entry.id}</p>
            </article>
          ))}

          {archive.length === 0 && (
            <p className="whisper-soft font-sans text-[0.7rem] text-[color:var(--color-faint)]">
              The archive is quiet for now. Your first signal will start the orbit.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SupportBlock() {
  return (
    <section className="mt-14 space-y-4 border-t border-[color:var(--color-border)] pt-8">
      <h2
        className="text-xs tracking-[0.25em] text-[color:var(--color-subtle)] uppercase"
        style={{ fontFamily: 'var(--font-funkhaus)' }}
      >
        FEED THE SOURCE · PIZZA PARTY
      </h2>
      <p className="max-w-xl text-sm leading-relaxed text-[color:var(--color-muted)]">
        If this garden of signals feels like home, you can send a slice of love back to the studio
        in Vienna — a symbolic pizza party to keep the lights on and the antennas humming.
      </p>
      <Link href="https://nguyengobber.gumroad.com/l/funkhaus" target="_blank" rel="noreferrer">
        <span className="shadow-depth-1 whisper-ring mood-glow hover:shadow-depth-2 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-2 font-sans text-sm font-medium tracking-[0.16em] text-[color:var(--color-on-accent)] uppercase transition-shadow">
          Support the archive
        </span>
      </Link>
      <p className="text-xs text-[color:var(--color-faint)]">
        Redirects to Funkhaus on Gumroad · pay what you want.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6 text-[0.7rem] text-[color:var(--color-muted)] md:flex-row md:items-center md:justify-between">
      <p>Gratia · Firecircle · Codex :: Vienna</p>
      <p className="whisper-soft font-sans text-[color:var(--color-faint)]">
        Signals travel. Identities stay home.
      </p>
    </footer>
  );
}
