import {
  Activity,
  Bell,
  Bot,
  Boxes,
  Braces,
  Filter,
  Image,
  Layers,
  ShieldCheck,
  Telescope,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface AviaryLib {
  /** url + folder slug under /docs */
  slug: string;
  /** primary published package, without the @dudousxd scope */
  pkg: string;
  /** display name */
  name: string;
  /** one-line description (taken from each package.json) */
  blurb: string;
  /** decorative "call sign" — every specimen in the aviary gets a bird */
  bird: string;
  /** lucide icon, used on cards + docs sidebar tabs */
  icon: LucideIcon;
  /** lucide icon name as string — for meta.json sidebar tabs */
  iconName: string;
  /** how many packages ship in the family */
  packages: number;
  /** maturity badge */
  stage: 'alpha' | 'beta' | 'wip';
}

export const libs: AviaryLib[] = [
  {
    slug: 'agent',
    pkg: 'nestjs-agent',
    name: 'Agent',
    blurb: 'A governed, durable-backed AI agent — chat + tool-calling + RBAC + quota + cost + human-in-the-loop, with each turn a replay-safe durable workflow.',
    bird: 'Magpie',
    icon: Bot,
    iconName: 'Bot',
    packages: 12,
    stage: 'wip',
  },
  {
    slug: 'authz',
    pkg: 'nestjs-authz',
    name: 'Authz',
    blurb: 'Laravel-style Gates & Policies. A zero-dependency authorization core that reads like plain TypeScript.',
    bird: 'Falcon',
    icon: ShieldCheck,
    iconName: 'ShieldCheck',
    packages: 2,
    stage: 'alpha',
  },
  {
    slug: 'codegen',
    pkg: 'nestjs-codegen',
    name: 'Codegen',
    blurb: 'Typed client artifacts from your NestJS app — pluggable validators (zod, valibot, arktype), optional TanStack Query & superjson.',
    bird: 'Weaver',
    icon: Braces,
    iconName: 'Braces',
    packages: 5,
    stage: 'wip',
  },
  {
    slug: 'context',
    pkg: 'nestjs-context',
    name: 'Context',
    blurb: 'Shared AsyncLocalStorage context that carries user, tenant and traceId across the request and the whole ecosystem.',
    bird: 'Swift',
    icon: Boxes,
    iconName: 'Boxes',
    packages: 2,
    stage: 'alpha',
  },
  {
    slug: 'durable',
    pkg: 'nestjs-durable',
    name: 'Durable',
    blurb: 'Durable, cross-app workflows for NestJS — pluggable stores, transports and a dashboard. Resumable by design.',
    bird: 'Albatross',
    icon: Workflow,
    iconName: 'Workflow',
    packages: 17,
    stage: 'wip',
  },
  {
    slug: 'filter',
    pkg: 'nestjs-filter',
    name: 'Filter',
    blurb: 'A query filter language with ORM adapters (MikroORM, TypeORM), a typed client and React bindings.',
    bird: 'Sandpiper',
    icon: Filter,
    iconName: 'Filter',
    packages: 6,
    stage: 'alpha',
  },
  {
    slug: 'inertia',
    pkg: 'nestjs-inertia',
    name: 'Inertia',
    blurb: 'A TypeScript-first Inertia.js adapter — multi-app, Vite-native, with a Tuyau-style typed client.',
    bird: 'Swallow',
    icon: Layers,
    iconName: 'Layers',
    packages: 6,
    stage: 'beta',
  },
  {
    slug: 'media',
    pkg: 'nestjs-media',
    name: 'Media',
    blurb: 'Filesystem + media-library in one package — disk-agnostic storage, resumable (tus) uploads, entity attachments and image conversions.',
    bird: 'Pelican',
    icon: Image,
    iconName: 'Image',
    packages: 14,
    stage: 'alpha',
  },
  {
    slug: 'notifications',
    pkg: 'nestjs-notifications',
    name: 'Notifications',
    blurb: 'Laravel-style notifications for NestJS — one notification, many channels (mail, database, Slack) plus real-time in-app delivery over SSE or WebSocket.',
    bird: 'Nightingale',
    icon: Bell,
    iconName: 'Bell',
    packages: 25,
    stage: 'wip',
  },
  {
    slug: 'telescope',
    pkg: 'nestjs-telescope',
    name: 'Telescope',
    blurb: 'A Laravel Telescope-style observability console — watchers, request correlation, pluggable storage, headless API + dashboard.',
    bird: 'Owl',
    icon: Telescope,
    iconName: 'Telescope',
    packages: 19,
    stage: 'wip',
  },
  {
    slug: 'diagnostics',
    pkg: 'nestjs-diagnostics',
    name: 'Diagnostics',
    blurb: 'A vendor-neutral diagnostics channel for the ecosystem — emit once over Node’s diagnostics_channel, observe anywhere (Telescope, OpenTelemetry, your own subscriber).',
    bird: 'Starling',
    icon: Activity,
    iconName: 'Activity',
    packages: 2,
    stage: 'alpha',
  },
  {
    slug: 'resilience',
    pkg: 'nestjs-resilience',
    name: 'Resilience',
    blurb: 'Composable timeout, retry, circuit-breaker and failover policies for NestJS — with a pluggable, distributed breaker store (Redis, Postgres, SQLite).',
    bird: 'Cockatiel',
    icon: Zap,
    iconName: 'Zap',
    packages: 6,
    stage: 'alpha',
  },
];

export const stageLabel: Record<AviaryLib['stage'], string> = {
  alpha: 'Alpha',
  beta: 'Beta',
  wip: 'In flight',
};

export const totalPackages = libs.reduce((n, l) => n + l.packages, 0);
