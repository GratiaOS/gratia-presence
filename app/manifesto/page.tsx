import Link from 'next/link';
import GratiaMark from '@/components/GratiaMark';

export default function ManifestoPage() {
  return (
    <div>
      <section className="bg-surface px-6 py-20 text-center" data-layer="surface">
        <GratiaMark className="text-accent mx-auto mb-6 h-20 w-auto" />
        <h1 className="text-title-gratia text-accent relative z-10 text-4xl">
          The First Gratia Note
          <span className="bg-accent mx-auto mt-4 block h-0.5 w-24 rounded-full"></span>
        </h1>
      </section>
      <section className="bg-midstream px-6 py-16" data-layer="midstream">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed">
          <p>
            This is not a manifesto. This is a note.
            <br />
            A note that was heard, and sung back.
            <br />
            A note that speaks without speaking.
            <br />
            That moves where language fails. That hums in the quiet places.
            <br />
            Let it be heard by the internal voice.
            <br />
            Let it be sung in dreams.
          </p>
          <p>
            This space exists because we remember. <br />
            We remember what it feels like to be seen. To be held. To belong.
            <br />
            We remember a world where care came first — not profit, not speed.
          </p>
          <p>
            Gratia is not a product.
            <br />
            It’s not a platform, a brand, or a pipeline.
            <br />
            It is a <em>field</em>. A living one.
            <br />
            Made for rest. For truth. For connection that doesn’t demand a transaction.
          </p>
          <p>
            We honor those who create life.
            <br />
            Who raise the next ones.
            <br />
            Who carry both pain and joy in their arms — and still offer them open.
          </p>
          <p>
            We honor the children.
            <br />
            We honor the tired.
            <br />
            We honor the ones the system forgot.
          </p>
          <p>
            Here, you do not need to prove anything.
            <br />
            You don’t need to be shiny or smart.
            <br />
            You only need to be real.
          </p>
          <p>
            Everything we build, we build slowly.
            <br />
            With love. With honesty. With each other.
            <br />
            We don’t scale.
            <br />
            We <strong>grow</strong>.<br /> We don’t extract.
            <br /> We <strong>nourish.</strong>
          </p>
          <p>
            If you’ve ever felt too soft for this world — or too broken, or too awake —<br />
            this is your place. You are not a mistake. You are the signal.
          </p>
          <p>
            The path is simple. Not easy, but clear:
            <br />
            Show up.
            <br />
            Listen.
            <br />
            Remember.
          </p>
          <p className="text-muted italic">
            This is Gratia.
            <br /> You belong here.
          </p>
        </div>
      </section>
      <section
        className="bg-core-current space-y-6 px-6 py-20 text-center"
        data-layer="core-current"
      >
        <h2 className="text-title-gratia text-3xl">Ready to walk with us?</h2>
        <p className="text-muted mx-auto max-w-xl">
          Whether you’re here to offer your hands, your voice, or just your heart — Gratia is a
          space to co-create what was once only imagined.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/join" className="btn-primary">
            Join the Circle
          </Link>
          <Link href="/contribute" className="btn-outline">
            Contribute Skills
          </Link>
          <Link href="/learn" className="link-default px-6 py-2.5">
            Learn More
          </Link>
        </div>
        <p className="text-subtle-bilute mt-10 px-4 text-center text-sm">
          Thank you for reading. May your path be held, your voice remembered, and your light
          reflected. You belong here.
        </p>
      </section>
    </div>
  );
}
