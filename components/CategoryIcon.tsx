import type { SVGProps } from "react";
import type { CategoryKey } from "@/lib/types";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// אייקוני חומרה קוויים — צללית פשוטה וברורה לכל קטגוריה.
const ICONS: Record<CategoryKey, React.ReactNode> = {
  // כרטיס מסך — גוף הכרטיס + מאוורר + צלעות גוף קירור
  gpu: (
    <>
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <circle cx="8" cy="12" r="2.6" />
      <path d="M8 12h.01" />
      <path d="M13.5 10.5h5M13.5 13.5h5" />
      <path d="M6 17v2.4M17 17v2.4" />
    </>
  ),
  // מעבד — ריבוע עם רגליים בארבעת הצדדים וריבוע פנימי
  cpu: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  // זיכרון — מקל RAM עם מחיצות שבבים ופינים תחתונים
  ram: (
    <>
      <rect x="2" y="7" width="20" height="8" rx="1.5" />
      <path d="M7 7v8M12 7v8M17 7v8" />
      <path d="M5 15v2.4M9.5 15v2.4M14.5 15v2.4M19 15v2.4" />
    </>
  ),
  // SSD — כונן עם שבב בקר ומגעים
  ssd: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <rect x="6.5" y="9.5" width="5.5" height="5" rx="1" />
      <path d="M15 10.5h3M15 13.5h3" />
    </>
  ),
  // כונן קשיח — צלחת מסתובבת + ציר + זרוע קריאה
  hdd: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="11" cy="12" r="5" />
      <path d="M11 12h.01" />
      <path d="m14.6 8.4-2.9 2.9" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  // כונן נייד (USB) — דיסק-און-קי אופקי: גוף + מחבר מתכת
  usb: (
    <>
      <rect x="2.5" y="8" width="12" height="8" rx="1.5" />
      <path d="M14.5 10h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4z" />
      <path d="M5.5 12h4" />
    </>
  ),
  // ספק כוח — תיבה + מאוורר + סמל חשמל
  psu: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <circle cx="8.5" cy="12" r="3.2" />
      <path d="M8.5 12h.01" />
      <path d="M16.6 9.3 14.5 12.2H16.7L14.6 15" />
    </>
  ),
  // לוח אם — לוח + סוקט + חריצי זיכרון + קבלים
  mobo: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="6" y="6" width="6" height="6" rx="1" />
      <path d="M15 7h3M15 9.5h3M15 12h3" />
      <path d="M6.5 16h5" />
      <path d="M16 16h.01M8 18.5h.01" />
    </>
  ),
  // מארז — שלדת מגדל עם כפתור הפעלה וחריצי אוורור קדמיים
  case: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <circle cx="9" cy="6" r="1" />
      <path d="M12.5 5.5h3.5" />
      <path d="M8 11h8M8 14h8M8 17h5" />
    </>
  ),
  // קירור — פתית שלג (סמל קירור)
  cooler: (
    <>
      <path d="M12 3v18" />
      <path d="M4.2 7.5 19.8 16.5" />
      <path d="M19.8 7.5 4.2 16.5" />
      <path d="M9.5 4.8 12 6.4l2.5-1.6" />
      <path d="M9.5 19.2 12 17.6l2.5 1.6" />
    </>
  ),
};

/** אייקון חומרה לפי קטגוריה (סגנון קווי, currentColor). */
export function CategoryIcon({ category, ...props }: { category: CategoryKey } & IconProps) {
  return (
    <svg width={18} height={18} {...base} {...props}>
      {ICONS[category]}
    </svg>
  );
}
