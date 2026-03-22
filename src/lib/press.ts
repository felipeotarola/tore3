export type PressTitleParts = {
  publication: string;
  secondary?: string;
  year?: string;
  fullTitle: string;
};

const MONTH_YEAR_RE =
  /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i;
const YEAR_RE = /^\d{4}(?:-\d{4})?$/;

function clean(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

function isYearLike(value: string): boolean {
  return YEAR_RE.test(value) || MONTH_YEAR_RE.test(value);
}

/**
 * Normalize any press title into a stable convention:
 * "Publication" + optional "Secondary" line (year/issue/page/feature).
 */
export function getPressTitleParts(rawTitle: string): PressTitleParts {
  const title = clean(rawTitle);

  let base = title;
  let suffixLabel: string | undefined;
  const lastDashIndex = title.lastIndexOf(' - ');

  // Examples:
  // "... (January 2021) - 1" => "Part 1"
  // "... (2024) - Page 1" => "Page 1"
  if (lastDashIndex > -1) {
    const candidateBase = clean(title.slice(0, lastDashIndex));
    const candidateSuffix = clean(title.slice(lastDashIndex + 3));
    const partOnly = candidateSuffix.match(/^(\d+)$/);
    const pageMatch = candidateSuffix.match(/^p(?:age)?\.?\s*(\d+)$/i);

    if (partOnly) {
      base = candidateBase;
      suffixLabel = `Part ${partOnly[1]}`;
    } else if (pageMatch) {
      base = candidateBase;
      suffixLabel = `Page ${pageMatch[1]}`;
    }
  }

  const parenthetical = base.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const publication = clean(parenthetical ? parenthetical[1] : base);
  const parentheticalContent = parenthetical ? clean(parenthetical[2]) : undefined;

  let secondary = parentheticalContent;
  let year: string | undefined;

  if (parentheticalContent && isYearLike(parentheticalContent)) {
    year = parentheticalContent;
  }

  if (suffixLabel) {
    secondary = secondary ? `${secondary} · ${suffixLabel}` : suffixLabel;
  }

  const fullTitle = secondary ? `${publication} (${secondary})` : publication;

  return {
    publication,
    secondary,
    year,
    fullTitle,
  };
}

export function formatPressDisplayTitle(title: string): string {
  return getPressTitleParts(title).fullTitle;
}

export function splitPressTitleForLines(
  label: string,
): [string, string | undefined] {
  const parts = getPressTitleParts(label);
  return [parts.publication, parts.secondary];
}
