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
    description: "Typed client artifacts with pluggable validators (zod/valibot/arktype).",
    icon: 'Braces',
    repo: 'DavideCarvalho/nestjs-codegen',
    ref: 'main',
    path: 'apps/docs/content/docs',
    repoDir: 'nestjs-codegen',
    migrated: true,
  },
  {
    slug: 'durable',
    name: 'Durable',
    description: "Durable, resumable cross-app workflows for NestJS.",
    icon: 'Workflow',
    repo: 'DavideCarvalho/nestjs-durable',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-durable',
    migrated: true,
  },
  {
    slug: 'filter',
    name: 'Filter',
    description: "A query filter language with ORM adapters and a typed client.",
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
    description: "TypeScript-first Inertia.js adapter — multi-app, Vite-native.",
    icon: 'Layers',
    repo: 'DavideCarvalho/nestjs-inertia',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-inertia',
    migrated: true,
  },
  {
    slug: 'media',
    name: 'Media',
    description: "Filesystem + media-library in one package — disks, resumable uploads, attachments, conversions.",
    icon: 'Image',
    repo: 'DavideCarvalho/nestjs-media',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-media',
    migrated: true,
  },
  {
    slug: 'notifications',
    name: 'Notifications',
    description: "Laravel-style notifications — one notification, many channels.",
    icon: 'Bell',
    repo: 'DavideCarvalho/nestjs-notifications',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-notifications',
    migrated: true,
  },
  {
    slug: 'telescope',
    name: 'Telescope',
    description: "Telescope-style observability console with watchers + dashboard.",
    icon: 'Telescope',
    repo: 'DavideCarvalho/nestjs-telescope',
    ref: 'main',
    path: 'website/content/docs',
    repoDir: 'nestjs-telescope',
    // Docs reference /screenshots/*.png from the site's public dir; vendor it.
    publicDir: 'website/public',
    migrated: true,
  },
  {
    slug: 'resilience',
    name: 'Resilience',
    description: "Composable timeout, retry, circuit-breaker and failover policies — with a pluggable, distributed breaker store.",
    icon: 'Zap',
    repo: 'DavideCarvalho/nestjs-resilience',
    ref: 'master',
    path: 'website/content/docs',
    repoDir: 'nestjs-resilience',
    migrated: true,
  },
];
