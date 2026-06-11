import Link from "next/link";
import { ALL_CATEGORIES } from "@/data/categories";
import { SearchIcon } from "./icons";
import { Typewriter } from "./Typewriter";
import { CategoryIcon } from "./CategoryIcon";

// ───────────────────────────────────────────────────────────
// "לא רק טבלת מפרט" — באנד עם 3 איורים סכמטיים (HTML/CSS/SVG),
// קשורים למה ש-tested עושה. בהשראת הסגנון של apify (לא העתקה 1:1).
// ───────────────────────────────────────────────────────────

const TILE_DOTS = ["#76b900", "#ed1c24", "#0071c5", "#16b981"]; // NVIDIA / AMD / Intel / accent

export function Showcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">לא רק טבלת מפרט</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">ככה tested הופכת בחירת חומרה להחלטה פשוטה</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel
          art={<SearchArt />}
          title="מצאו כל רכיב בשנייה"
          text="חיפוש חכם בכל הקטגוריות — התחילו להקליד ובחרו מתוך עשרות רכיבים מעודכנים."
          href="/compare"
          cta="התחילו השוואה"
        />
        <Panel
          art={<CategoriesArt />}
          title={`${ALL_CATEGORIES.length} קטגוריות, מנוע אחד`}
          text="כרטיסי מסך, מעבדים, אחסון, קירור, מארזים ועוד — מפרט מותאם לכל סוג רכיב."
          href="/category/gpu"
          cta="עיינו בקטגוריות"
        />
        <Panel
          art={<VerdictArt />}
          title="מנצח ברור בכל מדד"
          text="סימון מנצח בכל שורה, ברים ויזואליים ומחירים מעודכנים ב-₪ וב-$."
          href="/compare/rtx-5090-vs-rtx-4090"
          cta="ראו השוואה לדוגמה"
        />
      </div>
    </section>
  );
}

function Panel({
  art,
  title,
  text,
  href,
  cta,
}: {
  art: React.ReactNode;
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="card group flex flex-col overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-card">
      <div aria-hidden className="relative h-52 overflow-hidden border-b border-border bg-surface/40">
        {art}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{text}</p>
        <Link
          href={href}
          className="mono mt-4 inline-flex items-center gap-1.5 text-sm text-accent transition-opacity hover:opacity-80"
        >
          {cta} <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        </Link>
      </div>
    </div>
  );
}

/* ── איור 1: חיפוש חכם — מעגלים קונצנטריים + צ'יפים צפים ── */
function SearchArt() {
  return (
    <div className="relative mx-auto h-full w-[300px]">
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-border"
        width="280"
        height="208"
        viewBox="0 0 280 208"
        fill="none"
      >
        <circle cx="140" cy="104" r="46" stroke="currentColor" strokeOpacity="0.7" />
        <circle cx="140" cy="104" r="78" stroke="currentColor" strokeOpacity="0.45" />
        <circle cx="140" cy="104" r="104" stroke="currentColor" strokeOpacity="0.25" />
      </svg>

      <MiniChip className="right-2 top-5" text="RTX 5090" dot={TILE_DOTS[0]} />
      <MiniChip className="left-3 top-10" dot={TILE_DOTS[1]} />
      <MiniChip className="right-7 bottom-7" dot={TILE_DOTS[2]} />
      <MiniChip className="left-4 bottom-10" text="Ryzen 7" dot={TILE_DOTS[3]} />

      <div className="absolute left-1/2 top-1/2 z-10 flex w-[182px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border border-border bg-elevated px-3 py-2.5 shadow-card">
        <SearchIcon width={15} height={15} className="shrink-0 text-muted" />
        <span className="text-xs text-muted">חיפוש רכיב…</span>
        <span className="ms-auto h-3.5 w-px bg-accent" />
      </div>
    </div>
  );
}

function MiniChip({ className, text, dot }: { className: string; text?: string; dot: string }) {
  return (
    <div
      className={`absolute z-10 flex items-center gap-1.5 rounded-lg border border-border bg-elevated px-2 py-1.5 shadow-soft ${className}`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: dot }} />
      {text ? (
        <span className="mono text-[10px] font-medium text-foreground/80">{text}</span>
      ) : (
        <span className="h-1.5 w-9 rounded-full bg-border" />
      )}
    </div>
  );
}

