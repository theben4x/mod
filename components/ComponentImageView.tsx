import Image from "next/image";
import type { Component } from "@/lib/types";
import { categoryColor } from "@/data/categories";
import { CategoryIcon } from "./CategoryIcon";

interface Props {
  component: Component;
  /** נתיב התמונה, או null ל-fallback. נפתר בצד-שרת ומועבר כ-prop (עובד גם ב-client). */
  src: string | null;
  /** מחלקות גודל/מסגרת לעטיפה (חובה רוחב+גובה כי התמונה היא fill) */
  className?: string;
  sizes?: string;
  iconSize?: number;
}

/**
 * הצגה טהורה של תמונת רכיב (ללא גישה למערכת הקבצים) — בטוח לשימוש גם ברכיבי client.
 * אם יש src — next/image עם object-contain על רקע בגוון הקטגוריה; אחרת אייקון fallback.
 */
export function ComponentImageView({ component, src, className = "", sizes = "128px", iconSize = 40 }: Props) {
  const tint = categoryColor(component.category);
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-border ${className}`}
      style={{ backgroundColor: `hsl(${tint} / 0.08)` }}
    >
      {src ? (
        <Image src={src} alt={component.name} fill sizes={sizes} className="object-contain p-2.5" />
      ) : (
        <CategoryIcon
          category={component.category}
          width={iconSize}
          height={iconSize}
          style={{ color: `hsl(${tint})`, opacity: 0.85 }}
        />
      )}
    </div>
  );
}
