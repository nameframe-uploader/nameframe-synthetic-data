import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicRoot = path.join(root, 'site', 'public');
const previewRoot = path.join(publicRoot, 'previews');
const ogRoot = path.join(publicRoot, 'og');
await mkdir(previewRoot, { recursive: true });
await mkdir(ogRoot, { recursive: true });

for (const slug of ['airbase', 'barnyard']) {
  await cp(path.join(root, 'datasets', slug, 'preview'), path.join(previewRoot, slug), { recursive: true, force: true });
  const card = JSON.parse(await readFile(path.join(root, 'datasets', slug, 'dataset-card.json'), 'utf8'));
  const source = path.join(root, 'datasets', slug, card.preview.rgb);
  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="30%" stop-color="#08120f" stop-opacity="0"/><stop offset="100%" stop-color="#08120f" stop-opacity=".95"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/>
      <text x="58" y="500" fill="#8df5a9" font-family="Arial, sans-serif" font-weight="700" font-size="24" letter-spacing="3">NAMEFRAME SAMPLE</text>
      <text x="58" y="562" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700" font-size="54">${card.name}</text>
      <text x="1140" y="562" text-anchor="end" fill="#ffffff" font-family="Arial, sans-serif" font-size="28">${card.packaged_sample.unique_frames} frames · Grade ${card.grade.letter}</text>
    </svg>`);
  await sharp(source).resize(1200, 630, { fit: 'cover' }).composite([{ input: overlay }]).png({ quality: 90 }).toFile(path.join(ogRoot, `${slug}.png`));
}

const homeSource = path.join(root, 'datasets', 'airbase', 'preview', 'airbase-rgb.webp');
const homeOverlay = Buffer.from(`
  <svg width="1280" height="640" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="640" fill="#08120f" fill-opacity=".22"/>
    <rect x="48" y="48" width="1184" height="544" rx="24" fill="none" stroke="#8df5a9" stroke-width="3"/>
    <text x="88" y="450" fill="#8df5a9" font-family="Arial, sans-serif" font-weight="700" font-size="25" letter-spacing="4">PUBLIC SAMPLE REGISTRY</text>
    <text x="88" y="522" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700" font-size="59">Inspect what a NameFrame run produces.</text>
  </svg>`);
await sharp(homeSource).resize(1280, 640, { fit: 'cover' }).composite([{ input: homeOverlay }]).png({ quality: 90 }).toFile(path.join(ogRoot, 'repository-social.png'));

const customOrigin = process.env.SITE_ORIGIN;
const siteRoot = customOrigin || 'https://nameframe-uploader.github.io/nameframe-synthetic-data';
await writeFile(path.join(publicRoot, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteRoot}/sitemap-index.xml\n`, 'utf8');
console.log('Prepared previews, social cards and robots.txt.');
