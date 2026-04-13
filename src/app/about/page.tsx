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

      <section className="py-8 md:py-10 lg:py-12 bigger-container">
        <div className="overflow-hidden rounded-lg border border-border bg-card/20 shadow-sm">
          <div className="relative h-[min(40vh,300px)] w-full md:h-[min(48vh,400px)] lg:h-[min(56vh,560px)]">
            <EditableImage
              srcKey="about.images.founderPortrait.src"
              altKey="about.images.founderPortrait.alt"
              fallbackSrc={FOUNDER_PORTRAIT.src}
              fallbackAlt={FOUNDER_PORTRAIT.alt}
              fill
              className="object-cover object-[center_15%]"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section-padding-tight container grid gap-6 md:grid-cols-2 md:gap-8 md:items-start">
        <EditableText
          as="h2"
          copyKey="about.who.heading"
          fallback="Who We Are"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        />
        <EditableText
          as="p"
          copyKey="about.who.body"
          fallback="As a Swedish and American company with a history of working in the USA, Italy, France, Tunisia, and Sweden, our projects are influenced by many different cultures, trends and styles - constantly changing, just like the world around us."
          className="text-muted-foreground text-base leading-snug md:text-lg md:leading-relaxed"
          singleLine={false}
        />
      </section>

      <AboutFounderBio />

      <AboutAwards />

      <section className="section-padding-tight container grid gap-6 md:grid-cols-2 md:gap-8 md:items-start">
        <EditableText
          as="h2"
          copyKey="about.philosophy.heading"
          fallback="Our Philosophy"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        />
        <div className="space-y-5 text-base md:text-lg">
          <EditableText
            as="p"
            copyKey="about.philosophy.body"
            fallback="We believe that there should never be a compromise between design and function. Without function, great design will go to waste. Without great design, all the content and efforts will be for nothing. The two must go hand in hand."
            className="text-muted-foreground leading-snug md:leading-relaxed"
            singleLine={false}
          />
          <div className="rounded-lg border border-border bg-card/40 p-4 shadow-sm md:p-5">
            <blockquote className="font-instrument-serif border-border border-l-2 pl-4 text-xl italic md:pl-5 md:text-2xl">
              &quot;
              <EditableText
                as="span"
                copyKey="about.philosophy.quote"
                fallback={TOREKULL.quote}
                singleLine={false}
              />
              &quot;
              <footer className="text-muted-foreground mt-2 text-sm not-italic md:text-base">
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

      <section className="section-padding-tight container grid gap-6 md:grid-cols-2 md:gap-8 md:items-start">
        <EditableText
          as="h2"
          copyKey="about.approach.heading"
          fallback="Design Approach"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        />
        <EditableText
          as="p"
          copyKey="about.approach.body"
          fallback="Design must be functional and functionality must be translated into visual aesthetics. This should be achieved without relying upon overused trends and gimmicks. If it has to be explained, either the design or functionality - or both - are lacking."
          className="text-muted-foreground text-base leading-snug md:text-lg md:leading-relaxed"
          singleLine={false}
        />
      </section>

      <section className="py-8 md:py-10 container">
        <div className="border-border bg-card/20 flex flex-col gap-2 rounded-lg border px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-5 md:py-4">
          <EditableText
            as="h2"
            copyKey="about.languages.heading"
            fallback="Languages"
            className="text-xl font-semibold tracking-tight md:text-2xl"
          />
          <EditableText
            as="p"
            copyKey="about.languages.list"
            fallback={ABOUT_LANGUAGES.join(' · ')}
            className="nav-caps max-w-xl text-xs leading-relaxed text-muted-foreground md:text-right md:text-sm"
          />
        </div>
      </section>

      <Cta padding="tight" />
    </LandingCopyEditorProvider>
  );
}

