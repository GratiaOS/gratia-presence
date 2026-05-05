'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
type SceneLayoutProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  footerCta?: ReactNode;
  footerNote?: ReactNode;
};

export default function SceneLayout({
  eyebrow,
  title,
  subtitle,
  backHref,
  backLabel,
  children,
  footerCta,
  footerNote,
}: SceneLayoutProps) {
  return (
    <main className="scene-root min-h-screen px-4 py-10 lg:py-16 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 lg:mb-10 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-(--color-accent)/80">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-(--color-accent)/10">●</span>
                {eyebrow}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-(--color-text)">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm sm:text-base text-(--color-muted)/80 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          {backHref && backLabel && (
            <Link
              href={backHref}
              className="hidden sm:inline-flex text-xs text-(--color-muted) hover:text-(--color-text) transition-colors"
            >
              ← {backLabel}
            </Link>
          )}
        </div>

        {backHref && backLabel && (
          <Link
            href={backHref}
            className="sm:hidden inline-flex text-xs text-(--color-muted) hover:text-(--color-text) transition-colors"
          >
            ← {backLabel}
          </Link>
        )}
      </header>

      <section className="scene-shell w-full max-w-5xl">{children}</section>

      {(footerCta || footerNote) && (
        <footer className="mt-10 w-full max-w-5xl flex flex-col items-center gap-2">
          {footerCta}
          {footerNote && (
            <p className="text-[11px] text-(--color-muted) text-center max-w-sm">
              {footerNote}
            </p>
          )}
        </footer>
      )}
    </main>
  );
}
