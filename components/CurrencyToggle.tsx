"use client";

import { usePrefs } from "./Providers";
import type { Currency } from "@/lib/types";

const OPTIONS: { value: Currency; symbol: string }[] = [
  { value: "ILS", symbol: "₪" },
  { value: "USD", symbol: "$" },
];

export function CurrencyToggle() {
  const { currency, setCurrency } = usePrefs();

  return (
    <div
      role="group"
      aria-label="בחירת מטבע"
      className="mono inline-flex items-center rounded-xl border border-border bg-surface p-0.5 text-sm"
    >
      {OPTIONS.map((opt) => {
        const active = currency === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setCurrency(opt.value)}
            aria-pressed={active}
            className={`grid h-8 w-8 place-items-center rounded-[10px] transition-all duration-200 ${
              active ? "bg-foreground text-background shadow-soft" : "text-muted hover:text-foreground"
            }`}
          >
            {opt.symbol}
          </button>
        );
      })}
    </div>
  );
}
