// Replacement for libraries that ship a bespoke <Screenshot> in their docs.
// Renders a framed figure; resolves root-absolute asset paths against the
// GitHub Pages basePath so images load under /<repo>/.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Screenshot({ src, alt }: { src: string; alt?: string }) {
  const url = src.startsWith("/") ? `${basePath}${src}` : src;
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      {/* biome-ignore lint/performance/noImgElement: next.config sets output: "export", so the
          image optimiser next/image exists for never runs — and these are docs screenshots of
          arbitrary size, which it would need explicit dimensions for */}
      <img src={url} alt={alt ?? ""} className="block w-full" loading="lazy" />
      {alt ? (
        <figcaption className="border-t border-fd-border px-4 py-2 text-xs text-fd-muted-foreground">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  );
}