/* ── איור 2: עץ קטגוריות — צומת מרכזי → אריחי קטגוריה ── */
function CategoriesArt() {
  // מיקומי ענפים מחושבים דינמית לפי מספר הקטגוריות (כל מספר)
  const n = ALL_CATEGORIES.length;
  const x0 = 30;
  const x1 = 270;
  const xs = ALL_CATEGORIES.map((_, i) =>
    n === 1 ? (x0 + x1) / 2 : Math.round(x0 + ((x1 - x0) * i) / (n - 1)),
  );
  return (
    <div className="relative mx-auto h-full w-[300px]">
      <svg className="absolute inset-0 h-full w-full text-border" viewBox="0 0 300 208" fill="none">
        <g stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" strokeOpacity="0.65">
          <path d="M150 60 V98" />
          <path d={`M${x0} 98 H${x1}`} />
          {xs.map((x) => (
            <path key={x} d={`M${x} 98 V144`} />
          ))}
        </g>
      </svg>

      <div className="absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border bg-elevated px-3.5 py-2 shadow-card">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-foreground text-background">
          <span className="mono text-[11px] font-bold leading-none">m</span>
        </span>
        <span className="text-sm font-medium">השוואה</span>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-1.5">
        {ALL_CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            title={cat.pluralHe}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-elevated text-accent shadow-soft"
          >
            <CategoryIcon category={cat.key} width={16} height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── איור 3: תצוגה מקדימה של השוואה — מנצח + ברים + מחיר ── */
function VerdictArt() {
  const rows = [
    { label: "ליבות", a: 92, b: 62, aWin: true },
    { label: "זיכרון", a: 86, b: 64, aWin: true },
    { label: "מחיר", a: 100, b: 82, aWin: false },
  ];
  return (
    <div className="mx-auto flex h-full w-[300px] flex-col justify-center gap-3 px-5">
      {/* שני רכיבים + VS */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 rounded-lg border border-accent/50 bg-elevated px-2.5 py-2 shadow-soft">
          <span className="mono block text-[9px] text-muted">NVIDIA</span>
          <Typewriter text="RTX 5090" startDelay={250} className="ltr block min-h-[14px] text-[11px] font-semibold leading-tight" />
          <span className="absolute -top-2 right-2 rounded-full bg-accent px-1.5 py-0.5 text-[8px] font-bold text-accent-foreground">
            מנצח
          </span>
        </div>
        <span className="mono shrink-0 rounded-full border border-border bg-surface px-1.5 py-0.5 text-[9px] text-muted">
          VS
        </span>
        <div className="flex-1 rounded-lg border border-border bg-elevated px-2.5 py-2 shadow-soft">
          <span className="mono block text-[9px] text-muted">NVIDIA</span>
          <Typewriter text="RTX 4090" startDelay={550} className="ltr block min-h-[14px] text-[11px] font-semibold leading-tight" />
        </div>
      </div>

      {/* ברים */}
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex h-1.5 justify-start overflow-hidden rounded-full bg-border/50">
              <div className={`h-full rounded-full ${r.aWin ? "bg-accent" : "bg-muted/30"}`} style={{ width: `${r.a}%` }} />
            </div>
            <span className="w-9 text-center text-[9px] text-muted">{r.label}</span>
            <div className="flex h-1.5 justify-end overflow-hidden rounded-full bg-border/50">
              <div className={`h-full rounded-full ${r.aWin ? "bg-muted/30" : "bg-accent"}`} style={{ width: `${r.b}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* מחיר + מתג מטבע */}
      <div className="flex items-center justify-between gap-2">
        <span className="mono text-sm font-semibold text-muted">₪11,500</span>
        <div className="mono inline-flex items-center rounded-md border border-border bg-surface p-0.5 text-[9px]">
          <span className="rounded bg-foreground px-1.5 py-0.5 text-background">₪</span>
          <span className="px-1.5 py-0.5 text-muted">$</span>
        </div>
        <span className="mono inline-flex items-center gap-1 text-sm font-semibold text-accent">
          ₪9,500 <span className="text-[9px]">▲</span>
        </span>
      </div>
    </div>
  );
}
