import type { ReactElement } from 'react';

// Per-library "call sign" specimens, mirroring the README banners. Drawn as
// satori-safe SVG (explicit presentation attrs on each shape — no reliance on
// group inheritance) so they render inside `next/og` ImageResponse.

const C = '#E0234E';
const INK = '#0C0A0E';
const BONE = '#ECE7E1';

const art: Record<string, ReactElement> = {
  Falcon: (
    <g>
      <path d="M-4 -30 C-40 -26 -78 -36 -96 -10 C-66 -16 -36 -4 -8 6 Z" fill={C} />
      <path d="M4 -30 C40 -26 78 -36 96 -10 C66 -16 36 -4 8 6 Z" fill={C} />
      <path d="M-8 -34 C-3 -40 3 -40 8 -34 C10 2 6 36 0 54 C-6 36 -10 2 -8 -34 Z" fill={C} />
      <circle cx="0" cy="-40" r="9" fill={C} />
    </g>
  ),
  Weaver: (
    <g>
      <path d="M-16 -16 C-20 -32 -6 -42 10 -38 C24 -34 24 -18 12 -12 C2 -8 -8 -6 -16 -16 Z" fill={C} />
      <circle cx="-12" cy="-32" r="8" fill={C} />
      <path d="M-19 -33 l-10 -1 l8 4 z" fill={C} />
      <circle cx="-13" cy="-33" r="1.6" fill={INK} />
      <ellipse cx="6" cy="30" rx="22" ry="17" stroke={C} strokeWidth="2.5" fill="none" />
      <path d="M-15 27 q21 -9 42 0" stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M-13 35 q19 -7 38 0" stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M-9 41 q15 -5 30 0" stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="6" cy="37" r="4" fill={INK} />
    </g>
  ),
  Swift: (
    <g>
      <path d="M-2 -8 C-34 -16 -66 -8 -94 14 C-66 4 -38 4 -8 8 Z" fill={C} />
      <path d="M2 -8 C34 -16 66 -8 94 14 C66 4 38 4 8 8 Z" fill={C} />
      <path d="M-7 -14 C-2 -18 2 -18 7 -14 C9 8 6 34 0 52 C-6 34 -9 8 -7 -14 Z" fill={C} />
    </g>
  ),
  Albatross: (
    <g>
      <path d="M-6 -2 C-44 -14 -78 -14 -96 -7 C-78 -1 -44 3 -8 5 Z" fill={C} />
      <path d="M6 -2 C44 -14 78 -14 96 -7 C78 -1 44 3 8 5 Z" fill={C} />
      <ellipse cx="0" cy="6" rx="7" ry="24" fill={C} />
      <circle cx="0" cy="-20" r="6.5" fill={C} />
      <path d="M0 -25 l0 -12" stroke={C} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  Sandpiper: (
    <g>
      <ellipse cx="4" cy="-6" rx="26" ry="18" fill={C} />
      <circle cx="-20" cy="-22" r="10" fill={C} />
      <path d="M-28 -23 C-44 -21 -53 -15 -58 -8" stroke={C} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="-22" cy="-24" r="1.8" fill={INK} />
      <path d="M0 11 l-5 36" stroke={C} strokeWidth="3" strokeLinecap="round" />
      <path d="M16 9 l5 38" stroke={C} strokeWidth="3" strokeLinecap="round" />
      <path d="M-5 47 l-6 4 M-5 47 l6 3 M21 47 l-6 4 M21 47 l6 3" stroke={C} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  Swallow: (
    <g>
      <path d="M-2 -4 C-34 -24 -66 -22 -90 -8 C-64 -10 -36 -2 -6 6 Z" fill={C} />
      <path d="M2 -4 C34 -24 66 -22 90 -8 C64 -10 36 -2 6 6 Z" fill={C} />
      <path d="M-6 -10 C0 -14 6 -10 6 -10 C7 8 6 24 4 32 L13 52 L0 41 L-13 52 L-4 32 C-6 24 -7 8 -6 -10 Z" fill={C} />
    </g>
  ),
  Nightingale: (
    <g>
      <path d="M-18 8 C-22 -16 -4 -30 14 -24 C30 -18 30 4 18 12 C8 18 -6 20 -18 8 Z" fill={C} />
      <path d="M16 10 C30 8 40 0 47 -11 C39 -5 28 -3 18 -1 Z" fill={C} />
      <circle cx="-12" cy="-18" r="9" fill={C} />
      <path d="M-20 -20 l-11 -3 l9 6 z" fill={C} />
      <circle cx="-13" cy="-20" r="1.6" fill={INK} />
      <path d="M-6 16 l0 11 M7 18 l0 10" stroke={C} strokeWidth="3" strokeLinecap="round" />
      <circle cx="-42" cy="-30" r="4" fill={BONE} />
      <rect x="-39" y="-46" width="2.4" height="17" fill={BONE} />
      <circle cx="-56" cy="-13" r="3" fill={BONE} />
      <rect x="-53.6" y="-27" width="2" height="15" fill={BONE} />
    </g>
  ),
  Owl: (
    <g>
      <path d="M-30 -54 L-16 -30 L-34 -34 Z" fill={C} />
      <path d="M30 -54 L16 -30 L34 -34 Z" fill={C} />
      <path d="M0 -52 C34 -52 50 -26 50 4 C50 40 30 60 0 60 C-30 60 -50 40 -50 4 C-50 -26 -34 -52 0 -52 Z" fill={C} />
      <circle cx="-18" cy="-8" r="13" fill={BONE} />
      <circle cx="18" cy="-8" r="13" fill={BONE} />
      <circle cx="-18" cy="-8" r="5.5" fill={INK} />
      <circle cx="18" cy="-8" r="5.5" fill={INK} />
      <path d="M0 0 L-6 10 L6 10 Z" fill={INK} />
      <path d="M-12 60 l0 8 M12 60 l0 8" stroke={INK} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  // Cockatiel — the swept-back crest and the round cheek patch are the call
  // sign, mirroring the resilience banner: a circuit that bends but holds.
  Cockatiel: (
    <g>
      <path d="M-18 8 C-22 -16 -4 -30 14 -24 C30 -18 30 4 18 12 C8 18 -6 20 -18 8 Z" fill={C} />
      <path d="M16 10 C30 8 40 0 47 -11 C39 -5 28 -3 18 -1 Z" fill={C} />
      <circle cx="-12" cy="-18" r="9" fill={C} />
      <path d="M-20 -19 l-11 -2 l9 6 z" fill={C} />
      <path d="M-14 -25 C-12 -37 -4 -44 6 -46" stroke={C} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M-11 -26 C-6 -36 3 -41 12 -41" stroke={C} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M-8 -25 C-2 -33 7 -36 15 -35" stroke={C} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="-15" cy="-13" r="3" fill={BONE} />
      <circle cx="-13" cy="-20" r="1.7" fill={INK} />
      <path d="M-6 16 l0 11 M7 18 l0 10" stroke={C} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  // Speckled starling — the specks are the call sign: each one a diagnostic
  // event landing on the channel.
  Starling: (
    <g>
      <path d="M-20 6 C-25 -19 -3 -33 17 -27 C33 -22 34 2 20 11 C9 17 -8 19 -20 6 Z" fill={C} />
      <path d="M17 9 C32 9 45 5 54 -1 L50 9 L47 18 C39 15 27 15 17 13 Z" fill={C} />
      <circle cx="-15" cy="-19" r="10" fill={C} />
      <path d="M-23 -22 l-17 1 l15 6 z" fill={C} />
      <circle cx="-16" cy="-21" r="1.7" fill={INK} />
      <path d="M-5 16 l0 13 M9 18 l0 12" stroke={C} strokeWidth="3" strokeLinecap="round" />
      <path d="M-5 29 l-5 4 M-5 29 l5 4 M9 30 l-5 4 M9 30 l5 4" stroke={C} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="-7" cy="-7" r="1.9" fill={BONE} />
      <circle cx="4" cy="-11" r="1.9" fill={BONE} />
      <circle cx="13" cy="-3" r="1.9" fill={BONE} />
      <circle cx="-1" cy="2" r="1.9" fill={BONE} />
      <circle cx="9" cy="5" r="1.9" fill={BONE} />
      <circle cx="18" cy="1" r="1.7" fill={BONE} />
      <circle cx="-12" cy="3" r="1.7" fill={BONE} />
      <circle cx="3" cy="-3" r="1.6" fill={BONE} />
    </g>
  ),
};

// slug → { call sign, plate number }
const meta: Record<string, { call: keyof typeof art; plate: string }> = {
  authz: { call: 'Falcon', plate: '01' },
  codegen: { call: 'Weaver', plate: '02' },
  context: { call: 'Swift', plate: '03' },
  durable: { call: 'Albatross', plate: '04' },
  filter: { call: 'Sandpiper', plate: '05' },
  inertia: { call: 'Swallow', plate: '06' },
  notifications: { call: 'Nightingale', plate: '07' },
  telescope: { call: 'Owl', plate: '08' },
  diagnostics: { call: 'Starling', plate: '09' },
  resilience: { call: 'Cockatiel', plate: '10' },
};

export interface Specimen {
  call: string;
  plate: string;
  art: ReactElement;
}

/** Resolve a docs slug's first segment to its Aviary specimen, if any. */
export function getSpecimen(libSlug: string | undefined): Specimen | null {
  if (!libSlug) return null;
  const m = meta[libSlug];
  if (!m) return null;
  return { call: m.call, plate: m.plate, art: art[m.call] };
}
