import type React from 'react';

export type LogoComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & {
    logomarkClassName?: string;
    wordmarkClassName?: string;
  }
>;

export interface ProjectImage {
  src: string;
  alt: string;
}

export type ProjectCategory =
  | 'restaurants'
  | 'bars'
  | 'cafes'
  | 'office'
  | 'other'
  | 'logo-design'
  | 'brand-identity'
  | 'icon-design';

export interface ProcessStep {
  title: string;
  description: string;
  image?: string;
}

export interface ProjectFrontmatter {
  id: string;
  name: string;
  slug: string;
  logo: string;
  category: ProjectCategory;
  url: string;
  location?: string;
  title?: string;
  description?: string;
  date?: string;
  industry?: string;
  collaborators?: string[];
  hideLogoOverlay?: boolean;
  images: ProjectImage[];
  process?: ProcessStep[];
  // Custom styling fields
  logoClassName?: string;
  wrapperClassName?: string;
  imageClassName?: string;
}

export interface EnrichedProject extends ProjectFrontmatter {
  Logo: LogoComponent;
}

export interface Project {
  slug: string;
  content: string;
  frontmatter: ProjectFrontmatter;
}

export interface ServiceFrontmatter {
  title: string;
  pageTitle: string;
  description: string;
  slug: string;
  heroImage: string;
  image: string;
  icon: string;
  shortDescription: string;
  tags: string[];
  // Optional array of project slugs for custom featured work selection
  // If not provided, auto-filters by category
  featuredWork?: string[];
  whatYouGet: Array<{
    icon: string;
    title: string;
    description: string;
    image?: string;
  }>;
  process: ProcessStep[];
}

export interface Service {
  slug: string;
  content: string;
  frontmatter: ServiceFrontmatter;
}
