import { Metadata } from 'next';

import { EditableImage } from '@/components/editing/editable-image';
import { EditableText } from '@/components/editing/editable-text';
import { LandingCopyEditorProvider } from '@/components/editing/landing-copy-editor-provider';
import { AboutAwards } from '@/components/sections/about-awards';
import { AboutFounderBio } from '@/components/sections/about-founder-bio';
import { AboutFounderHero } from '@/components/sections/about-founder-hero';
import { Cta } from '@/components/sections/cta';
import { ABOUT_LANGUAGES, FOUNDER_PORTRAIT, TOREKULL } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <LandingCopyEditorProvider>
      <AboutFounderHero />

      <section className="container pb-14 md:pb-16">
        <div className="overflow-hidden rounded-md border border-border/70 bg-card/10">
          <div className="relative h-[min(42vh,360px)] w-full md:h-[min(52vh,520px)]">
            <EditableImage
              srcKey="about.images.founderPortrait.src"
              altKey="about.images.founderPortrait.alt"
              fallbackSrc={FOUNDER_PORTRAIT.src}
              fallbackAlt={FOUNDER_PORTRAIT.alt}
              fill
              className="object-cover object-[center_15%] grayscale"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container grid gap-8 border-t border-border/60 py-14 md:grid-cols-2 md:items-start md:gap-12 md:py-16">
        <EditableText
          as="h2"
          copyKey="about.who.heading"
          fallback="Who We Are"
          className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl"
        />
        <EditableText
          as="p"
          copyKey="about.who.body"
          fallback="As a Swedish and American company with a history of working in the USA, Italy, France, Tunisia, and Sweden, our projects are influenced by many different cultures, trends and styles - constantly changing, just like the world around us."
          className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          singleLine={false}
        />
      </section>

      <AboutFounderBio />

      <AboutAwards />

      <section className="container grid gap-8 border-t border-border/60 py-14 md:grid-cols-2 md:items-start md:gap-12 md:py-16">
        <EditableText
          as="h2"
          copyKey="about.philosophy.heading"
          fallback="Our Philosophy"
          className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl"
        />
        <div className="max-w-2xl space-y-5 text-base md:text-lg">
          <EditableText
            as="p"
            copyKey="about.philosophy.body"
            fallback="We believe that there should never be a compromise between design and function. Without function, great design will go to waste. Without great design, all the content and efforts will be for nothing. The two must go hand in hand."
            className="leading-relaxed text-muted-foreground"
            singleLine={false}
          />
          <div className="rounded-md border border-border/70 bg-card/10 p-4 md:p-5">
            <blockquote className="border-l-2 border-border pl-4 font-instrument-serif text-xl italic md:pl-5 md:text-2xl">
              &quot;
              <EditableText
                as="span"
                copyKey="about.philosophy.quote"
                fallback={TOREKULL.quote}
                singleLine={false}
              />
              &quot;
              <footer className="mt-2 text-sm text-muted-foreground not-italic md:text-base">
                -
                {' '}
                <EditableText
                  as="span"
                  copyKey="about.philosophy.quoteAuthor"
                  fallback={TOREKULL.quoteAuthor}
                />
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="container grid gap-8 border-t border-border/60 py-14 md:grid-cols-2 md:items-start md:gap-12 md:py-16">
        <EditableText
          as="h2"
          copyKey="about.approach.heading"
          fallback="Design Approach"
          className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl"
        />
        <EditableText
          as="p"
          copyKey="about.approach.body"
          fallback="Design must be functional and functionality must be translated into visual aesthetics. This should be achieved without relying upon overused trends and gimmicks. If it has to be explained, either the design or functionality - or both - are lacking."
          className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          singleLine={false}
        />
      </section>

      <section className="container pb-14 md:pb-16">
        <div className="flex flex-col gap-2 rounded-md border border-border/70 bg-card/10 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-5">
          <EditableText
            as="h2"
            copyKey="about.languages.heading"
            fallback="Languages"
            className="text-lg font-semibold tracking-[-0.01em] md:text-xl"
          />
          <EditableText
            as="p"
            copyKey="about.languages.list"
            fallback={ABOUT_LANGUAGES.join(' · ')}
            className="nav-caps max-w-xl text-[11px] leading-relaxed tracking-[0.18em] text-muted-foreground md:text-right"
          />
        </div>
      </section>

      <Cta padding="tight" />
    </LandingCopyEditorProvider>
  );
}
