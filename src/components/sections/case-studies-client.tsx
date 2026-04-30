'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import { EditableText } from '@/components/editing/editable-text';
import { useLandingCopyEditor } from '@/components/editing/landing-copy-editor-provider';
import { buttonVariants } from '@/components/ui/button';
import { CATEGORY_LABELS, HOME_FEATURED_SLUGS } from '@/lib/torekull';
import { ProjectFrontmatter } from '@/lib/types';
import { cn } from '@/lib/utils';

const FEATURED_ORDER_KEY = 'home.caseStudies.featuredSlugs';

function parseFeaturedSlugs(raw: string | undefined) {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((entry): entry is string => typeof entry === 'string');
  } catch {
    return null;
  }
}

function resolveOrderedFeaturedSlugs(
  availableProjects: ProjectFrontmatter[],
  savedRaw: string | undefined,
) {
  const availableSlugs = new Set(availableProjects.map((project) => project.slug));
  const fallbackSlugs: string[] = HOME_FEATURED_SLUGS.filter((slug) => availableSlugs.has(slug));
  const savedSlugs = parseFeaturedSlugs(savedRaw)?.filter((slug) =>
    availableSlugs.has(slug),
  );

  if (!savedRaw || !savedSlugs) {
    return fallbackSlugs;
  }

  const dedupedSaved = savedSlugs.filter(
    (slug, index) => savedSlugs.indexOf(slug) === index,
  );
  return dedupedSaved;
}

type CaseStudiesClientProps = {
  allProjects: ProjectFrontmatter[];
};

export function CaseStudiesClient({ allProjects }: CaseStudiesClientProps) {
  const { copy } = useLandingCopyEditor();

  const projectBySlug = useMemo(() => {
    const map = new Map<string, ProjectFrontmatter>();
    for (const project of allProjects) {
      map.set(project.slug, project);
    }
    return map;
  }, [allProjects]);

  const featuredSlugs = useMemo(
    () => resolveOrderedFeaturedSlugs(allProjects, copy[FEATURED_ORDER_KEY]),
    [allProjects, copy],
  );

  const featuredProjects = useMemo(
    () =>
      featuredSlugs
        .map((slug) => projectBySlug.get(slug))
        .filter((project): project is ProjectFrontmatter => Boolean(project)),
    [featuredSlugs, projectBySlug],
  );

return (
  <section className="container overflow-hidden py-8 md:py-10 lg:py-12">
    <div className="mb-7 grid gap-5 md:mb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div className="max-w-2xl space-y-2">
        <EditableText
          as="h2"
          copyKey="home.caseStudies.heading"
          fallback="Selected projects"
          className="text-3xl leading-tight tracking-[-0.03em] md:text-4xl"
        />

        <EditableText
          as="p"
          copyKey="home.caseStudies.description"
          fallback="Explore recent work across restaurants, bars, and hospitality spaces. Hover each panel for quick context and open the full case."
          singleLine={false}
          className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
        />
      </div>

      <Link
        href="/projects"
        data-editor-lock-nav="true"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'w-fit rounded-md px-4 text-xs',
        )}
      >
        <EditableText
          as="span"
          copyKey="home.caseStudies.cta"
          fallback="View all projects"
        />
      </Link>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {featuredProjects.map((project, index) => {
        const image = project.images[0];
        const category = CATEGORY_LABELS[project.category] ?? project.industry;

        return (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            data-editor-lock-nav="true"
            className={cn(
              'group relative block overflow-hidden rounded-md border border-border bg-muted',
              index >= 2 && 'hidden sm:block',
              'outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            <div className="relative aspect-[4/4.6] w-full overflow-hidden">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={90}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-muted" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              <div
                className="absolute right-4 bottom-4 z-10 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:opacity-100"
                aria-hidden="true"
              >
                <EditableText
                  as="span"
                  copyKey="home.caseStudies.cardCta"
                  fallback="View project"
                  className="nav-caps inline-flex rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[10px] font-medium text-white/90 backdrop-blur-sm"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 z-[1] p-4 text-white md:p-5">
                <p className="nav-caps text-[10px] tracking-[0.18em] text-white/75 md:text-xs">
                  {category ?? 'Project'}
                </p>

                <h3 className="mt-1.5 max-w-[16rem] text-lg leading-snug tracking-[-0.01em] md:text-xl">
                  {project.title ?? project.name}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);
}
