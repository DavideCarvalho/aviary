import { appName } from '@/lib/shared';

/**
 * Aviary mark — an abstract swift in flight (two swept wings + a body),
 * drawn so it also reads as a downward chevron / "nest" notch. Uses
 * currentColor for the body and the brand crimson for the lead wing.
 */
export function AviaryMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label={`${appName} logo`}
      className={className}
    >
      {/* trailing wing */}
      <path
        d="M3 9c6.5 1.2 11 4.8 13 11.5C13.4 18 9.2 16.4 4.6 16.2"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      {/* lead wing — brand crimson */}
      <path
        d="M29 9c-6.5 1.2-11 4.8-13 11.5C18.6 18 22.8 16.4 27.4 16.2"
        stroke="var(--aviary-primary, #E0234E)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* body */}
      <path
        d="M16 20.5c.7 2.7 1 5 .9 7.5-1 .1-1.8.1-2.8 0 .1-2.5.5-4.8 1.9-7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** GitHub mark — lucide dropped brand glyphs in v1, so we inline it. */
export function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

export function AviaryWordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <AviaryMark className="size-6 shrink-0" />
      <span className="font-display text-[1.35rem] leading-none font-medium tracking-tight">
        {appName}
      </span>
    </span>
  );
}
