import { Diagram, type DiagramEdge, type DiagramNode, type DiagramTheme } from "./Diagram";

export type DiagramName = "reminders" | "nudge" | "sitemap";

/* Column and row positions shared by the two flow charts: four columns, and rows 120 apart. */
const C = [0, 210, 420, 630];
const R = [0, 120, 240, 360, 480, 600];

/** User flow 1: setting up habit stacking with reminders. Teal. */
const REMINDERS_THEME: DiagramTheme = { line: "#2c6e67", step: "#d9eeea", accent: "#2c6e67", end: "#f6e6cb", chip: "#fffdf7" };

const reminderNodes: DiagramNode[] = [
  { id: "s", x: C[0], y: R[0], kind: "end", lines: ["Open the", "Exercise tab"] },
  { id: "a", x: C[1], y: R[0], lines: ["Show weekly exercises", "and progress"] },
  { id: "d1", x: C[2], y: R[0], kind: "decision", lines: ["Reminder already", "set up?"] },
  { id: "b", x: C[3], y: R[0], lines: ["Show reminder", "details"] },
  { id: "n", x: C[1], y: R[1], lines: ["Show “Add a", "Reminder” banner"] },
  { id: "e1", x: C[2], y: R[1], kind: "tag", lines: ["Back to the", "exercise list"] },
  { id: "d2", x: C[3], y: R[1], kind: "decision", lines: ["Stack another", "habit?"] },
  { id: "d3", x: C[1], y: R[2], kind: "decision", lines: ["Want a", "notification?"] },
  { id: "c", x: C[3], y: R[2], lines: ["Select exercises"] },
  { id: "p", x: C[3], y: R[3], lines: ["Pick a start date"] },
  { id: "d4", x: C[2], y: R[3], kind: "decision", lines: ["Location-based?"] },
  { id: "l1", x: C[1], y: R[3], lines: ["Enable location", "sharing"] },
  { id: "l2", x: C[1], y: R[4], lines: ["Pick a location"] },
  { id: "t", x: C[2], y: R[4], lines: ["Pick a time"] },
  { id: "x", x: C[1], y: R[5], lines: ["Add optional early", "reminder or repeat"] },
  { id: "z", x: C[0], y: R[5], kind: "end", lines: ["Save and add"] },
];

const reminderEdges: DiagramEdge[] = [
  { from: "s.r", to: "a.l" },
  { from: "a.r", to: "d1.l" },
  { from: "d1.r", to: "b.l", label: "Yes", at: [C[2] + 170 + 20, R[0] + 6] },
  { from: "b.b", to: "d2.t" },
  { from: "d1.b", to: "n.t", via: [[C[2] + 85, 92], [C[1] + 85, 92]], label: "No", at: [C[2] + 85, 78] },
  { from: "d2.l", to: "e1.r", label: "No", at: [C[2] + 170 + 20, R[1] + 6] },
  { from: "d2.b", to: "c.t", label: "Yes" },
  { from: "n.b", to: "d3.t" },
  { from: "d3.r", to: "c.l", label: "Yes", at: [C[2] + 85, R[2] + 32] },
  { from: "c.b", to: "p.t" },
  { from: "p.l", to: "d4.r" },
  { from: "d4.l", to: "l1.r", label: "Yes", at: [C[1] + 170 + 20, R[3] + 6] },
  { from: "d4.b", to: "t.t", label: "No" },
  { from: "l1.b", to: "l2.t" },
  { from: "l2.b", to: "x.t" },
  { from: "t.b", to: "x.r", via: [[C[2] + 85, R[5] + 32]] },
  { from: "x.l", to: "z.r" },
];

/** User flow 2: planning exercises through a buddy's nudge. Coral. */
const NUDGE_THEME: DiagramTheme = { line: "#c4574b", step: "#fbe0db", accent: "#c4574b", end: "#f6e6cb", chip: "#fffdf7" };
const NR = [0, 130, 260, 390];
const nz = (row: number, h: number) => NR[row] + (80 - h) / 2;

