import { categoryColor } from "@/data/categories";
import type { CategoryKey } from "@/lib/types";

/**
 * זוהר רקע עדין בצבע החתימה של הקטגוריה — לראש דפי קטגוריה/השוואה/רכיב.
 * דורש הורה עם `relative isolate` כדי שה--z-10 יישאר מאחורי התוכן ולא מאחורי רקע הדף.
 */
export function CategoryGlow({ category }: { category: CategoryKey }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-64 max-w-3xl rounded-full blur-[130px]"
      style={{ background: `hsl(${categoryColor(category)} / 0.22)` }}
    />
  );
}
