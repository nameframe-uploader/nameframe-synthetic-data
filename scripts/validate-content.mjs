import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const registry = JSON.parse(await readFile(path.join(root, 'datasets', 'registry.json'), 'utf8'));
const required = [
  'schema_version', 'slug', 'name', 'version', 'purpose', 'engine', 'map', 'seed',
  'source_run', 'packaged_sample', 'classes', 'formats', 'camera_policy', 'grade',
  'limitations', 'distributions', 'preview', 'licensing', 'citation', 'last_verified'
];
const errors = [];
const cards = [];

for (const entry of registry.datasets) {
  const cardPath = path.join(root, 'datasets', entry.slug, 'dataset-card.json');
  let card;
  try {
    card = JSON.parse(await readFile(cardPath, 'utf8'));
  } catch (error) {
    errors.push(`${entry.slug}: cannot read dataset card (${error.message})`);
    continue;
  }
  cards.push(card);
  for (const field of required) if (!(field in card)) errors.push(`${entry.slug}: missing ${field}`);
  if (card.slug !== entry.slug) errors.push(`${entry.slug}: registry/card slug mismatch`);
  if (!Array.isArray(card.classes) || card.classes.length === 0) errors.push(`${entry.slug}: classes must be non-empty`);
  if (!Array.isArray(card.limitations) || card.limitations.length === 0) errors.push(`${entry.slug}: limitations must be non-empty`);
  if (card.source_run?.resolution?.length !== 2) errors.push(`${entry.slug}: resolution must be [width, height]`);
  if (!Number.isFinite(card.grade?.score) || card.grade.score < 0 || card.grade.score > 100) errors.push(`${entry.slug}: invalid grade score`);
  for (const distribution of card.distributions || []) {
    if (!/^[a-f0-9]{64}$/.test(distribution.sha256)) errors.push(`${entry.slug}: invalid SHA-256 for ${distribution.name}`);
    if (!['available', 'pending_publication'].includes(distribution.download_status)) errors.push(`${entry.slug}: invalid download status`);
    if (distribution.download_status === 'available' && !distribution.official_download_url.startsWith('https://')) errors.push(`${entry.slug}: available archive must use HTTPS`);
  }
  for (const key of ['rgb', 'boxes', 'instances']) {
    const preview = card.preview?.[key];
    if (!preview) errors.push(`${entry.slug}: missing ${key} preview`);
    else {
      const files = await readdir(path.join(root, 'datasets', entry.slug, 'preview'));
      if (!files.includes(path.basename(preview))) errors.push(`${entry.slug}: preview file not found: ${preview}`);
    }
  }
}

if (new Set(cards.map((card) => card.slug)).size !== cards.length) errors.push('Dataset slugs must be unique');

if (errors.length) {
  console.error(`Content validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Validated ${cards.length} public dataset cards.`);
