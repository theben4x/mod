"use client";

import { useMemo, useState } from "react";
import type { ComparisonResult } from "@/lib/compare";
import type { PriceQuote, SpecValue, SpecField, SpecComparison } from "@/lib/types";
import { formatSpec } from "@/lib/format";
import { SpecBar } from "./SpecBar";
import { PriceTag } from "./PriceTag";
import { ScoreRing } from "./ScoreRing";

type CellState = "win" | "lose" | "tie" | "neutral";

function statesFor(winner: "a" | "b" | "tie" | null): [CellState, CellState] {
  if (winner === "a") return ["win", "lose"];
  if (winner === "b") return ["lose", "win"];
  if (winner === "tie") return ["tie", "tie"];
  return ["neutral", "neutral"];
}

/** הפרש יחסי באחוזים של המנצח מול המפסיד (חתום). null אם לא רלוונטי. */
function deltaLabel(row: SpecComparison): string | null {
  if (row.winner !== "a" && row.winner !== "b") return null;
  const av = row.a;
  const bv = row.b;
  if (typeof av !== "number" || typeof bv !== "number") return null;
  const win = row.winner === "a" ? av : bv;
  const lose = row.winner === "a" ? bv : av;
  if (lose === 0) return null;
  const pct = Math.round(((win - lose) / Math.abs(lose)) * 100);
  if (!Number.isFinite(pct) || pct === 0) return null;
  return (pct > 0 ? "+" : "") + pct + "%";
}

function ValueCell({
  side,
  display,
  state,
  ratio,
  showBar,
  delta,
}: {
  side: "a" | "b";
  display: { value: string; unit?: string };
  state: CellState;
  ratio: number;
  showBar: boolean;
  delta: string | null;
}) {
  const alignItems = side === "a" ? "items-start text-start" : "items-end text-end";
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${alignItems}`}>
      <div
        className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 rounded-lg px-2 py-1 transition-colors ${
          side === "b" ? "justify-end" : ""
        } ${state === "win" ? "bg-accent-soft/70" : ""}`}
      >
        {state === "win" && <span className="text-[10px] leading-none text-accent">▲</span>}
        <span
          className={`mono text-[15px] font-semibold tabular-nums sm:text-lg ${
            state === "win" ? "text-accent" : state === "lose" ? "text-muted" : "text-foreground"
          }`}
        >
          {display.value}
        </span>
        {display.unit && <span className="mono text-[10px] text-muted">{display.unit}</span>}
        {state === "win" && delta && (
          <span className="mono rounded bg-accent/15 px-1 text-[10px] font-medium leading-tight text-accent">{delta}</span>
        )}
      </div>
      {showBar && <SpecBar ratio={ratio} align={side === "a" ? "start" : "end"} state={state} />}
    </div>
  );
}

