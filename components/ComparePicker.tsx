"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoryKey, Component } from "@/lib/types";
import { ALL_CATEGORIES, CATEGORIES, categoryColor } from "@/data/categories";
import { searchComponents } from "@/lib/data";
import { buildSlug } from "@/lib/compare";
import { CloseIcon, SearchIcon, SwapIcon, ChevronDownIcon, CheckIcon } from "./icons";
import { CategoryIcon } from "./CategoryIcon";

interface Props {
  initialCategory?: CategoryKey;
  initialA?: Component | null;
  initialB?: Component | null;
  /** מחרוזת חיפוש ראשונית לשדה הראשון (מגיע מ-?q= / Sitelinks Searchbox) */
  initialQuery?: string;
  autoNavigate?: boolean;
}

export function ComparePicker({ initialCategory = "gpu", initialA = null, initialB = null, initialQuery = "" }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [a, setA] = useState<Component | null>(initialA);
  const [b, setB] = useState<Component | null>(initialB);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCatOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function changeCategory(next: CategoryKey) {
    if (next === category) return;
    setCategory(next);
    setA(null);
    setB(null);
  }

  function swap() {
    setA(b);
    setB(a);
  }

  const ready = a && b && a.id !== b.id;

  function go() {
    if (!ready || !a || !b) return;
    router.push(`/compare/${buildSlug(a.id, b.id)}`);
  }

  return (
    <div className="card p-3 shadow-card sm:p-4">
      {/* בורר קטגוריה — תפריט נפתח מסודר */}
      <div ref={catRef} className="relative pb-3">
        <span className="mb-1.5 block px-1 text-xs text-muted">קטגוריה</span>
        <button
          type="button"
          onClick={() => setCatOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={catOpen}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm transition-colors hover:border-accent/50"
        >
          <span className="flex items-center gap-2 font-medium">
            <CategoryIcon category={category} width={17} height={17} style={{ color: `hsl(${categoryColor(category)})` }} />
            {CATEGORIES[category].pluralHe}
          </span>
          <ChevronDownIcon width={15} height={15} className={`text-muted transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
        </button>

        {catOpen && (
          <div
            role="listbox"
            className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 animate-fade-up overflow-auto rounded-2xl border border-border bg-elevated p-1.5 shadow-card"
          >
            {ALL_CATEGORIES.map((cat) => {
              const active = cat.key === category;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    changeCategory(cat.key);
                    setCatOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start transition-colors ${
                    active ? "bg-surface" : "hover:bg-surface"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CategoryIcon category={cat.key} width={17} height={17} style={{ color: `hsl(${categoryColor(cat.key)})` }} />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">{cat.pluralHe}</span>
                      <span className="text-xs text-muted">{cat.nameEn}</span>
                    </span>
                  </span>
                  {active && <CheckIcon width={15} height={15} className="text-accent" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* שדות בחירה */}
      <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <PickerField
          label="רכיב ראשון"
          side="a"
          value={a}
          category={category}
          excludeId={b?.id}
          onSelect={setA}
          initialQuery={initialQuery}
        />

        <div className="flex items-center justify-center py-1 sm:py-0">
          <button
            type="button"
            onClick={swap}
            aria-label="החלף צדדים"
            title="החלף צדדים"
            className="group grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted transition-all duration-300 hover:rotate-180 hover:border-accent hover:text-accent"
          >
            <SwapIcon width={16} height={16} />
          </button>
        </div>

        <PickerField
          label="רכיב שני"
          side="b"
          value={b}
          category={category}
          excludeId={a?.id}
          onSelect={setB}
        />
      </div>

      {/* כפתור השוואה */}
      <button
        type="button"
        onClick={go}
        disabled={!ready}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
          ready
            ? "bg-accent text-accent-foreground shadow-glow hover:brightness-110"
            : "cursor-not-allowed bg-surface text-muted"
        }`}
      >
        {ready ? "השווה עכשיו" : "בחרו שני רכיבים להשוואה"}
        {ready && <span className="mono">←</span>}
      </button>
    </div>
  );
}

interface FieldProps {
  label: string;
  side: "a" | "b";
  value: Component | null;
  category: CategoryKey;
  excludeId?: string;
  onSelect: (c: Component | null) => void;
  initialQuery?: string;
}

function PickerField({ label, value, category, excludeId, onSelect, initialQuery = "" }: FieldProps) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(Boolean(initialQuery));
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

  const results = useMemo(
    () => searchComponents(query, category, 8).filter((c) => c.id !== excludeId),
    [query, category, excludeId],
  );

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

  const cat = CATEGORIES[category];

  return (
    <div ref={ref} className="relative">
      {value ? (
        <div className="flex h-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3.5 py-3">
          <button type="button" onClick={() => setOpen(true)} className="flex min-w-0 flex-col items-start text-start">
            <span className="ltr truncate text-sm font-medium">{value.name}</span>
            <span className="text-xs text-muted">{value.brand} · {value.year}</span>
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
        <div className="flex h-full items-center gap-2 rounded-xl border border-border bg-surface px-3.5 focus-within:border-accent">
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
            placeholder={`חיפוש ${cat.nameHe}...`}
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted"
            aria-label={label}
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
                  <span className="mono shrink-0 rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                    {c.score}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
