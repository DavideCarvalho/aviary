import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Bird } from "lucide-react";
import { VersionSelect } from "@/components/version-select";
import { baseOptions } from "@/lib/layout.shared";
import { libs } from "@/lib/libs";
import { source } from "@/lib/source";

// Explicit dropdown tabs. The libraries are root folders (each its own tab), but
// we list them here ourselves and prepend a "Field guide" entry pointing at the
// /docs hub — so the dropdown is visible and consistent on every page, including
// /docs (where an auto-generated tab list would otherwise hide it).
const tabs = [
  { title: "Field guide", url: "/docs", icon: <Bird className="size-full" /> },
  ...libs.map((lib) => ({
    title: lib.name,
    url: `/docs/${lib.slug}`,
    icon: <lib.icon className="size-full" />,
  })),
];

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    // The version dropdown sits in the sidebar banner, under the library dropdown, and
    // renders only for a library with older majors.
    <DocsLayout
      {...baseOptions()}
      tree={source.getPageTree()}
      tabs={tabs}
      sidebar={{ banner: <VersionSelect /> }}
    >
      {children}
    </DocsLayout>
  );
}
