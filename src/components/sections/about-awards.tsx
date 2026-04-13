'use client';

import { EditableImage } from '@/components/editing/editable-image';
import { EditableText } from '@/components/editing/editable-text';

/**
 * Awards / recognition strip (shadcnblocks-style card shell).
 * Image defaults to `public/awards_21-23.png`; URLs alts editable via CMS.
 */
export function AboutAwards() {
  return (
    <section className="section-padding-tight container">
      <div className="mb-4 max-w-2xl space-y-2 md:mb-5">
        <EditableText
          as="p"
          copyKey="about.awards.kicker"
          fallback="European Property Awards"
          className="nav-caps text-xs text-muted-foreground"
        />
        <EditableText
          as="h2"
          copyKey="about.awards.heading"
          fallback="Recognition"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        />
        <EditableText
          as="p"
          copyKey="about.awards.description"
          fallback="Selected honours from the International Property Awards programme — interior architecture and leisure categories across recent years."
          className="text-muted-foreground text-sm leading-snug md:text-base md:leading-relaxed"
          singleLine={false}
        />
      </div>

      <div className="rounded-lg border border-border bg-card/40 p-3 shadow-sm md:p-4">
        <div className="relative aspect-[21/9] w-full max-h-[min(32vh,320px)] min-h-[120px] overflow-hidden rounded-md border border-border/60 bg-muted/30 md:max-h-[min(38vh,380px)]">
          <EditableImage
            srcKey="about.images.awards21to23.src"
            altKey="about.images.awards21to23.alt"
            fallbackSrc="/awards_21-23.png"
            fallbackAlt="TOREKULL — European Property Awards and related recognition, 2021–2023"
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
