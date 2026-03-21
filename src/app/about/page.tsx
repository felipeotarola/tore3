import { Metadata } from 'next';
import Image from 'next/image';

import { Cta } from '@/components/sections/cta';
import { ABOUT_LANGUAGES, TOREKULL } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <>
      <section className="hero-padding space-y-18 md:space-y-20 lg:space-y-26">
        <h1 className="container text-center text-5xl md:text-6xl lg:text-7xl">
          About TOREKULL
        </h1>

        <div className="bigger-container">
          <div className="relative h-[335px] w-full overflow-hidden md:h-[450px] lg:h-[900px]">
            <Image
              src="/images/torekull/projects/walthon-1.jpg"
              alt="TOREKULL studio"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          </div>
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

      <section className="section-padding container space-y-10">
        <h2 className="text-4xl">Languages</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ABOUT_LANGUAGES.map((language) => (
            <div key={language} className="bg-card border-border border px-5 py-4">
              <p className="nav-caps text-sm">{language}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding container grid gap-10 md:grid-cols-2">
        <h2 className="text-4xl">Founder</h2>
        <div className="text-muted-foreground space-y-5 text-lg">
          <p className="text-foreground">
            Maja-Li Torekull - Founder &amp; Lead Interior Architect
          </p>
          <p>Educated at ESAG Penninghen and Academie Julian.</p>
          <p>
            Published internationally in ArchDaily, Enki Magazine, H.O.O.M,
            Residence, and Plaza Interior.
          </p>
        </div>
      </section>

      <Cta />
    </>
  );
}