export function CompareTable({
  result,
  priceA,
  priceB,
}: {
  result: ComparisonResult;
  priceA: PriceQuote;
  priceB: PriceQuote;
}) {
  const { a, b, rows } = result;
  const [onlyDiff, setOnlyDiff] = useState(false);

  const diffCount = useMemo(() => rows.filter((r) => r.a !== r.b).length, [rows]);
  const visibleRows = useMemo(
    () => (onlyDiff ? rows.filter((r) => r.a !== r.b) : rows),
    [onlyDiff, rows]
  );

  // מנצח המחיר (נמוך = טוב), לפי ILS
  let priceWinner: "a" | "b" | "tie" | null = null;
  if (priceA.ils != null && priceB.ils != null) {
    priceWinner = priceA.ils === priceB.ils ? "tie" : priceA.ils < priceB.ils ? "a" : "b";
  }
  const [psA, psB] = statesFor(priceWinner);

  return (
    <div className="card relative">
      {/* כותרת דביקה — זהות הרכיבים (נשארת גלויה בגלילה) */}
      <div className="sticky top-16 z-30 rounded-t-2xl border-b border-border bg-elevated/90 backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 p-4 sm:gap-5 sm:p-6">
          <ComponentHead component={a} side="a" />
          <div className="flex items-center justify-center">
            <span className="mono rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted">VS</span>
          </div>
          <ComponentHead component={b} side="b" />
        </div>
      </div>

      {/* סרגל כלים — סינון לשורות שונות בלבד */}
      <div className="flex items-center justify-center gap-3 border-b border-border bg-surface/40 px-4 py-2.5">
        <button
          type="button"
          onClick={() => setOnlyDiff((v) => !v)}
          aria-pressed={onlyDiff}
          className={`mono inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] transition-colors ${
            onlyDiff ? "border-accent/60 bg-accent-soft text-accent" : "border-border text-muted hover:text-foreground"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${onlyDiff ? "bg-accent" : "bg-muted/50"}`} />
          הצג רק הבדלים
        </button>
        <span className="mono text-[11px] text-muted">
          {diffCount} מתוך {rows.length} שונים
        </span>
      </div>

      {/* שורת מחיר */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border bg-accent-soft/40 px-4 py-4 sm:gap-5 sm:px-6">
        <div className={`flex flex-col ${psA === "win" ? "text-accent" : ""} items-start text-start`}>
          <div className="flex items-baseline gap-1">
            {psA === "win" && <span className="text-[10px] text-accent">▲</span>}
            <PriceTag ils={priceA.ils} usd={priceA.usd} className={`text-base font-semibold sm:text-xl ${psA === "lose" ? "text-muted" : ""}`} />
          </div>
        </div>
        <SpecLabel field={{ label: "מחיר", higherIsBetter: null }} />
        <div className={`flex flex-col ${psB === "win" ? "text-accent" : ""} items-end text-end`}>
          <div className="flex items-baseline gap-1">
            {psB === "win" && <span className="text-[10px] text-accent">▲</span>}
            <PriceTag ils={priceB.ils} usd={priceB.usd} className={`text-base font-semibold sm:text-xl ${psB === "lose" ? "text-muted" : ""}`} />
          </div>
        </div>
      </div>

      {/* שורות מפרט */}
      <div className="overflow-hidden rounded-b-2xl">
        {visibleRows.map((row, i) => {
          const [sa, sb] = statesFor(row.winner);
          const showBar = row.ratioA > 0 || row.ratioB > 0;
          const delta = deltaLabel(row);
          return (
            <div
              key={row.field.key}
              className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3.5 sm:gap-5 sm:px-6 ${
                i % 2 === 1 ? "bg-surface/30" : ""
              }`}
            >
              <ValueCell side="a" display={formatSpec(row.field, row.a as SpecValue)} state={sa} ratio={row.ratioA} showBar={showBar} delta={delta} />
              <SpecLabel field={row.field} />
              <ValueCell side="b" display={formatSpec(row.field, row.b as SpecValue)} state={sb} ratio={row.ratioB} showBar={showBar} delta={delta} />
            </div>
          );
        })}
        {visibleRows.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted">אין הבדלים במדדים</div>
        )}
      </div>
    </div>
  );
}

function SpecLabel({ field }: { field: Pick<SpecField, "label" | "hint" | "higherIsBetter"> }) {
  return (
    <div className="flex w-[78px] flex-col items-center text-center sm:w-[150px]">
      <span
        className={`text-xs font-medium leading-tight text-muted sm:text-[13px] ${
          field.hint ? "cursor-help underline decoration-dotted decoration-muted/40 underline-offset-2" : ""
        }`}
        title={field.hint || undefined}
        aria-label={field.hint ? `${field.label} — ${field.hint}` : undefined}
      >
        {field.label}
      </span>
      {field.higherIsBetter === false && (
        <span className="mono text-[9px] text-muted/70">נמוך = טוב</span>
      )}
    </div>
  );
}

function ComponentHead({ component, side }: { component: ComparisonResult["a"]; side: "a" | "b" }) {
  const align = side === "a" ? "items-start text-start" : "items-end text-end";
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${align}`}>
      <span className="mono text-[10px] uppercase tracking-wide text-muted">{component.brand}</span>
      <span className="ltr text-[15px] font-semibold leading-tight sm:text-xl">{component.name}</span>
      <div className={`mt-0.5 flex items-center gap-2 ${side === "b" ? "flex-row-reverse" : ""}`}>
        {typeof component.score === "number" && <ScoreRing score={component.score} label="ציון" size={38} />}
        <span className="mono text-xs text-muted">{component.year}</span>
      </div>
    </div>
  );
}
