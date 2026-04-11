import { EditableImage } from '@/components/editing/editable-image';
import { EditableText } from '@/components/editing/editable-text';
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
            <EditableImage
              srcKey="about.images.founderPortrait.src"
              altKey="about.images.founderPortrait.alt"
              fallbackSrc={FOUNDER_PORTRAIT.src}
              fallbackAlt={FOUNDER_PORTRAIT.alt}
              fill
              className="object-cover object-[center_15%]"
              sizes="80px"
            />
          </div>
          <div className="max-w-md space-y-3">
            <EditableText
              as="p"
              copyKey="about.founder.nameTitle"
              fallback="Maja-Li Torekull - Founder & Lead Interior Architect"
              className="text-base font-medium text-foreground"
            />
            <EditableText
              as="p"
              copyKey="about.founder.bio"
              fallback="Educated at ESAG Penninghen and Academie Julian. Published internationally in ArchDaily, Enki Magazine, H.O.O.M, Residence, and Plaza Interior."
              className="leading-relaxed"
              singleLine={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

