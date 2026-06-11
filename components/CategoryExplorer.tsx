"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CategoryKey, Component, Currency, SpecField } from "@/lib/types";
import { CATEGORIES } from "@/data/categories";
import { buildSlug } from "@/lib/compare";
import { formatSpec, currencySymbol, formatPrice } from "@/lib/format";
import { USD_TO_ILS } from "@/lib/fx";
import { usePrefs } from "./Providers";
import { PriceTag } from "./PriceTag";
import { ComponentImageView } from "./ComponentImageView";
import { SearchIcon, CloseIcon, CheckIcon } from "./icons";

type PriceMap = Record<string, { ils: number | null; usd: number | null } | undefined>;
/** מפת id → נתיב תמונה (או null), נפתרת בצד-שרת בעמוד הקטגוריה */
type ImageMap = Record<string, string | null>;

type SortKey = "score" | "value" | "price-asc" | "price-desc" | "name" | "year";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "ציון" },
  { key: "value", label: "תמורה לכסף" },
  { key: "price-asc", label: "מחיר — מהזול" },
  { key: "price-desc", label: "מחיר — מהיקר" },
  { key: "year", label: "החדש ביותר" },
  { key: "name", label: "שם A→Z" },
];

function priceOf(p: PriceMap[string]): number {
  if (!p) return Infinity;
  return p.ils ?? (p.usd != null ? p.usd * USD_TO_ILS : Infinity);
}

/** מחיר במטבע התצוגה (null אם אין מחיר). */
function displayedPrice(p: PriceMap[string], currency: Currency): number | null {
  if (!p) return null;
  return currency === "ILS" ? p.ils : p.usd;
}

