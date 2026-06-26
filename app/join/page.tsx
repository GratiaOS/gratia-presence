import Link from 'next/link';
import GratiaMark from '@/components/GratiaMark';

export default function JoinPage() {
  return (
    <div className="px-6 py-24">
      <section className="mx-auto max-w-3xl text-center">
        <GratiaMark className="text-accent mx-auto mb-6 h-20 w-auto" />
        <h1 className="text-title-gratia text-accent relative z-10 mb-6 text-4xl">
          Join the Circle
          <span className="bg-accent mx-auto mt-4 block h-0.5 w-24 rounded-full"></span>
        </h1>
        <p className="mb-8 text-lg">
          You don’t need credentials, followers, or a pitch. You only need presence.
        </p>
        <p className="mb-12 text-lg">
          Whether you're called to hold space, offer skills, or simply walk with us quietly — your
          presence matters.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a href="mailto:razvan@gratia.space" className="btn-primary">
            Email Us to Join
          </a>
          <Link href="/contribute" className="btn-outline">
            I Want to Offer Skills
          </Link>
        </div>

        <p className="text-subtle-bilute mt-20 px-4 text-center text-sm">
          No rush. No pressure. The field knows when it’s time.
        </p>
      </section>
    </div>
  );
}
