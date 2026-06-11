import type { ComparisonResult } from "@/lib/compare";

// גרף רדאר (spider) להשוואת פרופיל המפרטים העיקריים — SVG טהור, ללא ספריות.
// סמנטיקה: רחוק מהמרכז = טוב יותר בכל ציר (מנורמל), כך ששטח גדול = רכיב חזק יותר.

const SIZE = 320;
const CENTER = SIZE / 2;
const R = 104;

function pt(r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)];
}

function clamp(n: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
}

// ירוק (accent) = מנצח, בעקביות עם VerdictBanner וטבלת ההשוואה. הצד שאינו מנצח מקבל גוון ניטרלי.
const ACCENT = "hsl(var(--accent))";
const SIDE_BLUE = "hsl(var(--accent-2))";
const SIDE_PURPLE = "hsl(270 55% 62%)";

export function RadarChart({ result }: { result: ComparisonResult }) {
  const axes = result.rows
    .filter((r) => r.field.primary && r.field.higherIsBetter !== null && typeof r.a === "number" && typeof r.b === "number")
    .slice(0, 6)
    .map((r) => {
      const va = r.a as number;
      const vb = r.b as number;
      let gA: number;
      let gB: number;
      if (r.field.higherIsBetter) {
        const max = Math.max(va, vb) || 1;
        gA = va / max;
        gB = vb / max;
      } else {
        // נמוך = טוב: הקטן יותר מתקרב למרכז החיצוני (1)
        const min = Math.min(va, vb);
        gA = va === 0 ? 1 : min === 0 ? (va === min ? 1 : 0) : min / va;
        gB = vb === 0 ? 1 : min === 0 ? (vb === min ? 1 : 0) : min / vb;
      }
      return { label: r.field.label, gA: clamp(gA), gB: clamp(gB) };
    });

  if (axes.length < 3) return null;

  // צביעה לפי תוצאה: המנצח בירוק (accent), השני בגוון ניטרלי; בתיקו — שני גוונים ניטרליים נבדלים.
  const COL_A = result.overall === "a" ? ACCENT : result.overall === "b" ? SIDE_BLUE : SIDE_BLUE;
  const COL_B = result.overall === "b" ? ACCENT : result.overall === "a" ? SIDE_BLUE : SIDE_PURPLE;

  const n = axes.length;
  const step = 360 / n;
  const rings = [0.33, 0.66, 1];
  const polyA = axes.map((ax, i) => pt(ax.gA * R, i * step).join(",")).join(" ");
  const polyB = axes.map((ax, i) => pt(ax.gB * R, i * step).join(",")).join(" ");

  return (
    <div className="card p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">פרופיל ביצועים</h2>
        <div className="flex min-w-0 items-center gap-3 text-xs">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: COL_A }} />
            <span className="ltr max-w-[110px] truncate">{result.a.name}</span>
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: COL_B }} />
            <span className="ltr max-w-[110px] truncate">{result.b.name}</span>
          </span>
        </div>
      </div>

      <svg viewBox={`-24 0 ${SIZE + 48} ${SIZE}`} className="mx-auto block w-full max-w-sm" role="img" aria-label={`גרף רדאר: ${result.a.name} מול ${result.b.name}`}>
        {rings.map((lvl) => (
          <polygon
            key={lvl}
            points={axes.map((_, i) => pt(lvl * R, i * step).join(",")).join(" ")}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        ))}
        {axes.map((ax, i) => {
          const [x, y] = pt(R, i * step);
          const [lx, ly] = pt(R + 20, i * step);
          return (
            <g key={i}>
              <line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="hsl(var(--border))" strokeWidth={1} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 8.5, fill: "hsl(var(--muted))" }}>
                {ax.label}
              </text>
            </g>
          );
        })}
        <polygon points={polyB} fill={COL_B} fillOpacity={0.16} stroke={COL_B} strokeWidth={2} strokeLinejoin="round" />
        <polygon points={polyA} fill={COL_A} fillOpacity={0.18} stroke={COL_A} strokeWidth={2} strokeLinejoin="round" />
      </svg>

      <p className="mt-1 text-center text-[11px] text-muted">רחוק מהמרכז = טוב יותר · מנורמל לכל מדד</p>
    </div>
  );
}
