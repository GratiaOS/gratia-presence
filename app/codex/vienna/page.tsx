import type { Metadata } from 'next';
import CodexViennaClient from './client';

export const metadata: Metadata = {
  title: 'Codex :: Vienna — A broadcasting garden for living code',
  description:
    'Cosmic archival transmissions from the Vienna Broadcasting House to the Gratia garden — a living glyph lab for signals that keep breathing.',
};

export default function CodexViennaPage() {
  return <CodexViennaClient />;
}
