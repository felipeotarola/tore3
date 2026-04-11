import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { Cta } from '@/components/sections/cta';
import { Process } from '@/components/sections/process';
import { Project14Detail } from '@/components/sections/project-14-detail';
import { ProjectGallery } from '@/components/sections/project-gallery';
import { ProjectLightboxProvider } from '@/components/sections/project-image-lightbox';
import { Button } from '@/components/ui/button';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectSlugs,
} from '@/lib/projects';
import { CATEGORY_LABELS } from '@/lib/torekull';
import type { ProjectCategory } from '@/lib/types';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const { frontmatter } = project;

  return {
    title: frontmatter.name,
    description: frontmatter.description,
    openGraph: {
      title: `${frontmatter.name} - TOREKULL`,
      description: frontmatter.description,
      images: frontmatter.images?.[0]
        ? [
            {
              url: frontmatter.images[0].src,
              alt: frontmatter.images[0].alt,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  const { frontmatter } = project;

  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex((item) => item.slug === slug);
  const nextProject =
    currentIndex >= 0 ? allProjects[(currentIndex + 1) % allProjects.length] : null;

  const images = frontmatter.images ?? [];
  const fallbackHero = {
    src: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg',
    alt: `${frontmatter.name} hero image`,
  };
  const detailImages = images.length > 0 ? images : [fallbackHero];
  const galleryAfterTemplate =
    detailImages.length > 5 ? detailImages.slice(5) : [];

  const categoryLabel =
    CATEGORY_LABELS[frontmatter.category as ProjectCategory] ??
    frontmatter.category;

  return (
    <>
      <section className="container relative z-20 pt-10 md:pt-12">
        <DetailCloseButton fallbackHref="/projects" />
      </section>

      <ProjectLightboxProvider images={detailImages}>
        <Project14Detail
          eyebrow="Selected work"
          title={frontmatter.name}
          images={detailImages}
          categoryLabel={categoryLabel}
          yearLabel={frontmatter.date}
          brandLabel={frontmatter.industry}
          description={frontmatter.description}
          project={frontmatter}
          className="!pt-4 md:!pt-6 lg:!pt-8"
        />

        {galleryAfterTemplate.length > 0 && (
          <ProjectGallery
            images={galleryAfterTemplate}
            imageIndexOffset={5}
          />
        )}
      </ProjectLightboxProvider>

      {frontmatter.process && frontmatter.process.length > 0 && (
        <Process title={`${frontmatter.name} process`} steps={frontmatter.process} />
      )}

      {nextProject && (
        <section className="section-padding container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="nav-caps text-muted-foreground text-xs">Next project</p>
            <h2 className="text-3xl">{nextProject.name}</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/projects/${nextProject.slug}`}>View next project</Link>
          </Button>
        </section>
      )}

      <Cta />
    </>
  );
}
