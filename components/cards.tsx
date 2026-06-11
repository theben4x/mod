import Link from "next/link";
import type { Component } from "@/lib/types";
import { CATEGORIES } from "@/data/categories";
import { CategoryIcon } from "./CategoryIcon";
import { ComponentImage } from "./ComponentImage";
import { buildSlug } from "@/lib/compare";
import { formatSpec } from "@/lib/format";
import { PriceTag } from "./PriceTag";
import { ChevronLeftIcon } from "./icons";

/** כרטיס השוואה נפוצה — A מול B */
export function ComparisonCard({ a, b, label }: { a: Component; b: Component; label?: string }) {
  const cat = CATEGORIES[a.category];
  return (
    <Link
      href={`/compare/${buildSlug(a.id, b.id)}`}
      className="card group flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
    >
      <div className="flex items-center justify-between">
        <span className="mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted">
          <CategoryIcon category={cat.key} width={13} height={13} className="text-accent" />
          {cat.nameHe}
        </span>
        {label && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] text-accent">{label}</span>}
      </div>

      <div className="flex items-center gap-3">
        <span className="ltr min-w-0 flex-1 truncate text-end text-sm font-semibold">{a.name}</span>
        <span className="mono shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">VS</span>
        <span className="ltr min-w-0 flex-1 truncate text-start text-sm font-semibold">{b.name}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>השוואה מלאה</span>
        <ChevronLeftIcon width={15} height={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}

/** כרטיס רכיב בודד — לרשת קטגוריה */
export function ComponentCard({
  component,
  price,
}: {
  component: Component;
  price?: { ils: number | null; usd: number | null };
}) {
  const cat = CATEGORIES[component.category];
  const primaryFields = cat.fields.filter((f) => f.primary).slice(0, 3);

  return (
    <Link
      href={`/component/${component.id}`}
      className="card group flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
    >
      <ComponentImage
        component={component}
        className="h-32 w-full transition-transform duration-300 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 50vw, 300px"
        iconSize={46}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="mono text-[10px] uppercase tracking-wide text-muted">{component.brand}</span>
          <h3 className="ltr truncate text-base font-semibold leading-tight">{component.name}</h3>
        </div>
        {typeof component.score === "number" && (
          <span className="mono shrink-0 rounded-lg bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">{component.score}</span>
        )}
      </div>

      {component.blurb && <p className="line-clamp-2 text-sm leading-relaxed text-muted">{component.blurb}</p>}

      <div className="flex flex-wrap gap-1.5">
        {primaryFields.map((f) => {
          const d = formatSpec(f, component.specs[f.key] ?? null);
          return (
            <span key={f.key} className="mono rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-muted">
              {d.value}
              {d.unit ? ` ${d.unit}` : ""}
            </span>
          );
        })}
      </div>

      {price && (
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <PriceTag ils={price.ils} usd={price.usd} className="text-base font-semibold" />
          <span className="text-xs text-muted transition-colors group-hover:text-accent">פרטים ←</span>
        </div>
      )}
    </Link>
  );
}
