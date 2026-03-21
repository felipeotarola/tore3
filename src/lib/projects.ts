import fs from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import path from 'path';

import {
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo6,
  Logo7,
  Logo8,
  Logo9,
} from '@/components/icons/logos';
import {
  EnrichedProject,
  Project,
  ProjectCategory,
  ProjectFrontmatter,
} from '@/lib/types';

const projectsDirectory = path.join(process.cwd(), 'content/torekull-projects');

// Logo component mapping
const LOGO_MAP = {
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo6,
  Logo7,
  Logo8,
  Logo9,
} as const;

/**
 * Get all project slugs
 */
export async function getProjectSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(projectsDirectory);
    return files.filter((file) => file.endsWith('.mdx'));
  } catch (error) {
    console.error('Error reading projects directory:', error);
    return [];
  }
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
    const fileContents = await fs.readFile(fullPath, 'utf8');

    return {
      slug,
      content: fileContents,
      frontmatter: {} as ProjectFrontmatter, // Will be parsed by compileMDX
    };
  } catch (error) {
    console.error(`Error reading project ${slug}:`, error);
    return null;
  }
}

/**
 * Get all projects with their frontmatter only (without Logo components)
 * Use this when passing data to Client Components
 */
export async function getAllProjects(): Promise<ProjectFrontmatter[]> {
  try {
    const files = await fs.readdir(projectsDirectory);
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

    const projects = await Promise.all(
      mdxFiles.map(async (file) => {
        const fullPath = path.join(projectsDirectory, file);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { frontmatter } = await compileMDX<ProjectFrontmatter>({
          source: fileContents,
          options: { parseFrontmatter: true },
        });

        return frontmatter;
      }),
    );

    // Sort by id
    return projects.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error) {
    console.error('Error reading all projects:', error);
    return [];
  }
}

/**
 * Get all projects with their frontmatter and Logo components
 * Use this only in Server Components when you need the Logo component
 */
export async function getAllProjectsWithLogos(): Promise<EnrichedProject[]> {
  try {
    const projects = await getAllProjects();

    return projects.map((frontmatter) => {
      // Map logo string to Logo component
      const Logo = LOGO_MAP[frontmatter.logo as keyof typeof LOGO_MAP];

      return {
        ...frontmatter,
        Logo,
      } as EnrichedProject;
    });
  } catch (error) {
    console.error('Error enriching projects with logos:', error);
    return [];
  }
}

/**
 * Get projects filtered by category
 */
export async function getProjectsByCategory(
  category: ProjectCategory,
): Promise<EnrichedProject[]> {
  const allProjects = await getAllProjectsWithLogos();
  return allProjects.filter((project) => project.category === category);
}

/**
 * Get projects by slugs in specified order
 * Used when service MDX specifies custom featured work
 */
export async function getProjectsBySlugs(
  slugs: string[],
): Promise<EnrichedProject[]> {
  const allProjects = await getAllProjectsWithLogos();
  const projectMap = new Map(allProjects.map((p) => [p.slug, p]));

  // Return projects in the order specified by slugs array
  return slugs
    .map((slug) => projectMap.get(slug))
    .filter((project): project is EnrichedProject => project !== undefined);
}
