import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.join(process.cwd(), 'site', 'dist');
const errors = [];
const allowedEmails = new Set(['hello@getnameframe.com']);
const localHostPattern = new RegExp(`https?://(?:${'local' + 'host'}|127\\.0\\.0\\.1|0\\.0\\.0\\.0)(?::\\d+)?`, 'i');

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (/\.(?:html|css|js|xml|txt)$/i.test(entry.name)) files.push(absolute);
  }
  return files;
}

for (const file of await walk(dist)) {
  const relative = path.relative(dist, file);
  const source = await readFile(file, 'utf8');
  if (/(?:[A-Za-z]:\\Users\\|\/Users\/[^/]+\/|\/home\/[^/]+\/)/.test(source)) errors.push(`${relative}: local absolute path leaked into build`);
  if (localHostPattern.test(source)) errors.push(`${relative}: loopback hostname leaked into build`);
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(source)) errors.push(`${relative}: private key marker leaked into build`);
  for (const match of source.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
    if (!allowedEmails.has(match[0].toLowerCase())) errors.push(`${relative}: non-public email leaked into build`);
  }
  if (file.endsWith('.html')) {
    for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\balt=/.test(match[0])) errors.push(`${relative}: rendered image missing alt attribute`);
      if (!/\bwidth=/.test(match[0]) || !/\bheight=/.test(match[0])) errors.push(`${relative}: rendered image missing width or height`);
    }
  }
}

if (errors.length) {
  console.error(`Built-output policy failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('Built output contains no local paths, private contacts or unlabelled images.');
