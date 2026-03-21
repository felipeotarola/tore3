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
        <Image
          width={924}
          height={664}
          src="/images/torekull/projects/walthon-1.jpg"
          alt="TOREKULL studio interior detail"
          className="size-full object-cover"
        />
        <Image
          width={924}
          height={664}
          src="/images/torekull/awards/award-eu-2022-1.jpg"
          alt="TOREKULL award recognition"
          className="size-full object-cover"
        />
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

