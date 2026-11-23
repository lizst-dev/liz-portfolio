import type { CSSProperties, ReactNode } from "react";

/**
 * A small diagram renderer for the case-study flow charts and the site map. Everything is plain SVG that uses the page's own
 * fonts and colors, so the diagrams match the rest of the page (rounded boxes, a dark outline, a hard plum shadow), stay sharp
 * at any size, and are text a reader can select. Nodes are placed by hand; edges are lines with optional waypoints.
 */

export type NodeKind = "step" | "decision" | "end" | "tag" | "page" | "tab" | "component" | "note";

export type DiagramNode = {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  lines: string[];
  kind?: NodeKind;
  /** Overrides for one node (a branch color in the site map). */
  fill?: string;
  stroke?: string;
  /** Left-aligned text whose first line is bold (for the "on Home" note). */
  align?: "left";
};

export type DiagramEdge = {
  /** "node.side", where side is l, r, t or b. */
  from: string;
  to: string;
  /** Waypoints between the two ends, in diagram coordinates. */
  via?: [number, number][];
  label?: string;
  /** Label position; defaults to the middle of the first segment. */
  at?: [number, number];
  dashed?: boolean;
  color?: string;
};

export type DiagramTheme = {
  /** Lines, arrowheads and outlines of the main boxes. */
  line: string;
  /** Fill of ordinary steps. */
  step: string;
  /** Fill of decisions (solid, with light text). */
  accent: string;
  /** Fill of start and end points. */
  end: string;
  /** Fill of the Yes and No chips. */
  chip: string;
};

const INK = "#1c2927";
const PLUM = "#4a3358";
const PAPER = "#fffdf7";

const SIZE: Record<NodeKind, { w: number; h: number }> = {
  step: { w: 170, h: 64 },
  decision: { w: 170, h: 64 },
  end: { w: 170, h: 64 },
  tag: { w: 170, h: 64 },
  page: { w: 180, h: 44 },
  tab: { w: 180, h: 44 },
  component: { w: 180, h: 44 },
  note: { w: 385, h: 100 },
};

function anchor(n: Required<Pick<DiagramNode, "x" | "y" | "w" | "h">>, side: string): [number, number] {
  if (side === "l") return [n.x, n.y + n.h / 2];
  if (side === "r") return [n.x + n.w, n.y + n.h / 2];
  if (side === "t") return [n.x + n.w / 2, n.y];
  return [n.x + n.w / 2, n.y + n.h];
}

/** A polyline with softly rounded corners. */
function roundedPath(pts: [number, number][], r = 12) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py);
    const l2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * rr;
    const ay = cy - ((cy - py) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr;
    const by = cy + ((ny - cy) / l2) * rr;
    d += ` L${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last[0]} ${last[1]}`;
}

export function Diagram({
  id,
  width,
  height,
  theme,
  nodes,
  edges,
  label,
  children,
}: {
  id: string;
  width: number;
  height: number;
  theme: DiagramTheme;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** Accessible description. */
  label: string;
  /** Extra SVG drawn on top (a key). */
  children?: ReactNode;
}) {
  const pad = 6;
  const sized = new Map(
    nodes.map((n) => {
      const kind = n.kind ?? "step";
      return [n.id, { ...n, kind, w: n.w ?? SIZE[kind].w, h: n.h ?? SIZE[kind].h }] as const;
    }),
  );
  const font: CSSProperties = { fontFamily: "var(--font-body), system-ui, sans-serif" };

  const edgeEls = edges.map((e, i) => {
    const [fa, fs] = e.from.split(".");
    const [ta, ts] = e.to.split(".");
    const a = sized.get(fa)!;
    const b = sized.get(ta)!;
    const pts: [number, number][] = [anchor(a, fs), ...(e.via ?? []), anchor(b, ts)];
    const color = e.color ?? theme.line;
    const seg: [[number, number], [number, number]] = [pts[0], pts[1]];
    const at = e.at ?? ([(seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2] as [number, number]);
    return (
      <g key={i}>
        <path
          d={roundedPath(pts)}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={e.dashed ? "6 5" : undefined}
          markerEnd={`url(#${id}-arrow-${color.replace("#", "")})`}
        />
        {e.label && (
          <g transform={`translate(${at[0]} ${at[1]})`}>
            <rect x={-19} y={-11} width={38} height={22} rx={11} fill={theme.chip} stroke={color} strokeWidth={1.5} />
            <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight={700} fill={INK} style={font}>
              {e.label}
            </text>
          </g>
        )}
      </g>
    );
  });

  const colors = Array.from(new Set(["#" + theme.line.replace("#", ""), ...edges.map((e) => e.color).filter(Boolean)] as string[]));

  const nodeEls = Array.from(sized.values()).map((n) => {
    const { x, y, w, h, kind } = n;
    const pill = kind === "decision" || kind === "end";
    const rx = pill ? h / 2 : kind === "note" ? 12 : 10;
    let fill = PAPER;
    let stroke = n.stroke ?? theme.line;
    let text = INK;
    let weight = 500;
    let dash: string | undefined;
    let shadow = true;
    if (kind === "step") fill = theme.step;
    if (kind === "decision") {
      fill = theme.accent;
      text = "#fff9ee";
      weight = 600;
      stroke = INK;
    }
    if (kind === "end") fill = theme.end;
    if (kind === "tag") {
      fill = "transparent";
      dash = "5 5";
      shadow = false;
    }
    if (kind === "page") {
      fill = n.fill ?? PAPER;
      shadow = false;
    }
    if (kind === "tab") {
      fill = n.fill ?? theme.step;
      weight = 700;
    }
    if (kind === "component") {
      fill = "transparent";
      dash = "6 5";
      shadow = false;
    }
    if (kind === "note") {
      fill = "transparent";
      dash = "6 5";
      shadow = false;
    }
    if (n.fill && kind !== "page" && kind !== "tab") fill = n.fill;
    const left = n.align === "left";
    const lineH = 19;
    const startY = y + h / 2 - ((n.lines.length - 1) * lineH) / 2;
    return (
      <g key={n.id}>
        {shadow && <rect x={x + 3} y={y + 3} width={w} height={h} rx={rx} fill={PLUM} />}
        <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={1.75} strokeDasharray={dash} />
        {n.lines.map((ln, i) => (
          <text
            key={i}
            x={left ? x + 16 : x + w / 2}
            y={left ? y + 24 + i * lineH : startY + i * lineH}
            textAnchor={left ? "start" : "middle"}
            dy={left ? 0 : "0.35em"}
            fontSize={left ? 14 : 15}
            fontWeight={left && i === 0 ? 700 : weight}
            fill={text}
            style={font}
          >
            {ln}
          </text>
        ))}
      </g>
    );
  });

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
      className="block h-auto w-full"
    >
      <title>{label}</title>
      <defs>
        {colors.map((c) => (
          <marker
            key={c}
            id={`${id}-arrow-${c.replace("#", "")}`}
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={9}
            markerHeight={9}
            orient="auto-start-reverse"
          >
            <path d="M1.5 1.5 L8 5 L1.5 8.5" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        ))}
      </defs>
      {edgeEls}
      {nodeEls}
      {children}
    </svg>
  );
}
