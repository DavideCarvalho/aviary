// Architecture diagrams for the agent docs' dispatched-turn and HITL-signal flows. Hand-authored
// SVG (no runtime deps), theme-aware via Fumadocs' `--color-fd-*` CSS variables — same pattern as
// `TenancyDiagram` for the durable docs. Static (no interaction): the point here is a readable map
// of which process does what, not a walkthrough — `AgentLoop` already owns the interactive
// beat-by-beat turn illustration.

type Variant = "dispatched" | "hitl";

const ink = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const card = "var(--color-fd-card)";
const border = "var(--color-fd-border)";
const accent = "var(--color-fd-primary)";
const accentSoft = "color-mix(in srgb, var(--color-fd-primary) 14%, transparent)";
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** A rounded node box with a title, muted subtitle rows, and an optional accent bar. */
function Node({
  x,
  y,
  w,
  h,
  title,
  rows,
  accented,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  rows: string[];
  accented?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        style={{
          fill: card,
          stroke: accented ? accent : border,
          strokeWidth: accented ? 1.5 : 1,
        }}
        filter="url(#soft)"
      />
      {accented ? (
        <rect x={x} y={y} width={4} height={h} rx={2} style={{ fill: accent }} />
      ) : null}
      <text x={x + 16} y={y + 25} style={{ fill: ink, fontSize: 13, fontWeight: 600 }}>
        {title}
      </text>
      {rows.map((row, i) => (
        <text
          // biome-ignore lint/suspicious/noArrayIndexKey: static label list, order is stable
          key={i}
          x={x + 16}
          y={y + 46 + i * 17}
          style={{ fill: muted, fontSize: 11, fontFamily: mono }}
        >
          {row}
        </text>
      ))}
    </g>
  );
}

