'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CATEGORY_LABELS } from '@/lib/torekull';
import type { ProjectFrontmatter } from '@/lib/types';

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
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground border-border border-t pt-12 text-center text-sm">
        No projects in this category yet.
      </p>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-9 pt-5 sm:grid-cols-2 md:pt-6 lg:grid-cols-3 lg:gap-y-11">
      {projects.map((project, index) => {
        const primary = project.images[0] ?? {
          src: FALLBACK_IMG,
          alt: `${project.name} cover`,
        };
        const categoryLabel =
          CATEGORY_LABELS[project.category] ?? project.industry ?? 'Project';

        return (
          <article key={project.id} className="min-w-0">
            <Link
              href={`/projects/${project.slug}`}
              className="tk-panel-link group flex h-full flex-col gap-4"
            >
              <div
                className="tk-image-frame relative aspect-[4/3] w-full"
              >
                <Image
                  src={primary.src}
                  alt={primary.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  quality={90}
                  priority={index < 9}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/8 transition-colors duration-300 group-hover:bg-black/18" />
                <div
                  className="absolute right-3 bottom-3 z-10 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
                  aria-hidden="true"
                >
                  <span className="nav-caps inline-flex rounded-full border border-white/35 bg-black/30 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                    View project
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <span className="tk-meta-label w-fit rounded-full border border-border/80 bg-background/45 px-3 py-1.5 text-foreground/75">
                  {categoryLabel}
                </span>
                <div className="space-y-2">
                  <h2 className="tk-card-title transition-colors group-hover:text-foreground">
                    {project.name}
                  </h2>
                  {project.location ? (
                    <p className="text-muted-foreground text-sm">{project.location}</p>
                  ) : null}
                </div>
                {project.description ? (
                  <p className="tk-body line-clamp-3">
                    {excerpt(project.description, 160)}
                  </p>
                ) : null}
                <span className="nav-caps mt-auto inline-flex items-center gap-1 pt-1 text-[10px] font-medium tracking-[0.16em] text-foreground/80 transition-colors group-hover:text-foreground">
                  View project
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
