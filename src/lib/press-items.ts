import { PRESS_ITEMS, PressItem } from '@/lib/torekull';

export type PressListItem = PressItem & {
  sortOrder: number;
  isPublished: boolean;
};

/** Featured on home + listed first on /press — International Property World's Best 2022–2023 */
const FEATURED_PRESS_SLUG_PRIMARY =
  'international-property-travel-worlds-best-2022-2023';
/** Fallback data (`PRESS_ITEMS`) uses this slug when not loading from Supabase */
const FEATURED_PRESS_SLUG_FALLBACK = 'worlds-best-interior-design-2022-2023';

/**
 * Moves the featured press tile to the front when present (does not duplicate).
 */
export function prioritizeFeaturedPressItem(
  items: PressListItem[],
): PressListItem[] {
  const targetSlug = items.some((i) => i.slug === FEATURED_PRESS_SLUG_PRIMARY)
    ? FEATURED_PRESS_SLUG_PRIMARY
    : items.some((i) => i.slug === FEATURED_PRESS_SLUG_FALLBACK)
      ? FEATURED_PRESS_SLUG_FALLBACK
      : null;
  if (!targetSlug) {
    return items;
  }
  const index = items.findIndex((i) => i.slug === targetSlug);
  if (index <= 0) {
    return items;
  }
  const copy = [...items];
  const [featured] = copy.splice(index, 1);
  return [featured, ...copy];
}

type SupabasePressItemRow = {
  slug: string | null;
  title: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_published: boolean | null;
};

type NormalizedPressValue = {
  slug: string;
  title: string;
};

const LEGACY_PRESS_NORMALIZATION: Record<string, NormalizedPressValue> = {
  'aftonbladet-sondag-no-12-2022': {
    slug: 'aftonbladet-sondag-no-12-2022',
    title: 'Aftonbladet Söndag No. 12 (2022)',
  },
  'eat-white-guide-se-o-1': {
    slug: 'eat-white-guide-feature',
    title: 'EAT by White Guide (Feature)',
  },
  'fb-img-1630518115295': {
    slug: 'the-new-generation-feature',
    title: 'The New Generation (Feature)',
  },
  'fb-img-1630518128595': {
    slug: 'krog-och-mat-august-2021',
    title: 'Krog & Mat (August 2021)',
  },
  'h-o-m-e-dekor-magazine-2017-torekull-o-1': {
    slug: 'home-dekor-magazine-2017',
    title: 'H.O.M.E Dekor Magazine (2017)',
  },
  'hl-articles-torekull-interior-design-stockholm': {
    slug: 'hl-articles-torekull-interior-design-stockholm',
    title: 'HL Articles: Torekull Interior Design Stockholm',
  },
  'hospitality-p1-2024': {
    slug: 'world-of-hospitality-2024-page-1',
    title: 'The World of Hospitality (2024) - Page 1',
  },
  'hospitality-p2-2024': {
    slug: 'world-of-hospitality-2024-page-2',
    title: 'The World of Hospitality (2024) - Page 2',
  },
  'img-20201205-120230-089': {
    slug: 'editorial-feature-dec-2020',
    title: 'Editorial Feature (December 2020)',
  },
  'img-20210129-105029-148': {
    slug: 'editorial-feature-jan-2021-1',
    title: 'Editorial Feature (January 2021) - 1',
  },
  'img-20210129-110508-892': {
    slug: 'editorial-feature-jan-2021-2',
    title: 'Editorial Feature (January 2021) - 2',
  },
  'img-20210203-125258-756': {
    slug: 'editorial-feature-feb-2021',
    title: 'Editorial Feature (February 2021)',
  },
  'innovation-torekull-interior-desing-articles': {
    slug: 'innovation-torekull-interior-design',
    title: 'Innovation: Torekull Interior Design',
  },
  'international-property-travel-the-world-s-best-21-22': {
    slug: 'international-property-travel-worlds-best-2021-2022',
    title: "International Property & Travel - World's Best (2021-2022)",
  },
  'international-property-travel-the-world-s-best-22-23-p-114': {
    slug: 'international-property-travel-worlds-best-2022-2023-page-114',
    title: "International Property & Travel - World's Best (2022-2023) - Page 114",
  },
  'international-property-travel-the-world-s-best-22-23': {
    slug: 'international-property-travel-worlds-best-2022-2023',
    title: "International Property & Travel - World's Best (2022-2023)",
  },
  'international-property-travel-the-world-s-finest-homes-travel-and-lifestyle-1': {
    slug: 'international-property-travel-lifestyle-issue-1',
    title: 'International Property & Travel - Homes, Travel & Lifestyle (Issue 1)',
  },
  'international-property-travel-the-world-s-finest-homes-travel-and-lifestyle-3': {
    slug: 'international-property-travel-lifestyle-issue-3-cover',
    title: 'International Property & Travel - Homes, Travel & Lifestyle (Issue 3 Cover)',
  },
  'international-property-travel-the-world-s-finest-homes-travel-and-lifestyle-3-2': {
    slug: 'international-property-travel-lifestyle-issue-3-spread',
    title: 'International Property & Travel - Homes, Travel & Lifestyle (Issue 3 Spread)',
  },
  'international-property-travel-the-world-s-finest-homes-travel-and-lifestyle': {
    slug: 'international-property-travel-lifestyle-special',
    title: 'International Property & Travel - Homes, Travel & Lifestyle (Special Edition)',
  },
  'modern-interior-deck-1': {
    slug: 'modern-interior-deck-feature-1',
    title: 'Modern Interiör - DECK (Feature 1)',
  },
  'modern-interior-deck-2': {
    slug: 'modern-interior-deck-feature-2',
    title: 'Modern Interiör - DECK (Feature 2)',
  },
  'modern-interior-nr-3-2024': {
    slug: 'modern-interior-no-3-2024',
    title: 'Modern Interiör No. 3 (2024)',
  },
  'modern-interior-nr-4-2024': {
    slug: 'modern-interior-no-4-2024',
    title: 'Modern Interiör No. 4 (2024)',
  },
  'modern-interi-c3-b6r-public-o': {
    slug: 'modern-interior-the-public-feature',
    title: 'Modern Interiör - The Public (Feature)',
  },
  'nojes-guiden-biblioteket': {
    slug: 'nojesguiden-biblioteket',
    title: 'Nöjesguiden - Biblioteket',
  },
  'nojesguiden-2022-biblioteket': {
    slug: 'nojesguiden-biblioteket-2022',
    title: 'Nöjesguiden - Biblioteket (2022)',
  },
  'screenshot-20220414-182248-instagram': {
    slug: 'instagram-feature-april-2022',
    title: 'Instagram Feature (April 2022)',
  },
  'the-public-t-c3-a4by-o': {
    slug: 'the-public-taby-feature',
    title: 'The Public Täby (Feature)',
  },
  'white-guide-biblioteket': {
    slug: 'white-guide-biblioteket',
    title: 'White Guide - Biblioteket',
  },
};

function normalizeLegacyPressValue(slug: string, title: string): NormalizedPressValue {
  return LEGACY_PRESS_NORMALIZATION[slug] ?? { slug, title };
}

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
        ...normalizeLegacyPressValue(row.slug as string, row.title as string),
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
