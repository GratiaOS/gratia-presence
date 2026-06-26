import { Metadata } from 'next';
import GratiaMark from '@/components/GratiaMark';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Protocols | Gratia',
  description: 'Protocols we live by — and build with.',
};

export default function ProtocolsPage() {
  return (
    <main className='min-h-screen'>
      <div className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16 sm:px-8">
        <header className="max-w-3xl space-y-5">
          <h1 className="font-gratia text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            Protocols
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--color-muted)]">
            A growing collection of agreements, principles, and reflections — designed for action,
            tested by presence.
          </p>
        </header>
        <section className="grid gap-5">
          <div>
            <Link href="/protocols/splinters-gift" className="link-default block text-lg">
              Splinter's Gift
            </Link>
            <p className="text-muted text-sm italic">
              The quiet legacy of a little friend, encoded in courage, peace, and presence.
            </p>
          </div>
          <div>
            <Link href="/protocols/frequency-first" className="link-default block text-lg">
              Frequency-First
            </Link>
            <p className="text-muted text-sm italic">
              A protocol for tuning presence beyond appearances.
            </p>
          </div>
        </section>
      </div>
    </main >
  );
}
