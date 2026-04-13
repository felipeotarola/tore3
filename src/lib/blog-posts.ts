/**
 * Supabase `blog_posts` — data fetching for public site + review workflow.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? '';
const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReviewStatus = 'pending_review' | 'approved' | 'rejected' | 'edit_requested';

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  tags: string[];
  sources_used: string[];
};

export type BlogDraftRow = BlogPostRow & {
  review_token: string;
  review_status: ReviewStatus;
  review_notes: string | null;
  is_published: boolean;
  created_at: string;
};

type RawRow = {
  id: string;
  slug: string | null;
  title: string | null;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  tags: string[] | null;
  sources_used: string[] | null;
  review_token?: string;
  review_status?: string;
  review_notes?: string | null;
  is_published?: boolean;
  created_at?: string;
};

function normalizeRow(row: RawRow): BlogPostRow | null {
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
    published_at: row.published_at ?? null,
    tags: Array.isArray(row.tags) ? row.tags : [],
    sources_used: Array.isArray(row.sources_used) ? row.sources_used : [],
  };
}

function normalizeDraft(row: RawRow): BlogDraftRow | null {
  const base = normalizeRow(row);
  if (!base) return null;
  return {
    ...base,
    review_token: row.review_token ?? '',
    review_status: (row.review_status as ReviewStatus) ?? 'pending_review',
    review_notes: row.review_notes ?? null,
    is_published: row.is_published ?? false,
    created_at: row.created_at ?? '',
  };
}

// ─── Public readers ───────────────────────────────────────────────────────────

const PUBLIC_SELECT =
  'id,slug,title,excerpt,body,cover_image_url,published_at,tags,sources_used';

async function supabaseFetch(
  params: URLSearchParams,
  key: string,
  revalidate = 60,
): Promise<RawRow[]> {
  if (!SUPABASE_URL || !key) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?${params}`, {
      next: { revalidate },
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      console.error(`blog_posts fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? (data as RawRow[]) : [];
  } catch (e) {
    console.error('blog_posts fetch error:', e);
    return [];
  }
}

export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  const params = new URLSearchParams({
    select: PUBLIC_SELECT,
    is_published: 'eq.true',
    order: 'published_at.desc.nullslast,created_at.desc',
  });
  const rows = await supabaseFetch(params, ANON_KEY);
  return rows.map(normalizeRow).filter((r): r is BlogPostRow => r !== null);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPostRow | null> {
  if (!slug.trim()) return null;
  const params = new URLSearchParams({
    select: PUBLIC_SELECT,
    slug: `eq.${slug.trim()}`,
    is_published: 'eq.true',
    limit: '1',
  });
  const rows = await supabaseFetch(params, ANON_KEY);
  if (!rows.length) return null;
  return normalizeRow(rows[0]);
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => p.slug);
}

// ─── Review workflow (server-side only, uses service role) ────────────────────

const DRAFT_SELECT =
  'id,slug,title,excerpt,body,cover_image_url,published_at,tags,sources_used,review_token,review_status,review_notes,is_published,created_at';

export async function getDraftByReviewToken(token: string): Promise<BlogDraftRow | null> {
  if (!token.trim() || !SERVICE_KEY) return null;
  const params = new URLSearchParams({
    select: DRAFT_SELECT,
    review_token: `eq.${token.trim()}`,
    limit: '1',
  });
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?${params}`, {
      cache: 'no-store',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    return normalizeDraft(data[0] as RawRow);
  } catch {
    return null;
  }
}

export async function updateReviewStatus(
  token: string,
  status: ReviewStatus,
  notes?: string,
): Promise<boolean> {
  if (!token.trim() || !SERVICE_KEY) return false;

  const body: Record<string, unknown> = { review_status: status };
  if (notes !== undefined) body.review_notes = notes;
  if (status === 'approved') {
    body.is_published = true;
    body.published_at = new Date().toISOString();
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?review_token=eq.${token.trim()}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(body),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Agent insertion (server-side, called from run-weekly.ts) ─────────────────

export type DraftInsert = {
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  sources_used: string[];
  agent_session_id?: string;
};

export async function insertDraft(draft: DraftInsert): Promise<BlogDraftRow | null> {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;

  const slug = draft.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

  const uniqueSlug = `${slug}-${Date.now()}`;

  const payload = {
    slug: uniqueSlug,
    title: draft.title,
    excerpt: draft.excerpt,
    body: draft.body,
    tags: draft.tags,
    sources_used: draft.sources_used,
    agent_session_id: draft.agent_session_id ?? null,
    is_published: false,
    review_status: 'pending_review',
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Failed to insert draft:', err);
      return null;
    }
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    return normalizeDraft(row as RawRow);
  } catch (e) {
    console.error('insertDraft error:', e);
    return null;
  }
}
