import Image from 'next/image';

import { HOME_STATS } from '@/lib/torekull';

const aboutDescription =
  'TOREKULL offers creative and innovative solutions within interior architecture, furniture and product design. We believe design must be functional and functionality must be translated into visual aesthetics.';

export const AboutIntro = () => {
  return (
    <section className="section-padding bigger-container space-y-16 md:space-y-18">
      <div className="container grid items-center gap-10 md:grid-cols-2">
        <h2 className="text-4xl">About</h2>

        <p className="text-muted-foreground md:text-lg lg:text-xl">
          {aboutDescription}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
          <Image
            fill
            src="https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/imports/la-botanica/09-botanica-002-final.jpg"
            alt="TOREKULL interior design - Botanica project"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
          <Image
            fill
            src="https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/imports/kasai-stockholm/03-20221007-173300.jpg"
            alt="TOREKULL interior design - Kasai Stockholm"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HOME_STATS.map((item) => (
          <div key={item.title} className="space-y-2 text-lg">
            <h3 className="text-muted-foreground">{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
