/**
 * Short label for press cards: publication name + year, without issue/page noise.
 */
export function formatPressDisplayTitle(title: string): string {
  return title
    .replace(/\s*[-–—]\s*Issue\s*\d+/gi, '')
    .replace(/\s*[-–—]\s*p\.\s*\d+/gi, '')
    .replace(/\s*[-–—]\s*Page\s*\d+/gi, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Split "Publication Name 2022" into two lines (name / year) when possible. */
export function splitPressTitleForLines(
  label: string,
): [string, string | undefined] {
  const m = label.match(/^(.*?)\s+(\d{4}(?:-\d{4})?)$/);
  if (m && m[1].trim().length > 0) {
    return [m[1].trim(), m[2]];
  }
  return [label, undefined];
}
