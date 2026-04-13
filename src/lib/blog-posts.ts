/**
 * Supabase `blog_posts` — publik lista via anon key, skrivning via autentiserad klient.
 */

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

type SupabaseBlogRow = {
  id: string;
  slug: string;
  title: string | null;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

function normalizeRow(row: SupabaseBlogRow): BlogPostRow | null {
  const slug = typeof row.slug === 'string' ? row.slug.trim() : '';
  const title = typeof row.title === 'string' ? row.title.trim() : '';
  if (!slug || !title) return null;
  return {
    id: row.id,
    slug,
    title,
    excerpt: row.excerpt?.trim() || null,
    body: row.body?.trim() || null,
    cover_image_url: row.cover_image_url?.trim() || null,
    published_at: row.published_at,
  };
}

async function fetchPublishedPosts(): Promise<SupabaseBlogRow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Blog posts disabled: missing Supabase public env vars.');
    return [];
  }

  const params = new URLSearchParams({
    select: 'id,slug,title,excerpt,body,cover_image_url,published_at',
    is_published: 'eq.true',
    order: 'published_at.desc.nullslast,created_at.desc',
  });

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts?${params.toString()}`, {
      next: { revalidate: 60 },
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 406) {
        console.warn(
          'blog_posts table missing or not exposed — kör migrationen 20260413_create_blog_posts.sql i Supabase.',
        );
      } else {
        console.error(
          `Failed to fetch blog_posts: ${response.status} ${response.statusText}`,
        );
      }
      return [];
    }

    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? (data as SupabaseBlogRow[]) : [];
  } catch (e) {
    console.error('Error fetching blog_posts:', e);
    return [];
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  const rows = await fetchPublishedPosts();
  return rows.map(normalizeRow).filter((r): r is BlogPostRow => r !== null);
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<BlogPostRow | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || !slug.trim()) {
    return null;
  }

  const params = new URLSearchParams({
    select: 'id,slug,title,excerpt,body,cover_image_url,published_at',
    slug: `eq.${slug.trim()}`,
    is_published: 'eq.true',
    limit: '1',
  });

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts?${params.toString()}`, {
      next: { revalidate: 60 },
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as unknown;
    if (!Array.isArray(data) || data.length === 0) return null;
    return normalizeRow(data[0] as SupabaseBlogRow);
  } catch {
    return null;
  }
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => p.slug);
}
