"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoryKey, Component } from "@/lib/types";
import { CATEGORIES } from "@/data/categories";
import { getComponent, searchComponents } from "@/lib/data";
import { BUILD_SLOTS, evaluateBuild, estimateBuildPower, type BuildSelection, type CompatStatus } from "@/lib/compatibility";
import { formatPrice } from "@/lib/format";
import { usePrefs } from "./Providers";
import { CategoryIcon } from "./CategoryIcon";
import { SearchIcon, CloseIcon, CheckIcon } from "./icons";

type PriceMap = Record<string, { ils: number | null; usd: number | null } | undefined>;

interface Props {
  /** ids התחלתיים לפי חריץ (מפענוח ה-query string בשרת) */
  initial?: Partial<Record<CategoryKey, string>>;
  /** החריץ של הרכיב שנבדק (מגיע מקישור עומק מעמוד רכיב) — מודגש */
  focus?: CategoryKey | null;
  /** מפת מחירים משכבת המחירים (אותו מקור כמו שאר האתר — תומך בספק חי) */
  prices: PriceMap;
}

function resolveInitial(ids?: Partial<Record<CategoryKey, string>>): BuildSelection {
  const out: BuildSelection = {};
  if (!ids) return out;
  for (const k of BUILD_SLOTS) {
    const id = ids[k];
    if (!id) continue;
    const c = getComponent(id);
    if (c && c.category === k) out[k] = c;
  }
  return out;
}

// ─────────── סגנון לפי סטטוס ───────────

function StatusGlyph({ status, className }: { status: CompatStatus; className?: string }) {
  if (status === "ok") return <CheckIcon className={className} width={15} height={15} />;
  if (status === "error")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className={className} width={15} height={15}>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  // warn — משולש אזהרה
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className} width={15} height={15}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

