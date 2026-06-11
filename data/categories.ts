import type { CategoryDef, CategoryKey } from "@/lib/types";

// ───────────────────────────────────────────────────────────
// הגדרות הקטגוריות + סכמת המפרט של כל סוג רכיב.
// higherIsBetter: true=גבוה טוב | false=נמוך טוב | null=ניטרלי (ללא מנצח)
// ───────────────────────────────────────────────────────────

export const CATEGORIES: Record<CategoryKey, CategoryDef> = {
  gpu: {
    key: "gpu",
    nameHe: "כרטיס מסך",
    pluralHe: "כרטיסי מסך",
    nameEn: "Graphics Card",
    icon: "▰",
    tagline: "השוואת ביצועי גרפיקה, זיכרון VRAM וצריכת חשמל בין כרטיסי מסך",
    headlineSpec: "cores",
    fields: [
      { key: "vram", label: "זיכרון VRAM", unit: "GB", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "memoryType", label: "סוג זיכרון", format: "text", higherIsBetter: null },
      { key: "architecture", label: "ארכיטקטורה", format: "text", higherIsBetter: null },
      { key: "boostClock", label: "תדר Boost", unit: "MHz", format: "frequency", higherIsBetter: true, primary: true },
      { key: "cores", label: "ליבות עיבוד", hint: "CUDA / Stream Processors", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "rtCores", label: "ליבות Ray Tracing", format: "number", higherIsBetter: true },
      { key: "tensorCores", label: "ליבות Tensor / AI", format: "number", higherIsBetter: true },
      { key: "upscaling", label: "תמיכת Upscaling", hint: "DLSS / FSR / XeSS", format: "text", higherIsBetter: null },
      { key: "memoryBus", label: "רוחב פס זיכרון", unit: "bit", format: "number", higherIsBetter: true },
      { key: "bandwidth", label: "קצב העברת נתונים", unit: "GB/s", format: "number", higherIsBetter: true, primary: true },
      { key: "tdp", label: "צריכת חשמל (TDP)", unit: "W", format: "watts", higherIsBetter: false, primary: true },
      { key: "process", label: "תהליך ייצור", unit: "nm", format: "number", higherIsBetter: false },
      { key: "pcie", label: "ממשק PCIe", format: "text", higherIsBetter: null },
      { key: "recommendedPsu", label: "ספק כוח מומלץ", unit: "W", format: "watts", higherIsBetter: null },
    ],
  },

  cpu: {
    key: "cpu",
    nameHe: "מעבד",
    pluralHe: "מעבדים",
    nameEn: "Processor",
    icon: "▣",
    tagline: "השוואת ליבות, תדרים, מטמון וצריכת חשמל בין מעבדים",
    headlineSpec: "cores",
    fields: [
      { key: "cores", label: "ליבות", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "threads", label: "תהליכונים (Threads)", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "baseClock", label: "תדר בסיס", unit: "GHz", format: "decimal", higherIsBetter: true },
      { key: "boostClock", label: "תדר Boost", unit: "GHz", format: "decimal", higherIsBetter: true, primary: true },
      { key: "l3Cache", label: "מטמון L3", unit: "MB", format: "number", higherIsBetter: true, primary: true },
      { key: "tdp", label: "צריכת חשמל (TDP)", unit: "W", format: "watts", higherIsBetter: false, primary: true },
      { key: "process", label: "תהליך ייצור", unit: "nm", format: "number", higherIsBetter: false },
      { key: "socket", label: "סוקט", format: "text", higherIsBetter: null, primary: true },
      { key: "memorySupport", label: "תמיכת זיכרון", format: "text", higherIsBetter: null },
      { key: "igpu", label: "גרפיקה מובנית", format: "text", higherIsBetter: null },
      { key: "unlocked", label: "ניתן ל-Overclock", format: "boolean", higherIsBetter: null },
    ],
  },

  ram: {
    key: "ram",
    nameHe: "זיכרון",
    pluralHe: "ערכות זיכרון",
    nameEn: "Memory",
    icon: "▤",
    tagline: "השוואת קיבולת, מהירות (MT/s) והשהיית CAS בין ערכות זיכרון",
    headlineSpec: "speed",
    fields: [
      { key: "capacity", label: "קיבולת כוללת", unit: "GB", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "type", label: "סוג", format: "text", higherIsBetter: null, primary: true },
      { key: "speed", label: "מהירות", unit: "MT/s", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "casLatency", label: "השהיית CAS (CL)", format: "number", higherIsBetter: false, primary: true },
      { key: "kit", label: "תצורת ערכה", hint: "מספר מקלות × קיבולת", format: "text", higherIsBetter: null },
      { key: "voltage", label: "מתח", unit: "V", format: "decimal", higherIsBetter: false },
      { key: "profile", label: "פרופיל אוברקלוק", hint: "XMP / EXPO", format: "text", higherIsBetter: null },
      { key: "rgb", label: "תאורת RGB", format: "boolean", higherIsBetter: null },
    ],
  },

  ssd: {
    key: "ssd",
    nameHe: "כונן SSD",
    pluralHe: "כונני SSD",
    nameEn: "SSD",
    icon: "▥",
    tagline: "השוואת מהירויות קריאה/כתיבה, קיבולת וסיבולת (TBW) בין כונני SSD",
    headlineSpec: "seqRead",
    fields: [
      { key: "capacity", label: "קיבולת", unit: "GB", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "interface", label: "ממשק", format: "text", higherIsBetter: null, primary: true },
      { key: "formFactor", label: "תצורה", format: "text", higherIsBetter: null },
      { key: "seqRead", label: "קריאה רציפה", unit: "MB/s", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "seqWrite", label: "כתיבה רציפה", unit: "MB/s", format: "number", higherIsBetter: true, primary: true },
      { key: "randomRead", label: "קריאה אקראית", unit: "IOPS", format: "number", higherIsBetter: true },
      { key: "randomWrite", label: "כתיבה אקראית", unit: "IOPS", format: "number", higherIsBetter: true },
      { key: "tbw", label: "סיבולת כתיבה (TBW)", unit: "TB", format: "number", higherIsBetter: true, primary: true },
      { key: "dram", label: "מטמון DRAM", format: "boolean", higherIsBetter: true },
      { key: "nandType", label: "סוג NAND", format: "text", higherIsBetter: null },
    ],
  },

  psu: {
    key: "psu",
    nameHe: "ספק כוח",
    pluralHe: "ספקי כוח",
    nameEn: "Power Supply",
    icon: "▦",
    tagline: "השוואת הספק, דירוג נצילות (80+) ומודולריות בין ספקי כוח",
    headlineSpec: "wattage",
    fields: [
      { key: "wattage", label: "הספק", unit: "W", format: "watts", higherIsBetter: true, primary: true, weight: 2 },
      { key: "efficiency", label: "דירוג נצילות", hint: "80 PLUS", format: "text", higherIsBetter: null, primary: true },
      { key: "modular", label: "מודולריות", format: "text", higherIsBetter: null, primary: true },
      { key: "formFactor", label: "תצורה", format: "text", higherIsBetter: null },
      { key: "atx3", label: "תקן ATX 3.0 / PCIe 5.0", format: "boolean", higherIsBetter: true, primary: true },
      { key: "fanSize", label: "מאוורר", unit: "mm", format: "number", higherIsBetter: null },
      { key: "warranty", label: "אחריות", unit: "שנים", format: "number", higherIsBetter: true, primary: true },
      { key: "zeroRpm", label: "מצב Zero RPM", format: "boolean", higherIsBetter: null },
    ],
  },

  mobo: {
    key: "mobo",
    nameHe: "לוח אם",
    pluralHe: "לוחות אם",
    nameEn: "Motherboard",
    icon: "▧",
    tagline: "השוואת סוקט, ערכת שבבים, חריצי זיכרון ו-M.2 בין לוחות אם",
    headlineSpec: "m2Slots",
    fields: [
      { key: "socket", label: "סוקט", format: "text", higherIsBetter: null, primary: true },
      { key: "chipset", label: "ערכת שבבים", format: "text", higherIsBetter: null, primary: true },
      { key: "formFactor", label: "תצורה", format: "text", higherIsBetter: null, primary: true },
      { key: "memoryType", label: "סוג זיכרון", format: "text", higherIsBetter: null },
      { key: "memorySlots", label: "חריצי זיכרון", format: "number", higherIsBetter: true },
      { key: "maxMemory", label: "זיכרון מקסימלי", unit: "GB", format: "number", higherIsBetter: true, primary: true },
      { key: "m2Slots", label: "חריצי M.2", format: "number", higherIsBetter: true, primary: true },
      { key: "pcieVersion", label: "גרסת PCIe", format: "text", higherIsBetter: null },
      { key: "wifi", label: "Wi-Fi מובנה", format: "text", higherIsBetter: null, primary: true },
      { key: "lan", label: "רשת (LAN)", format: "text", higherIsBetter: null },
    ],
  },

  hdd: {
    key: "hdd",
    nameHe: "כונן קשיח",
    pluralHe: "כוננים קשיחים",
    nameEn: "Hard Drive",
    icon: "▨",
    tagline: "השוואת קיבולת, מהירות סיבוב (RPM), מטמון ומהירות העברה בין כוננים קשיחים",
    headlineSpec: "capacity",
    fields: [
      { key: "capacity", label: "קיבולת", unit: "TB", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "rpm", label: "מהירות סיבוב", unit: "RPM", format: "number", higherIsBetter: true, primary: true },
      { key: "cache", label: "מטמון", unit: "MB", format: "number", higherIsBetter: true, primary: true },
      { key: "seqRead", label: "קצב העברה", unit: "MB/s", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "interface", label: "ממשק", format: "text", higherIsBetter: null },
      { key: "formFactor", label: "תצורה", format: "text", higherIsBetter: null },
      { key: "recordingTech", label: "טכנולוגיית הקלטה", hint: "CMR / SMR", format: "text", higherIsBetter: null },
      { key: "usage", label: "ייעוד", hint: "Desktop / NAS / Surveillance", format: "text", higherIsBetter: null, primary: true },
      { key: "workloadRate", label: "עומס עבודה שנתי", unit: "TB/שנה", format: "number", higherIsBetter: true },
      { key: "warranty", label: "אחריות", unit: "שנים", format: "number", higherIsBetter: true, primary: true },
    ],
  },

  usb: {
    key: "usb",
    nameHe: "כונן נייד",
    pluralHe: "כוננים ניידים",
    nameEn: "USB Drive",
    icon: "▩",
    tagline: "השוואת קיבולת, ממשק USB ומהירויות קריאה/כתיבה בין כוננים ניידים והתקני USB",
    headlineSpec: "seqRead",
    fields: [
      { key: "capacity", label: "קיבולת", unit: "GB", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "interface", label: "ממשק USB", format: "text", higherIsBetter: null, primary: true },
      { key: "connector", label: "מחבר", format: "text", higherIsBetter: null, primary: true },
      { key: "seqRead", label: "קצב קריאה", unit: "MB/s", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "seqWrite", label: "קצב כתיבה", unit: "MB/s", format: "number", higherIsBetter: true, primary: true },
      { key: "driveType", label: "סוג כונן", format: "text", higherIsBetter: null },
      { key: "encryption", label: "הצפנה", format: "text", higherIsBetter: null },
      { key: "warranty", label: "אחריות", unit: "שנים", format: "number", higherIsBetter: true },
    ],
  },

  case: {
    key: "case",
    nameHe: "מארז",
    pluralHe: "מארזים",
    nameEn: "Case",
    icon: "▢",
    tagline: "השוואת תאימות לוח אם, מרווח לכרטיס מסך, גובה קירור ותמיכת רדיאטור בין מארזים",
    headlineSpec: "maxGpuLength",
    fields: [
      { key: "type", label: "סוג מארז", format: "text", higherIsBetter: null, primary: true },
      { key: "motherboardSupport", label: "תמיכת לוח אם", hint: "תצורות נתמכות", format: "text", higherIsBetter: null, primary: true },
      { key: "maxGpuLength", label: "אורך כרטיס מסך מרבי", unit: "mm", format: "number", higherIsBetter: true, primary: true, weight: 2 },
      { key: "maxCoolerHeight", label: "גובה קירור אוויר מרבי", unit: "mm", format: "number", higherIsBetter: true, primary: true },
      { key: "maxRadiator", label: "רדיאטור מרבי", unit: "mm", format: "number", higherIsBetter: true },
      { key: "psuFormFactor", label: "תצורת ספק נתמכת", format: "text", higherIsBetter: null },
      { key: "fans", label: "מאווררים כלולים", format: "number", higherIsBetter: true },
      { key: "driveBays", label: "מפרצי כוננים", format: "text", higherIsBetter: null },
      { key: "frontIo", label: "חיבורים קדמיים", format: "text", higherIsBetter: null },
    ],
  },

  cooler: {
    key: "cooler",
    nameHe: "קירור",
    pluralHe: "פתרונות קירור",
    nameEn: "CPU Cooler",
    icon: "❄",
    tagline: "השוואת קיבולת קירור (TDP), תאימות סוקטים, גובה ורמת רעש בין מערכות קירור למעבד",
    headlineSpec: "tdpRating",
    fields: [
      { key: "type", label: "סוג", hint: "אוויר / נוזל (AIO)", format: "text", higherIsBetter: null, primary: true },
      { key: "socketSupport", label: "תאימות סוקטים", format: "text", higherIsBetter: null, primary: true },
      { key: "tdpRating", label: "קיבולת קירור", unit: "W", format: "watts", higherIsBetter: true, primary: true, weight: 2 },
      { key: "height", label: "גובה", hint: "רלוונטי לקירור אוויר", unit: "mm", format: "number", higherIsBetter: null, primary: true },
      { key: "radiatorSize", label: "גודל רדיאטור", hint: "ל-AIO", unit: "mm", format: "number", higherIsBetter: null },
      { key: "fanSize", label: "מאוורר", unit: "mm", format: "number", higherIsBetter: null },
      { key: "noiseLevel", label: "רמת רעש מרבית", unit: "dB", format: "decimal", higherIsBetter: false },
      { key: "rgb", label: "תאורת RGB", format: "boolean", higherIsBetter: null },
    ],
  },
};

