"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencyToggle } from "./CurrencyToggle";
import { ChevronDownIcon, CloseIcon } from "./icons";
import { CategoryIcon } from "./CategoryIcon";
import type { CategoryKey } from "@/lib/types";

const MAIN_LINKS = [
  { href: "/compare", label: "השוואה" },
  { href: "/compatibility", label: "תאימות" },
  { href: "/blog", label: "בלוג" },
  { href: "/about", label: "אודות" },
];

// קיבוץ הקטגוריות לשלושה נושאים בתפריט הנפתח
const CATEGORY_GROUPS: { title: string; items: { key: CategoryKey; label: string }[] }[] = [
  {
    title: "רכיבי עיבוד וביצועים",
    items: [
      { key: "cpu", label: "מעבדים" },
      { key: "gpu", label: "כרטיסי מסך" },
      { key: "ram", label: "זיכרון RAM" },
    ],
  },
  {
    title: "אחסון נתונים",
    items: [
      { key: "ssd", label: "SSD" },
      { key: "hdd", label: "HDD" },
      { key: "usb", label: "כוננים חיצוניים / ניידים" },
    ],
  },
  {
    title: "רכיבי מערכת",
    items: [
      { key: "mobo", label: "לוחות אם" },
      { key: "psu", label: "ספקי כוח" },
      { key: "case", label: "מארזים" },
      { key: "cooler", label: "קירורי מעבד ומאווררים" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  // סגירת התפריטים במעבר עמוד
  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
  }, [pathname]);

  // סגירת dropdown הקטגוריות בלחיצה בחוץ
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* פקדים — מטבע, ערכה ותפריט מובייל (הוחלפו מקומות עם הלוגו) */}
        <div className="flex items-center gap-2">
          <CurrencyToggle />
          <ThemeToggle />
          {/* כפתור תפריט מובייל */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="תפריט"
            aria-expanded={mobileOpen}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface md:hidden"
          >
            {mobileOpen ? (
              <CloseIcon />
            ) : (
              <svg width={18} height={18} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} fill="none" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {/* ניווט דסקטופ */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/compare"
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive("/compare") ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            השוואה
          </Link>

          {/* dropdown קטגוריות */}
          <div ref={catRef} className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive("/category") ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              קטגוריות
              <ChevronDownIcon
                width={14}
                height={14}
                className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
              />
            </button>
            {catOpen && (
              <div className="absolute left-1/2 top-full mt-2 -ml-[310px] w-[620px] animate-fade-up rounded-2xl border border-border bg-elevated p-3 shadow-card">
                <div className="grid grid-cols-3">
                  {CATEGORY_GROUPS.map((group, gi) => (
                    <div key={group.title} className={gi > 0 ? "border-s border-border ps-2" : "pe-2"}>
                      <div className="px-3 pb-1.5 pt-1 text-[13px] font-bold text-foreground">{group.title}</div>
                      {group.items.map((it) => (
                        <Link
                          key={it.key}
                          href={`/category/${it.key}`}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface"
                        >
                          <CategoryIcon category={it.key} width={17} height={17} className="shrink-0 text-foreground" />
                          <span className="font-normal">{it.label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {MAIN_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(link.href) ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Logo />
      </div>

      {/* תפריט מובייל */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            <Link href="/compare" className="block rounded-xl px-3 py-3 text-sm hover:bg-surface">
              השוואה
            </Link>
            <Link href="/compatibility" className="block rounded-xl px-3 py-3 text-sm hover:bg-surface">
              בדיקת תאימות
            </Link>
            {CATEGORY_GROUPS.map((group, gi) => (
              <div key={group.title} className={gi > 0 ? "mt-1 border-t border-border pt-1" : ""}>
                <div className="px-3 pb-1 pt-2 text-[13px] font-bold text-foreground">{group.title}</div>
                <div className="grid grid-cols-2 gap-1">
                  {group.items.map((it) => (
                    <Link
                      key={it.key}
                      href={`/category/${it.key}`}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-surface"
                    >
                      <CategoryIcon category={it.key} width={16} height={16} className="shrink-0 text-foreground" />
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/blog" className="block rounded-xl px-3 py-3 text-sm hover:bg-surface">
              בלוג
            </Link>
            <Link href="/about" className="block rounded-xl px-3 py-3 text-sm hover:bg-surface">
              אודות
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
