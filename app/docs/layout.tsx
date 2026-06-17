import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Bird } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { libs } from '@/lib/libs';

// Explicit dropdown tabs. The libraries are root folders (each its own tab), but
// we list them here ourselves and prepend a "Field guide" entry pointing at the
// /docs hub — so the dropdown is visible and consistent on every page, including
// /docs (where an auto-generated tab list would otherwise hide it).
const tabs = [
  { title: 'Field guide', url: '/docs', icon: <Bird className="size-full" /> },
  ...libs.map((lib) => ({
    title: lib.name,
    url: `/docs/${lib.slug}`,
    icon: <lib.icon className="size-full" />,
  })),
];

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} tabs={tabs} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
