import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-24 text-center">
      <h1 className="mb-2 text-3xl font-semibold">Page not found</h1>
      <p className="mb-6 text-muted">The path you followed isn’t planted yet.</p>
      <Link href="/" className="btn-primary inline-block">
        Back to garden
      </Link>
    </section>
  );
}
