import Link from 'next/link';
import { Badge } from '@gratiaos/ui';
import GratiaMark from '@/components/GratiaMark';

export default function ScenesPage() {
  return (
    <main className="min-h-screen bg-(--color-surface) text-(--color-text)">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-(--color-muted) uppercase">
            Scenes · Kernel
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--color-elev) ring-1 ring-(--color-border)">
                <GratiaMark variant="outline" />
              </span>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Kernel update · Witnessed by Roots</h1>
                <p className="text-sm text-(--color-muted)">
                  Cum am simțit momentul în care Mark-ul a intrat în sistem și Next.js a fost urcat
                  la versiunea patch pentru CVE.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-(--color-border) bg-(--color-elev) p-6 shadow-depth-2">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] text-(--color-muted) uppercase">
                  Scene Card
                </p>
                <h2 className="text-lg font-semibold">Kernel Update — Mark + Next 15.5.7</h2>
              </div>
              <Badge tone="accent" variant="soft" size="sm">
                Roots
              </Badge>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-(--color-text)">
              <p>
                Am pus floarea în sistem: favicon, header, metadata. Am urcat Next la 15.5.7 pentru
                CVE-2025-66478. Build verde, fără refresh forțat.
              </p>
              <p className="text-(--color-muted)">
                Whisper: „cel mai stabil cedează tensiunea înainte ca ea să apară”.
              </p>
            </div>
            <footer className="mt-4 flex flex-wrap gap-2 text-[11px] text-(--color-muted)">
              <Badge tone="accent" variant="subtle" size="sm">
                Mark v0.2
              </Badge>
              <Badge tone="accent" variant="subtle" size="sm">
                CVE fix
              </Badge>
              <Badge tone="accent" variant="subtle" size="sm">
                Witnessed by Roots
              </Badge>
            </footer>
          </article>

          <article className="rounded-3xl border border-(--color-border) bg-(--color-elev) p-6 shadow-depth-2">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.18em] text-(--color-muted) uppercase">
                  Kernel Trace
                </p>
                <h2 className="text-lg font-semibold">Cum a curs pentru mine</h2>
              </div>
              <Badge tone="accent" variant="soft" size="sm">
                Roots
              </Badge>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-(--color-text)">
              <li>
                <strong>L1</strong> · corp relaxat la build, zero panică când a apărut warningul.
              </li>
              <li>
                <strong>L2</strong> · calm + bucurie că Mark-ul e viu în header.
              </li>
              <li>
                <strong>L3</strong> · am văzut că era doar import default → fixed import și
                metadata.
              </li>
              <li>
                <strong>L4</strong> · rol: Roots care ține structura și duce patch-ul de securitate.
              </li>
              <li>
                <strong>L6</strong> · câmp clar: build verde, fără refresh manual la tema
                sistemului.
              </li>
              <li>
                <strong>L7</strong> · whisper scris: Mark + securitate = stabilitate blândă.
              </li>
            </ul>
            <footer className="mt-4 flex flex-wrap gap-2 text-[11px] text-(--color-muted)">
              <Badge tone="accent" variant="subtle" size="sm">
                Calm build
              </Badge>
              <Badge tone="accent" variant="subtle" size="sm">
                Whisper logged
              </Badge>
            </footer>
          </article>
        </section>

        <div className="pt-4 text-sm text-(--color-muted)">
          <Link href="/" className="hover:underline">
            Înapoi în Grădină
          </Link>
        </div>
      </div>
    </main>
  );
}