export function CategoryExplorer({
  components,
  prices,
  images = {},
  categoryKey,
}: {
  components: Component[];
  prices: PriceMap;
  images?: ImageMap;
  categoryKey: CategoryKey;
}) {
  const router = useRouter();
  const cat = CATEGORIES[categoryKey];
  const primaryFields = cat.fields.filter((f) => f.primary).slice(0, 3);

  const { currency } = usePrefs();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("score");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  // מחיר מרבי נשמר במטבע התצוגה — איפוס בהחלפת מטבע כדי לא לבלבל בין סקאלות
  useEffect(() => {
    setMaxPrice(null);
  }, [currency]);

  // מותגים נפוצים בקטגוריה (לפי כמות, יורד)
  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of components) counts.set(c.brand, (counts.get(c.brand) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b);
  }, [components]);

  const valueOf = (c: Component) => {
    const pr = priceOf(prices[c.id]);
    return pr === Infinity ? 0 : (c.score ?? 0) / pr;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = components.filter((c) => {
      if (brand && c.brand !== brand) return false;
      if (q && !(`${c.name} ${c.brand}`.toLowerCase().includes(q))) return false;
      if (maxPrice != null) {
        const dp = displayedPrice(prices[c.id], currency);
        if (dp == null || dp > maxPrice) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "value":
          return valueOf(b) - valueOf(a) || (b.score ?? 0) - (a.score ?? 0);
        case "price-asc":
        case "price-desc": {
          const pa = priceOf(prices[a.id]);
          const pb = priceOf(prices[b.id]);
          if (pa === Infinity && pb === Infinity) return 0;
          if (pa === Infinity) return 1; // מחיר חסר תמיד אחרון
          if (pb === Infinity) return -1;
          return sort === "price-asc" ? pa - pb : pb - pa;
        }
        case "name":
          return a.name.localeCompare(b.name);
        case "year":
          return (b.year ?? 0) - (a.year ?? 0) || (b.score ?? 0) - (a.score ?? 0);
        case "score":
        default:
          return (b.score ?? 0) - (a.score ?? 0) || (b.year ?? 0) - (a.year ?? 0);
      }
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components, prices, query, brand, sort, maxPrice, currency]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id]; // החלף את הישן ביותר
      return [...prev, id];
    });
  }

  const selectedComps = selected
    .map((id) => components.find((c) => c.id === id))
    .filter(Boolean) as Component[];

  function compareNow() {
    if (selected.length === 2) router.push(`/compare/${buildSlug(selected[0], selected[1])}`);
  }

  return (
    <div>
      {/* סרגל כלים */}
      <div className="sticky top-2 z-20 rounded-2xl border border-border bg-elevated/80 p-2.5 shadow-soft backdrop-blur-md sm:p-3">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          {/* חיפוש */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 focus-within:border-accent lg:w-72">
            <SearchIcon width={16} height={16} className="shrink-0 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`חיפוש ב${cat.pluralHe}...`}
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
              aria-label={`חיפוש ${cat.pluralHe}`}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="נקה חיפוש" className="shrink-0 text-muted hover:text-foreground">
                <CloseIcon width={14} height={14} />
              </button>
            )}
          </div>

          {/* מותגים */}
          <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterChip active={brand === null} onClick={() => setBrand(null)}>
              הכל
            </FilterChip>
            {brands.map((b) => (
              <FilterChip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>
                {b}
              </FilterChip>
            ))}
          </div>

          {/* מחיר מרבי */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 lg:w-40">
            <span className="mono text-xs text-muted">{currencySymbol(currency)}</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(e.target.value ? Math.max(0, Number(e.target.value)) : null)}
              placeholder="מחיר מרבי"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
              aria-label="מחיר מרבי"
            />
            {maxPrice != null && (
              <button type="button" onClick={() => setMaxPrice(null)} aria-label="נקה מחיר מרבי" className="shrink-0 text-muted hover:text-foreground">
                <CloseIcon width={14} height={14} />
              </button>
            )}
          </div>

          {/* מיון */}
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="sort" className="hidden text-xs text-muted sm:block">
              מיון:
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="mono cursor-pointer appearance-none rounded-xl border border-border bg-surface py-2.5 pe-8 ps-3 text-xs outline-none transition-colors hover:border-accent focus:border-accent"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 end-2.5 grid place-items-center text-muted">▾</span>
            </div>
          </div>
        </div>
      </div>

      {/* ספירת תוצאות */}
      <p className="mt-4 px-1 text-sm text-muted">
        <span className="mono font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "דגם" : "דגמים"}
        {brand ? ` · ${brand}` : ""}
        {query ? ` · "${query}"` : ""}
        {maxPrice != null ? ` · עד ${formatPrice(maxPrice, currency)}` : ""}
      </p>

      {/* רשת */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted">לא נמצאו דגמים תואמים.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setBrand(null);
              setMaxPrice(null);
            }}
            className="mt-3 text-sm text-accent hover:opacity-80"
          >
            נקה סינון
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 pb-24 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <ExplorerCard
              key={c.id}
              component={c}
              price={prices[c.id]}
              imageSrc={images[c.id] ?? null}
              primaryFields={primaryFields}
              selected={selected.includes(c.id)}
              onToggle={() => toggleSelect(c.id)}
            />
          ))}
        </div>
      )}

      {/* סרגל השוואה צף */}
      {selectedComps.length > 0 && (
        <div className="fixed inset-x-0 bottom-14 z-40 flex justify-center px-4">
          <div className="flex w-full max-w-2xl animate-fade-up items-center gap-2 rounded-2xl border border-border bg-elevated/95 p-2 shadow-card backdrop-blur-md sm:gap-3 sm:p-2.5">
            <span className="mono hidden shrink-0 ps-2 text-xs text-muted sm:block">השוואה:</span>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {[0, 1].map((i) => {
                const c = selectedComps[i];
                return c ? (
                  <span
                    key={c.id}
                    className="flex min-w-0 items-center gap-1.5 rounded-lg border border-border bg-surface ps-2.5 pe-1 py-1"
                  >
                    <span className="ltr truncate text-xs font-medium">{c.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleSelect(c.id)}
                      aria-label={`הסר ${c.name}`}
                      className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted hover:bg-background hover:text-foreground"
                    >
                      <CloseIcon width={12} height={12} />
                    </button>
                  </span>
                ) : (
                  <span
                    key={i}
                    className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border px-2 py-1.5 text-[11px] text-muted"
                  >
                    בחרו רכיב נוסף
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              onClick={compareNow}
              disabled={selected.length !== 2}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                selected.length === 2
                  ? "bg-accent text-accent-foreground shadow-glow hover:brightness-110"
                  : "cursor-not-allowed bg-surface text-muted"
              }`}
            >
              השווה <span className="mono">←</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
        active ? "bg-foreground text-background" : "border border-border bg-surface text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ExplorerCard({
  component: c,
  price,
  imageSrc,
  primaryFields,
  selected,
  onToggle,
}: {
  component: Component;
  price?: { ils: number | null; usd: number | null };
  imageSrc: string | null;
  primaryFields: SpecField[];
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`card group relative flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${
        selected ? "border-accent ring-1 ring-accent" : "hover:border-accent/60"
      }`}
    >
      {/* שכבת קישור (לכל הכרטיס) — מתחת לכפתורים */}
      <Link href={`/component/${c.id}`} aria-label={c.name} className="absolute inset-0 z-[1] rounded-2xl" />

      {/* תוכן — שקוף ללחיצה כדי שהקליק יגיע לקישור */}
      <div className="pointer-events-none relative z-0 flex flex-1 flex-col gap-4">
        <ComponentImageView
          component={c}
          src={imageSrc}
          className="h-32 w-full transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
          iconSize={46}
        />

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="mono text-[10px] uppercase tracking-wide text-muted">{c.brand}</span>
            <h3 className="ltr truncate text-base font-semibold leading-tight">{c.name}</h3>
          </div>
          {typeof c.score === "number" && (
            <span className="mono shrink-0 rounded-lg bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">{c.score}</span>
          )}
        </div>

        {c.blurb && <p className="line-clamp-2 text-sm leading-relaxed text-muted">{c.blurb}</p>}

        <div className="flex flex-wrap gap-1.5">
          {primaryFields.map((f) => {
            const d = formatSpec(f, c.specs[f.key] ?? null);
            return (
              <span key={f.key} className="mono rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-muted">
                {d.value}
                {d.unit ? ` ${d.unit}` : ""}
              </span>
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          {price ? <PriceTag ils={price.ils} usd={price.usd} className="text-base font-semibold" /> : <span />}
          <span className="text-xs text-muted transition-colors group-hover:text-accent">פרטים ←</span>
        </div>
      </div>

      {/* כפתור בחירה להשוואה — מעל הקישור */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        aria-label={selected ? `הסר את ${c.name} מההשוואה` : `הוסף את ${c.name} להשוואה`}
        title={selected ? "הוסר מההשוואה" : "הוסף להשוואה"}
        className={`absolute end-3 bottom-3 z-[2] grid h-8 w-8 place-items-center rounded-lg border text-sm transition-all duration-200 ${
          selected
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-surface text-muted opacity-100 hover:border-accent hover:text-accent focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        }`}
      >
        {selected ? <CheckIcon width={15} height={15} /> : <span className="text-base leading-none">+</span>}
      </button>
    </div>
  );
}