const nudgeNodes: DiagramNode[] = [
  { id: "s", x: C[0], y: nz(0, 64), kind: "end", lines: ["Buddy sends a", "nudge in the app"] },
  { id: "d1", x: C[1], y: nz(0, 64), kind: "decision", lines: ["Want to do today’s", "exercise?"] },
  { id: "n1", x: C[2], y: nz(0, 80), h: 80, lines: ["Long-press to mark", "complete or snooze", "(15, 30 or 60 min)"] },
  { id: "d2", x: C[2], y: nz(1, 64), kind: "decision", lines: ["Snoozed?"] },
  { id: "yn", x: C[3], y: nz(1, 64), kind: "end", lines: ["Notified at the", "chosen time"] },
  { id: "m", x: C[2], y: nz(2, 64), kind: "end", lines: ["Exercise marked", "complete"] },
  { id: "q1", x: C[1], y: nz(1, 64), lines: ["Autoplay a new session,", "open the first exercise"] },
  { id: "q2", x: C[1], y: nz(2, 64), lines: ["Complete the exercise", "and session"] },
  { id: "q3", x: C[1], y: nz(3, 64), lines: ["Show session", "summary"] },
  { id: "q4", x: C[2], y: nz(3, 64), lines: ["Open the", "Community page"] },
  { id: "q5", x: C[3], y: nz(3, 80), h: 80, kind: "end", lines: ["Progress bar grows on", "the Daily Buddy", "Challenge widget"] },
];

const nudgeEdges: DiagramEdge[] = [
  { from: "s.r", to: "d1.l" },
  { from: "d1.r", to: "n1.l", label: "No", at: [C[1] + 170 + 20, nz(0, 64) - 2] },
  { from: "d1.b", to: "q1.t", label: "Yes" },
  { from: "n1.b", to: "d2.t" },
  { from: "d2.r", to: "yn.l", label: "Yes", at: [C[2] + 170 + 20, nz(1, 64) - 2] },
  { from: "d2.b", to: "m.t", label: "No" },
  { from: "q1.b", to: "q2.t" },
  { from: "q2.b", to: "q3.t" },
  { from: "q3.r", to: "q4.l" },
  { from: "q4.r", to: "q5.l" },
];

/** Information architecture. Keeps the original branch colors: violet Home, blue Exercises, coral Community, gray Profile. */
const SITE_THEME: DiagramTheme = { line: "#5b5bd6", step: "#dedcf8", accent: "#5b5bd6", end: "#f6e6cb", chip: "#fffdf7" };
const EX = { stroke: "#4f97d4", fill: "#d6e9f8" };
const CM = { stroke: "#d4694a", fill: "#f8dcd2" };
const PR = { stroke: "#85827b", fill: "#e2e0da" };
const X = [0, 205, 410, 615, 820];
const SR = [224, 288, 352, 416, 480, 544, 608, 672];

