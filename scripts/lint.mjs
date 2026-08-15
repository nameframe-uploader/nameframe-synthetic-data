import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const excluded = new Set(['.git', 'node_modules', 'dist', '.astro']);
const textExtensions = new Set(['.md', '.json', '.csv', '.mjs', '.astro', '.css', '.ts', '.yml', '.yaml', '.cff', '.txt']);
const errors = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (textExtensions.has(path.extname(entry.name).toLowerCase()) || ['CODEOWNERS'].includes(entry.name)) {
      const text = await readFile(absolute, 'utf8');
      const relative = path.relative(root, absolute);
      if (/\r/.test(text)) errors.push(`${relative}: use LF line endings`);
      text.split('\n').forEach((line, index) => {
        if (/\s+$/.test(line)) errors.push(`${relative}:${index + 1}: trailing whitespace`);
      });
      if (absolute.endsWith('.json')) {
        try { JSON.parse(text); } catch (error) { errors.push(`${relative}: invalid JSON (${error.message})`); }
      }
    }
  }
}

await walk(root);
if (errors.length) {
  console.error(`Lint failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('Text and JSON lint checks passed.');
