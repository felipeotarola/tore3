import { Metadata } from 'next';
import Image from 'next/image';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import {
  AWARDS,
  COLLABORATION_MARQUEE,
  COLLABORATION_PARTNERS,
} from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'Collaborations',
};

export default function CollaborationsPage() {
  return (
    <>
      <section className="hero-padding container space-y-8">
        <DetailCloseButton fallbackHref="/" />

        <h1 className="text-5xl md:text-6xl">COLLABORATIONS</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          TOREKULL works with trusted partners across lighting, technical
          integration, styling, branding, and delivery to bring ambitious
          interior concepts to life.
        </p>
      </section>

      <section className="section-padding container space-y-8">
        <h2 className="text-4xl">Core Partners</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COLLABORATION_PARTNERS.map((partner) => (
            <div key={partner} className="bg-card border-border border p-6">
              <p className="text-lg">{partner}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding container space-y-8">
        <h2 className="text-4xl">Notable Projects</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLABORATION_MARQUEE.map((project) => (
            <div key={project} className="bg-primary text-primary-foreground p-5">
              <p className="nav-caps text-xs">Project</p>
              <p className="mt-2 text-lg">{project}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding container space-y-8">
        <h2 className="text-4xl">Recognition</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {AWARDS.map((award) => (
            <article
              key={`${award.title}-${award.year}-${award.image}`}
              className="border-border overflow-hidden rounded-sm border bg-transparent"
            >
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-3 md:inset-5">
                  <Image
                    src={award.image}
                    alt={`${award.title} ${award.year}`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              </div>
              <div className="space-y-0.5 border-t border-border px-3 pb-4 pt-3 md:px-4">
                <p className="text-sm font-medium leading-snug">{award.title}</p>
                <p className="text-muted-foreground text-xs">{award.year}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

