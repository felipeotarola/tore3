export const LIMITS = {
  heroLine: 90,
  heroCta: 40,
  sectionTitle: 60,
  shortBody: 240,
  body: 900,
  metaValue: 120,
  footer: 180,
  address: 200,
  mapUrl: 500,
  projectTitle: 80,
  slug: 90,
  location: 120,
  completion: 40,
  projectDescription: 1800,
  website: 240,
  creditLabel: 80,
  creditValue: 140,
  imageUrl: 500,
  galleryCount: 12,
  pressTitle: 140,
}

const asText = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''

const asTextMultiline = (value) =>
  typeof value === 'string' ? value.trim().replace(/\r/g, '') : ''

const clamp = (value, max) => value.slice(0, max)

export const clampText = (value, max) => clamp(asText(value), max)
export const clampMultilineText = (value, max) =>
  clamp(asTextMultiline(value), max)

export const sanitizeSlug = (value) =>
  clamp(
    asText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    LIMITS.slug
  )

const asUrl = (value) => {
  const url = asText(value)
  if (!url) return ''
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return clamp(url, LIMITS.imageUrl)
  }
  return ''
}

const asInteger = (value, fallback = 0) => {
  const parsed = Number(value)
  if (Number.isFinite(parsed)) return Math.trunc(parsed)
  return fallback
}

const sanitizeCredits = (credits) => {
  if (!Array.isArray(credits)) return []
  return credits
    .map((credit) => ({
      label: clampText(credit?.label ?? '', LIMITS.creditLabel),
      value: clampText(credit?.value ?? '', LIMITS.creditValue),
    }))
    .filter((entry) => entry.label && entry.value)
    .slice(0, 24)
}

const sanitizeGallery = (gallery) => {
  if (!Array.isArray(gallery)) return []
  return gallery
    .map((entry) => asUrl(entry))
    .filter(Boolean)
    .slice(0, LIMITS.galleryCount)
}

export const sanitizeSiteSettings = (input) => ({
  heroLine1: clampText(input?.heroLine1 ?? '', LIMITS.heroLine),
  heroLine2: clampText(input?.heroLine2 ?? '', LIMITS.heroLine),
  heroCtaLabel: clampText(input?.heroCtaLabel ?? '', LIMITS.heroCta),
  awardsTagline: clampText(input?.awardsTagline ?? '', LIMITS.shortBody),
  studioTitle: clampText(input?.studioTitle ?? '', LIMITS.sectionTitle),
  studioQuote: clampText(input?.studioQuote ?? '', LIMITS.body),
  studioSub: clampText(input?.studioSub ?? '', LIMITS.shortBody),
  disciplines: clampText(input?.disciplines ?? '', LIMITS.shortBody),
  sectors: clampText(input?.sectors ?? '', LIMITS.shortBody),
  locations: clampText(input?.locations ?? '', LIMITS.metaValue),
  pressTitle: clampText(input?.pressTitle ?? '', LIMITS.sectionTitle),
  pressSubtitle: clampText(input?.pressSubtitle ?? '', LIMITS.shortBody),
  contactTitle: clampText(input?.contactTitle ?? '', LIMITS.sectionTitle),
  contactSubtitle: clampText(input?.contactSubtitle ?? '', LIMITS.shortBody),
  contactNote: clampText(input?.contactNote ?? '', LIMITS.shortBody),
  visitLabel: clampText(input?.visitLabel ?? '', LIMITS.metaValue),
  contactAddress: clampMultilineText(input?.contactAddress ?? '', LIMITS.address),
  emailLabel: clampText(input?.emailLabel ?? '', LIMITS.metaValue),
  contactEmail: clampText(input?.contactEmail ?? '', LIMITS.metaValue),
  phoneLabel: clampText(input?.phoneLabel ?? '', LIMITS.metaValue),
  contactPhone: clampText(input?.contactPhone ?? '', LIMITS.metaValue),
  footerCopy: clampText(input?.footerCopy ?? '', LIMITS.footer),
  mapEmbedUrl: clamp(asText(input?.mapEmbedUrl ?? ''), LIMITS.mapUrl),
})

export const sanitizeProject = (input) => {
  const cover = asUrl(input?.cover)
  const gallery = sanitizeGallery(input?.gallery)
  const credits = sanitizeCredits(input?.credits)

  return {
    id: input?.id || undefined,
    slug: sanitizeSlug(input?.slug || input?.title || ''),
    title: clampText(input?.title ?? '', LIMITS.projectTitle),
    location: clampText(input?.location ?? '', LIMITS.location),
    completion: clampText(input?.completion ?? '', LIMITS.completion),
    description: clampText(input?.description ?? '', LIMITS.projectDescription),
    website: asUrl(input?.website),
    photo: clampText(input?.photo ?? '', LIMITS.metaValue),
    via: clampText(input?.via ?? '', LIMITS.metaValue),
    credits,
    cover,
    gallery: gallery.length > 0 ? gallery : cover ? [cover] : [],
    tone: clampText(input?.tone ?? 'tone-warm', 30) || 'tone-warm',
    sortOrder: asInteger(input?.sortOrder, 0),
    isPublished: Boolean(input?.isPublished ?? true),
  }
}

export const sanitizePressItem = (input) => ({
  id: input?.id || undefined,
  title: clampText(input?.title ?? '', LIMITS.pressTitle),
  image: asUrl(input?.image),
  sortOrder: asInteger(input?.sortOrder, 0),
  isPublished: Boolean(input?.isPublished ?? true),
})

export const parseCreditsFromText = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':')
      return {
        label: label?.trim() ?? '',
        value: rest.join(':').trim(),
      }
    })
    .filter((entry) => entry.label && entry.value)

export const creditsToText = (credits) =>
  Array.isArray(credits)
    ? credits.map((entry) => `${entry.label}: ${entry.value}`).join('\n')
    : ''

export const parseGalleryFromText = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => asUrl(line.trim()))
    .filter(Boolean)

export const galleryToText = (gallery) =>
  Array.isArray(gallery) ? gallery.join('\n') : ''
