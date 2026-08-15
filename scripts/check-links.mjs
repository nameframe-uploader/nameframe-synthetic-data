import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'site', 'dist');
const errors = [];
const external = new Set();

async function htmlFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await htmlFiles(absolute));
    else if (entry.name.endsWith('.html')) result.push(absolute);
  }
  return result;
}

const base = '/nameframe-synthetic-data';
for (const file of await htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(mailto:|#|data:|javascript:)/.test(value)) continue;
    if (/^https:\/\//.test(value)) { external.add(value.split('#')[0]); continue; }
    const withoutFragment = value.split('#')[0].split('?')[0];
    if (!withoutFragment) continue;
    let relative = withoutFragment;
    if (relative.startsWith(base)) relative = relative.slice(base.length);
    if (relative.startsWith('/')) relative = relative.slice(1);
    const candidate = relative.endsWith('/') ? path.join(dist, relative, 'index.html') : path.join(dist, relative);
    try { await access(candidate); } catch { errors.push(`${path.relative(dist, file)}: missing internal target ${value}`); }
  }
}

if (process.env.CHECK_EXTERNAL === 'true') {
  for (const url of external) {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (response.status >= 400) errors.push(`${url}: HTTP ${response.status}`);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
}

if (errors.length) {
  console.error(`Link check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Checked internal links and discovered ${external.size} external targets${process.env.CHECK_EXTERNAL === 'true' ? ' (also verified)' : ''}.`);