const siteNodes: DiagramNode[] = [
  { id: "ob", x: X[0], y: 0, kind: "page", stroke: "#6f6f6f", lines: ["Onboarding"] },
  { id: "hm", x: X[2], y: 0, kind: "tab", lines: ["Home"] },
  { id: "wg", x: X[3], y: 0, kind: "note", align: "left", stroke: "#5b5bd6", lines: ["On Home", "Alert: new cards imported", "Button: start today’s session", "Widgets: nudge buddy, streak, goal progress"], h: 100 },
  // Exercises
  { id: "ex", x: X[1], y: 150, kind: "tab", fill: EX.fill, stroke: EX.stroke, lines: ["Exercises"] },
  { id: "nc", x: X[0], y: SR[0], kind: "component", stroke: EX.stroke, lines: ["New cards (modal)"] },
  { id: "ns", x: X[0], y: SR[1], kind: "page", stroke: EX.stroke, lines: ["New session"] },
  { id: "ee", x: X[0], y: SR[2], kind: "page", stroke: EX.stroke, lines: ["Exercise"] },
  { id: "ec", x: X[0], y: SR[3], kind: "page", stroke: EX.stroke, lines: ["Exercise complete"] },
  { id: "ss", x: X[0], y: SR[4], kind: "page", stroke: EX.stroke, lines: ["Session summary"] },
  { id: "nw", x: X[1], y: SR[0], kind: "page", stroke: EX.stroke, lines: ["Newest week"] },
  { id: "pw", x: X[1], y: SR[1], kind: "page", stroke: EX.stroke, lines: ["Past week"] },
  { id: "ls", x: X[1], y: SR[2], kind: "page", stroke: EX.stroke, lines: ["List of sessions"] },
  { id: "rm", x: X[2], y: SR[0], kind: "page", stroke: EX.stroke, lines: ["Reminders"] },
  { id: "ar", x: X[2], y: SR[1], kind: "component", stroke: EX.stroke, lines: ["Add reminder"] },
  { id: "se", x: X[2], y: SR[2], kind: "page", stroke: EX.stroke, lines: ["Select exercises"] },
  { id: "sd", x: X[2], y: SR[3], kind: "page", stroke: EX.stroke, lines: ["Select details"] },
  // Community
  { id: "cm", x: X[3], y: 150, kind: "tab", fill: CM.fill, stroke: CM.stroke, lines: ["Community"] },
  { id: "jg", x: X[3], y: SR[0], kind: "page", stroke: CM.stroke, lines: ["Join group"] },
  { id: "ch", x: X[3], y: SR[1], kind: "page", stroke: CM.stroke, lines: ["Challenges"] },
  { id: "db", x: X[3] + 26, y: SR[2], w: 154, kind: "page", stroke: CM.stroke, lines: ["Daily Buddy Challenge"] },
  { id: "bl", x: X[3] + 26, y: SR[3], w: 154, kind: "page", stroke: CM.stroke, lines: ["Buddy leaderboard"] },
  { id: "fd", x: X[3], y: SR[4], kind: "page", stroke: CM.stroke, lines: ["Feed"] },
  { id: "ug", x: X[3] + 26, y: SR[5], w: 154, kind: "page", stroke: CM.stroke, lines: ["User goal"] },
  { id: "fg", x: X[3] + 26, y: SR[6], w: 154, kind: "page", stroke: CM.stroke, lines: ["Friend’s goals"] },
  { id: "gf", x: X[3] + 26, y: SR[7], w: 154, kind: "page", stroke: CM.stroke, lines: ["Group feed"] },
  // Profile
  { id: "pr", x: X[4], y: 150, kind: "tab", fill: PR.fill, stroke: PR.stroke, lines: ["User profile"] },
  { id: "ps", x: X[4], y: SR[0], kind: "page", stroke: PR.stroke, lines: ["Profile settings"] },
  { id: "nd", x: X[4] + 26, y: SR[1], w: 154, kind: "page", stroke: PR.stroke, lines: ["Name, demographics"] },
  { id: "go", x: X[4] + 26, y: SR[2], w: 154, kind: "page", stroke: PR.stroke, lines: ["Goals"] },
  { id: "gr", x: X[4] + 26, y: SR[3], w: 154, kind: "page", stroke: PR.stroke, lines: ["General reminders"] },
];

/** The y of the middle of a site-map row. */
const mid = (row: number) => SR[row] + 22;

