// Phase 3: place the visually-verified images into public/components/ and emit
// the attribution data (required by the CC licenses). REJECTS were chosen by eye
// from the _montage2 sheets (charts, die shots, logos, landscapes, teardowns, wrong product).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STAGE = path.join(__dirname, "_imgstage");
const PUBLIC = path.join(__dirname, "..", "public", "components");
const DATA = path.join(__dirname, "..", "data");
const index = JSON.parse(fs.readFileSync(path.join(__dirname, "_finalindex.json"), "utf8"));

const REJECT = new Set([11, 14, 15, 17, 20, 24, 25, 29, 30, 31, 32, 33, 34, 50, 52, 56, 57, 62, 63, 67, 76, 77]);

const kept = index.filter((m) => !REJECT.has(m.idx));

// copy verified files
const credits = {};
const byCat = {};
for (const m of kept) {
  fs.copyFileSync(path.join(STAGE, m.file), path.join(PUBLIC, `${m.id}${path.extname(m.file)}`));
  credits[m.id] = {
    artist: m.artist || "Wikimedia Commons",
    license: m.license || "CC",
    source: m.pageUrl,
    title: m.title,
  };
  byCat[m.category] = (byCat[m.category] || 0) + 1;
}

// emit attribution module
const header = `// תמונות רכיבים מ-Wikimedia Commons — ייחוס לפי רישיון CC.\n// נוצר אוטומטית ע"י scripts/finalize-images.mjs. אל תערוך ידנית.\n`;
const body =
  `export interface ComponentCredit { artist: string; license: string; source: string; title: string; }\n\n` +
  `export const COMPONENT_CREDITS: Record<string, ComponentCredit> = ${JSON.stringify(credits, null, 2)};\n`;
fs.writeFileSync(path.join(DATA, "component-credits.ts"), header + body);

console.log(`kept ${kept.length} images`);
for (const c of Object.keys(byCat).sort()) console.log(`  ${c.padEnd(7)} ${byCat[c]}`);
console.log(`\ncredits written to data/component-credits.ts`);
