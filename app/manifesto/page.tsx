'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManifestoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/notes/first-note');
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          Redirecting to notes...
        </p>
      </div>
    </main>
  );
}
