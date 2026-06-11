"use client";

import { usePrefs } from "./Providers";
import { formatPrice, relativeTimeHe } from "@/lib/format";

interface Props {
  ils: number | null;
  usd: number | null;
  className?: string;
  updatedAt?: string | null;
}

export function PriceTag({ ils, usd, className = "" }: Props) {
  const { currency } = usePrefs();
  const amount = currency === "ILS" ? ils : usd;
  return <span className={`mono tabular-nums ${className}`}>{formatPrice(amount, currency)}</span>;
}

/** מציג מחיר + זמן עדכון יחסי (לכרטיס/עמוד) */
export function PriceWithTime({ ils, usd, updatedAt, className = "" }: Props) {
  const { currency } = usePrefs();
  const amount = currency === "ILS" ? ils : usd;
  const now = typeof window !== "undefined" ? Date.now() : 0;
  return (
    <span className={`inline-flex flex-col items-end ${className}`}>
      <span className="mono tabular-nums text-lg font-semibold">{formatPrice(amount, currency)}</span>
      {updatedAt && now > 0 && (
        <span className="mono text-[10px] text-muted">עודכן {relativeTimeHe(updatedAt, now)}</span>
      )}
    </span>
  );
}
