"use client";

// Interactive "model → tools → model" illustration for the agent docs. Hand-authored SVG, no
// animation deps — plain React state + CSS transitions. One MODEL node calls the tools lane and the
// results feed back for the next step; play/step/scrub walks the loop beat by beat until the model
// returns zero tool calls and the turn ends. A segmented control switches between a read-only turn
// and one that also asks for an `action` tool (which suspends for human approval).
//
// Degrades without JS: SSR renders the fully-resolved final frame (a readable static diagram).
// Theme-aware via Fumadocs' `--color-fd-*` variables; respects `prefers-reduced-motion`.

import { useEffect, useMemo, useRef, useState } from "react";

const ink = "var(--color-fd-foreground)";
const muted = "var(--color-fd-muted-foreground)";
const border = "var(--color-fd-border)";
const accent = "var(--color-fd-primary)";
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const AMBER = "#f5a623";

const tintAccent =
  "color-mix(in srgb, var(--color-fd-primary) 14%, var(--color-fd-card))";
const tintAccentSoft =
  "color-mix(in srgb, var(--color-fd-primary) 7%, var(--color-fd-card))";
const neutral =
  "color-mix(in srgb, var(--color-fd-foreground) 4%, var(--color-fd-card))";
const tintAmber = "color-mix(in srgb, #f5a623 15%, var(--color-fd-card))";

type Mode = "mixed" | "read";

type Beat =
  | { kind: "model"; step: number }
  | { kind: "emit"; step: number }
  | { kind: "usage"; step: number }
  | { kind: "read"; step: number }
  | { kind: "suspend"; step: number }
  | { kind: "action"; step: number }
  | { kind: "feedback"; step: number }
  | { kind: "done"; step: number };

function buildBeats(mode: Mode): Beat[] {
  const b: Beat[] = [
    { kind: "model", step: 0 },
    { kind: "emit", step: 0 },
    { kind: "usage", step: 0 },
    { kind: "read", step: 0 },
  ];
  if (mode === "mixed") {
    b.push({ kind: "suspend", step: 0 }, { kind: "action", step: 0 });
  }
  b.push(
    { kind: "feedback", step: 1 },
    { kind: "model", step: 1 },
    { kind: "usage", step: 1 },
    { kind: "done", step: 1 },
  );
  return b;
}

function caption(beat: Beat | undefined, mode: Mode): string {
  if (!beat) return "Ready — press play or step through one turn of the loop.";
  switch (beat.kind) {
    case "model":
      return beat.step === 0
        ? "step 0 — the model is called with the system prompt, the thread's messages, and the tools this actor may see. One ModelProvider.runTurn call."
        : "step 1 — the model is called again, now seeing every tool result from step 0.";
    case "emit":
      return mode === "mixed"
        ? "The model returns two tool calls: a read and an action."
        : "The model returns one tool call: a read.";
    case "usage":
      return "A usage row is appended — unconditionally, whether or not the model asked for a tool.";
    case "read":
      return "A read tool is safe, so it auto-executes and its result is captured.";
    case "suspend":
      return "An action tool never auto-executes: the run suspends for a human approve/reject.";
    case "action":
      return "Approved — the action tool executes. Its result joins the read's.";
    case "feedback":
      return "Every tool result is fed back as the next step's input.";
    case "done":
      return "The model returns zero tool calls → the loop breaks. The turn is done.";
  }
}

// Geometry (viewBox 0 0 760 360).
const MODEL = { cx: 380, y: 54, w: 260, h: 66 };
const READ = { cx: 258, y: 196, w: 200, h: 66 };
const ACTION = { cx: 502, y: 196, w: 200, h: 66 };
const LEDGER_Y = 312;

type Tip = { ax: number; ay: number; title: string; body: string } | null;

