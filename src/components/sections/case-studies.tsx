import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { getAllProjects } from '@/lib/projects';
import { CATEGORY_LABELS, HOME_FEATURED_SLUGS } from '@/lib/torekull';
import { cn } from '@/lib/utils';

export const CaseStudies = async () => {
  const allProjects = await getAllProjects();
  const caseStudyProjects = allProjects.filter((project) =>
    HOME_FEATURED_SLUGS.includes(
      project.slug as (typeof HOME_FEATURED_SLUGS)[number],
    ),
  );

  return (
    <section className="section-padding-tight container space-y-10 overflow-hidden md:space-y-12">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-4xl md:text-5xl">Selected projects</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Explore recent work across restaurants, bars, and hospitality
            spaces. Hover each panel for quick context and open the full case.
          </p>
        </div>
        <Link
          href="/projects"
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          View all projects
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {caseStudyProjects.map((project) => {
          const image = project.images[0];
          const category = CATEGORY_LABELS[project.category] ?? project.industry;

          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={cn(
                'group border-border relative block overflow-hidden rounded-sm border',
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

                <div className="absolute inset-0 bg-black/18 transition-colors duration-300 group-hover:bg-black/50" />

                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-6">
                  <p className="nav-caps text-xs text-white/85">
                    {category ?? 'Project'}
                  </p>
                  <h3 className="mt-2 text-xl leading-snug tracking-[0.02em] md:text-2xl">
                    {project.title ?? project.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/0 transition-colors duration-300 group-hover:text-white/88">
                    {project.description ?? 'Open project details'}
                  </p>
                  <span className="mt-4 inline-block text-sm text-white/0 transition-colors duration-300 group-hover:text-white">
                    View project
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

