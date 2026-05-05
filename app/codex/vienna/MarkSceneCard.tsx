import Image from 'next/image';

/**
 * SceneCard: Suave Bloom intră în Codex Vienna.
 * Poveste scurtă: floarea nu e logo, e o prezență care a intrat în Grădină și Grajd.
 */
export function MarkSceneCard() {
  return (
    <section className="shadow-depth-2 rounded-3xl border border-(--color-border) bg-(--color-elev) p-6 md:p-8">
      <header className="space-y-1">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-(--color-muted) uppercase">
          Seed · Suave Bloom
        </p>
        <h2 className="text-lg font-semibold text-(--color-text) md:text-xl">
          La flor que eligió el Jardín y el Establo.
        </h2>
      </header>

      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-(--color-surface) ring-1 ring-(--color-border)">
          <Image
            src="/mark/gratia-mark.svg"
            alt="Gratia Mark · Suave Bloom"
            fill
            className="object-contain p-3"
          />
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-(--color-text)">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-(--color-muted) uppercase">
            Signal · Echo · Meaning
          </p>
          <p className="whisper-soft">
            Signal: Una flor naranja apareció en el campo. Suave. Abierta.
          </p>
          <p className="whisper-soft">Echo: Pulsa apenas — semilla, corazón, kernel.</p>
          <p className="whisper-soft text-(--color-muted)">
            Meaning: El cambio habla así: bajo, claro, vivo.
          </p>
        </div>
      </div>

      <footer className="mt-4 flex flex-wrap gap-2 text-[11px] text-(--color-muted)">
        <span className="rounded-full bg-(--color-accent)/10 px-2 py-1">
          Mark v0.3 · Suave Bloom
        </span>
        <span className="rounded-full bg-(--color-accent)/10 px-2 py-1">Witnessed in Vienna</span>
        <span className="rounded-full bg-(--color-accent)/10 px-2 py-1">Floare · Grajd · Cal</span>
      </footer>
    </section>
  );
}

export default MarkSceneCard;
