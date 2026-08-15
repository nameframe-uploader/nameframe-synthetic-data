import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'site', 'src');
const errors = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (entry.name.endsWith('.astro')) {
      const source = await readFile(absolute, 'utf8');
      const relative = path.relative(process.cwd(), absolute);
      for (const match of source.matchAll(/<img\b[\s\S]*?>/gi)) {
        const tag = match[0];
        if (!/\balt\s*=/.test(tag)) errors.push(`${relative}: image is missing an alt attribute`);
        const literalAlt = tag.match(/\balt\s*=\s*"([^"]*)"/);
        if (literalAlt && literalAlt[1] && literalAlt[1].trim().length < 8) errors.push(`${relative}: image alt text is not meaningful`);
      }
    }
  }
}

await walk(root);
if (errors.length) {
  console.error(`Site-source validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('Validated image alternative text in Astro sources.');
