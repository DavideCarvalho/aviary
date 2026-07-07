import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { AgentLoop } from "@/components/agent-loop";
import { CodeFlow } from "@/components/code-flow";
import { DlqSim, RetrySim } from "@/components/failure-sims";
import { QueueSim, SingletonSim } from "@/components/queue-sim";
import { AdaptiveSim, FanoutSim, RateLimitSim } from "@/components/scale-sims";
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
    AgentLoop,
    CodeFlow,
    AdaptiveSim,
    DlqSim,
    FanoutSim,
    QueueSim,
    RateLimitSim,
    RetrySim,
    SingletonSim,
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
