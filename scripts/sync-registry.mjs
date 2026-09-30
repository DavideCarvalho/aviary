#!/usr/bin/env node

// Rebuilds public/r — the shadcn registry `npx shadcn add <url>` fetches — from the
// nestjs-agent repo's `registry/`, at a PINNED ref.
//
//   pnpm sync:registry                     # REGISTRY_REF below → public/r
//   pnpm sync:registry --ref <tag|branch|sha>
//   pnpm sync:registry --local [dir]       # a checkout on disk (default ../nestjs-agent)
//   pnpm sync:registry --out <dir>         # relative to where you run it
//
// Pinned on purpose. The components are copy-in source written against a specific
// @dudousxd/nestjs-agent-react, so what the site serves has to match a RELEASE of it. Building
// from "whatever the sibling checkout is on" published a feature branch's components once;
// `--local` still exists for previewing unreleased work, and says out loud what it built from.
//
// To publish newer components: bump REGISTRY_REF to the new release tag, run this, commit
// public/r with it.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = "DavideCarvalho/nestjs-agent";
/** The release of @dudousxd/nestjs-agent-react the served components are written against. */
export const REGISTRY_REF = "@dudousxd/nestjs-agent-react@0.28.0";

const BUILD_SCRIPT = "registry/scripts/build-registry.mjs";

function usage(message) {
  console.error(`✖ ${message}`);
  console.error(
    "  usage: sync-registry [--ref <tag|branch|sha>] [--local [dir]] [--out <dir>]",
  );
  process.exit(1);
}

function parseArgs(argv) {
  const options = { ref: REGISTRY_REF, local: undefined, out: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    const value =
      next !== undefined && !next.startsWith("--") ? next : undefined;
    if (arg === "--ref") {
      if (value === undefined) usage("--ref needs a tag, branch or commit");
      options.ref = value;
      i += 1;
    } else if (arg === "--out") {
      if (value === undefined) usage("--out needs a directory");
      options.out = value;
      i += 1;
    } else if (arg === "--local") {
      options.local = value ?? join(ROOT, "..", "nestjs-agent");
      if (value !== undefined) i += 1;
    } else {
      usage(`unknown argument "${arg}"`);
    }
  }
  if (options.local !== undefined && argv.includes("--ref")) {
    usage(
      "--local builds from a checkout as it is; it cannot be combined with --ref",
    );
  }
  return options;
}

const git = (cwd, ...args) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

/** A sparse, shallow checkout of `registry/` at `ref` (a tag, a branch or a commit). */
function checkout(ref, dir) {
  git(dir, "init", "--quiet");
  git(dir, "remote", "add", "origin", `https://github.com/${REPO}.git`);
  git(dir, "sparse-checkout", "set", "registry");
  try {
    git(
      dir,
      "fetch",
      "--quiet",
      "--depth",
      "1",
      "--filter=blob:none",
      "origin",
      ref,
    );
  } catch (error) {
    const detail = error.stderr?.toString().trim() ?? String(error);
    console.error(`✖ could not fetch ${REPO} at "${ref}"\n  ${detail}`);
    process.exit(1);
  }
  git(dir, "checkout", "--quiet", "FETCH_HEAD");
  return git(dir, "rev-parse", "--short", "HEAD");
}

function describeLocal(dir) {
  try {
    const branch = git(dir, "rev-parse", "--abbrev-ref", "HEAD");
    const sha = git(dir, "rev-parse", "--short", "HEAD");
    const dirty = git(dir, "status", "--porcelain", "--", "registry") !== "";
    return `${branch} @ ${sha}${dirty ? " + uncommitted changes" : ""}`;
  } catch {
    return "not a git checkout";
  }
}

const options = parseArgs(process.argv.slice(2));
// Against the working directory, like any CLI path; the default is this site's own public/r
// wherever the command is run from.
const outDir =
  options.out === undefined
    ? join(ROOT, "public", "r")
    : resolve(process.cwd(), options.out);

let source;
let label;
let tmp;
if (options.local !== undefined) {
  source = resolve(process.cwd(), options.local);
  if (!existsSync(join(source, BUILD_SCRIPT))) {
    usage(`no ${BUILD_SCRIPT} under ${source}`);
  }
  label = `${source} (${describeLocal(source)})`;
  console.warn(
    `! building from a local checkout, NOT the pinned ${REGISTRY_REF}: ${label}`,
  );
} else {
  tmp = mkdtempSync(join(tmpdir(), "aviary-registry-"));
  source = tmp;
  label = `${REPO} at ${options.ref} (${checkout(options.ref, tmp)})`;
}

try {
  // Absolute, so it lands in the same place whichever way the library's script resolves --out.
  execFileSync(
    process.execPath,
    [join(source, BUILD_SCRIPT), "--out", outDir],
    {
      stdio: "inherit",
    },
  );
} finally {
  if (tmp !== undefined) rmSync(tmp, { recursive: true, force: true });
}
console.log(`✔ registry from ${label}`);
