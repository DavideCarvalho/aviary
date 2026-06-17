#!/usr/bin/env node
// Next emits the file-based metadata images as extensionless files
// (out/opengraph-image, out/twitter-image). GitHub Pages then serves them as
// application/octet-stream, which Facebook / WhatsApp / X reject as og:image.
// This renames them to .png and points the meta tags at the .png URL.

import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const NAMES = ['opengraph-image', 'twitter-image'];

if (!existsSync(OUT)) {
  console.error('postbuild-og: no out/ directory');
  process.exit(0);
}

let renamed = 0;
for (const name of NAMES) {
  const file = join(OUT, name);
  if (existsSync(file) && statSync(file).isFile()) {
    renameSync(file, `${file}.png`);
    renamed += 1;
  }
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

// Rewrite `.../opengraph-image?<hash>` -> `.../opengraph-image.png` in every page.
const re = /(opengraph-image|twitter-image)\?[A-Za-z0-9]+/g;
let patched = 0;
for (const file of walk(OUT)) {
  if (!file.endsWith('.html')) continue;
  const before = readFileSync(file, 'utf8');
  const after = before.replace(re, '$1.png');
  if (after !== before) {
    writeFileSync(file, after);
    patched += 1;
  }
}

console.log(`✓ postbuild-og: renamed ${renamed} image(s), patched ${patched} page(s)`);
