import Image from 'next/image';

import { EditableText } from '@/components/editing/editable-text';
import { HOME_STATS } from '@/lib/torekull';
import { cn } from '@/lib/utils';

const aboutDescription =
  'TOREKULL offers creative and innovative solutions within interior architecture, furniture and product design. We believe design must be functional and functionality must be translated into visual aesthetics.';

export const AboutIntro = () => {
  return (
    <section className="section-padding-tight bigger-container space-y-10 md:space-y-12">
      <div className="container grid items-center gap-10 md:grid-cols-2">
        <EditableText
          as="h2"
          copyKey="home.about.heading"
          fallback="About"
          className="text-4xl"
        />

        <EditableText
          as="p"
          copyKey="home.about.description"
          fallback={aboutDescription}
          singleLine={false}
          className="text-muted-foreground md:text-lg lg:text-xl"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative h-[300px] overflow-hidden rounded-md md:h-[400px] lg:h-[500px]">
          <Image
            fill
            src="https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/imports/la-botanica/09-botanica-002-final.jpg"
            alt="TOREKULL interior design - Botanica project"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="relative h-[300px] overflow-hidden rounded-md md:h-[400px] lg:h-[500px]">
          <Image
            fill
            src="https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/imports/kasai-stockholm/03-20221007-173300.jpg"
            alt="TOREKULL interior design - Kasai Stockholm"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="container border-y border-border py-6 md:py-7">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:gap-x-10 md:grid-cols-4 md:gap-x-8 md:gap-y-0">
          {HOME_STATS.map((item, index) => {
            const isShortMetric = item.value.length <= 8;
            return (
              <div key={item.title} className="min-w-0">
                <p className="nav-caps mb-1 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
                  <EditableText
                    as="span"
                    copyKey={`home.about.stats.${index}.label`}
                    fallback={item.title}
                  />
                </p>
                <p
                  className={cn(
                    'font-display leading-[1.1] tracking-[0.02em]',
                    isShortMetric
                      ? 'text-2xl tabular-nums sm:text-3xl'
                      : 'text-sm leading-snug sm:text-base',
                  )}
                >
                  <EditableText
                    as="span"
                    copyKey={`home.about.stats.${index}.value`}
                    fallback={item.value}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
