import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { EditableText } from '@/components/editing/editable-text';
import { ProjectCard } from '@/components/project-card';
import { getAllProjectsWithLogos } from '@/lib/projects';
import {
  HERO_POSTER_SRC,
  HERO_VIDEO_SRC,
  HOME_HERO_SLUGS,
} from '@/lib/torekull';
import { cn } from '@/lib/utils';

/** Bump when replacing award PNGs so browsers skip stale cache (`2022` refreshed here). */
const HERO_AWARD_ASSET_VERSIONS: Record<string, string> = {
  '/EUawards2021_Torkel.png': '4',
  '/EUawards2022_Torkel.png': '5',
};

export async function Hero() {
  const allProjects = await getAllProjectsWithLogos();
  const heroProjects = allProjects.filter((project) =>
    HOME_HERO_SLUGS.includes(project.slug as (typeof HOME_HERO_SLUGS)[number]),
  );

  return (
    <div className="pt-0 pb-4 md:pb-6 lg:pb-8">
      <section
        className={cn(
          'relative m-5 mb-0! flex min-h-[min(100dvh,702px)] flex-col items-center justify-center overflow-hidden p-5 md:m-6 md:min-h-[min(100dvh,1032px)] md:p-6',
          'bg-foreground text-background',
        )}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={HERO_POSTER_SRC}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[1] bg-black/60" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-10 pb-[11rem] text-center sm:pb-[12.5rem] md:pb-[14.5rem] lg:pb-[17rem]">
          <EditableText
            as="p"
            copyKey="home.hero.kicker"
            fallback="TOREKULL"
            className="nav-caps mb-4 text-sm md:text-base"
          />
          <EditableText
            as="h1"
            copyKey="home.hero.title"
            fallback="INTERIOR ARCHITECTURE & DESIGN"
            className="max-w-[12ch] text-4xl leading-[1.05] sm:max-w-none sm:text-6xl md:text-7xl lg:text-8xl"
          />
          <Link
            href="/projects/3sixty-skybar"
            className="hero-video-cta group nav-caps mt-6 inline-flex items-center gap-2 px-4 py-2 text-[11px] sm:mt-8 sm:px-6 sm:py-3 sm:text-xs md:text-sm"
          >
            <EditableText
              as="span"
              copyKey="home.hero.cta"
              fallback="Explore 3Sixty Skybar"
              className="relative z-10"
            />
            <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="relative z-10 hidden gap-6 p-6 [@media(min-width:1920px)]:grid [@media(min-width:1920px)]:grid-cols-4">
          {heroProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showName={false}
              className="h-[290px] w-[438px]"
            />
          ))}
        </div>

        {/* <Carousel
          opts={{
            align: 'start',
          }}
          className="relative z-10 mt-4 flex w-full cursor-grab justify-center sm:mt-6 [@media(min-width:1920px)]:hidden"
        >
          <CarouselContent>
            {heroProjects.map((project) => (
              <CarouselItem
                key={project.id}
                className="basis-[74%] pl-3 first:pl-0 sm:basis-[58%] sm:pl-4 md:basis-[1/4] md:pl-6"
              >
                <ProjectCard
                  project={project}
                  showName={false}
                  className="h-[170px] w-full sm:h-[210px] md:h-[290px] md:w-[438px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="top-auto bottom-3 left-1/2 h-9 w-9 -translate-x-[125%] translate-y-0 border-white/35 bg-black/50 text-white hover:bg-black/70 sm:bottom-4"
            aria-label="Previous featured project"
          />
          <CarouselNext
            className="top-auto right-auto bottom-3 left-1/2 h-9 w-9 translate-x-[25%] translate-y-0 border-white/35 bg-black/50 text-white hover:bg-black/70 sm:bottom-4"
            aria-label="Next featured project"
          />
        </Carousel> */}

        <nav
          aria-label="European Property Awards"
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex items-end justify-center gap-6 px-4 pb-2 sm:gap-10 sm:pb-3 md:gap-14 md:pb-4"
        >
          {(
            [
              {
                src: '/EUawards2021_Torkel.png',
                label: 'European Property Awards 2021–2022',
              },
              {
                src: '/EUawards2022_Torkel.png',
                label: 'European Property Awards 2022–2023',
              },
            ] as const
          ).map((award) => (
            <Link
              key={award.src}
              href="/about"
              data-editor-lock-nav="true"
              aria-label={`About TOREKULL — ${award.label}`}
              className="border-0 outline-none ring-0 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            >
              <div className="relative h-36 w-[6.75rem] overflow-hidden bg-transparent sm:h-40 sm:w-[7.75rem] md:h-48 md:w-[9rem] lg:h-52 lg:w-[9.75rem]">
                <Image
                                   src={`${award.src}?v=${HERO_AWARD_ASSET_VERSIONS[award.src] ?? '1'}`}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 120px, (max-width: 1024px) 144px, 168px"
                  className="object-cover object-top [image-rendering:auto]"
                />
              </div>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
