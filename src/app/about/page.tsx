import { Metadata } from 'next';

import { EditableImage } from '@/components/editing/editable-image';
import { EditableText } from '@/components/editing/editable-text';
import { LandingCopyEditorProvider } from '@/components/editing/landing-copy-editor-provider';
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

      <section className="section-padding-tight bigger-container">
        <div className="relative h-[335px] w-full overflow-hidden rounded-md md:h-[450px] lg:h-[900px]">
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
      </section>

      <section className="section-padding container grid gap-10 md:grid-cols-2">
        <EditableText
          as="h2"
          copyKey="about.who.heading"
          fallback="Who We Are"
          className="text-4xl"
        />
        <EditableText
          as="p"
          copyKey="about.who.body"
          fallback="As a Swedish and American company with a history of working in the USA, Italy, France, Tunisia, and Sweden, our projects are influenced by many different cultures, trends and styles - constantly changing, just like the world around us."
          className="text-muted-foreground text-lg"
          singleLine={false}
        />
      </section>

      <AboutFounderBio />

      <section className="section-padding container grid gap-10 md:grid-cols-2">
        <EditableText
          as="h2"
          copyKey="about.philosophy.heading"
          fallback="Our Philosophy"
          className="text-4xl"
        />
        <div className="space-y-8 text-lg">
          <EditableText
            as="p"
            copyKey="about.philosophy.body"
            fallback="We believe that there should never be a compromise between design and function. Without function, great design will go to waste. Without great design, all the content and efforts will be for nothing. The two must go hand in hand."
            className="text-muted-foreground"
            singleLine={false}
          />
          <blockquote className="font-instrument-serif border-border border-l-2 pl-6 text-3xl italic">
            &quot;
            <EditableText
              as="span"
              copyKey="about.philosophy.quote"
              fallback={TOREKULL.quote}
              singleLine={false}
            />
            &quot;
            <footer className="text-muted-foreground mt-3 text-base not-italic">
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
      </section>

      <section className="section-padding container grid gap-10 md:grid-cols-2">
        <EditableText
          as="h2"
          copyKey="about.approach.heading"
          fallback="Design Approach"
          className="text-4xl"
        />
        <EditableText
          as="p"
          copyKey="about.approach.body"
          fallback="Design must be functional and functionality must be translated into visual aesthetics. This should be achieved without relying upon overused trends and gimmicks. If it has to be explained, either the design or functionality - or both - are lacking."
          className="text-muted-foreground text-lg"
          singleLine={false}
        />
      </section>

      <section className="section-padding-tight container">
        <div className="border-border flex flex-col gap-3 border-y py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:py-4">
          <EditableText
            as="h2"
            copyKey="about.languages.heading"
            fallback="Languages"
            className="text-2xl md:text-3xl"
          />
          <EditableText
            as="p"
            copyKey="about.languages.list"
            fallback={ABOUT_LANGUAGES.join(' · ')}
            className="nav-caps max-w-xl text-xs leading-relaxed text-muted-foreground md:text-right md:text-sm"
          />
        </div>
      </section>

      <Cta />
    </LandingCopyEditorProvider>
  );
}

