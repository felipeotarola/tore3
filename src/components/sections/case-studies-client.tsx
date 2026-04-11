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
    <section className="section-padding-tight container space-y-10 overflow-hidden md:space-y-12">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-3xl space-y-3">
          <EditableText
            as="h2"
            copyKey="home.caseStudies.heading"
            fallback="Selected projects"
            className="text-4xl md:text-5xl"
          />
          <EditableText
            as="p"
            copyKey="home.caseStudies.description"
            fallback="Explore recent work across restaurants, bars, and hospitality spaces. Hover each panel for quick context and open the full case."
            singleLine={false}
            className="text-muted-foreground text-lg leading-relaxed"
          />
        </div>
        <Link
          href="/projects"
          data-editor-lock-nav="true"
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          <EditableText
            as="span"
            copyKey="home.caseStudies.cta"
            fallback="View all projects"
          />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, index) => {
          const image = project.images[0];
          const category = CATEGORY_LABELS[project.category] ?? project.industry;

          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              data-editor-lock-nav="true"
              className={cn(
                'group border-border relative block overflow-hidden rounded-md border',
                index >= 2 && 'hidden sm:block',
                'outline-none transition-shadow hover:shadow-md',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="bg-muted absolute inset-0" />
                )}

                <div className="absolute inset-0 bg-black/18 transition-colors duration-300 group-hover:bg-black/55" />

                <div
                  className="absolute inset-0 z-10 flex items-center justify-center p-4 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
                  aria-hidden="true"
                >
                  <EditableText
                    as="span"
                    copyKey="home.caseStudies.cardCta"
                    fallback="View project"
                    className="text-center text-2xl font-semibold uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-3xl md:text-4xl"
                  />
                </div>

                <div className="absolute inset-0 z-[1] flex flex-col justify-end p-5 text-white transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0 sm:p-6">
                  <p className="nav-caps text-xs text-white/85">
                    {category ?? 'Project'}
                  </p>
                  <h3 className="mt-2 text-xl leading-snug tracking-[0.02em] md:text-2xl">
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