const STATUS_UI: Record<CompatStatus, { label: string; text: string; bg: string; border: string; chip: string }> = {
  ok: {
    label: "תואם",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  warn: {
    label: "לתשומת לב",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  error: {
    label: "לא תואם",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    chip: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export function CompatibilityChecker({ initial, focus = null, prices }: Props) {
  const [sel, setSel] = useState<BuildSelection>(() => resolveInitial(initial));

  // סנכרון ה-URL לשיתוף (ללא ניווט מחדש)
  useEffect(() => {
    const params = new URLSearchParams();
    for (const k of BUILD_SLOTS) {
      const c = sel[k];
      if (c) params.set(k, c.id);
    }
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [sel]);

  const report = useMemo(() => evaluateBuild(sel), [sel]);

  function setSlot(slot: CategoryKey, c: Component | null) {
    setSel((prev) => ({ ...prev, [slot]: c }));
  }

  const hasAny = report.selectedCount > 0;

  return (
    <div className="space-y-6">
      {/* בוחרי החריצים */}
      <div className="card p-3 shadow-card sm:p-4">
        <div className="flex items-center justify-between px-1 pb-3">
          <span className="text-[11px] uppercase tracking-wider text-muted">
            <span className="mono">
              {report.selectedCount}/{BUILD_SLOTS.length}
            </span>{" "}
            רכיבים
          </span>
          {hasAny && (
            <button
              type="button"
              onClick={() => setSel({})}
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              נקה הכל
            </button>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {BUILD_SLOTS.map((slot) => (
            <SlotPicker
              key={slot}
              slot={slot}
              value={sel[slot] ?? null}
              focused={focus === slot}
              onSelect={(c) => setSlot(slot, c)}
            />
          ))}
        </div>
      </div>

      {report.selectedCount > 0 && <BuildSummary sel={sel} prices={prices} />}

      {/* תוצאות */}
      {report.selectedCount < 2 ? (
        <div className="card flex flex-col items-center gap-2 p-8 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
            <SearchIcon width={20} height={20} />
          </span>
          <p className="mt-1 font-medium">בחרו לפחות שני רכיבים</p>
          <p className="max-w-sm text-sm text-muted">
            הוסיפו את החומרה שכבר יש לכם ואת הרכיב שאתם שוקלים לקנות — ונבדוק מיד אם הם מתאימים זה לזה.
          </p>
        </div>
      ) : report.overall === null ? (
        <div className="card flex flex-col items-center gap-2 p-8 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
            <SearchIcon width={20} height={20} />
          </span>
          <p className="mt-1 font-medium">אין יחס תאימות ישיר בין הרכיבים שנבחרו</p>
          <p className="max-w-sm text-sm text-muted">
            בין הרכיבים שבחרתם אין בדיקה ישירה. הוסיפו לוח אם או ספק כוח (למשל מעבד + לוח אם, או כרטיס מסך + ספק כוח) כדי לקבל פסק דין.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <OverallBanner report={report} />

          <div className="grid gap-2.5">
            {report.checks.map((c) => {
              const ui = STATUS_UI[c.status];
              return (
                <div key={c.id} className={`card border ${ui.border} p-4`}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${ui.bg} ${ui.text}`}>
                      <StatusGlyph status={c.status} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="flex items-center gap-1 text-muted">
                          {c.slots.map((s) => (
                            <CategoryIcon key={s} category={s} width={15} height={15} />
                          ))}
                        </span>
                        <h3 className="text-sm font-semibold">{c.title}</h3>
                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${ui.chip}`}>
                          {ui.label}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {report.notChecked.length > 0 && (
        <div className="space-y-3">
          <div className="card border border-border bg-surface/40 p-4">
            <h3 className="text-sm font-semibold text-muted">מה לא נבדק אוטומטית</h3>
            <ul className="mt-2 space-y-1.5">
              {report.notChecked.map((t, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <p className="px-1 text-xs leading-relaxed text-muted">
            פסק דין ירוק מאשר רק את ההיבטים שנבדקו לעיל, ומבוסס על מפרטי היצרן — אינו ערובה לכל היבט. ודאו מול היצרן/החנות לפני רכישה.
          </p>
        </div>
      )}
    </div>
  );
}

function OverallBanner({ report }: { report: ReturnType<typeof evaluateBuild> }) {
  const status = report.overall as CompatStatus;
  const ui = STATUS_UI[status];

  let title = "";
  let subtitle = "";
  if (status === "ok") {
    title = "הכול תואם";
    subtitle = `כל ${report.oks} הבדיקות עברו בהצלחה — אפשר להרכיב בראש שקט.`;
  } else if (status === "warn") {
    title = "תואם — עם הסתייגויות";
    subtitle = `${report.warns} ${report.warns === 1 ? "נקודה" : "נקודות"} לתשומת לב, ללא חוסמי הרכבה.`;
  } else {
    title = "נמצאו אי-התאמות";
    subtitle =
      `${report.errors} ${report.errors === 1 ? "בעיה שתמנע" : "בעיות שימנעו"} הרכבה תקינה` +
      (report.warns > 0 ? `, ועוד ${report.warns} לתשומת לב.` : ".");
  }

  return (
    <div className={`card border ${ui.border} ${ui.bg} flex items-center gap-3 p-4`}>
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-background/60 ${ui.text}`}>
        <StatusGlyph status={status} className="!h-5 !w-5" />
      </span>
      <div>
        <h2 className={`font-semibold ${ui.text}`}>{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

// ─────────── סיכום בנייה: מחיר, הספק ושלמות ───────────

function BuildSummary({ sel, prices }: { sel: BuildSelection; prices: PriceMap }) {
  const { currency } = usePrefs();
  let ils = 0;
  let usd = 0;
  let priced = 0;
  let unpriced = 0;
  const filled: CategoryKey[] = [];
  const missing: CategoryKey[] = [];
  for (const k of BUILD_SLOTS) {
    const c = sel[k];
    if (!c) {
      missing.push(k);
      continue;
    }
    filled.push(k);
    const p = prices[c.id]; // משכבת המחירים (כבר מולא בשני המטבעות)
    if (p && (p.ils != null || p.usd != null)) {
      ils += p.ils ?? 0;
      usd += p.usd ?? 0;
      priced++;
    } else {
      unpriced++;
    }
  }
  const power = estimateBuildPower(sel);
  const total = currency === "ILS" ? ils : usd;

  return (
    <div className="card p-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="מחיר כולל"
          value={priced > 0 ? formatPrice(total, currency) : "—"}
          hint={unpriced > 0 ? `${priced}/${filled.length} מתומחרים` : undefined}
        />
        <Stat
          label="צריכת חשמל"
          value={power ? `≈${power.load}W` : "—"}
          hint={power ? `ספק מומלץ: ${power.recommendedPsu}W` : undefined}
        />
        <Stat label="רכיבים" value={`${filled.length}/${BUILD_SLOTS.length}`} />
      </div>
      {missing.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted">
          <span>כדאי להוסיף:</span>
          {missing.map((k) => (
            <span key={k} className="inline-flex items-center gap-1">
              <CategoryIcon category={k} width={12} height={12} className="text-muted" />
              {CATEGORIES[k].nameHe}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-xs text-muted">{label}</div>
      <div className="mono mt-0.5 text-base font-semibold tabular-nums sm:text-lg">{value}</div>
      {hint && <div className="mt-0.5 truncate text-[11px] text-muted">{hint}</div>}
    </div>
  );
}

// ─────────── בוחר רכיב לחריץ בודד (autocomplete) ───────────

interface SlotPickerProps {
  slot: CategoryKey;
  value: Component | null;
  focused?: boolean;
  onSelect: (c: Component | null) => void;
}

function SlotPicker({ slot, value, focused = false, onSelect }: SlotPickerProps) {
  const cat = CATEGORIES[slot];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => searchComponents(query, slot, 8), [query, slot]);
  useEffect(() => setActive(0), [query, open]);

  function select(c: Component) {
    onSelect(c);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onSelect(null);
    setQuery("");
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* תווית החריץ */}
      <div className="mb-1.5 flex items-center gap-1.5 px-1">
        <CategoryIcon category={slot} width={14} height={14} className="text-accent" />
        <span className="text-xs font-medium">{cat.nameHe}</span>
        {focused && value && (
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] text-accent">נבדק</span>
        )}
      </div>

      {value ? (
        <div
          className={`flex h-[52px] items-center justify-between gap-2 rounded-xl border bg-surface px-3.5 ${
            focused ? "border-accent shadow-glow" : "border-border"
          }`}
        >
          <button type="button" onClick={() => setOpen(true)} className="flex min-w-0 flex-col items-start text-start">
            <span className="ltr truncate text-sm font-medium">{value.name}</span>
            <span className="text-xs text-muted">
              {value.brand} · {value.year}
            </span>
          </button>
          <button
            type="button"
            onClick={clear}
            aria-label="נקה בחירה"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground"
          >
            <CloseIcon width={15} height={15} />
          </button>
        </div>
      ) : (
        <div className="flex h-[52px] items-center gap-2 rounded-xl border border-border bg-surface px-3.5 focus-within:border-accent">
          <SearchIcon width={16} height={16} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={`הוספת ${cat.nameHe}...`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            aria-label={cat.nameHe}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
          />
        </div>
      )}

      {open && !value && (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 animate-fade-up overflow-auto rounded-2xl border border-border bg-elevated p-1.5 shadow-card"
        >
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">לא נמצאו תוצאות</p>
          ) : (
            results.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(c)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-start transition-colors ${
                  i === active ? "bg-surface" : ""
                }`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="ltr truncate text-sm font-medium">{c.name}</span>
                  <span className="text-xs text-muted">{c.brand}</span>
                </span>
                {typeof c.score === "number" && (
                  <span className="mono shrink-0 rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-muted">{c.score}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
