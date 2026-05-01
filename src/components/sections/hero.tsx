import { ArrowUpRight } from 'lucide-react';
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

export async function Hero() {
  const allProjects = await getAllProjectsWithLogos();
  const heroProjects = allProjects.filter((project) =>
    HOME_HERO_SLUGS.includes(project.slug as (typeof HOME_HERO_SLUGS)[number]),
  );

  return (
    <div className="pt-0 pb-4 md:pb-6 lg:pb-8">
      <section
        className={cn(
          'relative flex min-h-[min(100dvh,702px)] w-full max-w-[100vw] flex-col items-center justify-center overflow-hidden px-8 py-5 md:min-h-[min(100dvh,1032px)] md:px-8 md:py-6',
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

        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-10 text-center">
          <h1 className="flex max-w-[min(94vw,1500px)] flex-wrap items-baseline justify-center gap-x-4 gap-y-2 text-center sm:gap-x-6 md:gap-x-8">
            <EditableText
              as="span"
              copyKey="home.hero.kicker"
              fallback="TOREKULL"
              className="nav-caps text-[clamp(3.75rem,14vw,12.5rem)] leading-[0.85]"
            />
            <EditableText
              as="span"
              copyKey="home.hero.title"
              fallback="INTERIOR ARCHITECTURE & DESIGN"
              className="nav-caps text-[clamp(0.82rem,1.8vw,1.8rem)] leading-none"
            />
          </h1>
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

      </section>
    </div>
  );
}
