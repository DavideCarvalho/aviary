import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ReplayDiagram } from "@/components/replay-diagram";
import { Screenshot } from "@/components/screenshot";
import { TenancyDiagram } from "@/components/tenancy-diagram";
import { TenantFlow } from "@/components/tenant-flow";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Components the synced library docs use without always importing them.
    Tab,
    Tabs,
    Step,
    Steps,
    TypeTable,
    ReplayDiagram,
    Screenshot,
    TenancyDiagram,
    TenantFlow,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
