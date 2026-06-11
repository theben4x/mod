// Merge web-verified components (scripts/_new_<cat>.json) into data/components/<cat>.ts.
// Validates schema keys, coerces types, dedupes vs existing + within batch,
// strips the non-schema `source` field into data/component-sources.json for provenance.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data", "components");

// key -> type per category ("i"=int, "d"=decimal, "b"=bool, "t"=text)
const SCHEMA = {
  gpu: { vram: "i", memoryType: "t", architecture: "t", boostClock: "i", cores: "i", rtCores: "i", tensorCores: "i", upscaling: "t", memoryBus: "i", bandwidth: "i", tdp: "i", process: "i", pcie: "t", recommendedPsu: "i" },
  cpu: { cores: "i", threads: "i", baseClock: "d", boostClock: "d", l3Cache: "i", tdp: "i", process: "i", socket: "t", memorySupport: "t", igpu: "t", unlocked: "b" },
  ram: { capacity: "i", type: "t", speed: "i", casLatency: "i", kit: "t", voltage: "d", profile: "t", rgb: "b" },
  ssd: { capacity: "i", interface: "t", formFactor: "t", seqRead: "i", seqWrite: "i", randomRead: "i", randomWrite: "i", tbw: "i", dram: "b", nandType: "t" },
  psu: { wattage: "i", efficiency: "t", modular: "t", formFactor: "t", atx3: "b", fanSize: "i", warranty: "i", zeroRpm: "b" },
  mobo: { socket: "t", chipset: "t", formFactor: "t", memoryType: "t", memorySlots: "i", maxMemory: "i", m2Slots: "i", pcieVersion: "t", wifi: "t", lan: "t" },
  hdd: { capacity: "i", rpm: "i", cache: "i", seqRead: "i", interface: "t", formFactor: "t", recordingTech: "t", usage: "t", workloadRate: "i", warranty: "i" },
  usb: { capacity: "i", interface: "t", connector: "t", seqRead: "i", seqWrite: "i", driveType: "t", encryption: "t", warranty: "i" },
  case: { type: "t", motherboardSupport: "t", maxGpuLength: "i", maxCoolerHeight: "i", maxRadiator: "i", psuFormFactor: "t", fans: "i", driveBays: "t", frontIo: "t" },
  cooler: { type: "t", socketSupport: "t", tdpRating: "i", height: "i", radiatorSize: "i", fanSize: "i", noiseLevel: "d", rgb: "b" },
};
const CATS = Object.keys(SCHEMA);

const kebab = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function coerce(v, t) {
  if (v === null || v === undefined || v === "") return t === "b" ? false : null;
  if (t === "i") { const n = Math.round(Number(String(v).replace(/[^0-9.\-]/g, ""))); return Number.isFinite(n) ? n : null; }
  if (t === "d") { const n = Number(String(v).replace(/[^0-9.\-]/g, "")); return Number.isFinite(n) ? n : null; }
  if (t === "b") return v === true || v === "true" || v === "yes" || v === 1;
  return String(v).trim();
}
const existingFrom = (txt) => ({
  ids: new Set([...txt.matchAll(/^\s*"?id"?\s*:\s*"([^"]+)"/gm)].map((m) => m[1])),
  names: new Set([...txt.matchAll(/^\s*"?name"?\s*:\s*"([^"]+)"/gm)].map((m) => m[1].toLowerCase())),
});

const sources = fs.existsSync(path.join(ROOT, "data", "component-sources.json"))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, "data", "component-sources.json"), "utf8")) : {};

const report = {};
for (const cat of CATS) {
  const newFile = path.join(__dirname, `_new_${cat}.json`);
  if (!fs.existsSync(newFile)) { report[cat] = "no file"; continue; }
  let raw;
  try { raw = JSON.parse(fs.readFileSync(newFile, "utf8")); } catch (e) { report[cat] = "BAD JSON: " + e.message; continue; }
  if (!Array.isArray(raw)) { report[cat] = "not an array"; continue; }

  const file = path.join(DATA, `${cat}.ts`);
  let txt = fs.readFileSync(file, "utf8");
  const { ids, names } = existingFrom(txt);
  const schema = SCHEMA[cat];
  const keys = Object.keys(schema);
  const accepted = [];

  for (const o of raw) {
    if (!o || !o.name || !o.brand) continue;
    const id = kebab(o.id || o.name);
    if (!id || ids.has(id) || names.has(String(o.name).toLowerCase())) continue;
    // require at least ~70% of spec keys present and non-null
    const specsIn = o.specs || {};
    const specs = {};
    let present = 0;
    for (const k of keys) {
      const val = coerce(specsIn[k], schema[k]);
      if (val !== null && !(schema[k] === "t" && val === "")) present++;
      specs[k] = val;
    }
    if (present < Math.ceil(keys.length * 0.7)) continue; // too incomplete → skip

    const comp = {
      id, name: String(o.name), brand: String(o.brand), category: cat,
      year: coerce(o.year, "i") ?? 2024,
      score: Math.max(0, Math.min(100, coerce(o.score, "i") ?? 60)),
      ...(o.blurb ? { blurb: String(o.blurb) } : {}),
      specs,
    };
    accepted.push(comp);
    ids.add(id); names.add(comp.name.toLowerCase());
    if (o.source) sources[id] = String(o.source);
  }

  if (accepted.length) {
    const block = accepted.map((c) => JSON.stringify(c, null, 2).split("\n").map((l) => "  " + l).join("\n")).join(",\n");
    const marker = txt.lastIndexOf("\n];");
    txt = txt.slice(0, marker) + ",\n" + block + txt.slice(marker);
    fs.writeFileSync(file, txt);
  }
  report[cat] = `${accepted.length} added (of ${raw.length})`;
}

fs.writeFileSync(path.join(ROOT, "data", "component-sources.json"), JSON.stringify(sources, null, 2));
console.log("MERGE REPORT:");
for (const cat of CATS) console.log(`  ${cat.padEnd(7)} ${report[cat]}`);
