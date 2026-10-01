#!/usr/bin/env node
// Compiles every page under content/docs with the MDX parser and lists each one that does not parse,
// with its line and column — all of them at once.
//
//   node scripts/check-mdx.mjs
//
// `next build` stops at the first broken page and points at a Turbopack frame, so a single bad page
// (say, a hard-wrapped line that starts with `{` inside an inline code span — MDX reads that `{` as a
// JavaScript expression) blocks the whole deploy. This runs in `prebuild` after the docs sync, so it
// also covers the pages synced from the library repos, and in the PR check before anything merges.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_DIR = join(ROOT, "content", "docs");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

/** Blank out the frontmatter (keeping its lines) so reported positions match the file. */
function withoutFrontmatter(source) {
  const match = /^---\r?\n[\s\S]*?\r?\n---(\r?\n|$)/.exec(source);
  if (!match) return source;
  return match[0].replace(/[^\n]/g, "") + source.slice(match[0].length);
}

const files = walk(DOCS_DIR);
const failures = [];
for (const file of files) {
  const value = withoutFrontmatter(readFileSync(file, "utf8"));
  try {
    await compile(
      { value, path: file },
      {
        format: file.endsWith(".md") ? "md" : "mdx",
        remarkPlugins: [remarkGfm],
      },
    );
  } catch (error) {
    const place = error.place?.start ?? error.place ?? {};
    const where = place.line ? `:${place.line}:${place.column}` : "";
    failures.push(
      `  ${relative(ROOT, file)}${where}  ${error.reason ?? error.message}`,
    );
  }
}

if (failures.length > 0) {
  console.error(
    `✖ ${failures.length} page(s) do not compile as MDX:\n${failures.join("\n")}`,
  );
  process.exit(1);
}
console.log(`✓ ${files.length} pages compile as MDX`);
