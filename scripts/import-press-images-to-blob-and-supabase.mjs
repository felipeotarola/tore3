import fs from 'node:fs';
import path from 'node:path';

import { put } from '@vercel/blob';

const PRESS_ROOT = path.join(process.cwd(), 'src', 'assets', 'press');
const OUTPUT_MAP_PATH = path.join(
  process.cwd(),
  '.blob-press-import-map.generated.json',
);
const BLOB_PREFIX = 'images/torekull/press/imports';
const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
]);

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

function toTitle(value) {
  return value
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function humanizeFileName(fileName) {
  const ext = path.extname(fileName);
  const base = fileName.slice(0, -ext.length);
  const cleaned = base
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return toTitle(cleaned);
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

async function uploadImageToBlob({ filePath, blobToken, slug }) {
  const ext = path.extname(filePath).toLowerCase();
  const blobPath = `${BLOB_PREFIX}/${slug}${ext}`;
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

async function replacePressItems({ supabaseUrl, serviceRoleKey, rows }) {
  const deleteRes = await fetch(`${supabaseUrl}/rest/v1/press_items?id=not.is.null`, {
    method: 'DELETE',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=minimal',
    },
  });

  if (!deleteRes.ok) {
    const detail = await deleteRes.text();
    throw new Error(
      `Failed deleting existing press_items: ${deleteRes.status} ${detail}`,
    );
  }

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/press_items`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(rows),
  });

  if (!insertRes.ok) {
    const detail = await insertRes.text();
    throw new Error(`Failed inserting press_items: ${insertRes.status} ${detail}`);
  }

  return await insertRes.json();
}

async function main() {
  loadEnvFile(path.join(process.cwd(), '.env'));

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!blobToken || !supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing one or more required env vars: BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  if (!fs.existsSync(PRESS_ROOT)) {
    throw new Error(`Directory not found: ${PRESS_ROOT}`);
  }

  const files = (await fs.promises.readdir(PRESS_ROOT, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error(`No image files found in: ${PRESS_ROOT}`);
  }

  const usedSlugs = new Set();
  const importMap = [];
  const rows = [];

  for (let i = 0; i < files.length; i += 1) {
    const fileName = files[i];
    const filePath = path.join(PRESS_ROOT, fileName);
    const title = humanizeFileName(fileName);
    let slug = slugify(path.basename(fileName, path.extname(fileName)));

    if (!slug) slug = `press-${i + 1}`;
    if (usedSlugs.has(slug)) {
      let suffix = 2;
      while (usedSlugs.has(`${slug}-${suffix}`)) suffix += 1;
      slug = `${slug}-${suffix}`;
    }
    usedSlugs.add(slug);

    const uploaded = await uploadImageToBlob({
      filePath,
      blobToken,
      slug,
    });

    const sortOrder = (i + 1) * 10;

    rows.push({
      slug,
      title,
      image_url: uploaded.url,
      sort_order: sortOrder,
      is_published: true,
    });

    importMap.push({
      fileName,
      slug,
      title,
      sortOrder,
      blobPath: uploaded.blobPath,
      url: uploaded.url,
    });

    console.log(`[${i + 1}/${files.length}] Uploaded ${fileName} -> ${uploaded.url}`);
  }

  const inserted = await replacePressItems({
    supabaseUrl,
    serviceRoleKey,
    rows,
  });

  await fs.promises.writeFile(OUTPUT_MAP_PATH, JSON.stringify(importMap, null, 2), 'utf8');

  console.log('');
  console.log(`Import complete.`);
  console.log(`Images uploaded: ${files.length}`);
  console.log(`Rows inserted: ${inserted.length}`);
  console.log(`Mapping file: ${path.relative(process.cwd(), OUTPUT_MAP_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
