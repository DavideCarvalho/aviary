export const appName = 'Aviary';
export const appTagline = 'A field guide to the NestJS ecosystem.';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// npm scope every package in the aviary lives under.
export const npmScope = '@dudousxd';

// GitHub info — used for nav link + "edit on GitHub" + Pages basePath assumptions.
// NOTE: `repo` should match the GitHub repository name; the Pages basePath is
// derived from it automatically by the deploy workflow (configure-pages).
export const gitConfig = {
  user: 'DavideCarvalho',
  repo: 'aviary',
  branch: 'main',
};
