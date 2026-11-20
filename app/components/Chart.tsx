import type { ChartData, ChartItem } from "../data/projects";
import { glass } from "./ui";
import { ChartCarousel } from "./ChartCarousel";

/** Slice and bar fills, in order: the site palette (teal, coral, periwinkle, sand), with coral as the accent. */
const FILLS = ["var(--chart-1, var(--color-teal))", "var(--chart-accent, var(--color-coral))", "var(--chart-3, #8b93e0)", "var(--chart-4, var(--color-line))", "var(--chart-5, var(--color-teal-deep))"];

function fillFor(item: ChartItem, i: number) {
  if (item.accent) return "var(--chart-accent, var(--color-coral))";
  return FILLS[i % FILLS.length];
}

function label(item: ChartItem, c: ChartData) {
  if (c.percent === false || !c.total) return `${item.value}`;
  return `${item.value} (${Math.round((item.value / c.total) * 1000) / 10}%)`;
}

function Columns({ c }: { c: ChartData }) {
  const max = Math.max(...c.items.map((i) => i.value), 1);
  const plot = 100;
  const compact = c.items.length > 6;
  return (
    <div className="flex items-end gap-2 border-b-2 border-deep/70 sm:gap-3" aria-hidden="true">
      {c.items.map((item) => (
        <div key={item.label} className="relative flex min-w-0 flex-1 flex-col items-center justify-end">
          {item.callout && (
            <span className="mb-1 text-center text-[11px] font-bold leading-tight text-coral">
              {item.callout}
            </span>
          )}
          <span className={`mb-1 text-center font-bold leading-tight ${compact ? "text-[12px]" : "text-[13px]"}`}>
            {c.percent === false || !c.total ? item.value : (
              <>
                {item.value}
                <span className="block font-normal text-muted sm:inline sm:before:content-['_']">
                  ({Math.round((item.value / c.total) * 1000) / 10}%)
                </span>
              </>
            )}
          </span>
          <div
            className="chart-bar-v w-full rounded-t-md"
            style={{ height: `${(item.value / max) * plot}px`, background: item.accent ? "var(--chart-accent, var(--color-coral))" : "var(--chart-1, var(--color-teal))" }}
          />
        </div>
      ))}
    </div>
  );
}

function ColumnLabels({ c }: { c: ChartData }) {
  return (
    <div className="mt-2 flex gap-2 sm:gap-3" aria-hidden="true">
      {c.items.map((item) => (
        <span key={item.label} className="min-w-0 flex-1 text-center text-[13px] leading-tight text-muted">
          {item.label}
        </span>
      ))}
    </div>
  );
}

function Rows({ c }: { c: ChartData }) {
  const max = Math.max(...c.items.map((i) => i.value), 1);
  return (
    <ul className="space-y-1.5" aria-hidden="true">
      {c.items.map((item) => (
        <li key={item.label} className="grid grid-cols-[minmax(0,4.5rem)_1fr] items-center gap-3 sm:grid-cols-[minmax(0,5.5rem)_1fr]">
          <span className="text-right text-[13px] leading-tight text-muted">{item.label}</span>
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="chart-bar-h h-4 rounded-r-md"
              style={{ width: `calc((100% - 4.25rem) * ${item.value / max})`, background: item.accent ? "var(--chart-accent, var(--color-coral))" : "var(--chart-1, var(--color-teal))" }}
            />
            <span className="whitespace-nowrap text-[13px] font-bold">{label(item, c)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Pie({ c }: { c: ChartData }) {
  const items = c.items.filter((i) => i.value > 0);
  const sum = items.reduce((s, i) => s + i.value, 0);
  const R = 50;
  const slices = items.map((item, i) => {
    const before = items.slice(0, i).reduce((t, o) => t + o.value, 0);
    const a0 = -Math.PI / 2 + (before / sum) * Math.PI * 2;
    const a1 = a0 + (item.value / sum) * Math.PI * 2;
    const x0 = 60 + R * Math.cos(a0), y0 = 60 + R * Math.sin(a0);
    const x1 = 60 + R * Math.cos(a1), y1 = 60 + R * Math.sin(a1);
    const d = `M60 60 L${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${item.value / sum > 0.5 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
    return { item, d, fill: fillFor(item, i) };
  });
  return (
    <div className="flex flex-col items-center gap-2.5" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="chart-pie size-24 shrink-0">
        {slices.map((s) => (
          <path key={s.item.label} d={s.d} fill={s.fill} stroke="var(--color-card)" strokeWidth="2" strokeLinejoin="round" />
        ))}
      </svg>
      <ul className="space-y-0.5">
        {slices.map((s) => (
          <li key={s.item.label} className="flex items-center gap-2 whitespace-nowrap text-[13px] leading-tight">
            <span className="size-3 shrink-0 rounded-sm border border-deep/20" style={{ background: s.fill }} />
            <span>{s.item.label}</span>
            <span className="font-bold">{label(s.item, c)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChartCard({ chart: c }: { chart: ChartData }) {
  return (
    <figure className={`${glass} reveal p-3 sm:p-3.5`} role="img" aria-label={c.alt}>
      <figcaption className="mb-2.5">
        <p className="text-[14px] font-bold leading-snug">{c.title}</p>
        {c.note && <p className="text-[13px] text-muted">{c.note}</p>}
      </figcaption>
      {c.kind === "columns" && (
        <>
          <Columns c={c} />
          <ColumnLabels c={c} />
          {c.axisLabel && <p className="mt-1 text-center text-[13px] text-muted" aria-hidden="true">{c.axisLabel}</p>}
        </>
      )}
      {c.kind === "rows" && <Rows c={c} />}
      {c.kind === "pie" && <Pie c={c} />}
      {c.legend && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px]" aria-hidden="true">
          {c.legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2">
              <span className="size-3 rounded-sm" style={{ background: l.accent ? "var(--chart-accent, var(--color-coral))" : "var(--chart-1, var(--color-teal))" }} />
              {l.label}
            </li>
          ))}
        </ul>
      )}
      {c.caption && <p className="mt-3 text-[13px] text-muted" aria-hidden="true">{c.caption}</p>}
    </figure>
  );
}

export function ChartGrid({ charts, label = "Charts" }: { charts: ChartData[]; label?: string }) {
  // Two or fewer fit side by side; more become a scrolling row with arrows.
  if (charts.length <= 2) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {charts.map((c) => <ChartCard key={c.title} chart={c} />)}
      </div>
    );
  }
  return (
    <ChartCarousel label={label}>
      {charts.map((c) => <ChartCard key={c.title} chart={c} />)}
    </ChartCarousel>
  );
}
