import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import * as lucide from "lucide-react";
import { type ComponentType, createElement } from "react";
import { docsContentRoute, docsImageRoute, docsRoute } from "./shared";
import {
  type DocsVersion,
  getAllLibVersions,
  type LibVersions,
  latestOnlyTree,
} from "./versions";

const lucideExports = lucide as unknown as Record<
  string,
  ComponentType | undefined
>;

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  // Resolve the `icon` field in meta.json / frontmatter to a lucide icon so the
  // per-lib sidebar tabs render their emblem. We resolve against the full lucide
  // namespace (not the `icons` object) so renamed-icon aliases still work —
  // e.g. `Filter` is an alias kept for back-compat while the canonical export is
  // now `Funnel`, and the `icons` map only contains canonical names.
  icon(icon) {
    if (!icon) return;
    const Icon = lucideExports[icon];
    if (Icon) return createElement(Icon);
  },
  plugins: [],
});

type Page = (typeof source)["$inferPage"];

let libVersions: Map<string, LibVersions> | undefined;

/** The library + docs version a page belongs to; undefined for pages outside a library. */
export function getPageVersion(
  page: Page,
): { lib: LibVersions; version: DocsVersion } | undefined {
  libVersions ??= getAllLibVersions(source.getPageTree());
  const lib = libVersions.get(page.slugs[0]);
  if (!lib) return;
  const version =
    lib.versions.find(
      (v) =>
        !v.latest &&
        (page.url === v.prefix || page.url.startsWith(`${v.prefix}/`)),
    ) ?? lib.versions.find((v) => v.latest);
  if (!version) return;
  return { lib, version };
}

/** Pages of an older major are served, but kept out of search and llms.txt. */
export function isLatestPage(page: Page): boolean {
  return getPageVersion(page)?.version.latest !== false;
}

/**
 * The loader as search and llms.txt see it: only the latest version of each library,
 * so a query never returns the same page once per major.
 */
export const latestSource: typeof source = {
  ...source,
  getPages: (...args) => source.getPages(...args).filter(isLatestPage),
  getPageTree: (...args) => latestOnlyTree(source.getPageTree(...args)),
};

export function getPageImage(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join("/")}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "content.md"];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join("/")}`,
  };
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const processed = await page.data.getText("processed");
  const versioned = getPageVersion(page);
  // Older majors are labelled, so an LLM handed one of their pages knows it is not current.
  const label =
    versioned && !versioned.version.latest
      ? ` — ${versioned.lib.name} ${versioned.version.label} docs (latest is ${versioned.lib.versions[0].label})`
      : "";

  return `# ${page.data.title}${label} (${page.url})

${processed}`;
}
