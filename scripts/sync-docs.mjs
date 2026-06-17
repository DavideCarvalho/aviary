#!/usr/bin/env node
// Pulls each library's docs into content/docs/<slug>/ (TanStack-style).
//
//   node scripts/sync-docs.mjs            # sync all migrated libraries
//   node scripts/sync-docs.mjs filter     # sync one library (even if not migrated)
//   AVIARY_DOCS_LOCAL=1 node scripts/...   # copy from sibling repos instead of cloning
//
// For each library it: fetches the docs subtree, rewrites root-absolute /docs
// links to be nested under /docs/<slug>, and turns the top-level meta.json into
// a sidebar "root" tab carrying the library's name + icon.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sources } from './docs-sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const USE_LOCAL = process.env.AVIARY_DOCS_LOCAL === '1';
const only = process.argv[2];

const selected = only
  ? sources.filter((s) => s.slug === only)
  : sources.filter((s) => s.migrated);

if (only && selected.length === 0) {
  console.error(`✖ no source configured for "${only}"`);
  process.exit(1);
}
if (selected.length === 0) {
  console.log('· no migrated libraries to sync yet');
  process.exit(0);
}

/** Recursively list files under a directory. */
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

/** Obtain the source docs dir, either from a sibling repo or a sparse clone. */
function fetchDocs(src, tmp) {
  if (USE_LOCAL) {
    const local = join(ROOT, '..', src.repoDir, src.path);
    if (!existsSync(local)) {
      throw new Error(`local source not found: ${local}`);
    }
    return local;
  }
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const url = `https://github.com/${src.repo}.git`;
  execFileSync(
    'git',
    ['clone', '--depth', '1', '--filter=blob:none', '--sparse', '--branch', src.ref, url, tmp],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );
  execFileSync('git', ['-C', tmp, 'sparse-checkout', 'set', src.path], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  const dir = join(tmp, src.path);
  if (!existsSync(dir)) {
    throw new Error(`docs path "${src.path}" missing in ${src.repo}@${src.ref}`);
  }
  return dir;
}

/** Rewrite root-absolute /docs links so they nest under the library slug. */
function rewriteLinks(content, slug) {
  // Only touch real link targets: markdown `](/docs...)` and `href="/docs..."`.
  // Source docs assume they are the root, so /docs never already contains the slug.
  return content
    .replaceAll('](/docs', `](/docs/${slug}`)
    .replaceAll('href="/docs', `href="/docs/${slug}`);
}

/** Promote the top-level meta.json to a sidebar root tab with name + icon. */
function transformRootMeta(file, src) {
  const meta = JSON.parse(readFileSync(file, 'utf8'));
  // Keep the source's page ordering etc., but make it a root tab and force the
  // library's own name + icon (sources usually ship title "Documentation").
  const next = { ...meta, root: true, title: src.name, icon: src.icon };
  writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
}

let totalFiles = 0;
let totalLinks = 0;

for (const src of selected) {
  const dest = join(ROOT, 'content', 'docs', src.slug);
  const tmp = join(ROOT, '.docs-tmp', src.slug);

  const from = fetchDocs(src, tmp);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  cpSync(from, dest, { recursive: true });
  if (!USE_LOCAL) rmSync(tmp, { recursive: true, force: true });

  let files = 0;
  let links = 0;
  for (const file of walk(dest)) {
    if (file.endsWith('.mdx') || file.endsWith('.md')) {
      const before = readFileSync(file, 'utf8');
      const after = rewriteLinks(before, src.slug);
      links += (before.match(/\]\(\/docs|href="\/docs/g) || []).length;
      if (after !== before) writeFileSync(file, after);
      files += 1;
    }
  }

  const rootMeta = join(dest, 'meta.json');
  if (existsSync(rootMeta)) transformRootMeta(rootMeta, src);

  totalFiles += files;
  totalLinks += links;
  console.log(
    `✓ ${src.slug.padEnd(14)} ${files} docs, ${links} links rewritten  (${USE_LOCAL ? 'local' : src.repo + '@' + src.ref})`,
  );
}

console.log(`\n✓ synced ${selected.length} librar${selected.length === 1 ? 'y' : 'ies'} · ${totalFiles} files · ${totalLinks} links`);
