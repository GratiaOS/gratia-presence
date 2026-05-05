import { PropsWithChildren } from 'react';

export default function SimpleDoc({
  children,
  hero,
  subtitle,
}: PropsWithChildren<{ hero?: string; subtitle?: string }>) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {hero && (
        <header className="mb-10">
          <h1 className="text-title-gratia text-3xl">{hero}</h1>
          {subtitle && <p className="text-muted mt-2">{subtitle}</p>}
        </header>
      )}
      <article className="prose prose-invert max-w-none">{children}</article>
    </main>
  );
}
