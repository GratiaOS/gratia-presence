import type { ReactNode } from 'react';

export default function Whisper({ children }: { children: ReactNode }) {
  return (
    <p className="text-subtle-bilute text-muted mt-8 text-sm">
      🌬 whisper: <em>“{children}”</em>
    </p>
  );
}
