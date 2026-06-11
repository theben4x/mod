import type { PopularComparison } from "@/lib/types";

// השוואות נפוצות (curated). כל המזהים תואמים לרכיבים קיימים בנתונים.
export const POPULAR_COMPARISONS: PopularComparison[] = [
  { category: "gpu", a: "rtx-5090", b: "rtx-4090", label: "דור מול דור" },
  { category: "gpu", a: "rtx-5070-ti", b: "rx-9070-xt", label: "הקרב על 1440p" },
  { category: "gpu", a: "rtx-4070", b: "rx-9070", label: "מעמד הביניים" },
  { category: "cpu", a: "ryzen-7-9800x3d", b: "intel-core-i9-14900k", label: "מלך הגיימינג" },
  { category: "cpu", a: "ryzen-9-9950x3d", b: "intel-core-ultra-9-285k", label: "דגל מול דגל" },
  { category: "cpu", a: "ryzen-7-7800x3d", b: "ryzen-7-9800x3d", label: "Zen 4 מול Zen 5" },
  { category: "ssd", a: "crucial-t705-2tb", b: "samsung-990-pro-2tb", label: "Gen5 מול Gen4" },
  { category: "ram", a: "gskill-trident-z5-neo-rgb-ddr5-6000-cl30", b: "corsair-vengeance-rgb-ddr5-6000-cl30", label: "ה-sweet spot" },
  { category: "psu", a: "corsair-rm850x-2024", b: "be-quiet-straight-power-12-850w", label: "850W פרימיום" },
  { category: "mobo", a: "asus-rog-strix-x670e-e-gaming-wifi", b: "msi-mag-b650-tomahawk-wifi", label: "X670E מול B650" },
  { category: "ssd", a: "samsung-9100-pro-2tb", b: "wd-black-sn8100-2tb", label: "קרב ה-Gen5" },
  { category: "gpu", a: "rtx-4080-super", b: "rtx-4070-ti-super", label: "עליון מול עליון" },
  { category: "hdd", a: "wd-red-pro-6tb", b: "wd-black-6tb", label: "NAS מול ביצועים" },
  { category: "usb", a: "samsung-t9-2tb", b: "sandisk-extreme-pro-portable-ssd-v2-2tb", label: "כונן נייד מהיר" },
];