/** A labelled straight connector. `dir="both"` draws arrowheads on both ends. */
function Link({
  x1,
  y1,
  x2,
  y2,
  label,
  dir = "forward",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  dir?: "both" | "forward";
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        style={{ stroke: muted, strokeWidth: 1.5 }}
        markerEnd="url(#arrow)"
        markerStart={dir === "both" ? "url(#arrow)" : undefined}
      />
      {label ? (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 7}
          textAnchor="middle"
          style={{ fill: muted, fontSize: 10.5, fontFamily: mono }}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/**
 * An elbowed "return" connector — down/up from the source, across on a rail — so a reply edge
 * doesn't cut straight back through the boxes it takes the long way around.
 */
function ReturnRail({
  x1,
  y1,
  x2,
  y2,
  railY,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  railY: number;
  label?: string;
}) {
  const d = `M ${x1} ${y1} L ${x1} ${railY} L ${x2} ${railY} L ${x2} ${y2}`;
  return (
    <g>
      <path
        d={d}
        style={{ stroke: muted, strokeWidth: 1.5, fill: "none" }}
        strokeDasharray="4 3"
        markerEnd="url(#arrow)"
      />
      {label ? (
        <text
          x={(x1 + x2) / 2}
          y={railY - 7}
          textAnchor="middle"
          style={{ fill: muted, fontSize: 10.5, fontFamily: mono }}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** Transport/broker pill — same shape `TenancyDiagram`'s `Bus` uses. */
function Bus({
  x,
  y,
  w,
  h,
  title,
  subtitle,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={w / 2}
        style={{ fill: accentSoft, stroke: border, strokeWidth: 1 }}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - 4}
        textAnchor="middle"
        style={{ fill: ink, fontSize: 12, fontWeight: 600 }}
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 13}
        textAnchor="middle"
        style={{ fill: muted, fontSize: 10.5, fontFamily: mono }}
      >
        {subtitle}
      </text>
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX={8}
        refY={5}
        markerWidth={6}
        markerHeight={6}
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" style={{ fill: muted }} />
      </marker>
      <filter id="soft" x="-8%" y="-8%" width="116%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
      </filter>
    </defs>
  );
}

/**
 * Dispatched-turn flow: the request lands on one pod, but under `durable: true` the actual model
 * call and tool execution (`AgentRunSteps.llm` / `.tool`) run as routed steps that may land on any
 * pod running a durable worker — so tokens/tool output must come back through a cross-process sink
 * (e.g. Redis pub/sub) before the SSE connection on the original pod can forward them.
 */
function Dispatched() {
  return (
    <svg viewBox="0 0 1000 380" width="100%" role="img" aria-label="Dispatched agent turn flow">
      <title>
        A dispatched agent turn: API pod starts agent.run, AgentRunSteps.llm/.tool execute on any
        durable worker pod, and a cross-process sink carries tokens back to the SSE connection
      </title>
      <Defs />
      <Node
        x={20}
        y={140}
        w={150}
        h={100}
        title="Client"
        rows={["POST /agent/chat", "reads SSE frames"]}
      />
      <Node
        x={210}
        y={100}
        w={200}
        h={180}
        accented
        title="API pod"
        rows={["AgentController", "starts workflow agent.run", "holds the SSE connection", "subscribes to the sink"]}
      />
      <Bus x={450} y={150} w={90} h={90} title="Transport" subtitle="durable queue" />
      <Node
        x={580}
        y={40}
        w={210}
        h={100}
        title="AgentRunSteps.llm"
        rows={["ctx.step — model call", "ANY pod running a", "durable worker"]}
      />
      <Node
        x={580}
        y={240}
        w={210}
        h={100}
        title="AgentRunSteps.tool"
        rows={["ctx.step — tool exec", "ANY pod running a", "durable worker"]}
      />
      <Bus x={830} y={140} w={150} h={100} title="Token sink" subtitle="Redis pub/sub" />
      <Link x1={170} y1={190} x2={210} y2={190} label="HTTP + SSE" dir="both" />
      <Link x1={410} y1={190} x2={450} y2={190} label="start agent.run" />
      <Link x1={540} y1={175} x2={580} y2={100} label="dispatch" />
      <Link x1={540} y1={215} x2={580} y2={280} label="dispatch" />
      <Link x1={790} y1={100} x2={830} y2={170} label="tokens" />
      <Link x1={790} y1={280} x2={830} y2={210} label="tool result" />
      <ReturnRail x1={905} y1={140} x2={310} y2={100} railY={20} label="subscribe (cross-process)" />
    </svg>
  );
}

/**
 * HITL signal flow: a suspended tool call is resolved from either of two callers — the thread's
 * own actor in the chat UI (ownership-checked), or an operator in the dashboard's approvals inbox
 * via `AGENT_APPROVAL_PORT` (console-guarded, not re-authorized against the thread). Both paths
 * converge on the same signal (`AgentService.signalToolCall` → `AgentRunner.signal`), which resolves
 * either an in-process pending-promise or a durable signal `tool:<runId>:<callId>` depending on how
 * the host configured `AgentModule`.
 */
function Hitl() {
  return (
    <svg viewBox="0 0 820 340" width="100%" role="img" aria-label="Human-in-the-loop signal flow">
      <title>
        Two decision sources — chat UI and the dashboard's approvals inbox — converge on the same
        signal that resumes a suspended tool call
      </title>
      <Defs />
      <Node
        x={24}
        y={20}
        w={240}
        h={110}
        title="Chat UI"
        rows={["thread's own actor", "approve / reject", "ownership-checked"]}
      />
      <Node
        x={24}
        y={200}
        w={240}
        h={110}
        title="Dashboard inbox"
        rows={["AGENT_APPROVAL_PORT", "opts.executedByRef", "console-guarded"]}
      />
      <Bus x={340} y={100} w={110} h={140} title="Signal" subtitle="tool:<runId>:<callId>" />
      <Node
        x={530}
        y={100}
        w={260}
        h={140}
        accented
        title="Turn resumes"
        rows={[
          "AgentRunner.signal",
          "decider = executedByRef",
          "?? input.actor.id",
          "tool executes, loop continues",
        ]}
      />
      <Link x1={264} y1={75} x2={340} y2={140} label="signalToolCall" />
      <Link x1={264} y1={255} x2={340} y2={210} label="signalToolCall" />
      <Link x1={450} y1={170} x2={530} y2={170} label="AgentRunner.signal" />
    </svg>
  );
}

const VARIANTS: Record<Variant, () => React.JSX.Element> = {
  dispatched: Dispatched,
  hitl: Hitl,
};

/**
 * Agent architecture diagrams. `variant` selects which flow to draw; `caption` is an optional
 * figcaption. Theme-aware (light/dark, per-site primary) via Fumadocs' CSS variables.
 */
export function AgentFlow({
  variant,
  caption,
}: {
  variant: Variant;
  caption?: string;
}) {
  const Shape = VARIANTS[variant];
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card p-4">
      <Shape />
      {caption ? (
        <figcaption className="mt-2 border-t border-fd-border px-1 pt-2 text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
