import fs from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import path from 'path';

import {
  EnrichedProject,
  ProjectCategory,
  Service,
  ServiceFrontmatter,
} from '@/lib/types';

import {
  getProjectsByCategory,
  getProjectsBySlugs,
} from './projects';

const servicesDirectory = path.join(process.cwd(), 'content/services');

/**
 * Get all service slugs
 */
export async function getServiceSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(servicesDirectory);
    return files.filter((file) => file.endsWith('.mdx'));
  } catch (error) {
    console.error('Error reading services directory:', error);
    return [];
  }
}

/**
 * Get service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const fullPath = path.join(servicesDirectory, `${slug}.mdx`);
    const fileContents = await fs.readFile(fullPath, 'utf8');

    return {
      slug,
      content: fileContents,
      frontmatter: {} as ServiceFrontmatter, // Will be parsed by compileMDX
    };
  } catch (error) {
    console.error(`Error reading service ${slug}:`, error);
    return null;
  }
}

/**
 * Get all services with their frontmatter
 */
export async function getAllServices(): Promise<ServiceFrontmatter[]> {
  try {
    const files = await fs.readdir(servicesDirectory);
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

    const services = await Promise.all(
      mdxFiles.map(async (file) => {
        const fullPath = path.join(servicesDirectory, file);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { frontmatter } = await compileMDX<ServiceFrontmatter>({
          source: fileContents,
          options: { parseFrontmatter: true },
        });
        return frontmatter;
      }),
    );

    return services;
  } catch (error) {
    console.error('Error reading all services:', error);
    return [];
  }
}

/**
 * Resolve featured work for a service
 * - If featuredWork is undefined/empty: auto-filter by service slug (category)
 * - If featuredWork is string array: get projects by those slugs in specified order
 */
export async function resolveFeaturedWork(
  service: ServiceFrontmatter,
): Promise<EnrichedProject[]> {
  const { slug, featuredWork } = service;

  // No featuredWork specified: auto-filter by category
  if (!featuredWork || featuredWork.length === 0) {
    return await getProjectsByCategory(slug as ProjectCategory);
  }

  // Custom project selection by slugs
  return await getProjectsBySlugs(featuredWork);
}
