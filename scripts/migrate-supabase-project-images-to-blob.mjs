import fs from 'node:fs';
import path from 'node:path';
import { put } from '@vercel/blob';

const BLOB_PREFIX = 'images/torekull/projects/migrated';
const OUTPUT_PATH = path.join(
  process.cwd(),
  '.blob-project-url-migration.generated.json',
);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function isSupabaseStorageUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.endsWith('.supabase.co') &&
      parsed.pathname.includes('/storage/v1/object/public/site-media/')
    );
  } catch {
    return false;
  }
}

function getContentType(extension) {
  switch (extension.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

function sanitizeSegment(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchProjects(supabaseUrl, serviceRoleKey) {
  const params = new URLSearchParams({
    select: 'slug,cover_image,gallery_images',
    order: 'sort_order.asc.nullslast,created_at.asc',
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/projects?${params.toString()}`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

async function uploadToBlob({
  sourceUrl,
  slug,
  index,
  blobToken,
  cache,
}) {
  if (cache.has(sourceUrl)) return cache.get(sourceUrl);

  const source = new URL(sourceUrl);
  const originalFile = source.pathname.split('/').at(-1) || `image-${index + 1}.jpg`;
  const ext = path.extname(originalFile) || '.jpg';
  const base = path.basename(originalFile, ext);
  const safeName = sanitizeSegment(base) || `image-${index + 1}`;
  const targetPath = `${BLOB_PREFIX}/${slug}/${String(index + 1).padStart(2, '0')}-${safeName}${ext}`;

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download source image ${sourceUrl}: ${response.status} ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const blob = await put(targetPath, buffer, {
    token: blobToken,
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: getContentType(ext),
  });

  cache.set(sourceUrl, blob.url);
  return blob.url;
}

async function patchProjectRow({
  supabaseUrl,
  serviceRoleKey,
  slug,
  coverImage,
  galleryImages,
}) {
  const params = new URLSearchParams({
    slug: `eq.${slug}`,
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/projects?${params.toString()}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      cover_image: coverImage,
      gallery_images: galleryImages,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to update ${slug}: ${response.status} ${detail}`);
  }

  return await response.json();
}

async function main() {
  loadEnvFile(path.join(process.cwd(), '.env'));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!supabaseUrl || !serviceRoleKey || !blobToken) {
    throw new Error(
      'Missing required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BLOB_READ_WRITE_TOKEN',
    );
  }

  const rows = await fetchProjects(supabaseUrl, serviceRoleKey);
  const urlCache = new Map();
  const migrationReport = [];

  for (const row of rows) {
    const slug = String(row.slug || '').trim();
    if (!slug) continue;

    const currentCover = typeof row.cover_image === 'string' ? row.cover_image : '';
    const currentGallery = Array.isArray(row.gallery_images)
      ? row.gallery_images.filter((item) => typeof item === 'string')
      : [];

    const merged = [
      ...(currentCover ? [currentCover] : []),
      ...currentGallery,
    ];
    const uniqueMerged = [...new Set(merged.map((url) => url.trim()).filter(Boolean))];

    const needsMigration = uniqueMerged.some((url) => isSupabaseStorageUrl(url));
    if (!needsMigration) continue;

    console.log(`Migrating project "${slug}" (${uniqueMerged.length} image URL(s))...`);

    const migrated = [];
    for (let i = 0; i < uniqueMerged.length; i += 1) {
      const url = uniqueMerged[i];
      if (isSupabaseStorageUrl(url)) {
        const blobUrl = await uploadToBlob({
          sourceUrl: url,
          slug,
          index: i,
          blobToken,
          cache: urlCache,
        });
        migrated.push(blobUrl);
      } else {
        migrated.push(url);
      }
    }

    const newCover = migrated[0] || '';
    const newGallery = migrated;
    await patchProjectRow({
      supabaseUrl,
      serviceRoleKey,
      slug,
      coverImage: newCover,
      galleryImages: newGallery,
    });

    migrationReport.push({
      slug,
      before: uniqueMerged,
      after: migrated,
    });

    console.log(`Updated "${slug}" to Blob URLs.`);
  }

  await fs.promises.writeFile(
    OUTPUT_PATH,
    JSON.stringify(migrationReport, null, 2),
    'utf8',
  );

  console.log('');
  console.log(`Migration complete. Projects updated: ${migrationReport.length}`);
  console.log(`Report: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
