import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

export const revalidate = false;

// Clamp long descriptions so they never overrun the card footer.
function clamp(text: string, max = 150) {
  if (!text || text.length <= max) return text ?? '';
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max).trimEnd()}…`;
}

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const title = page.data.title;
  const description = clamp(page.data.description ?? '');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background:
          'radial-gradient(900px 520px at 50% -8%, rgba(224,35,78,0.34), rgba(224,35,78,0) 70%), radial-gradient(700px 420px at 14% 12%, rgba(124,58,170,0.20), rgba(124,58,170,0) 70%), #0c0a0e',
        color: '#ECE7E1',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 24,
          letterSpacing: 6,
          textTransform: 'uppercase',
          color: '#B9B2AA',
        }}
      >
        <div style={{ display: 'flex', width: 14, height: 14, borderRadius: 999, background: '#E0234E' }} />
        Aviary · Field guide
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, lineHeight: 1.05, color: '#ECE7E1' }}>
          {title}
        </div>
        {description ? (
          <div style={{ display: 'flex', fontSize: 33, lineHeight: 1.35, color: '#B9B2AA', maxWidth: 1000 }}>
            {description}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 28,
          color: '#8A847C',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#ECE7E1' }}>Aviary</div>
          <div style={{ display: 'flex' }}>— a field guide to the NestJS ecosystem</div>
        </div>
        <div style={{ display: 'flex', color: '#E0234E' }}>@dudousxd</div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
