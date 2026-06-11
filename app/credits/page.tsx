import type { Metadata } from "next";
import Link from "next/link";
import type { Component } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getComponent } from "@/lib/data";
import { COMPONENT_CREDITS, type ComponentCredit } from "@/data/component-credits";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "קרדיטים לתמונות",
  description: "ייחוס לתמונות המוצרים באתר — מקורן ב-Wikimedia Commons תחת רישיונות Creative Commons.",
  path: "/credits",
  noindex: true,
});

type Entry = { c: Component; cr: ComponentCredit };

export default function CreditsPage() {
  const entries: Entry[] = [];
  for (const [id, cr] of Object.entries(COMPONENT_CREDITS)) {
    const c = getComponent(id);
    if (c) entries.push({ c, cr });
  }
  entries.sort((a, b) => a.c.category.localeCompare(b.c.category) || a.c.name.localeCompare(b.c.name));

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "קרדיטים לתמונות" }]} />

      <header className="mt-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">קרדיטים לתמונות</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          תמונות המוצרים באתר מקורן ב־
          <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Wikimedia Commons</a>
          , ומוצגות תחת רישיונות Creative Commons בתודה לצלמים. שאר הרכיבים מוצגים עם סמל הקטגוריה עד שתתווסף תמונה. סה״כ {entries.length} תמונות.
        </p>
      </header>

      <ul className="card mt-8 divide-y divide-border overflow-hidden">
        {entries.map(({ c, cr }) => (
          <li key={c.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm sm:px-5">
            <Link href={`/component/${c.id}`} className="ltr min-w-0 flex-1 truncate font-medium transition-colors hover:text-accent">
              {c.name}
            </Link>
            <span className="flex shrink-0 items-center gap-2 text-xs text-muted">
              <span className="hidden max-w-[160px] truncate sm:inline">{cr.artist}</span>
              <span className="mono rounded bg-surface px-1.5 py-0.5">{cr.license}</span>
              <a href={cr.source} target="_blank" rel="noopener noreferrer" className="shrink-0 text-accent hover:underline">
                מקור ↗
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
