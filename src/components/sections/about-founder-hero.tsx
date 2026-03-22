import Image from 'next/image';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { FOUNDER_PORTRAIT } from '@/lib/torekull';

export function AboutFounderHero() {
  return (
    <section className="hero-padding container flex flex-col gap-10 lg:gap-12">
      <DetailCloseButton fallbackHref="/" />

      <div className="max-w-3xl space-y-3">
        <p className="nav-caps text-xs text-muted-foreground">The practice</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl">About TOREKULL</h1>
        <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
          The studio is led by founder{' '}
          <span className="text-foreground">Maja-Li Torekull</span>—an interior
          architect and designer working across commercial interiors, custom
          furniture, and product development for clients in Europe and the
          United States.
        </p>
      </div>

      <div className="text-muted-foreground max-w-3xl border-t border-border pt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-6">
          <div
            className="relative size-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted"
            aria-hidden
          >
            <Image
              src={FOUNDER_PORTRAIT.src}
              alt=""
              fill
              className="object-cover object-[center_15%]"
              sizes="80px"
            />
          </div>
          <div className="max-w-md space-y-3">
            <p className="text-base font-medium text-foreground">
              Maja-Li Torekull — Founder &amp; Lead Interior Architect
            </p>
            <p className="leading-relaxed">
              Educated at ESAG Penninghen and Academie Julian. Published
              internationally in ArchDaily, Enki Magazine, H.O.O.M, Residence,
              and Plaza Interior.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
