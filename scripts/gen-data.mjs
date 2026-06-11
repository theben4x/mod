// מחולל קבצי נתונים: ממיר את פלט מחקר הנתונים לקבצי TS מוקלדים.
// שימוש: node scripts/gen-data.mjs <path-to-output.json>
import fs from "node:fs";
import path from "node:path";

const outputPath = process.argv[2];
if (!outputPath) {
  console.error("usage: node scripts/gen-data.mjs <output.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const dataset = raw.result ?? raw;

const ROOT = path.resolve(process.cwd());
const COMP_DIR = path.join(ROOT, "data", "components");
const UPDATED_AT = "2026-06-07T09:00:00Z";

const VAR_NAMES = { gpu: "gpus", cpu: "cpus", ram: "ram", ssd: "ssds", hdd: "hdds", usb: "usbs", psu: "psus", mobo: "mobos" };

// תיקוני נתונים נקודתיים
function fix(item) {
  const s = item.specs ?? {};
  if (item.id === "arc-b580" && s.cores === 20) s.cores = 2560; // Xe-cores → shader count
  if (s.fanSize === 0) s.fanSize = null; // ספק fanless
  return item;
}

const prices = {};

for (const [cat, items] of Object.entries(dataset)) {
  const cleaned = items.map((it) => {
    fix(it);
    if (it.priceIls != null || it.priceUsd != null) {
      prices[it.id] = { ils: it.priceIls ?? null, usd: it.priceUsd ?? null, updatedAt: UPDATED_AT };
    }
    return {
      id: it.id,
      name: it.name,
      brand: it.brand,
      category: cat,
      year: it.year,
      score: it.score,
      blurb: it.blurb,
      specs: it.specs,
    };
  });

  const varName = VAR_NAMES[cat];
  const body = `import type { Component } from "@/lib/types";

export const ${varName}: Component[] = ${JSON.stringify(cleaned, null, 2)};
`;
  fs.writeFileSync(path.join(COMP_DIR, `${cat}.ts`), body, "utf8");
  console.log(`wrote data/components/${cat}.ts (${cleaned.length} items)`);
}

// prices.ts
const priceBody = `// ───────────────────────────────────────────────────────────
// מחירי seed (גיבוי). משמשים כש-PRICE_PROVIDER=seed או כשה-API נכשל.
// נוצר אוטומטית ממנגנון איסוף הנתונים. ערכים ב-ILS/USD (street price משוער).
// ───────────────────────────────────────────────────────────

export interface SeedPrice {
  ils: number | null;
  usd: number | null;
  updatedAt: string | null;
  url?: string | null;
}

export const SEED_PRICES: Record<string, SeedPrice> = ${JSON.stringify(prices, null, 2)};
`;
fs.writeFileSync(path.join(ROOT, "data", "prices.ts"), priceBody, "utf8");
console.log(`wrote data/prices.ts (${Object.keys(prices).length} prices)`);