const siteEdges: DiagramEdge[] = [
  { from: "ob.r", to: "hm.l" },
  { from: "hm.r", to: "wg.l", dashed: true },
  { from: "hm.b", to: "ex.t", via: [[X[2] + 90, 125], [X[1] + 90, 125]], color: EX.stroke },
  { from: "hm.b", to: "cm.t", via: [[X[2] + 90, 125], [X[3] + 90, 125]], color: CM.stroke },
  { from: "hm.b", to: "pr.t", via: [[X[2] + 90, 125], [X[4] + 90, 125]], color: PR.stroke },
  // Exercises
  { from: "ex.b", to: "nc.t", via: [[X[1] + 90, 209], [X[0] + 90, 209]], color: EX.stroke },
  { from: "ex.b", to: "nw.t", color: EX.stroke },
  { from: "ex.b", to: "rm.t", via: [[X[1] + 90, 209], [X[2] + 90, 209]], color: EX.stroke },
  { from: "ex.b", to: "pw.l", via: [[X[1] + 90, 209], [X[1] - 14, 209], [X[1] - 14, mid(1)]], color: EX.stroke },
  { from: "nc.b", to: "ns.t", color: EX.stroke },
  { from: "ns.b", to: "ee.t", color: EX.stroke },
  { from: "ee.b", to: "ec.t", color: EX.stroke },
  { from: "ec.b", to: "ss.t", color: EX.stroke },
  { from: "pw.b", to: "ls.t", color: EX.stroke },
  { from: "rm.b", to: "ar.t", dashed: true, color: EX.stroke },
  { from: "ar.b", to: "se.t", dashed: true, color: EX.stroke },
  { from: "se.b", to: "sd.t", color: EX.stroke },
  // Community
  { from: "cm.b", to: "jg.t", color: CM.stroke },
  { from: "cm.b", to: "ch.l", via: [[X[3] + 90, 209], [X[3] - 14, 209], [X[3] - 14, mid(1)]], color: CM.stroke },
  { from: "cm.b", to: "fd.l", via: [[X[3] + 90, 209], [X[3] - 14, 209], [X[3] - 14, mid(4)]], color: CM.stroke },
  { from: "ch.b", to: "db.t", color: CM.stroke },
  { from: "ch.b", to: "bl.l", via: [[X[3] + 90, 342], [X[3] + 12, 342], [X[3] + 12, mid(3)]], color: CM.stroke },
  { from: "fd.b", to: "ug.t", color: CM.stroke },
  { from: "fd.b", to: "fg.l", via: [[X[3] + 90, 534], [X[3] + 12, 534], [X[3] + 12, mid(6)]], color: CM.stroke },
  { from: "fd.b", to: "gf.l", via: [[X[3] + 90, 534], [X[3] + 12, 534], [X[3] + 12, mid(7)]], color: CM.stroke },
  // Profile
  { from: "pr.b", to: "ps.t", color: PR.stroke },
  { from: "ps.b", to: "nd.t", color: PR.stroke },
  { from: "ps.b", to: "go.l", via: [[X[4] + 90, 278], [X[4] + 12, 278], [X[4] + 12, mid(2)]], color: PR.stroke },
  { from: "ps.b", to: "gr.l", via: [[X[4] + 90, 278], [X[4] + 12, 278], [X[4] + 12, mid(3)]], color: PR.stroke },
];

function Key() {
  const y = 722;
  const font = { fontFamily: "var(--font-body), system-ui, sans-serif" };
  const items: { x: number; node: React.ReactNode; text: string }[] = [
    { x: 0, node: <rect x={0} y={y} width={30} height={18} rx={5} fill="#dedcf8" stroke="#5b5bd6" strokeWidth={1.75} />, text: "Main tab" },
    { x: 130, node: <rect x={130} y={y} width={30} height={18} rx={5} fill="#fffdf7" stroke="#5b5bd6" strokeWidth={1.75} />, text: "Page" },
    { x: 230, node: <rect x={230} y={y} width={30} height={18} rx={5} fill="none" stroke="#5b5bd6" strokeWidth={1.75} strokeDasharray="5 4" />, text: "Component on a page" },
  ];
  return (
    <g>
      <text x={0} y={y - 14} fontSize={14} fontWeight={700} fill="#1c2927" style={font}>
        Key
      </text>
      {items.map((it) => (
        <g key={it.text}>
          {it.node}
          <text x={it.x + 38} y={y + 9} dy="0.35em" fontSize={14} fill="#1c2927" style={font}>
            {it.text}
          </text>
        </g>
      ))}
    </g>
  );
}

export function DiagramByName({ name, label }: { name: DiagramName; label: string }) {
  if (name === "reminders") {
    return <Diagram id="d-reminders" width={800} height={664} theme={REMINDERS_THEME} nodes={reminderNodes} edges={reminderEdges} label={label} />;
  }
  if (name === "nudge") {
    return <Diagram id="d-nudge" width={800} height={470} theme={NUDGE_THEME} nodes={nudgeNodes} edges={nudgeEdges} label={label} />;
  }
  return (
    <Diagram id="d-site" width={1000} height={752} theme={SITE_THEME} nodes={siteNodes} edges={siteEdges} label={label}>
      <Key />
    </Diagram>
  );
}