export const CATEGORY_ORDER: CategoryKey[] = ["gpu", "cpu", "ram", "ssd", "hdd", "usb", "psu", "mobo", "case", "cooler"];

export const ALL_CATEGORIES: CategoryDef[] = CATEGORY_ORDER.map((k) => CATEGORIES[k]);

export function getCategory(key: string): CategoryDef | undefined {
  return (CATEGORIES as Record<string, CategoryDef>)[key];
}

export function isCategoryKey(key: string): key is CategoryKey {
  return key in CATEGORIES;
}

// ───────────────────────────────────────────────────────────
// צבע חתימה לכל קטגוריה (HSL) — להתמצאות ויזואלית.
// נבחרו גוונים מרוחקים זה מזה עם בהירות בינונית שעובדת גם בכהה וגם בהיר.
// ───────────────────────────────────────────────────────────
export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  gpu: "135 55% 40%", // הוזז מגוון ה-accent (158) כדי לא להתבלבל עם "מנצח"
  cpu: "212 72% 50%",
  ram: "275 58% 56%",
  ssd: "192 80% 38%",
  hdd: "32 85% 43%",
  usb: "330 68% 52%",
  psu: "0 72% 53%",
  mobo: "250 60% 60%",
  case: "96 52% 38%",
  cooler: "172 64% 40%",
};

/** מחזיר את צבע החתימה של הקטגוריה כמחרוזת HSL (לשימוש ב-hsl(...)). */
export function categoryColor(key: CategoryKey): string {
  return CATEGORY_COLORS[key];
}
