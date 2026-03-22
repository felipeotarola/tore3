/**
 * Supabase-backed project records and loaders. Listing layout (Projects 1–style grid,
 * alternating image + copy, badges, scroll-in motion): `ProjectsShowcase` +
 * `src/app/projects/page.tsx`.
 */

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

interface SupabaseProjectRow {
  slug: string;
  title: string | null;
  location: string | null;
  completion: string | null;
  description: string | null;
  website: string | null;
  credits: Array<{ label?: string; value?: string }> | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  sort_order: number | null;
}

const FALLBACK_IMAGE =
  'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg';

const CATEGORY_OVERRIDES: Record<string, ProjectCategory> = {
  '3sixty-skybar': 'bars',
  'biblioteket-live-bar': 'bars',
  'biblioteket-live-cocktail-bar': 'bars',
  'cava-bar-centralstation': 'bars',
  'cava-bar-signalfabriken': 'bars',
  'hallwylska-bar': 'bars',
  'rose-club': 'bars',
  'kasai-stockholm': 'restaurants',
  'la-botanica': 'restaurants',
  'moyagi-london': 'restaurants',
  'moyagi-malmo': 'restaurants',
  'walthon-advokater-office': 'office',
};

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

function normalizeText(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map((segment) =>
      segment.length > 0
        ? segment.charAt(0).toUpperCase() + segment.slice(1)
        : segment,
    )
    .join(' ');
}

function shouldUseMockDescription(value: string | null | undefined): boolean {
  const text = normalizeText(value);
  if (!text) return true;
  return /^imported from local folder/i.test(text);
}

function buildMockDescription(name: string): string {
  return `${name} is a featured TOREKULL project. Detailed case study text will be added soon.`;
}

function buildProjectImages(
  row: SupabaseProjectRow,
  projectName: string,
): ProjectFrontmatter['images'] {
  const urls: string[] = [];

  if (row.cover_image) {
    urls.push(row.cover_image);
  }

  if (Array.isArray(row.gallery_images)) {
    urls.push(...row.gallery_images);
  }

  const uniqueUrls = [...new Set(urls.map((entry) => entry.trim()).filter(Boolean))];
  if (uniqueUrls.length === 0) {
    uniqueUrls.push(FALLBACK_IMAGE);
  }

  return uniqueUrls.map((src, index) => ({
    src,
    alt: `${projectName} image ${index + 1}`,
  }));
}

function buildCollaborators(
  row: SupabaseProjectRow,
): ProjectFrontmatter['collaborators'] {
  if (!Array.isArray(row.credits)) return undefined;

  const collaborators = row.credits
    .map((entry) => {
      const label = normalizeText(entry?.label);
      const value = normalizeText(entry?.value);
      if (!label || !value) return '';
      return `${label}: ${value}`;
    })
    .filter(Boolean);

  return collaborators.length > 0 ? collaborators : undefined;
}

function inferCategory(row: SupabaseProjectRow): ProjectCategory {
  if (CATEGORY_OVERRIDES[row.slug]) return CATEGORY_OVERRIDES[row.slug];

  const text = `${row.slug} ${normalizeText(row.title)}`.toLowerCase();
  if (text.includes('office')) return 'office';
  if (
    text.includes('bar') ||
    text.includes('club') ||
    text.includes('cocktail') ||
    text.includes('skybar')
  ) {
    return 'bars';
  }
  if (text.includes('cafe') || text.includes('bakery') || text.includes('bakehouse')) {
    return 'cafes';
  }
  if (text.includes('restaurant')) return 'restaurants';
  return 'other';
}

function inferIndustry(category: ProjectCategory): string {
  if (category === 'office') return 'Office';
  if (category === 'bars') return 'Bar & Nightlife';
  if (category === 'cafes') return 'Cafe';
  if (category === 'restaurants') return 'Restaurant';
  return 'Hospitality';
}

function toProjectFrontmatter(
  row: SupabaseProjectRow,
  index: number,
): ProjectFrontmatter {
  const name = normalizeText(row.title) || humanizeSlug(row.slug);
  const description = shouldUseMockDescription(row.description)
    ? buildMockDescription(name)
    : normalizeText(row.description);
  const category = inferCategory(row);

  return {
    id: String(index + 1),
    name,
    slug: row.slug,
    logo: 'Logo1',
    category,
    url: normalizeText(row.website) || 'https://torekull.se',
    location: normalizeText(row.location) || undefined,
    title: name,
    description,
    date: normalizeText(row.completion) || undefined,
    industry: inferIndustry(category),
    collaborators: buildCollaborators(row),
    hideLogoOverlay: true,
    images: buildProjectImages(row, name),
    process: [],
  };
}

async function fetchPublishedSupabaseProjects(): Promise<SupabaseProjectRow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Projects source disabled: missing Supabase public env vars.');
    return [];
  }

  const params = new URLSearchParams({
    select:
      'slug,title,location,completion,description,website,credits,cover_image,gallery_images,sort_order',
    is_published: 'eq.true',
    order: 'sort_order.asc.nullslast,created_at.asc',
  });

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/projects?${params.toString()}`, {
      next: { revalidate: 60 },
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch Supabase projects: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? (data as SupabaseProjectRow[]) : [];
  } catch (error) {
    console.error('Error fetching Supabase projects:', error);
    return [];
  }
}

const loadSupabaseProjects = async (): Promise<ProjectFrontmatter[]> => {
  const rows = await fetchPublishedSupabaseProjects();
  return rows.map((row, index) => toProjectFrontmatter(row, index));
};

/**
 * Get all project slugs
 */
export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((project) => project.slug);
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const projects = await getAllProjects();
  const frontmatter = projects.find((project) => project.slug === slug);
  if (!frontmatter) return null;

  return {
    slug,
    content: '',
    frontmatter,
  };
}

/**
 * Get all projects with their frontmatter only (without Logo components)
 * Source of truth: Supabase `public.projects` table.
 */
export async function getAllProjects(): Promise<ProjectFrontmatter[]> {
  return await loadSupabaseProjects();
}

/**
 * Get all projects with their frontmatter and Logo components
 * Use this only in Server Components when you need the Logo component
 */
export async function getAllProjectsWithLogos(): Promise<EnrichedProject[]> {
  try {
    const projects = await getAllProjects();

    return projects.map((frontmatter) => {
      const Logo = LOGO_MAP[frontmatter.logo as keyof typeof LOGO_MAP] || Logo1;

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

  return slugs
    .map((slug) => projectMap.get(slug))
    .filter((project): project is EnrichedProject => project !== undefined);
}
