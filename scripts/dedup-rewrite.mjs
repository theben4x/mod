// Robust dedup: import each category array, drop entries whose normalized name
// (manufacturer words + punctuation removed) collides with an earlier entry.
// Originals precede appended ones, so first-wins keeps originals. Rewrites the file.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "data", "components");
const CATS = ["gpu", "cpu", "ram", "ssd", "hdd", "usb", "psu", "mobo", "case", "cooler"];

const norm = (s) =>
  String(s).toLowerCase().replace(/\b(nvidia|amd|intel|corp|corporation)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

for (const cat of CATS) {
  const file = path.join(DATA, `${cat}.ts`);
  const text = fs.readFileSync(file, "utf8");
  const varName = (text.match(/export const (\w+)\s*:/) || [])[1];
  if (!varName) { console.log(`${cat}: no export var found, skip`); continue; }

  const mod = await import(pathToFileURL(file).href + "?t=" + (process.hrtime.bigint()));
  const arr = Object.values(mod).find(Array.isArray);
  if (!arr) { console.log(`${cat}: no array, skip`); continue; }

  const seenName = new Set(), seenId = new Set(), out = [], removed = [];
  for (const c of arr) {
    const k = norm(c.name);
    if (seenName.has(k) || seenId.has(c.id)) { removed.push(c.name); continue; }
    seenName.add(k); seenId.add(c.id); out.push(c);
  }

  const body = `import type { Component } from "@/lib/types";\n\nexport const ${varName}: Component[] = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync(file, body);
  console.log(`${cat.padEnd(7)} kept ${out.length}, removed ${removed.length}${removed.length ? " → " + removed.slice(0, 6).join(", ") + (removed.length > 6 ? " …" : "") : ""}`);
}
