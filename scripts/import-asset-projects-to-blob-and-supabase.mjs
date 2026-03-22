import fs from 'node:fs';
import path from 'node:path';
import { put } from '@vercel/blob';

const IMAGE_ROOT = path.join(process.cwd(), 'src', 'assets', 'projects');
const OUTPUT_MAP_PATH = path.join(
  process.cwd(),
  '.blob-asset-project-import-map.generated.json',
);
const BLOB_PREFIX = 'images/torekull/projects/imports';
const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
]);

const PROJECT_OVERRIDES = {
  'biblioteket live cocktail bar': {
    slug: 'biblioteket-live-cocktail-bar',
    title: 'Biblioteket Live Cocktail Bar',
    location: 'Stockholm',
  },
  'the public sundbyberg': {
    slug: 'the-public-sundbyberg',
    title: 'The Public Sundbyberg',
    location: 'Stockholm',
  },
  'cava bar signalfabriken': {
    slug: 'cava-bar-signalfabriken',
    title: 'Cava Bar Signalfabriken',
    location: 'Stockholm',
  },
  cavabar: {
    slug: 'cava-bar-centralstation',
    title: 'Cava Bar Centralstation',
    location: 'Stockholm',
  },
  'cavabar centralstation': {
    slug: 'cava-bar-centralstation',
    title: 'Cava Bar Centralstation',
    location: 'Stockholm',
  },
  cantalola: {
    slug: 'canta-lola',
    title: 'Canta Lola',
    location: 'Stockholm',
  },
  'e a t': {
    slug: 'eat',
    title: 'E.A.T',
    location: 'Stockholm',
  },
};

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

function normalizeName(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(value) {
  return normalizeName(value).replace(/\s+/g, '-');
}

function sanitizeFileStem(value) {
  return slugify(value).replace(/^-+|-+$/g, '') || 'image';
}

function getContentType(ext) {
  switch (ext.toLowerCase()) {
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

function inferLocation(folderName) {
  if (folderName.includes(',')) {
    const parts = folderName.split(',');
    return parts.at(-1)?.trim() ?? '';
  }
  return '';
}

async function readProjectFolders() {
  const entries = await fs.promises.readdir(IMAGE_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function readProjectImages(folderName) {
  const folderPath = path.join(IMAGE_ROOT, folderName);
  const entries = await fs.promises.readdir(folderPath, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return files.map((fileName) => path.join(folderPath, fileName));
}

async function fetchExistingProjects({ supabaseUrl, serviceRoleKey }) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/projects?select=slug,title,location,completion,description,website,photo,via,credits,tone,sort_order,is_published&order=sort_order.asc.nullslast`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to load existing projects: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

async function upsertProject({ supabaseUrl, serviceRoleKey, row }) {
  const res = await fetch(`${supabaseUrl}/rest/v1/projects?on_conflict=slug`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([row]),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Upsert failed for "${row.slug}": ${res.status} ${detail}`);
  }
  return await res.json();
}

async function uploadImageToBlob({ filePath, blobToken, projectSlug, index }) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const ordinal = String(index + 1).padStart(2, '0');
  const safeFileName = `${ordinal}-${sanitizeFileStem(base)}${ext}`;
  const blobPath = `${BLOB_PREFIX}/${projectSlug}/${safeFileName}`;
  const body = await fs.promises.readFile(filePath);
  const blob = await put(blobPath, body, {
    token: blobToken,
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: getContentType(ext),
  });
  return { blobPath, url: blob.url };
}

async function main() {
  loadEnvFile(path.join(process.cwd(), '.env'));

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!blobToken) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN in environment.');
  }
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.',
    );
  }
  if (!fs.existsSync(IMAGE_ROOT)) {
    throw new Error(`Directory not found: ${IMAGE_ROOT}`);
  }

  const existingRows = await fetchExistingProjects({ supabaseUrl, serviceRoleKey });
  const existingBySlug = new Map(existingRows.map((row) => [row.slug, row]));
  const highestSortOrder = existingRows.reduce((max, row) => {
    const value = Number.isFinite(row.sort_order) ? row.sort_order : 0;
    return Math.max(max, value);
  }, 0);
  let nextSortOrder = highestSortOrder > 0 ? highestSortOrder + 10 : 10;

  const folderNames = await readProjectFolders();
  const importMap = [];
  let totalUploaded = 0;

  for (const folderName of folderNames) {
    const normalized = normalizeName(folderName);
    const override = PROJECT_OVERRIDES[normalized];
    const slug = override?.slug ?? slugify(folderName);
    const title = override?.title ?? folderName;
    const location = override?.location ?? inferLocation(folderName);

    const imagePaths = await readProjectImages(folderName);
    if (imagePaths.length === 0) {
      console.log(`Skipping "${folderName}" (no image files found).`);
      continue;
    }

    console.log(`Uploading ${imagePaths.length} image(s) for "${folderName}" -> ${slug}`);
    const uploaded = [];
    for (let i = 0; i < imagePaths.length; i += 1) {
      const filePath = imagePaths[i];
      const result = await uploadImageToBlob({
        filePath,
        blobToken,
        projectSlug: slug,
        index: i,
      });
      uploaded.push({
        localPath: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        blobPath: result.blobPath,
        url: result.url,
      });
      totalUploaded += 1;
      console.log(`  [${i + 1}/${imagePaths.length}] ${uploaded.at(-1).url}`);
    }

    const galleryUrls = uploaded.map((entry) => entry.url);
    const existing = existingBySlug.get(slug);
    const row = {
      slug,
      title: existing?.title || title,
      location: existing?.location || location,
      completion: existing?.completion || '',
      description:
        existing?.description ||
        `Imported from local folder "${folderName}" on ${new Date().toISOString()}.`,
      website: existing?.website || '',
      photo: existing?.photo || '',
      via: existing?.via || '',
      credits: Array.isArray(existing?.credits) ? existing.credits : [],
      tone: existing?.tone || 'tone-warm',
      sort_order:
        typeof existing?.sort_order === 'number' ? existing.sort_order : nextSortOrder,
      is_published: typeof existing?.is_published === 'boolean' ? existing.is_published : true,
      cover_image: galleryUrls[0],
      gallery_images: galleryUrls,
    };

    if (typeof existing?.sort_order !== 'number') {
      nextSortOrder += 10;
    }

    const [saved] = await upsertProject({ supabaseUrl, serviceRoleKey, row });
    existingBySlug.set(slug, saved);

    importMap.push({
      folderName,
      slug,
      title: row.title,
      coverImage: row.cover_image,
      galleryCount: row.gallery_images.length,
      uploaded,
    });

    console.log(`Saved project "${row.title}" (${slug}) with ${galleryUrls.length} images.`);
  }

  await fs.promises.writeFile(OUTPUT_MAP_PATH, JSON.stringify(importMap, null, 2), 'utf8');
  console.log('');
  console.log(`Import complete.`);
  console.log(`Folders processed: ${importMap.length}`);
  console.log(`Images uploaded: ${totalUploaded}`);
  console.log(`Mapping file: ${path.relative(process.cwd(), OUTPUT_MAP_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
