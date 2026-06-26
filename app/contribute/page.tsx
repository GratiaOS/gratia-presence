import GratiaMark from '@/components/GratiaMark';

export default function ContributePage() {
  return (
    <div className="px-6 py-24">
      <section className="mx-auto max-w-3xl text-center">
        <GratiaMark className="text-accent mx-auto mb-6 h-20 w-auto" />
        <h1 className="text-title-gratia text-accent relative z-10 mb-6 text-4xl">
          Contribute to Gratia
          <span className="bg-accent mx-auto mt-4 block h-0.5 w-24 rounded-full"></span>
        </h1>

        <p className="mb-8 text-lg">
          We believe that when people share from the heart, it changes the system.
        </p>
        <p className="mb-12 text-lg">
          You don’t have to be a “professional.” You don’t need a portfolio. You just need to care
          about something enough to offer it.
        </p>

        <div className="mx-auto mb-12 max-w-xl space-y-6 text-left">
          <p className="text-accent font-semibold">Things we welcome:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Design (quiet, thoughtful, grounded)</li>
            <li>Frontend dev (React, Next, Tailwind — you know the vibe)</li>
            <li>Writing, editing, soft technology</li>
            <li>Audio, sound design, soft music</li>
            <li>Field sensing / space holding</li>
            <li>Organizing, admin, soul-aligned logistics</li>
          </ul>
        </div>

        <a href="mailto:razvan@gratia.space" className="btn-primary">
          Offer Your Gifts
        </a>

        <p className="text-subtle-bilute mt-20 px-4 text-center text-sm">
          Offer only what you love. The field doesn't need more hustle — it needs wholeness.
        </p>
      </section>
    </div>
  );
}
