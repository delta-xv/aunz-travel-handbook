import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const versions = new Map();
for (const name of ['index.html', 'documents.html']) {
  const file = new URL(name, root);
  let html = await readFile(file, 'utf8');
  const paths = [...html.matchAll(/(?:src|href)="(assets\/[^"?]+)(?:\?v=[^"]*)?"/g)].map(match => match[1]);
  for (const path of new Set(paths)) {
    if (!versions.has(path)) {
      versions.set(path, createHash('sha256').update(await readFile(new URL(path, root))).digest('hex').slice(0, 12));
    }
  }
  html = html.replace(/((?:src|href)=")(assets\/[^"?]+)(?:\?v=[^"]*)?(")/g,
    (_, prefix, path, suffix) => `${prefix}${path}?v=${versions.get(path)}${suffix}`);
  await writeFile(file, html);
}
