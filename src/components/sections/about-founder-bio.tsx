import { EditableImage } from '@/components/editing/editable-image';
import { EditableText } from '@/components/editing/editable-text';
import { FOUNDER_PORTRAIT } from '@/lib/torekull';

/** Founder credentials in a bordered surface (card rhythm). */
export function AboutFounderBio() {
  return (
    <section className="container pb-14 md:pb-16">
      <div className="rounded-md border border-border/70 bg-card/15 p-4 md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div
            className="relative size-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted sm:size-20"
            aria-hidden
          >
            <EditableImage
              srcKey="about.images.founderPortrait.src"
              altKey="about.images.founderPortrait.alt"
              fallbackSrc={FOUNDER_PORTRAIT.src}
              fallbackAlt={FOUNDER_PORTRAIT.alt}
              fill
              className="object-cover object-[center_15%]"
              sizes="96px"
            />
          </div>
          <div className="min-w-0 max-w-2xl space-y-2">
            <EditableText
              as="p"
              copyKey="about.founder.nameTitle"
              fallback="Maja-Li Torekull - Founder & Lead Interior Architect"
              className="text-sm font-medium text-foreground md:text-base"
            />
            <EditableText
              as="p"
              copyKey="about.founder.bio"
              fallback="Educated at ESAG Penninghen and Academie Julian. Published internationally in ArchDaily, Enki Magazine, H.O.O.M, Residence, and Plaza Interior."
              className="text-sm leading-relaxed text-muted-foreground"
              singleLine={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
