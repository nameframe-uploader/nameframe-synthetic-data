import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const excludedDirectories = new Set(['.git', 'node_modules', 'dist', '.astro', 'previews', 'og']);
const prohibitedSuffixes = [
  '.uplugin', '.uproject', '.uasset', '.umap', '.pak', '.dll', '.pdb', '.exe', '.pyc',
  '.build.cs', '.target.cs'
];
const maximumBytes = 5 * 1024 * 1024;
const errors = [];
const credentialPatterns = [
  new RegExp('gh' + 'p_[A-Za-z0-9]{20,}'),
  new RegExp('github' + '_pat_[A-Za-z0-9_]{20,}'),
  new RegExp('s' + 'k-[A-Za-z0-9_-]{20,}')
];
const publicEmails = new Set(['hello@getnameframe.com']);
const localHostPattern = new RegExp(`https?://(?:${'local' + 'host'}|127\\.0\\.0\\.1|0\\.0\\.0\\.0)(?::\\d+)?`, 'i');

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

const files = await walk(root);
for (const absolute of files) {
  const relative = path.relative(root, absolute).replaceAll('\\', '/');
  const lower = relative.toLowerCase();
  const info = await stat(absolute);
  if (prohibitedSuffixes.some((suffix) => lower.endsWith(suffix))) errors.push(`${relative}: prohibited product or binary file type`);
  if (path.basename(lower).startsWith('.env')) errors.push(`${relative}: environment file is prohibited`);
  if (info.size > maximumBytes) errors.push(`${relative}: exceeds the 5 MiB public-repository limit`);

  if (info.size > 1_000_000 || /\.(png|jpe?g|webp|gif|ico|woff2?)$/i.test(relative)) continue;
  const text = await readFile(absolute, 'utf8');
  if (/(?:[A-Za-z]:\\Users\\|\/Users\/[^/]+\/|\/home\/[^/]+\/)/.test(text)) errors.push(`${relative}: contains a local absolute path`);
  if (localHostPattern.test(text)) errors.push(`${relative}: contains an internal or loopback hostname`);
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)) errors.push(`${relative}: contains a private key marker`);
  if (credentialPatterns.some((pattern) => pattern.test(text))) errors.push(`${relative}: contains a credential-like token`);
  for (const match of text.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
    if (!publicEmails.has(match[0].toLowerCase())) errors.push(`${relative}: contains a non-public email address`);
  }
}

if (errors.length) {
  console.error(`Public content policy failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Public content policy checked ${files.length} files.`);
