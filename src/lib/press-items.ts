import { PRESS_ITEMS, PressItem } from '@/lib/torekull';

export type PressListItem = PressItem & {
  sortOrder: number;
  isPublished: boolean;
};

type SupabasePressItemRow = {
  slug: string | null;
  title: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_published: boolean | null;
};

function toFallbackItems(): PressListItem[] {
  return PRESS_ITEMS.map((item, index) => ({
    slug: item.slug,
    title: item.title,
    image: item.image,
    url: item.url,
    sortOrder: (index + 1) * 10,
    isPublished: true,
  }));
}

export async function getPressItems(): Promise<PressListItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return toFallbackItems();
  }

  const params = new URLSearchParams({
    select: 'slug,title,image_url,sort_order,is_published',
    is_published: 'eq.true',
    order: 'sort_order.asc.nullslast',
  });

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/press_items?${params.toString()}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      return toFallbackItems();
    }

    const data = (await response.json()) as SupabasePressItemRow[];
    const items = data
      .filter(
        (row) =>
          typeof row.slug === 'string' &&
          row.slug.length > 0 &&
          typeof row.title === 'string' &&
          row.title.length > 0 &&
          typeof row.image_url === 'string' &&
          row.image_url.length > 0,
      )
      .map((row, index) => ({
        slug: row.slug as string,
        title: row.title as string,
        image: row.image_url as string,
        sortOrder:
          typeof row.sort_order === 'number' ? row.sort_order : (index + 1) * 10,
        isPublished: row.is_published !== false,
      }));

    return items.length > 0 ? items : toFallbackItems();
  } catch {
    return toFallbackItems();
  }
}
