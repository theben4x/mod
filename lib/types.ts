// ───────────────────────────────────────────────────────────
// tested — מודל הנתונים המרכזי
// כל הקטגוריות נשענות על אותו מנוע מפרט גנרי (SpecField).
// ───────────────────────────────────────────────────────────

export type CategoryKey = "gpu" | "cpu" | "ram" | "ssd" | "hdd" | "usb" | "psu" | "mobo" | "case" | "cooler";

/** סוג הערך של שדה מפרט בודד */
export type SpecValue = number | string | boolean | null;

/** איך לעצב ולהשוות שדה מפרט */
export type SpecFormat =
  | "number" // מספר רגיל (עם הפרדת אלפים)
  | "decimal" // מספר עם נקודה עשרונית
  | "text" // טקסט חופשי (לרוב אנגלית) — ללא ניצחון
  | "boolean" // כן/לא
  | "watts" // הספק
  | "frequency" // תדר (MHz/GHz)
  | "bytes" // קיבולת (GB/TB)
  | "year"; // שנה

export interface SpecField {
  /** מפתח ייחודי בתוך הקטגוריה (תואם למפתח ב-specs) */
  key: string;
  /** תווית בעברית */
  label: string;
  /** הסבר קצר (tooltip) — אופציונלי */
  hint?: string;
  /** יחידת מידה להצגה (נשמרת ב-Geist Mono) */
  unit?: string;
  format: SpecFormat;
  /** האם ערך גבוה = טוב יותר (לקביעת מנצח ולברים). null = ניטרלי, ללא ניצחון */
  higherIsBetter: boolean | null;
  /** משקל לחישוב ציון כולל (0 = לא נספר). ברירת מחדל 1 */
  weight?: number;
  /** האם להציג בכרטיס התקציר/בטבלה הראשית */
  primary?: boolean;
}

export interface CategoryDef {
  key: CategoryKey;
  /** שם בעברית (יחיד) */
  nameHe: string;
  /** שם בעברית (רבים) — לכותרות */
  pluralHe: string;
  /** שם באנגלית */
  nameEn: string;
  /** אימוji/אייקון קצר לשימוש בממשק */
  icon: string;
  /** משפט תיאור קצר ל-SEO ולעמוד הקטגוריה */
  tagline: string;
  /** שדות המפרט של הקטגוריה, לפי סדר תצוגה */
  fields: SpecField[];
  /** מפתח השדה שמשמש כ"ביצוע" עיקרי (לדירוג מהיר) — אופציונלי */
  headlineSpec?: string;
}

export interface Component {
  /** מזהה ייחודי / slug באנגלית, למשל "rtx-4090" */
  id: string;
  /** שם תצוגה באנגלית, למשל "GeForce RTX 4090" */
  name: string;
  /** יצרן/מותג */
  brand: string;
  category: CategoryKey;
  /** שנת יציאה */
  year: number;
  /** ערכי המפרט, לפי מפתחות ה-SpecField של הקטגוריה */
  specs: Record<string, SpecValue>;
  /** ציון ביצועים מנורמל 0-100 (אופציונלי, להשוואה מהירה) */
  score?: number;
  /** מילות תיאור קצרות בעברית */
  blurb?: string;
}

/** ציטוט מחיר משכבת המחירים */
export interface PriceQuote {
  id: string;
  ils: number | null;
  usd: number | null;
  /** ISO timestamp או null אם לא ידוע */
  updatedAt: string | null;
  /** קישור לחנות/מקור (אופציונלי) */
  url?: string | null;
  /** שם מקור המחיר (seed / שם ספק) */
  source: string;
}

export type Currency = "ILS" | "USD";
export type Theme = "light" | "dark";

/** תוצאת השוואה של שדה בודד בין שני רכיבים */
export interface SpecComparison {
  field: SpecField;
  a: SpecValue;
  b: SpecValue;
  /** "a" | "b" | "tie" | null(ניטרלי/לא ניתן להשוואה) */
  winner: "a" | "b" | "tie" | null;
  /** יחס הברים 0-1 עבור צד a ו-b (לפי הערך הגדול) */
  ratioA: number;
  ratioB: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date */
  date: string;
  author: string;
  /** דקות קריאה משוערות */
  readingMinutes: number;
  tags: string[];
  /** תוכן markdown (עברית, עם מונחים באנגלית) */
  body: string;
  /** קטגוריה רלוונטית (אופציונלי) לקישור פנימי */
  category?: CategoryKey;
}

export interface TickerItem {
  /** טקסט קצר (Geist Mono) */
  text: string;
  /** סוג, לצביעת אינדיקטור */
  kind: "news" | "price-up" | "price-down" | "release" | "tip";
  href?: string;
}

export interface PopularComparison {
  category: CategoryKey;
  a: string; // component id
  b: string; // component id
  /** כותרת קצרה אופציונלית */
  label?: string;
}
