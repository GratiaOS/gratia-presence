import type { ReactNode } from 'react';

type Kind = 'note' | 'info' | 'warn' | 'success';

export default function Callout({
  title,
  kind = 'note',
  children,
}: {
  title?: string;
  kind?: Kind;
  children: ReactNode;
}) {
  const tone: Record<Kind, string> = {
    note: 'border-(--color-border)/50 bg-(--color-elev)/60',
    info: 'border-(--color-accent)/40 bg-(--color-accent)/10',
    warn: 'border-(--color-accent)/50 bg-(--color-accent)/14',
    success: 'border-(--color-accent)/50 bg-(--color-accent)/18',
  };

  return (
    <div className={`my-6 rounded-md border px-4 py-3 ${tone[kind]}`}>
      {title ? <p className="mb-2 font-medium">{title}</p> : null}
      <div className="prose prose-gratia prose-sm max-w-none">{children}</div>
    </div>
  );
}
