// Source of truth for the docs sync (scripts/sync-docs.mjs).
//
// Aviary follows the TanStack model: each library keeps its own docs in its own
// repo, and this site pulls them in at build time. `migrated: true` means the
// library has been onboarded — only migrated libs are synced by default. Flip
// the flag as each library is brought over.
//
// `path` is the docs directory *inside* the library repo. `repoDir` is the
// sibling folder name used by the optional local mode (AVIARY_DOCS_LOCAL=1).

export const sources = [
  {
    slug: 'codegen',
    name: 'Codegen',
    icon: 'Braces',
    repo: 'DavideCarvalho/nestjs-codegen',
    ref: 'main',
    path: 'apps/docs/content/docs',
    repoDir: 'nestjs-codegen',
    migrated: false,
  },
  {
    slug: 'durable',
    name: 'Durable',
    icon: 'Workflow',
    repo: 'DavideCarvalho/nestjs-durable',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-durable',
    migrated: false,
  },
  {
    slug: 'filter',
    name: 'Filter',
    icon: 'Filter',
    repo: 'DavideCarvalho/nestjs-filter',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-filter',
    migrated: true,
  },
  {
    slug: 'inertia',
    name: 'Inertia',
    icon: 'Layers',
    repo: 'DavideCarvalho/nestjs-inertia',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-inertia',
    migrated: false,
  },
  {
    slug: 'notifications',
    name: 'Notifications',
    icon: 'Bell',
    repo: 'DavideCarvalho/nestjs-notifications',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-notifications',
    migrated: false,
  },
  {
    slug: 'telescope',
    name: 'Telescope',
    icon: 'Telescope',
    repo: 'DavideCarvalho/nestjs-telescope',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-telescope',
    migrated: false,
  },
];