/** A presentational rounded node. The parent computes the whole look per frame. */
function Node({
  cx,
  y,
  w,
  h,
  fill,
  stroke,
  dashed,
  opacity,
  glyph,
  glyphFill,
  title,
  titleFill,
  sub,
  tip,
  onTip,
}: {
  cx: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
  dashed?: boolean;
  opacity: number;
  glyph: string;
  glyphFill: string;
  title: string;
  titleFill: string;
  sub: string;
  tip: { title: string; body: string };
  onTip: (t: Tip) => void;
}) {
  const x = cx - w / 2;
  const enter = () =>
    onTip({ ax: cx, ay: y, title: tip.title, body: tip.body });
  const leave = () => onTip(null);
  return (
    <g
      className="al-anim"
      style={{ opacity, cursor: "help" }}
      tabIndex={0}
      role="img"
      aria-label={`${tip.title}. ${tip.body}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        className="al-anim"
        style={{
          fill,
          stroke,
          strokeWidth: 1.25,
          strokeDasharray: dashed ? "5 4" : undefined,
        }}
        filter="url(#al-soft)"
      />
      <text x={x + 16} y={y + 25} style={{ fill: glyphFill, fontSize: 14 }}>
        {glyph}
      </text>
      <text
        x={cx + 8}
        y={y + h / 2 - 1}
        textAnchor="middle"
        className="al-anim"
        style={{ fill: titleFill, fontSize: 14, fontWeight: 600 }}
      >
        {title}
      </text>
      <text
        x={cx + 8}
        y={y + h / 2 + 17}
        textAnchor="middle"
        style={{ fill: muted, fontSize: 10.5, fontFamily: mono }}
      >
        {sub}
      </text>
    </g>
  );
}

/** A vertical connector between the model and a tool, with an optional flowing dash. */
function Link({
  x1,
  y1,
  x2,
  y2,
  shown,
  flow,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  shown: boolean;
  flow: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={`al-anim${flow ? " al-flow" : ""}`}
      markerEnd={`url(#al-arrow${shown ? "-on" : ""})`}
      style={{
        stroke: shown ? accent : muted,
        strokeWidth: 1.75,
        opacity: shown ? 1 : 0.4,
      }}
    />
  );
}

export function AgentLoop() {
  const [mode, setMode] = useState<Mode>("mixed");
  const beats = useMemo(() => buildBeats(mode), [mode]);
  // Start fully resolved so SSR / no-JS shows the whole turn; Reset/Play replays from the top.
  const [t, setT] = useState(99);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [tip, setTip] = useState<{
    left: number;
    top: number;
    title: string;
    body: string;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const tc = Math.min(t, beats.length);
  const current = tc > 0 ? beats[tc - 1] : undefined;
  const applied = beats.slice(0, tc);
  const has = (pred: (b: Beat) => boolean) => applied.some(pred);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (tc >= beats.length) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(
      () => setT((v) => Math.min(beats.length, v + 1)),
      reduced ? 340 : 950,
    );
    return () => clearTimeout(id);
  }, [playing, tc, beats.length, reduced]);

  function switchMode(next: Mode) {
    setMode(next);
    setT(99);
    setPlaying(false);
  }

  function onTip(raw: Tip) {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!raw || !svg || !wrap) return setTip(null);
    const s = svg.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    setTip({
      left: (raw.ax / 760) * s.width + (s.left - w.left),
      top: (raw.ay / 360) * s.height + (s.top - w.top),
      title: raw.title,
      body: raw.body,
    });
  }

  // Derived state for the current frame.
  const modelStep = has((b) => b.kind === "model" && b.step === 1) ? 1 : 0;
  const emitted = has((b) => b.kind === "emit");
  const readDone = has((b) => b.kind === "read");
  const suspended =
    has((b) => b.kind === "suspend") && !has((b) => b.kind === "action");
  const actionDone = has((b) => b.kind === "action");
  const fedBack = has((b) => b.kind === "feedback");
  const usageCount = applied.filter((b) => b.kind === "usage").length;
  const done = has((b) => b.kind === "done");
  const modelActive = current?.kind === "model" || current?.kind === "done";

  const btn = {
    font: "inherit",
    fontSize: 13,
    lineHeight: 1,
    color: "var(--color-fd-foreground)",
    background: "transparent",
    border: "none",
    borderRadius: 7,
    padding: "7px 10px",
    cursor: "pointer",
  } as const;
  const group = {
    display: "inline-flex",
    alignItems: "center",
    gap: 2,
    background: "var(--color-fd-card)",
    border: "1px solid var(--color-fd-border)",
    borderRadius: 9,
    padding: 2,
  } as const;

  return (
    <figure
      className="my-6 rounded-2xl border border-fd-border p-3 sm:p-4"
      style={{ background: tintAccentSoft }}
    >
      <style>{`
        .al-anim { transition: opacity .4s ease, fill .4s ease, stroke .4s ease; }
        .al-ping { animation: al-ping 1.1s ease-out forwards; }
        @keyframes al-ping { 0% { opacity: .55 } 70%, 100% { opacity: 0 } }
        .al-flow { stroke-dasharray: 5 4; animation: al-flow .6s linear infinite; }
        @keyframes al-flow { to { stroke-dashoffset: -18 } }
        .al-seg { font: inherit; font-size: 12px; color: var(--color-fd-muted-foreground); background: transparent; border: none; border-radius: 6px; padding: 5px 9px; cursor: pointer; }
        .al-seg[data-on="true"] { color: var(--color-fd-primary-foreground); background: var(--color-fd-primary); }
        @media (prefers-reduced-motion: reduce) { .al-anim { transition: none } .al-ping, .al-flow { animation: none } .al-ping { opacity: 0 } }
      `}</style>

      <div ref={wrapRef} style={{ position: "relative" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 760 360"
          width="100%"
          role="img"
          aria-label="Interactive agent loop: the model is called, resolves its tool calls, and is called again until it returns no tools and the turn ends"
        >
          <title>
            Each pass through the loop is one step: the model is called, a usage
            row is appended, any requested tools are resolved by kind (read
            tools auto-execute, action tools suspend for approval), and the
            results are fed back to the model. When the model returns no tool
            calls, the loop breaks and the turn is done.
          </title>
          <defs>
            <marker
              id="al-arrow"
              viewBox="0 0 10 10"
              refX={8}
              refY={5}
              markerWidth={6}
              markerHeight={6}
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: muted }} />
            </marker>
            <marker
              id="al-arrow-on"
              viewBox="0 0 10 10"
              refX={8}
              refY={5}
              markerWidth={6}
              markerHeight={6}
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: accent }} />
            </marker>
            <filter id="al-soft" x="-10%" y="-10%" width="120%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Left-rail lane labels. */}
          {[
            { y: MODEL.y + MODEL.h / 2, label: "MODEL" },
            { y: READ.y + READ.h / 2, label: "TOOLS" },
            { y: LEDGER_Y + 14, label: "LEDGER" },
          ].map((lane) => (
            <text
              key={lane.label}
              x={14}
              y={lane.y + 3}
              style={{
                fill: muted,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {lane.label}
            </text>
          ))}

          {/* Loop-back: results feed the next step. Curves from the tools lane up to the model. */}
          <path
            d={`M ${ACTION.cx + ACTION.w / 2 - 8} ${READ.y} C 690 150, 690 96, ${MODEL.cx + MODEL.w / 2} ${MODEL.y + MODEL.h - 14}`}
            fill="none"
            className={`al-anim${current?.kind === "feedback" ? " al-flow" : ""}`}
            markerEnd={`url(#al-arrow${fedBack && !done ? "-on" : ""})`}
            style={{
              stroke: fedBack && !done ? accent : muted,
              strokeWidth: 1.75,
              opacity: fedBack && !done ? 1 : 0.35,
            }}
          />
          <text
            x={702}
            y={150}
            textAnchor="middle"
            className="al-anim"
            style={{
              fill: fedBack && !done ? accent : muted,
              fontSize: 10,
              fontFamily: mono,
              opacity: fedBack && !done ? 1 : 0.6,
            }}
          >
            results →
          </text>
          <text
            x={702}
            y={163}
            textAnchor="middle"
            style={{ fill: muted, fontSize: 10, fontFamily: mono }}
          >
            next step
          </text>

          {/* Model → tool links. */}
          <Link
            x1={MODEL.cx - 60}
            y1={MODEL.y + MODEL.h}
            x2={READ.cx}
            y2={READ.y - 2}
            shown={emitted}
            flow={current?.kind === "emit"}
          />
          {mode === "mixed" ? (
            <Link
              x1={MODEL.cx + 60}
              y1={MODEL.y + MODEL.h}
              x2={ACTION.cx}
              y2={ACTION.y - 2}
              shown={emitted}
              flow={current?.kind === "emit"}
            />
          ) : null}

          {/* Model node. */}
          <Node
            cx={MODEL.cx}
            y={MODEL.y}
            w={MODEL.w}
            h={MODEL.h}
            fill={modelActive ? tintAccent : neutral}
            stroke={modelActive ? accent : border}
            opacity={1}
            glyph={done ? "✓" : "◆"}
            glyphFill={modelActive ? accent : muted}
            title={done ? "turn done" : "model"}
            titleFill={ink}
            sub={done ? "returned no tools" : `step[${modelStep}] · runTurn`}
            onTip={onTip}
            tip={{
              title: done ? "Turn complete" : `Model · step ${modelStep}`,
              body: done
                ? "The model returned zero tool calls, so the loop breaks and the turn ends."
                : "One ModelProvider.runTurn call with the system prompt, prior messages, and the actor's allowed tools.",
            }}
          />

          {/* Ping ring when the model is the active beat. */}
          {modelActive ? (
            <rect
              key={`ping-${tc}`}
              className="al-ping"
              x={MODEL.cx - MODEL.w / 2 - 3}
              y={MODEL.y - 3}
              width={MODEL.w + 6}
              height={MODEL.h + 6}
              rx={17}
              style={{ fill: "none", stroke: accent, strokeWidth: 2 }}
            />
          ) : null}

          {/* Read tool. */}
          <Node
            cx={READ.cx}
            y={READ.y}
            w={READ.w}
            h={READ.h}
            fill={readDone ? tintAccent : neutral}
            stroke={readDone ? accent : border}
            dashed={!emitted}
            opacity={emitted ? 1 : 0.5}
            glyph={readDone ? "▸" : "○"}
            glyphFill={readDone ? accent : muted}
            title="read · getWeather"
            titleFill={readDone ? ink : muted}
            sub={readDone ? "auto-executed" : "auto-executes"}
            onTip={onTip}
            tip={{
              title: "read tool",
              body: "A read tool is side-effect-free, so the loop runs it immediately and captures the result.",
            }}
          />

          {/* Action tool (mixed mode only). */}
          {mode === "mixed" ? (
            <>
              <Node
                cx={ACTION.cx}
                y={ACTION.y}
                w={ACTION.w}
                h={ACTION.h}
                fill={suspended ? tintAmber : actionDone ? tintAccent : neutral}
                stroke={suspended ? AMBER : actionDone ? accent : border}
                dashed={!emitted}
                opacity={emitted ? 1 : 0.5}
                glyph={suspended ? "⏸" : actionDone ? "▸" : "○"}
                glyphFill={suspended ? AMBER : actionDone ? accent : muted}
                title="action · purgeCache"
                titleFill={actionDone || suspended ? ink : muted}
                sub={
                  suspended
                    ? "awaiting approval"
                    : actionDone
                      ? "approved · executed"
                      : "needs approval"
                }
                onTip={onTip}
                tip={{
                  title: "action tool",
                  body: "An action tool has side effects, so it never auto-executes — the run suspends for a human approve/reject before it runs.",
                }}
              />
              {suspended ? (
                <rect
                  key={`ping-a-${tc}`}
                  className="al-ping"
                  x={ACTION.cx - ACTION.w / 2 - 3}
                  y={ACTION.y - 3}
                  width={ACTION.w + 6}
                  height={ACTION.h + 6}
                  rx={17}
                  style={{ fill: "none", stroke: AMBER, strokeWidth: 2 }}
                />
              ) : null}
            </>
          ) : null}

          {/* Ledger tape: one usage pill per step, appended unconditionally. */}
          {[0, 1].map((i) => {
            const filled = usageCount > i;
            const cx = 232 + i * 150;
            return (
              <g
                key={`u-${i}`}
                className="al-anim"
                style={{ opacity: filled ? 1 : 0.4 }}
              >
                <rect
                  x={cx - 66}
                  y={LEDGER_Y - 15}
                  width={132}
                  height={30}
                  rx={8}
                  className="al-anim"
                  style={{
                    fill: filled ? tintAccent : neutral,
                    stroke: filled ? accent : border,
                    strokeWidth: 1.1,
                    strokeDasharray: filled ? undefined : "4 4",
                  }}
                />
                <text
                  x={cx}
                  y={LEDGER_Y + 4}
                  textAnchor="middle"
                  style={{
                    fill: filled ? ink : muted,
                    fontSize: 11,
                    fontFamily: mono,
                  }}
                >
                  {filled ? `usage · step ${i}` : "usage"}
                </text>
              </g>
            );
          })}

          {/* Done terminal. */}
          <g className="al-anim" style={{ opacity: done ? 1 : 0.4 }}>
            <rect
              x={548}
              y={LEDGER_Y - 15}
              width={150}
              height={30}
              rx={8}
              className="al-anim"
              style={{
                fill: done ? tintAccent : neutral,
                stroke: done ? accent : border,
                strokeWidth: 1.1,
                strokeDasharray: done ? undefined : "4 4",
              }}
            />
            <text
              x={623}
              y={LEDGER_Y + 4}
              textAnchor="middle"
              style={{
                fill: done ? accent : muted,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: mono,
              }}
            >
              {done ? "✓ turn done" : "turn done"}
            </text>
          </g>
        </svg>

        {tip ? (
          <div
            style={{
              position: "absolute",
              left: tip.left,
              top: tip.top,
              transform: "translate(-50%, calc(-100% - 12px))",
              width: 220,
              pointerEvents: "none",
              zIndex: 5,
              background: "var(--color-fd-card)",
              border: "1px solid var(--color-fd-border)",
              borderRadius: 10,
              padding: "8px 11px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--color-fd-foreground)",
                marginBottom: 3,
              }}
            >
              {tip.title}
            </div>
            <div
              style={{
                fontSize: 11.5,
                lineHeight: 1.4,
                color: "var(--color-fd-muted-foreground)",
              }}
            >
              {tip.body}
            </div>
          </div>
        ) : null}
      </div>

      {/* Controls. */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          marginTop: 14,
        }}
      >
        <div style={group}>
          <button
            type="button"
            style={btn}
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              if (tc >= beats.length) setT(0);
              setPlaying((p) => !p);
            }}
          >
            {playing ? "⏸" : "▶"} {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            style={btn}
            aria-label="Step forward"
            onClick={() => {
              setPlaying(false);
              setT((v) =>
                Math.min(beats.length, Math.min(v, beats.length) + 1),
              );
            }}
          >
            ⏭
          </button>
          <button
            type="button"
            style={btn}
            aria-label="Reset"
            onClick={() => {
              setPlaying(false);
              setT(0);
            }}
          >
            ⟲
          </button>
        </div>

        <input
          type="range"
          min={0}
          max={beats.length}
          value={tc}
          aria-label="Scrub the loop"
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value));
          }}
          style={{
            flex: "1 1 120px",
            minWidth: 110,
            accentColor: "var(--color-fd-primary)",
          }}
        />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 11.5,
              color: "var(--color-fd-muted-foreground)",
            }}
          >
            Tools
          </span>
          <div style={group}>
            <button
              type="button"
              className="al-seg"
              data-on={mode === "mixed"}
              aria-pressed={mode === "mixed"}
              onClick={() => switchMode("mixed")}
            >
              read + action
            </button>
            <button
              type="button"
              className="al-seg"
              data-on={mode === "read"}
              aria-pressed={mode === "read"}
              onClick={() => switchMode("read")}
            >
              read only
            </button>
          </div>
        </div>
      </div>

      <figcaption
        className="mt-3 border-t border-fd-border px-1 pt-2.5 text-xs text-fd-muted-foreground"
        aria-live="polite"
        style={{ minHeight: 32 }}
      >
        {caption(current, mode)}
      </figcaption>
    </figure>
  );
}
