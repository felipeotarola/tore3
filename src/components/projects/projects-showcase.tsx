'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS } from '@/lib/torekull';
import type { ProjectFrontmatter } from '@/lib/types';
import { cn } from '@/lib/utils';

function excerpt(text: string, max = 200) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
}

const FALLBACK_IMG =
  'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg';

type ProjectsShowcaseProps = {
  projects: ProjectFrontmatter[];
};

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const reduceMotion = Boolean(useReducedMotion());

  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground border-border border-t pt-12 text-center text-sm">
        No projects in this category yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-16 pt-10 lg:gap-24 lg:pt-14">
      {projects.map((project, index) => {
        const primary = project.images[0] ?? {
          src: FALLBACK_IMG,
          alt: `${project.name} cover`,
        };
        const categoryLabel =
          CATEGORY_LABELS[project.category] ?? project.industry ?? 'Project';
        const reversed = index % 2 === 1;

        return (
          <motion.article
            key={project.id}
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16"
            >
              <div
                className={cn(
                  'relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-muted',
                  reversed && 'lg:order-2',
                )}
              >
                <Image
                  src={primary.src}
                  alt={primary.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  quality={90}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/18 transition-colors duration-300 group-hover:bg-black/55" />
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center p-4 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
                  aria-hidden="true"
                >
                  <span className="text-center text-2xl font-semibold uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-3xl md:text-4xl">
                    View project
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  'flex min-w-0 flex-col gap-4 lg:max-w-xl',
                  reversed && 'lg:order-1',
                )}
              >
                <Badge variant="outline" className="nav-caps w-fit text-[0.65rem] tracking-[0.12em]">
                  {categoryLabel}
                </Badge>
                <div className="space-y-2">
                  <h2 className="text-3xl tracking-[0.02em] md:text-4xl">{project.name}</h2>
                  {project.location ? (
                    <p className="text-muted-foreground text-sm">{project.location}</p>
                  ) : null}
                </div>
                {project.description ? (
                  <p className="text-muted-foreground line-clamp-4 text-base leading-relaxed">
                    {excerpt(project.description)}
                  </p>
                ) : null}
                <span className="inline-flex items-center gap-2 pt-1 text-sm font-medium">
                  View project
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
