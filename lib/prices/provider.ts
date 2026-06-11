import "server-only";
import type { PriceQuote } from "@/lib/types";
import { fillPrices } from "@/lib/fx";
import { SEED_PRICES } from "@/data/prices";

// ───────────────────────────────────────────────────────────
// שכבת מחירים pluggable.
// ברירת מחדל: מחירי seed מקומיים. אם מוגדר PRICE_PROVIDER=http,
// המערכת שולפת מחירים חיים מ-API חיצוני, עם נפילה חיננית ל-seed.
// כדי לחבר ספק אמיתי — ערוך את HttpPriceProvider בלבד.
// ───────────────────────────────────────────────────────────

export interface PriceProvider {
  readonly name: string;
  getPrices(ids: string[]): Promise<Record<string, PriceQuote>>;
}

/** ציטוט seed עבור מזהה בודד (תמיד זמין כגיבוי). */
function seedQuote(id: string): PriceQuote {
  const seed = SEED_PRICES[id];
  const filled = fillPrices(seed?.ils ?? null, seed?.usd ?? null);
  return {
    id,
    ils: filled.ils,
    usd: filled.usd,
    updatedAt: seed?.updatedAt ?? null,
    url: seed?.url ?? null,
    source: "seed",
  };
}

class SeedPriceProvider implements PriceProvider {
  readonly name = "seed";
  async getPrices(ids: string[]): Promise<Record<string, PriceQuote>> {
    const out: Record<string, PriceQuote> = {};
    for (const id of ids) out[id] = seedQuote(id);
    return out;
  }
}

class HttpPriceProvider implements PriceProvider {
  readonly name = "http";
  constructor(
    private url: string,
    private key?: string,
  ) {}

  async getPrices(ids: string[]): Promise<Record<string, PriceQuote>> {
    const out: Record<string, PriceQuote> = {};
    try {
      const u = new URL(this.url);
      u.searchParams.set("ids", ids.join(","));
      const res = await fetch(u, {
        headers: this.key ? { Authorization: `Bearer ${this.key}` } : {},
        next: { revalidate: 1800 }, // קאש של 30 דקות
      });
      if (!res.ok) throw new Error(`price API ${res.status}`);
      const data = (await res.json()) as Record<
        string,
        { ils?: number | null; usd?: number | null; updatedAt?: string | null; url?: string | null }
      >;
      for (const id of ids) {
        const row = data[id];
        if (row && (row.ils != null || row.usd != null)) {
          const filled = fillPrices(row.ils ?? null, row.usd ?? null);
          out[id] = {
            id,
            ils: filled.ils,
            usd: filled.usd,
            updatedAt: row.updatedAt ?? null,
            url: row.url ?? null,
            source: this.name,
          };
        } else {
          out[id] = seedQuote(id); // נפילה ל-seed עבור מזהה חסר
        }
      }
    } catch {
      // נפילה חיננית מלאה ל-seed
      for (const id of ids) out[id] = seedQuote(id);
    }
    return out;
  }
}

let cached: PriceProvider | null = null;

export function getProvider(): PriceProvider {
  if (cached) return cached;
  const mode = (process.env.PRICE_PROVIDER ?? "seed").toLowerCase();
  if (mode === "http" && process.env.PRICE_API_URL) {
    cached = new HttpPriceProvider(process.env.PRICE_API_URL, process.env.PRICE_API_KEY);
  } else {
    cached = new SeedPriceProvider();
  }
  return cached;
}

/** ה-API הציבורי של השכבה: שליפת מחירים למספר מזהים. */
export async function getPrices(ids: string[]): Promise<Record<string, PriceQuote>> {
  if (ids.length === 0) return {};
  return getProvider().getPrices(ids);
}

export async function getPrice(id: string): Promise<PriceQuote> {
  const map = await getPrices([id]);
  return map[id] ?? seedQuote(id);
}
