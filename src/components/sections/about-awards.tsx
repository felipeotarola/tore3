'use client';

import { useMemo } from 'react';

import { EditableImage } from '@/components/editing/editable-image';
import { EditableText } from '@/components/editing/editable-text';
import {
  citationForEuropeanPropertyAward,
  EUROPEAN_PROPERTY_AWARDS_INTERIOR_DESIGN_21_23,
  europeanPropertyAwardsAboutJsonLd,
  europeanPropertyAwardsStripAlt,
} from '@/lib/european-property-awards';

const AWARDS_LIST_ID = 'european-property-awards-citations';

/**
 * Awards / recognition strip (shadcnblocks-style card shell).
 * Image defaults to `public/awards_21-23.png`; URLs alts editable via CMS.
 * Plain-text list + JSON-LD mirror the ribbons for GEO / structured extraction.
 */
export function AboutAwards() {
  const jsonLd = useMemo(() => JSON.stringify(europeanPropertyAwardsAboutJsonLd()), []);

  return (
    <section
      className="container border-t border-border/60 py-14 md:py-16"
      aria-labelledby="about-awards-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="mb-5 max-w-2xl space-y-2 md:mb-6">
        <EditableText
          as="p"
          copyKey="about.awards.kicker"
          fallback="European Property Awards"
          className="nav-caps text-[11px] tracking-[0.2em] text-muted-foreground"
        />
        <EditableText
          as="h2"
          id="about-awards-heading"
          copyKey="about.awards.heading"
          fallback="Recognition"
          className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl"
        />
        <EditableText
          as="p"
          copyKey="about.awards.description"
          fallback="Official European Property Awards (Interior Design) results for TOREKULL leisure interiors in Sweden — spelled out below so the same facts appear in text and in structured data."
          className="text-muted-foreground text-sm leading-snug md:text-base md:leading-relaxed"
          singleLine={false}
        />
      </div>

      <div className="mb-4 rounded-md border border-border/70 bg-card/10 px-4 py-4 md:px-5 md:py-5">
        <h3 className="text-foreground mb-3 text-sm font-semibold tracking-tight md:text-base">
          European Property Awards — Interior Design (Sweden)
        </h3>
        <ul
          id={AWARDS_LIST_ID}
          className="divide-y divide-border/60 border-b border-t border-border/60 text-sm leading-snug text-muted-foreground md:leading-relaxed"
        >
          {EUROPEAN_PROPERTY_AWARDS_INTERIOR_DESIGN_21_23.map((row) => (
            <li key={`${row.project}-${row.programmeYears}`} className="py-3 first:pt-0 last:pb-0">
              {citationForEuropeanPropertyAward(row)}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md border border-border/70 bg-card/10 p-3 md:p-4">
        <div
          className="relative aspect-[21/9] w-full max-h-[min(32vh,320px)] min-h-[120px] overflow-hidden rounded-sm border border-border/60 bg-muted/20 md:max-h-[min(38vh,380px)]"
          aria-describedby={AWARDS_LIST_ID}
        >
          <EditableImage
            srcKey="about.images.awards21to23.src"
            altKey="about.images.awards21to23.alt"
            fallbackSrc="/awards_21-23.png"
            fallbackAlt={europeanPropertyAwardsStripAlt()}
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
