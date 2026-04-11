import Image from 'next/image';

import { FOUNDER_PORTRAIT } from '@/lib/torekull';

export function AboutFounderBio() {
  return (
    <section className="section-padding container">
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
