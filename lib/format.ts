import type { Currency, SpecField, SpecValue } from "./types";

const heNum = new Intl.NumberFormat("he-IL", { maximumFractionDigits: 2 });
const heInt = new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 });

/** מספר עם הפרדת אלפים (ל-Geist Mono) */
export function formatNumber(n: number, decimals = false): string {
  return decimals ? heNum.format(n) : heInt.format(n);
}

/** עיצוב ערך מפרט לפי סוג השדה. מחזיר { value, unit } להצגה נפרדת. */
export function formatSpec(field: SpecField, raw: SpecValue): { value: string; unit?: string } {
  if (raw === null || raw === undefined || raw === "") {
    return { value: "—" };
  }

  switch (field.format) {
    case "boolean":
      return { value: raw ? "כן" : "לא" };
    case "text":
      return { value: String(raw) };
    case "decimal":
      return { value: typeof raw === "number" ? formatNumber(raw, true) : String(raw), unit: field.unit };
    case "year":
      return { value: String(raw) };
    case "number":
    case "watts":
    case "frequency":
    case "bytes":
    default:
      return {
        value: typeof raw === "number" ? formatNumber(raw) : String(raw),
        unit: field.unit,
      };
  }
}

/** ערך מפרט כטקסט אחד (לשימוש ב-meta / aria) */
export function formatSpecText(field: SpecField, raw: SpecValue): string {
  const { value, unit } = formatSpec(field, raw);
  return unit ? `${value} ${unit}` : value;
}

export function currencySymbol(currency: Currency): string {
  return currency === "ILS" ? "₪" : "$";
}

/** עיצוב מחיר. amount ב-null → "—". */
export function formatPrice(amount: number | null, currency: Currency): string {
  if (amount === null || amount === undefined) return "—";
  const symbol = currencySymbol(currency);
  const rounded = Math.round(amount);
  return `${symbol}${heInt.format(rounded)}`;
}

/** "לפני 3 ימים" וכו' — זמן יחסי בעברית */
export function relativeTimeHe(iso: string | null, nowMs: number): string {
  if (!iso) return "לא ידוע";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "לא ידוע";
  const diff = Math.max(0, nowMs - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ממש עכשיו";
  if (min < 60) return `לפני ${min} דקות`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `לפני ${days} ימים`;
  const months = Math.floor(days / 30);
  if (months < 12) return `לפני ${months} חודשים`;
  return `לפני ${Math.floor(months / 12)} שנים`;
}

/** המרת מספר ל-slug באנגלית בטוח ל-URL */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
