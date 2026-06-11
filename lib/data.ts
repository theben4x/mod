import type { CategoryKey, Component } from "./types";
import { ALL_COMPONENTS } from "@/data/components";

// אינדקסים נבנים פעם אחת (module scope)
const byId = new Map<string, Component>();
const byCategory = new Map<CategoryKey, Component[]>();

for (const c of ALL_COMPONENTS) {
  byId.set(c.id, c);
  const list = byCategory.get(c.category) ?? [];
  list.push(c);
  byCategory.set(c.category, list);
}

export function getComponent(id: string): Component | undefined {
  return byId.get(id);
}

export function allComponents(): Component[] {
  return ALL_COMPONENTS;
}

export function getByCategory(category: CategoryKey): Component[] {
  return byCategory.get(category) ?? [];
}

export function categoryCount(category: CategoryKey): number {
  return byCategory.get(category)?.length ?? 0;
}

/** נרמול טקסט לחיפוש (מסיר רעשים) */
function norm(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/** חיפוש רכיבים לפי שם/מותג, אופציונלית מוגבל לקטגוריה. */
export function searchComponents(query: string, category?: CategoryKey, limit = 8): Component[] {
  const q = norm(query);
  const pool = category ? getByCategory(category) : ALL_COMPONENTS;
  if (!q) return [...pool].sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || b.year - a.year).slice(0, limit);

  const scored = pool
    .map((c) => {
      const name = norm(c.name);
      const brand = norm(c.brand);
      const hay = `${name} ${brand}`;
      let score = 0;
      if (name.startsWith(q)) score = 100;
      else if (name.includes(q)) score = 70;
      else if (hay.includes(q)) score = 50;
      else {
        // התאמת מילים חלקית
        const words = q.split(" ");
        const hits = words.filter((w) => hay.includes(w)).length;
        if (hits > 0) score = 20 + hits * 5;
      }
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (b.c.year - a.c.year));

  return scored.slice(0, limit).map((x) => x.c);
}

/** רכיבים דומים מאותה קטגוריה (לפי קרבת ציון/שנה), למעט הנתון. */
export function relatedComponents(component: Component, limit = 4): Component[] {
  return getByCategory(component.category)
    .filter((c) => c.id !== component.id)
    .sort((a, b) => {
      const da = Math.abs((a.score ?? 50) - (component.score ?? 50));
      const db = Math.abs((b.score ?? 50) - (component.score ?? 50));
      return da - db;
    })
    .slice(0, limit);
}

/** רכיבים מובילים בקטגוריה לפי ציון (לעמוד קטגוריה / דף בית). */
export function topComponents(category: CategoryKey, limit = 6): Component[] {
  return [...getByCategory(category)]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || b.year - a.year)
    .slice(0, limit);
}
