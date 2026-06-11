import type { CategoryKey } from "./types";

export const SITE = {
  name: "tested",
  /** שם מלא לכותרות */
  longName: "tested — השוואת חומרה",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tested.co.il").replace(/\/$/, ""),
  locale: "he_IL",
  description:
    "tested — פלטפורמה להשוואת רכיבי חומרה זה מול זה: כרטיסי מסך, מעבדים, זיכרון, כונני SSD, ספקי כוח, לוחות אם, מארזים, פתרונות קירור ועוד. מפרט טכני מלא, מחירים מעודכנים וסימון מנצח בכל מדד.",
  tagline: "השוואת חומרה. בלי רעש.",
  keywords: [
    "השוואת חומרה",
    "השוואת כרטיסי מסך",
    "השוואת מעבדים",
    "GPU comparison",
    "CPU comparison",
    "מפרט טכני",
    "מחירי חומרה",
    "מחשב גיימינג",
    "בניית מחשב",
  ],
  twitter: "@tested_il",
  author: "צוות tested",
} as const;

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/compare", label: "השוואה" },
  { href: "/compatibility", label: "תאימות" },
  { href: "/category/gpu", label: "קטגוריות" },
  { href: "/blog", label: "בלוג" },
  { href: "/about", label: "אודות" },
];

export const FOOTER_CATEGORIES: { key: CategoryKey; href: string; label: string }[] = [
  { key: "gpu", href: "/category/gpu", label: "כרטיסי מסך" },
  { key: "cpu", href: "/category/cpu", label: "מעבדים" },
  { key: "ram", href: "/category/ram", label: "זיכרון RAM" },
  { key: "ssd", href: "/category/ssd", label: "כונני SSD" },
  { key: "hdd", href: "/category/hdd", label: "כוננים קשיחים" },
  { key: "usb", href: "/category/usb", label: "כוננים ניידים" },
  { key: "psu", href: "/category/psu", label: "ספקי כוח" },
  { key: "mobo", href: "/category/mobo", label: "לוחות אם" },
  { key: "case", href: "/category/case", label: "מארזים" },
  { key: "cooler", href: "/category/cooler", label: "פתרונות קירור" },
];

/** כתובת מוחלטת מנתיב יחסי */
export function absoluteUrl(path = ""): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
