import { TOREKULL } from '@/lib/torekull';

/** Canonical site origin for JSON-LD @id values. */
export const SITE_CANONICAL_ORIGIN = 'https://torekull.se' as const;

const PROGRAMME = 'European Property Awards';
const AREA = 'Interior Design';

/** Short name as printed on the award ribbons. */
export const TOREKULL_AWARDS_ORG_LABEL = 'TOREKULL Interior Architecture & Design' as const;

export type EuropeanPropertyAwardRow = {
  readonly programmeYears: string;
  readonly distinction: string;
  readonly category: string;
  readonly project: string;
};

/**
 * Leisure interior recognitions shown on the four-ribbon graphic (2021–2023 programme years).
 * Keep in sync with `public/awards_21-23.png` and on-page copy for GEO / traditional SEO.
 */
export const EUROPEAN_PROPERTY_AWARDS_INTERIOR_DESIGN_21_23: readonly EuropeanPropertyAwardRow[] =
  [
    {
      programmeYears: '2021–2022',
      distinction: 'Award Winner',
      category: 'Leisure Interior Sweden',
      project: 'DECK Brasserie & Bar',
    },
    {
      programmeYears: '2021–2022',
      distinction: '5-Star Winner',
      category: 'Best Leisure Interior Sweden',
      project: 'Canta Lola',
    },
    {
      programmeYears: '2022–2023',
      distinction: '5-Star Winner',
      category: 'Best Leisure Interior Sweden',
      project: 'Biblioteket Live',
    },
    {
      programmeYears: '2022–2023',
      distinction: 'Award Winner',
      category: 'Leisure Interior Sweden',
      project: 'ChouChou',
    },
  ] as const;

/** One factual sentence per ribbon — easy for models and search to quote. */
export function citationForEuropeanPropertyAward(
  row: EuropeanPropertyAwardRow,
): string {
  return `${PROGRAMME} (${AREA}), ${row.programmeYears}: ${row.distinction} — ${row.category} — ${row.project} by ${TOREKULL_AWARDS_ORG_LABEL}.`;
}

/** Descriptive alt for the composite ribbon image. */
export function europeanPropertyAwardsStripAlt(): string {
  const projects = EUROPEAN_PROPERTY_AWARDS_INTERIOR_DESIGN_21_23.map(
    (r) => `${r.project} (${r.programmeYears})`,
  ).join('; ');
  return `${PROGRAMME} ${AREA} award ribbons for ${TOREKULL_AWARDS_ORG_LABEL}: ${projects}.`;
}

export function europeanPropertyAwardsAboutJsonLd(): Record<string, unknown> {
  const orgId = `${SITE_CANONICAL_ORIGIN}/#organization`;
  const citations = EUROPEAN_PROPERTY_AWARDS_INTERIOR_DESIGN_21_23.map((row) =>
    citationForEuropeanPropertyAward(row),
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: TOREKULL_AWARDS_ORG_LABEL,
        legalName: TOREKULL.legalName,
        url: SITE_CANONICAL_ORIGIN,
        award: citations,
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_CANONICAL_ORIGIN}/about#european-property-awards`,
        name: `${PROGRAMME} — ${TOREKULL_AWARDS_ORG_LABEL} (${AREA}, Sweden)`,
        description:
          'Leisure interior recognitions from the European Property Awards programme for hospitality projects in Sweden (2021–2022 and 2022–2023 programme years).',
        numberOfItems: EUROPEAN_PROPERTY_AWARDS_INTERIOR_DESIGN_21_23.length,
        itemListElement: EUROPEAN_PROPERTY_AWARDS_INTERIOR_DESIGN_21_23.map(
          (row, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${row.project} (${row.programmeYears})`,
            description: citationForEuropeanPropertyAward(row),
          }),
        ),
      },
    ],
  };
}
