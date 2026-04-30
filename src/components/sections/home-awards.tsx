import Image, { type StaticImageData } from 'next/image';

import { EditableText } from '@/components/editing/editable-text';
import { HOME_STATS } from '@/lib/torekull';
import { cn } from '@/lib/utils';

import award2021RollsRoyceFiveStar from '@/assets/award-eu-2021-1-BEKUfOFA.png';
import award2021RollsRoyceWinner from '@/assets/award-eu-2021-2-B3LTT-g_.jpg';
import award2022LaufenFiveStar from '@/assets/award-eu-2022-1-DfHIgPbY.jpg';
import award2022LaufenWinner from '@/assets/award-eu-2022-2-MqLdy2AQ.jpg';

type HomeAward = {
  src: StaticImageData;
  year: string;
  label: string;
};

const HOME_AWARDS: HomeAward[] = [
  {
    src: award2021RollsRoyceFiveStar,
    year: '2021-2022',
    label: 'European Property Awards 2021-2022 five star interior design award',
  },
  {
    src: award2021RollsRoyceWinner,
    year: '2021-2022',
    label: 'European Property Awards 2021-2022 interior design award winner',
  },
  {
    src: award2022LaufenFiveStar,
    year: '2022-2023',
    label: 'European Property Awards 2022-2023 five star interior design award',
  },
  {
    src: award2022LaufenWinner,
    year: '2022-2023',
    label: 'European Property Awards 2022-2023 interior design award winner',
  },
];

export function HomeProofBlock() {
  return (
    <section
      className="container py-10 md:py-12 lg:py-14"
      aria-labelledby="home-proof-heading"
    >
      <div className="mx-auto max-w-5xl">
        <p
          id="home-proof-heading"
          className="nav-caps text-center text-[11px] leading-relaxed tracking-[0.22em] text-muted-foreground sm:text-xs"
        >
          Europe&apos;s best interior design studio · European Property Awards
        </p>

        <div className="mx-auto mt-6 grid max-w-2xl grid-cols-4 items-end justify-items-center gap-x-5 sm:gap-x-8">
          {HOME_AWARDS.map((award) => (
            <figure
              key={`${award.label}-${award.year}`}
              className="flex flex-col items-center gap-3"
            >
              <Image
                src={award.src}
                alt={award.label}
                className="h-24 w-auto object-contain sm:h-28 md:h-32"
                sizes="(max-width: 640px) 72px, 92px"
                placeholder="blur"
              />
              <figcaption className="text-xs text-muted-foreground sm:text-sm">
                {award.year}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 border-y border-border/80 py-5 md:mt-9">
          <div className="grid grid-cols-2 gap-y-5 md:grid-cols-4 md:divide-x md:divide-border/80">
            {HOME_STATS.map((item, index) => {
              const isShortMetric = item.value.length <= 8;

              return (
                <div
                  key={item.title}
                  className="min-w-0 px-0 md:px-7 first:md:pl-0 last:md:pr-0"
                >
                  <p className="nav-caps mb-1 text-[10px] leading-snug tracking-[0.18em] text-muted-foreground">
                    <EditableText
                      as="span"
                      copyKey={`home.about.stats.${index}.label`}
                      fallback={item.title}
                    />
                  </p>

                  <p
                    className={cn(
                      'font-display leading-[1.1] tracking-[0.01em] text-foreground',
                      isShortMetric
                        ? 'text-2xl tabular-nums sm:text-3xl'
                        : 'max-w-[14rem] text-sm leading-snug sm:text-[15px]',
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
      </div>
    </section>
  );
}