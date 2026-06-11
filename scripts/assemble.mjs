// הרכבת הדאטה הסופית: ממזג רכיבים חדשים (_final_<cat>.json) עם הקיימים,
// מוודא מול סכמת המפרט, כותב data/components/<cat>.ts וממזג data/prices.ts.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const COMP = path.join(ROOT, "data", "components");
const SCRIPTS = path.join(ROOT, "scripts");
const UPDATED_AT = "2026-06-08T09:00:00Z";

const VAR_NAMES = { gpu: "gpus", cpu: "cpus", ram: "ram", ssd: "ssds", hdd: "hdds", usb: "usbs" };
const EXISTING_CATS = new Set(["gpu", "cpu", "ram", "ssd"]); // יש להם קובץ קיים למיזוג

// מפתחות המפרט הנדרשים לכל קטגוריה (חייב לתאום ל-data/categories.ts)
const FIELDS = {
  gpu: ["vram", "memoryType", "boostClock", "cores", "rtCores", "tensorCores", "memoryBus", "bandwidth", "tdp", "process", "recommendedPsu"],
  cpu: ["cores", "threads", "baseClock", "boostClock", "l3Cache", "tdp", "process", "socket", "memorySupport", "igpu", "unlocked"],
  ram: ["capacity", "type", "speed", "casLatency", "kit", "voltage", "profile", "rgb"],
  ssd: ["capacity", "interface", "formFactor", "seqRead", "seqWrite", "randomRead", "randomWrite", "tbw", "dram", "nandType"],
  hdd: ["capacity", "rpm", "cache", "seqRead", "interface", "formFactor", "recordingTech", "usage", "workloadRate", "warranty"],
  usb: ["capacity", "interface", "connector", "seqRead", "seqWrite", "driveType", "encryption", "warranty"],
};

function readArrayTs(file) {
  if (!fs.existsSync(file)) return [];
  const txt = fs.readFileSync(file, "utf8");
  const eq = txt.indexOf("= [");
  const a = eq < 0 ? -1 : txt.indexOf("[", eq);
  const b = txt.lastIndexOf("]");
  if (a < 0 || b < 0) return [];
  return JSON.parse(txt.slice(a, b + 1));
}

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  let txt = fs.readFileSync(file, "utf8").trim();
  // הסר עטיפת ```json אם הסוכן השאיר
  txt = txt.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(txt);
}

function readPrices() {
  const f = path.join(ROOT, "data", "prices.ts");
  const txt = fs.readFileSync(f, "utf8");
  const m = txt.indexOf("SEED_PRICES");
  const a = txt.indexOf("{", m);
  const b = txt.lastIndexOf("}");
  return JSON.parse(txt.slice(a, b + 1));
}

const warnings = [];
const slugSeen = {};
const prices = readPrices();
const existingPriceCount = Object.keys(prices).length;
const counts = {};

for (const [cat, varName] of Object.entries(VAR_NAMES)) {
  const reqKeys = FIELDS[cat];
  const existing = EXISTING_CATS.has(cat) ? readArrayTs(path.join(COMP, `${cat}.ts`)) : [];
  const finalFile = path.join(SCRIPTS, `_final_${cat}.json`);
  let incoming = readJson(finalFile);
  if (!Array.isArray(incoming)) {
    // נסה fallback ל-_gen אם המאמת לא הספיק
    incoming = readJson(path.join(SCRIPTS, `_gen_${cat}.json`)) || [];
    if (incoming.length) warnings.push(`${cat}: used _gen fallback (no _final)`);
  }

  const seen = new Set(existing.map((c) => c.id));
  slugSeen[cat] = seen;
  const merged = [...existing.map((c) => ({ ...c, category: cat }))];

  for (const raw of incoming) {
    if (!raw || typeof raw !== "object") continue;
    const id = String(raw.id || "").trim();
    if (!id) { warnings.push(`${cat}: dropped item with no id (${raw.name})`); continue; }
    if (seen.has(id)) { warnings.push(`${cat}: duplicate id "${id}" skipped`); continue; }
    const specs = raw.specs || {};
    // ולידציית מפתחות מפרט
    const missing = reqKeys.filter((k) => !(k in specs));
    const extra = Object.keys(specs).filter((k) => !reqKeys.includes(k));
    if (missing.length) warnings.push(`${cat}/${id}: missing specs [${missing.join(", ")}]`);
    if (extra.length) { for (const k of extra) delete specs[k]; }
    // נורמליזציה: רק המפתחות הנדרשים, בסדר הסכמה
    const cleanSpecs = {};
    for (const k of reqKeys) cleanSpecs[k] = k in specs ? specs[k] : null;
    const score = typeof raw.score === "number" ? Math.max(0, Math.min(100, Math.round(raw.score))) : undefined;
    seen.add(id);
    merged.push({
      id,
      name: String(raw.name || id),
      brand: String(raw.brand || ""),
      category: cat,
      year: Number(raw.year) || null,
      score,
      blurb: raw.blurb ? String(raw.blurb) : undefined,
      specs: cleanSpecs,
    });
    // מחירים
    const ils = raw.priceIls != null ? Number(raw.priceIls) : null;
    const usd = raw.priceUsd != null ? Number(raw.priceUsd) : null;
    if (ils != null || usd != null) prices[id] = { ils, usd, updatedAt: UPDATED_AT };
  }

  counts[cat] = { existing: existing.length, added: merged.length - existing.length, total: merged.length };

  const body = `import type { Component } from "@/lib/types";\n\nexport const ${varName}: Component[] = ${JSON.stringify(merged, null, 2)};\n`;
  fs.writeFileSync(path.join(COMP, `${cat}.ts`), body, "utf8");
}

// כתוב prices.ts ממוזג
const priceHeader = `// ───────────────────────────────────────────────────────────
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
fs.writeFileSync(path.join(ROOT, "data", "prices.ts"), priceHeader, "utf8");

console.log("=== assembled ===");
for (const [cat, c] of Object.entries(counts)) console.log(`${cat}: existing ${c.existing} + added ${c.added} = ${c.total}`);
console.log(`prices: ${existingPriceCount} -> ${Object.keys(prices).length}`);
console.log(`\nwarnings (${warnings.length}):`);
for (const w of warnings) console.log("  ! " + w);
