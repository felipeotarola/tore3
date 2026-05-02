import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { DetailPageHeader } from '@/components/navigation/detail-page-header';
import { Button } from '@/components/ui/button';
import { getAllProjects } from '@/lib/projects';
import {
  CATEGORY_LABELS,
  COLLABORATION_MARQUEE,
  COLLABORATION_PARTNERS,
} from '@/lib/torekull';
import type { ProjectFrontmatter } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Collaborations',
};

const COLLABORATION_PROJECT_SLUGS: Partial<
  Record<(typeof COLLABORATION_MARQUEE)[number], string>
> = {
  Kasai: 'kasai-stockholm',
  Moyagi: 'moyagi-london',
  'La Botanica': 'la-botanica',
  '3Sixty Skybar': '3sixty-skybar',
  'Biblioteket Live': 'biblioteket-live-cocktail-bar',
  'Deck Brasserie': 'deck-brasserie-bar',
  Chouchou: 'chouchou',
  'Canta Lola': 'canta-lola',
  Hallwylska: 'hallwylska-bar',
  'Rose Club': 'rose-club',
  'Walthon Advokater': 'walthon-advokater-office',
  'Delish Bakehouse': 'delish-bakehouse',
  'Cava Bar': 'cava-bar-centralstation',
};

const COLLABORATION_SCOPE = [
  {
    label: 'Interior delivery',
    body: 'Trusted specialists help move concepts from material direction into finished hospitality environments.',
  },
  {
    label: 'Technical integration',
    body: 'Lighting, operational requirements, and site constraints are coordinated as part of the design story.',
  },
  {
    label: 'Identity & styling',
    body: 'Branding, styling, and spatial details are shaped so the full guest experience feels coherent.',
  },
] as const;

function getProjectByName(
  projects: ProjectFrontmatter[],
  name: (typeof COLLABORATION_MARQUEE)[number],
) {
  const slug = COLLABORATION_PROJECT_SLUGS[name];
  if (!slug) return null;
  return projects.find((project) => project.slug === slug) ?? null;
}

export default async function CollaborationsPage() {
  const allProjects = await getAllProjects();

  return (
    <>
      <DetailPageHeader
        fallbackHref="/"
        eyebrow="Studio network"
        title="Collaborations"
        description="TOREKULL works with trusted partners across lighting, technical integration, styling, branding, and delivery to bring ambitious interior concepts to life."
      />

      <section className="container tk-section-tight tk-section-border space-y-7">
        <div className="max-w-2xl space-y-2">
          <p className="tk-eyebrow">Trusted network</p>
          <h2 className="tk-section-title">Core Partners</h2>
          <p className="tk-lead">
            A focused group of collaborators supports the parts of a project that
            need specialist craft, technical precision, and local delivery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COLLABORATION_PARTNERS.map((partner, index) => (
            <article key={partner} className="tk-surface p-5 md:p-6">
              <p className="tk-meta-label mb-4">
                Partner {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="tk-card-title">{partner}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="container tk-section-tight tk-section-border space-y-7">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl space-y-2">
            <p className="tk-eyebrow">Selected work together</p>
            <h2 className="tk-section-title">Notable Projects</h2>
            <p className="tk-lead">
              Collaboration is visible in the details: lighting, materiality,
              branding, styling, and the final guest-facing atmosphere.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects">View all projects</Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COLLABORATION_MARQUEE.map((projectName, index) => {
            const project = getProjectByName(allProjects, projectName);
            const image = project?.images?.[0];
            const category = project
              ? CATEGORY_LABELS[project.category] ?? project.industry
              : 'Project';

            return (
              <Link
                key={projectName}
                href={project ? `/projects/${project.slug}` : '/projects'}
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <article className="h-full">
                  <div className="tk-image-frame relative aspect-[4/3] w-full">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={90}
                        priority={index < 12}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-card" />
                    )}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <p className="nav-caps text-[10px] font-medium tracking-[0.14em] text-white/75">
                        {category}
                      </p>
                      <h3 className="mt-1 tk-card-title text-white">
                        {project?.name ?? projectName}
                      </h3>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container tk-section-tight tk-section-border pb-12 md:pb-16 lg:pb-20">
        <div className="grid gap-7 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-start md:gap-12">
          <div className="max-w-xl space-y-2">
            <p className="tk-eyebrow">Working model</p>
            <h2 className="tk-section-title">Collaborative Scope</h2>
          </div>

          <div className="grid gap-4">
            {COLLABORATION_SCOPE.map((item) => (
              <article key={item.label} className="tk-surface p-5">
                <h3 className="tk-card-title">{item.label}</h3>
                <p className="tk-body mt-2">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
