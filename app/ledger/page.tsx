import { getEmotions } from '@/lib/m3/client';
import type { Metadata } from 'next';
import { LedgerCard } from './LedgerCard';

export const metadata: Metadata = {
  title: 'Ledger — Gratia',
  description: 'Emotional patterns witnessed by the garden.',
};

// Force dynamic rendering (no static generation)
export const dynamic = 'force-static';

export default async function LedgerPage() {
  const emotions = await getEmotions();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-12">
        <h1 className="text-fg-primary mb-2 text-3xl font-semibold">Ledger</h1>
        <p className="text-fg-secondary">Emotional patterns witnessed by the garden. 🌱</p>
      </header>

      {emotions.length === 0 ? (
        <div className="border-border-subtle bg-surface-subtle rounded-lg border p-8 text-center">
          <p className="text-fg-secondary">
            The ledger is empty. Signals will appear here as they arrive.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {emotions.map((emotion: any, index: number) => (
            <LedgerCard key={emotion.id} emotion={emotion} index={index} />
          ))}
        </div>
      )}

      {emotions.length > 0 && (
        <footer className="text-fg-tertiary mt-8 text-center text-sm">
          Showing {emotions.length} recent {emotions.length === 1 ? 'entry' : 'entries'}
        </footer>
      )}
    </main>
  );
}
