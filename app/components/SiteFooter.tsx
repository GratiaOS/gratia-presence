import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-16 w-full border-t border-(--color-border)">
      <div className="text-muted mx-auto flex max-w-5xl items-center justify-between px-6 py-8 text-sm">
        <p>© {new Date().getFullYear()} Gratia. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <Link href="/pattern-mirror" className="text-(--color-text) underline-offset-4 hover:underline">
            See your reflection
          </Link>
          <p className="font-bilute">
            🌬 whisper: <em>“paths open where attention flows.”</em>
          </p>
        </div>
      </div>
    </footer>
  );
}
