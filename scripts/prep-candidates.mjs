// עיבוד קובצי UserBenchmark CSV -> מאגר מועמדים נקי לכל קטגוריה.
// פלט: scripts/_candidates.json  { [cat]: { existing:[{id,name}], candidates:[{brand,model,rank,benchmark,samples}] } }
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const COMP = path.join(ROOT, "data", "components");

// מיפוי קובץ CSV -> מפתח קטגוריה באתר
const CSV = {
  gpu: "GPU_UserBenchmarks (1).csv",
  cpu: "CPU_UserBenchmarks (2).csv",
  ram: "RAM_UserBenchmarks (1).csv",
  ssd: "SSD_UserBenchmarks (1).csv",
  hdd: "HDD_UserBenchmarks (1).csv",
  usb: "USB_UserBenchmarks (1).csv",
};

// פירוק שורת CSV: Type,Part,Brand,Model(may contain commas),Rank,Benchmark,Samples,URL
function parseRow(line) {
  const p = line.split(",");
  if (p.length < 8) return null;
  const type = p[0];
  const part = p[1];
  const brand = p[2];
  const url = p[p.length - 1];
  const samples = +p[p.length - 2];
  const benchmark = +p[p.length - 3];
  const rank = +p[p.length - 4];
  const model = p.slice(3, p.length - 4).join(",").trim();
  if (!model) return null;
  return { type, part, brand: brand.trim(), model, rank, benchmark, samples, url: url.trim() };
}

function loadCsv(file) {
  const txt = fs.readFileSync(path.join(ROOT, file), "utf8");
  const lines = txt.split(/\r?\n/).slice(1).filter((l) => l.trim());
  return lines.map(parseRow).filter(Boolean);
}

// קריאת רכיבים קיימים מתוך data/components/<cat>.ts (מערך JSON תקין)
function loadExisting(cat) {
  const f = path.join(COMP, `${cat}.ts`);
  if (!fs.existsSync(f)) return [];
  const txt = fs.readFileSync(f, "utf8");
  const eq = txt.indexOf("= ["); // דלג על "Component[]" שבטיפוס
  const a = eq < 0 ? -1 : txt.indexOf("[", eq);
  const b = txt.lastIndexOf("]");
  if (a < 0 || b < 0) return [];
  try {
    const arr = JSON.parse(txt.slice(a, b + 1));
    return arr.map((c) => ({ id: c.id, name: c.name, brand: c.brand }));
  } catch (e) {
    console.error(`parse existing ${cat} failed:`, e.message);
    return [];
  }
}

const REF_GPU = new Set(["nvidia", "amd", "intel"]);

function dedupeGpu(rows) {
  // קבץ לפי URL (=שבב). בחר שם קנוני: שורת היצרן הייחוס (Nvidia/AMD/Intel), אחרת הקצר ביותר.
  const byUrl = new Map();
  for (const r of rows) {
    const g = byUrl.get(r.url) ?? [];
    g.push(r);
    byUrl.set(r.url, g);
  }
  const out = [];
  for (const g of byUrl.values()) {
    let canon = g.find((r) => REF_GPU.has(r.brand.toLowerCase()));
    if (!canon) canon = g.slice().sort((a, b) => a.model.length - b.model.length)[0];
    // המותג הקנוני: אם שורת ייחוס -> השבב; אחרת נסה לזהות Nvidia/AMD/Intel מהשם
    let brand = canon.brand;
    const m = canon.model.toLowerCase();
    if (/\brtx\b|\bgtx\b|geforce|titan/.test(m)) brand = "NVIDIA";
    else if (/\brx\b|radeon/.test(m)) brand = "AMD";
    else if (/\barc\b/.test(m)) brand = "Intel";
    out.push({ brand, model: canon.model.replace(/\s+/g, " ").trim(), rank: canon.rank, benchmark: canon.benchmark, samples: g.reduce((s, r) => Math.max(s, r.samples), 0), url: canon.url });
  }
  return out;
}

function dedupeByModel(rows) {
  const byKey = new Map();
  for (const r of rows) {
    const key = `${r.brand.toLowerCase()}|${r.model.toLowerCase()}`;
    const prev = byKey.get(key);
    if (!prev || r.samples > prev.samples) byKey.set(key, r);
  }
  return [...byKey.values()];
}

const result = {};
const summary = [];
for (const [cat, file] of Object.entries(CSV)) {
  const rows = loadCsv(file);
  let uniq = cat === "gpu" ? dedupeGpu(rows) : dedupeByModel(rows);
  // מיון: שילוב פופולריות (samples) ודירוג. ניקח top ~80 לפי samples + top 40 לפי rank (איחוד).
  const bySamples = [...uniq].sort((a, b) => b.samples - a.samples);
  const byRank = [...uniq].sort((a, b) => a.rank - b.rank);
  const picked = new Map();
  // קודם דגמים מדורגים-גבוה (ביצועים/מודרני) כדי שישרדו, אז הפופולריים ביותר
  for (const r of byRank.slice(0, 38)) picked.set(r.url || r.model, r);
  for (const r of bySamples) {
    if (picked.size >= 70) break;
    picked.set(r.url || r.model, r);
  }
  const candidates = [...picked.values()]
    .sort((a, b) => b.samples - a.samples)
    .map((r) => ({ brand: r.brand, model: r.model, rank: r.rank, benchmark: r.benchmark, samples: r.samples }));
  const existing = loadExisting(cat);
  result[cat] = { existing, candidates };
  summary.push(`${cat}: existing=${existing.length} uniq=${uniq.length} candidates=${candidates.length}`);
}

fs.writeFileSync(path.join(ROOT, "scripts", "_candidates.json"), JSON.stringify(result), "utf8");
const bytes = fs.statSync(path.join(ROOT, "scripts", "_candidates.json")).size;
console.log(summary.join("\n"));
console.log(`\nwrote scripts/_candidates.json (${(bytes / 1024).toFixed(1)} KB)`);
// הצג דוגמת מועמדים מובילים לכל קטגוריה
for (const cat of Object.keys(CSV)) {
  console.log(`\n[${cat}] top 8:`);
  for (const c of result[cat].candidates.slice(0, 8)) console.log(`  ${c.brand} | ${c.model} | rank ${c.rank} | bench ${c.benchmark} | samples ${c.samples}`);
}
