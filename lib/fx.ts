import type { Currency } from "./types";

/** שער המרה לגיבוי: 1 USD = X ILS (ניתן לעקיפה דרך env). */
export const USD_TO_ILS: number = (() => {
  const raw = process.env.NEXT_PUBLIC_USD_TO_ILS;
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 3.72;
})();

/** המרת סכום בין מטבעות. */
export function convert(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount;
  if (from === "USD" && to === "ILS") return amount * USD_TO_ILS;
  return amount / USD_TO_ILS;
}

/**
 * השלמת מחיר חסר: אם יש רק מטבע אחד, ממירים לשני לפי שער הגיבוי.
 * מחזיר { ils, usd } מלאים ככל האפשר.
 */
export function fillPrices(ils: number | null, usd: number | null): { ils: number | null; usd: number | null } {
  if (ils !== null && usd !== null) return { ils, usd };
  if (ils !== null && usd === null) return { ils, usd: Math.round(convert(ils, "ILS", "USD")) };
  if (usd !== null && ils === null) return { ils: Math.round(convert(usd, "USD", "ILS")), usd };
  return { ils: null, usd: null };
}
