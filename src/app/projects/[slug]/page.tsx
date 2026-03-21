import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';

import { Cta } from '@/components/sections/cta';
import { Process } from '@/components/sections/process';
import { ProjectGallery } from '@/components/sections/project-gallery';
import { ProjectHero } from '@/components/sections/project-hero';
import { ProjectOverview } from '@/components/sections/project-overview';
import { Button } from '@/components/ui/button';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectSlugs,
} from '@/lib/projects';
import { ProjectFrontmatter } from '@/lib/types';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
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

  const { frontmatter } = await compileMDX<ProjectFrontmatter>({
    source: project.content,
    options: { parseFrontmatter: true },
  });

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

  const { frontmatter } = await compileMDX<ProjectFrontmatter>({
    source: project.content,
    options: { parseFrontmatter: true },
  });

  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex((item) => item.slug === slug);
  const nextProject =
    currentIndex >= 0 ? allProjects[(currentIndex + 1) % allProjects.length] : null;

  const images = frontmatter.images ?? [];
  const heroImage = images[0] ?? {
    src: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg',
    alt: `${frontmatter.name} hero image`,
  };
  const galleryImages = images.slice(1);

  return (
    <>
      <ProjectHero title={frontmatter.name} image={heroImage} />

      <ProjectOverview
        title="Project overview"
        description={frontmatter.description}
        project={frontmatter}
      />

      {galleryImages.length >= 2 && (
        <ProjectGallery images={galleryImages.slice(0, 2)} />
      )}

      {frontmatter.process && frontmatter.process.length > 0 && (
        <Process title={`${frontmatter.name} process`} steps={frontmatter.process} />
      )}

      {galleryImages.length >= 4 && (
        <ProjectGallery images={galleryImages.slice(2, 4)} />
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

