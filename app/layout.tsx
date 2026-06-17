import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import { appName, appTagline, gitConfig } from '@/lib/shared';
import './global.css';

// Editorial "field guide" display serif — characterful, never generic.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Warm, humanist body grotesk (deliberately not Inter/Arial/system).
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// e.g. https://dudousxd.github.io/aviary  (basePath is empty in dev / on a custom domain)
const siteUrl = `https://${gitConfig.user}.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ''}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} — ${appTagline}`,
    template: `%s · ${appName}`,
  },
  description:
    'Aviary is a collection of plug-n-play, fully-configurable libraries for NestJS, published under @dudousxd. One field guide, one habitat — many species.',
  applicationName: appName,
  authors: [{ name: 'dudousxd' }],
  keywords: ['NestJS', 'TypeScript', 'Laravel-style', 'dudousxd', 'Aviary', 'monorepo', 'libraries'],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
