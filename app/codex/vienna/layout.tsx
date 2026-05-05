import type { ReactNode } from 'react';

export const metadata = {
  title: 'Codex :: Vienna · Gratia',
  description: 'A public broadcast space. Words sent into the field.',
};

export default function ViennaLayout({ children }: { children: ReactNode }) {
  return (
    <section
      data-codex="vienna"
      data-field="broadcast"
      data-typo="spatial"
      className="codex-vienna"
    >
      {children}
    </section>
  );
}
