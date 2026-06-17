# 🪺 Aviary

> A field guide to the NestJS ecosystem — plug-n-play, fully-configurable libraries published under `@dudousxd`.

This is the centralized documentation site for the Aviary libraries. It's a
[Fumadocs](https://fumadocs.dev) (Next.js) app configured for **static export**, so it deploys
to **GitHub Pages** as plain HTML. The home page is the "aviary"; each library is its own
section (a `root` sidebar tab) that links through to its full docs.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

- `lib/libs.ts` — the catalogue of library families (drives the home grid).
- `content/docs/<lib>/` — one folder per library; `meta.json` makes it a sidebar tab.
- `lib/source.ts` — content source + lucide icon resolver for tabs.
- `app/(home)/page.tsx` — the landing page ("the aviary").
- `app/global.css` — the NestJS-crimson theme (overrides Fumadocs `fd-*` tokens).

Add a new library: drop a folder under `content/docs/`, add an entry to `lib/libs.ts`.

## Deploy to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. It assumes **this folder is the root
of its own GitHub repo**.

1. Push this directory to a GitHub repo (e.g. `dudousxd/aviary`).
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`. The site builds and deploys to
   `https://<user>.github.io/<repo>/`.

### The `basePath` gotcha (already handled)

A GitHub *project* site is served from a sub-path (`/<repo>`), so every asset and the static
search index must be prefixed. This is wired up automatically:

- `next.config.mjs` reads `PAGES_BASE_PATH` (empty in dev, set in CI).
- The deploy workflow fills it from `actions/configure-pages` (`base_path`).
- `components/search.tsx` fetches the search index from `${basePath}/api/search`.

If you later add a **custom domain** (e.g. `aviary.dev`), the base path becomes `/` — nothing
to change, `configure-pages` reports an empty base path automatically.

### Keeping docs in sync

The 6 synced libraries keep their docs in their own repos, so editing them there does **not**
rebuild Aviary on its own. Three triggers handle that:

- **Scheduled** — the deploy workflow runs on a cron (every 3 hours) and re-syncs + redeploys,
  so library doc edits show up automatically within the interval.
- **Manual** — run the workflow from the Actions tab ("Run workflow"), or `gh workflow run deploy.yml`.
- **Instant (optional)** — a library repo can rebuild Aviary the moment its docs change by
  POSTing a `repository_dispatch` event. Add this workflow to the library repo and a
  `AVIARY_DISPATCH_TOKEN` secret (a PAT with `repo` scope on the Aviary repo):

  ```yaml
  # .github/workflows/notify-aviary.yml (in the library repo)
  name: Notify Aviary
  on:
    push:
      branches: [main]
      paths: ['website/content/docs/**', 'apps/docs/content/docs/**']
  jobs:
    dispatch:
      runs-on: ubuntu-latest
      steps:
        - run: |
            curl -sf -X POST \
              -H "Authorization: Bearer ${{ secrets.AVIARY_DISPATCH_TOKEN }}" \
              -H "Accept: application/vnd.github+json" \
              https://api.github.com/repos/DavideCarvalho/aviary/dispatches \
              -d '{"event_type":"lib-docs-updated"}'
  ```

### Keeping it as a monorepo subfolder instead

If `aviary/` stays inside a bigger repo, move `deploy.yml` to the repo's top-level
`.github/workflows/`, add `working-directory: aviary` to the build `run` steps, and set the
upload artifact `path` to `aviary/out`.

## Stack

Fumadocs 16 · Next.js 16 (static export) · React 19 · Tailwind v4 · Orama (static search).
