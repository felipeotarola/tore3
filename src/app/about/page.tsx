import { Metadata } from 'next';
import Image from 'next/image';

import { AboutFounderHero } from '@/components/sections/about-founder-hero';
import { Cta } from '@/components/sections/cta';
import { getAllProjects } from '@/lib/projects';
import { ABOUT_LANGUAGES, HOME_FEATURED_SLUGS, TOREKULL } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'About',
};

const FALLBACK_ABOUT_HERO_IMAGE =
  'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg';

export default async function AboutPage() {
  const projects = await getAllProjects();
  const featuredProjects = projects.filter((project) =>
    HOME_FEATURED_SLUGS.includes(project.slug as (typeof HOME_FEATURED_SLUGS)[number]),
  );
  const sourceProjects = featuredProjects.length > 0 ? featuredProjects : projects;
  const imageFromDatabase = sourceProjects
    .map((project) => ({
      src: project.images[0]?.src,
      alt: project.images[0]?.alt || `${project.name} project image`,
    }))
    .find((image) => Boolean(image.src));

  const heroImageSrc = imageFromDatabase?.src || FALLBACK_ABOUT_HERO_IMAGE;
  const heroImageAlt = imageFromDatabase?.alt || 'TOREKULL studio';

  return (
    <>
      <AboutFounderHero />

      <section className="section-padding-tight bigger-container">
        <div className="relative h-[335px] w-full overflow-hidden md:h-[450px] lg:h-[900px]">
          <Image
            src={heroImageSrc}
            alt={heroImageAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      </section>

      <section className="section-padding container grid gap-10 md:grid-cols-2">
        <h2 className="text-4xl">Who We Are</h2>
        <p className="text-muted-foreground text-lg">
          As a Swedish and American company with a history of working in the
          USA, Italy, France, Tunisia, and Sweden, our projects are influenced
          by many different cultures, trends and styles - constantly changing,
          just like the world around us.
        </p>
      </section>

      <section className="section-padding container grid gap-10 md:grid-cols-2">
        <h2 className="text-4xl">Our Philosophy</h2>
        <div className="space-y-8 text-lg">
          <p className="text-muted-foreground">
            We believe that there should never be a compromise between design
            and function. Without function, great design will go to waste.
            Without great design, all the content and efforts will be for
            nothing. The two must go hand in hand.
          </p>
          <blockquote className="font-instrument-serif border-border border-l-2 pl-6 text-3xl italic">
            &quot;{TOREKULL.quote}&quot;
            <footer className="text-muted-foreground mt-3 text-base not-italic">
              - {TOREKULL.quoteAuthor}
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="section-padding container grid gap-10 md:grid-cols-2">
        <h2 className="text-4xl">Design Approach</h2>
        <p className="text-muted-foreground text-lg">
          Design must be functional and functionality must be translated into
          visual aesthetics. This should be achieved without relying upon
          overused trends and gimmicks. If it has to be explained, either the
          design or functionality - or both - are lacking.
        </p>
      </section>

      <section className="section-padding-tight container">
        <div className="border-border flex flex-col gap-3 border-y py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:py-4">
          <h2 className="text-2xl md:text-3xl">Languages</h2>
          <p className="nav-caps max-w-xl text-xs leading-relaxed text-muted-foreground md:text-right md:text-sm">
            {ABOUT_LANGUAGES.join(' · ')}
          </p>
        </div>
      </section>

      <Cta />
    </>
  );
}
