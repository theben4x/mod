import type { TickerItem } from "@/lib/types";

// פריטי ה-News Ticker (Geist Mono). מתעדכן ידנית או ממקור חדשות בעתיד.
export const TICKER_ITEMS: TickerItem[] = [
  { kind: "release", text: "NVIDIA RTX 5090 — 32GB GDDR7, הדגל החדש", href: "/category/gpu" },
  { kind: "price-down", text: "RTX 4070 ירד ל-₪2,600", href: "/compare/rtx-4070-vs-rx-9070" },
  { kind: "news", text: "AMD RDNA4 — RX 9070 XT מציג ערך מנצח ב-1440p", href: "/category/gpu" },
  { kind: "release", text: "Ryzen 9 9950X3D — 16 ליבות Zen 5 עם 3D V-Cache", href: "/category/cpu" },
  { kind: "tip", text: "טיפ: ל-Ryzen X3D בחרו DDR5-6000 CL30", href: "/category/ram" },
  { kind: "news", text: "PCIe 5.0 SSD שובר שיא: 14,500MB/s", href: "/compare/crucial-t705-2tb-vs-samsung-990-pro-2tb" },
  { kind: "price-up", text: "מחירי DDR5 בעלייה קלה החודש", href: "/category/ram" },
  { kind: "tip", text: "ספק בתקן ATX 3.0 מומלץ לכרטיסי RTX 50", href: "/category/psu" },
  { kind: "release", text: "Intel Core Ultra 9 285K — Arrow Lake על LGA1851", href: "/category/cpu" },
  { kind: "news", text: "Intel Arc B580 — 12GB במחיר תקציבי", href: "/compare/arc-b580-vs-rx-7600" },
];
