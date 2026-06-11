"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ───────────────────────────────────────────────
// כפתור נגישות צף + פאנל הגדרות. מיישם תאימות לתקנות הנגישות
// (ת"י 5568 / WCAG 2.0 AA): שינוי גודל טקסט, ניגודיות, גווני אפור,
// הדגשת קישורים, גופן קריא, עצירת אנימציות, סמן גדול. נשמר ב-localStorage.
// ───────────────────────────────────────────────

type Toggles = {
  contrast: boolean;
  grayscale: boolean;
  links: boolean;
  readable: boolean;
  motion: boolean;
  cursor: boolean;
};
type A11y = Toggles & { font: number };

const DEFAULTS: A11y = { font: 0, contrast: false, grayscale: false, links: false, readable: false, motion: false, cursor: false };
const KEY = "mod-a11y";
const FONT_PCT = ["100%", "110%", "120%", "130%"]; // index = font step
const CLASS: Record<keyof Toggles, string> = {
  contrast: "a11y-contrast",
  grayscale: "a11y-grayscale",
  links: "a11y-links",
  readable: "a11y-readable",
  motion: "a11y-no-motion",
  cursor: "a11y-big-cursor",
};

const TOGGLES: { key: keyof Toggles; label: string }[] = [
  { key: "contrast", label: "ניגודיות גבוהה" },
  { key: "grayscale", label: "גווני אפור" },
  { key: "links", label: "הדגשת קישורים" },
  { key: "readable", label: "גופן קריא" },
  { key: "motion", label: "עצירת אנימציות" },
  { key: "cursor", label: "סמן גדול" },
];

function applyToDom(s: A11y) {
  const d = document.documentElement;
  (Object.keys(CLASS) as (keyof Toggles)[]).forEach((k) => d.classList.toggle(CLASS[k], s[k]));
  d.style.fontSize = s.font > 0 ? FONT_PCT[s.font] : "";
}

function AccessibilityIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <path d="M6.7 9.6c1.9 1 3.4 1.3 5.3 1.3s3.4-.3 5.3-1.3" />
      <path d="M12 10.9V15" />
      <path d="M12 15l-2.3 4.2M12 15l2.3 4.2" />
    </svg>
  );
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<A11y>(DEFAULTS);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // טעינת העדפות שמורות בעלייה
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const next = { ...DEFAULTS, ...JSON.parse(raw) } as A11y;
        setS(next);
        applyToDom(next);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback((next: A11y) => {
    setS(next);
    applyToDom(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (k: keyof Toggles) => update({ ...s, [k]: !s[k] });
  const setFont = (n: number) => update({ ...s, font: Math.max(0, Math.min(FONT_PCT.length - 1, n)) });
  const reset = () => update(DEFAULTS);

  // סגירה בלחיצה בחוץ / Escape, והחזרת פוקוס לכפתור
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeCount = TOGGLES.filter((t) => s[t.key]).length + (s.font > 0 ? 1 : 0);

  return (
    <div ref={rootRef} className="fixed bottom-12 left-4 z-50 print:hidden">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="הגדרות נגישות"
          tabIndex={-1}
          dir="rtl"
          className="absolute bottom-full left-0 mb-3 max-h-[70vh] w-[19rem] animate-fade-up overflow-auto rounded-2xl border border-border bg-elevated p-3 shadow-card outline-none"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <AccessibilityIcon size={18} />
              נגישות
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגור תפריט נגישות"
              className="grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* גודל טקסט */}
          <div className="mb-2 flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2">
            <span className="text-sm">גודל טקסט</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFont(s.font - 1)}
                disabled={s.font === 0}
                aria-label="הקטנת טקסט"
                className="grid h-7 w-7 place-items-center rounded-lg border border-border text-sm font-bold transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              >
                −
              </button>
              <span className="mono w-10 text-center text-xs text-muted">{FONT_PCT[s.font]}</span>
              <button
                type="button"
                onClick={() => setFont(s.font + 1)}
                disabled={s.font === FONT_PCT.length - 1}
                aria-label="הגדלת טקסט"
                className="grid h-7 w-7 place-items-center rounded-lg border border-border text-sm font-bold transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* מתגים */}
          <div className="grid grid-cols-1 gap-1.5">
            {TOGGLES.map((t) => {
              const on = s[t.key];
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(t.key)}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                    on ? "border-accent bg-accent-soft text-foreground" : "border-border bg-surface text-foreground hover:border-accent/50"
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    aria-hidden
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] ${
                      on ? "border-accent bg-accent text-accent-foreground" : "border-border text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              איפוס הכל
            </button>
            <Link
              href="/accessibility"
              onClick={() => setOpen(false)}
              className="text-sm text-accent transition-opacity hover:opacity-80"
            >
              הצהרת נגישות ←
            </Link>
          </div>
        </div>
      )}

      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`תפריט נגישות${activeCount ? ` — ${activeCount} הגדרות פעילות` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative grid h-12 w-12 place-items-center rounded-full border border-border bg-accent text-accent-foreground shadow-card transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
      >
        <AccessibilityIcon />
        {activeCount > 0 && (
          <span className="mono absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
}
