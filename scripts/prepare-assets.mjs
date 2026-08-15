import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicRoot = path.join(root, 'site', 'public');
const previewRoot = path.join(publicRoot, 'previews');
const ogRoot = path.join(publicRoot, 'og');
const repositoryAssetRoot = path.join(root, 'assets');
await mkdir(previewRoot, { recursive: true });
await mkdir(ogRoot, { recursive: true });
await mkdir(repositoryAssetRoot, { recursive: true });

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

for (const slug of ['airbase', 'barnyard']) {
  await cp(path.join(root, 'datasets', slug, 'preview'), path.join(previewRoot, slug), { recursive: true, force: true });
  const card = JSON.parse(await readFile(path.join(root, 'datasets', slug, 'dataset-card.json'), 'utf8'));
  const responsiveRoot = path.join(previewRoot, slug, 'responsive');
  await mkdir(responsiveRoot, { recursive: true });
  const widths = [...new Set([640, 960, 1600, card.preview.width])]
    .filter((width) => width <= card.preview.width)
    .sort((a, b) => a - b);
  for (const key of ['rgb', 'boxes', 'instances', 'depth']) {
    if (!card.preview[key]) continue;
    const modalitySource = path.join(root, 'datasets', slug, card.preview[key]);
    for (const width of widths) {
      await sharp(modalitySource).resize({ width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(path.join(responsiveRoot, `${key}-${width}.webp`));
    }
  }
  const source = path.join(root, 'datasets', slug, card.preview.rgb);
  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="30%" stop-color="#08120f" stop-opacity="0"/><stop offset="100%" stop-color="#08120f" stop-opacity=".95"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/>
      <text x="58" y="450" fill="#8df5a9" font-family="Arial, sans-serif" font-weight="700" font-size="22" letter-spacing="3">NAMEFRAME SAMPLE · VERSION ${escapeXml(card.version)}</text>
      <text x="58" y="520" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700" font-size="56">${escapeXml(card.name)}</text>
      <text x="58" y="565" fill="#ffffff" font-family="Arial, sans-serif" font-size="24">${escapeXml(card.purpose)}</text>
      <text x="1140" y="610" text-anchor="end" fill="#ffffff" font-family="Arial, sans-serif" font-size="23">${card.packaged_sample.unique_frames} frames · Grade ${card.grade.letter}</text>
    </svg>`);
  await sharp(source).resize(1200, 630, { fit: 'cover' }).composite([{ input: overlay }]).png({ quality: 90 }).toFile(path.join(ogRoot, `${slug}.png`));
}

const homeSource = path.join(root, 'datasets', 'airbase', 'preview', 'airbase-rgb.webp');
const homeInstances = path.join(root, 'datasets', 'airbase', 'preview', 'airbase-instances.webp');
const homeDepth = path.join(root, 'datasets', 'airbase', 'preview', 'airbase-depth.webp');
const [rgbPane, instancesPane, depthPane] = await Promise.all([
  sharp(homeSource).resize(720, 640, { fit: 'cover' }).toBuffer(),
  sharp(homeInstances).resize(280, 640, { fit: 'cover' }).toBuffer(),
  sharp(homeDepth).resize(280, 640, { fit: 'cover' }).toBuffer()
]);
const homeOverlay = Buffer.from(`
  <svg width="1280" height="640" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="470" width="1280" height="170" fill="#08120f" fill-opacity=".92"/>
    <rect x="0" y="0" width="1280" height="640" fill="none" stroke="#8df5a9" stroke-width="4"/>
    <text x="24" y="42" fill="#08120f" stroke="#ffffff" stroke-width=".5" font-family="Arial, sans-serif" font-weight="700" font-size="22">RGB</text>
    <text x="744" y="42" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700" font-size="22">INSTANCE IDs</text>
    <text x="1024" y="42" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700" font-size="22">DEPTH</text>
    <text x="48" y="520" fill="#8df5a9" font-family="Arial, sans-serif" font-weight="700" font-size="22" letter-spacing="4">NAMEFRAME · PUBLIC SAMPLE REGISTRY</text>
    <text x="48" y="590" fill="#ffffff" font-family="Arial, sans-serif" font-weight="700" font-size="52">One capture. Aligned outputs.</text>
    <text x="1230" y="590" text-anchor="end" fill="#ffffff" font-family="Arial, sans-serif" font-size="24">Airbase · v1.0</text>
  </svg>`);
await sharp({ create: { width: 1280, height: 640, channels: 3, background: '#08120f' } })
  .composite([
    { input: rgbPane, left: 0, top: 0 },
    { input: instancesPane, left: 720, top: 0 },
    { input: depthPane, left: 1000, top: 0 },
    { input: homeOverlay, left: 0, top: 0 }
  ])
  .png({ quality: 90 })
  .toFile(path.join(ogRoot, 'repository-social.png'));
await cp(path.join(ogRoot, 'repository-social.png'), path.join(repositoryAssetRoot, 'repository-social.png'), { force: true });

const customOrigin = process.env.SITE_ORIGIN;
const siteRoot = (customOrigin || 'https://nameframe-uploader.github.io/nameframe-synthetic-data').replace(/\/$/, '');
const routes = ['/', '/datasets/', '/datasets/airbase/', '/datasets/barnyard/', '/formats/', '/quality/', '/guides/inspect-a-dataset/', '/about/', '/terms/'];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteRoot}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(publicRoot, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(publicRoot, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteRoot}/sitemap.xml\n`, 'utf8');
console.log('Prepared responsive previews, social cards, sitemap and robots.txt.');
