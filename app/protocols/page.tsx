import { Metadata } from 'next';
import GratiaMark from '@/components/GratiaMark';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Protocols | Gratia',
  description: 'Protocols we live by — and build with.',
};

export default function ProtocolsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <GratiaMark className="text-accent mx-auto mb-6 h-20 w-auto" />
      <h1 className="text-title-gratia text-accent mb-4 text-4xl">Protocols</h1>
      <p className="text-muted mb-8 text-lg">
        A growing collection of agreements, principles, and reflections — designed for action,
        tested by presence.
      </p>
      <div className="mt-8 space-y-4 border-t border-current/10 pt-6">
        <Link href="/protocols/splinters-gift" className="link-default block text-lg">
          Splinter's Gift
        </Link>
        <p className="text-muted text-sm italic">
          The quiet legacy of a little friend, encoded in courage, peace, and presence.
        </p>
      </div>
      <div className="mt-8 space-y-4 border-t border-current/10 pt-6">
        <Link href="/protocols/frequency-first" className="link-default block text-lg">
          Frequency-First
        </Link>
        <p className="text-muted text-sm italic">
          A protocol for tuning presence beyond appearances.
        </p>
      </div>
    </div>
  );
}
