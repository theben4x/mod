// Phase 1: query Wikimedia Commons for each component, score candidates,
// download the best thumbnail to a staging dir, and record attribution metadata.
// Verification of the picks happens afterwards (visually, via montages).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execP = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data", "components");
const STAGE = path.join(__dirname, "_imgstage");
const UA = "tested-hardware-site/1.0 (image sourcing for comparison catalog; contact gavrielbentouchama@gmail.com)";

const CATS = ["gpu", "cpu", "ram", "ssd", "hdd", "usb", "psu", "mobo", "case", "cooler"];
const BAD = /logo|diagram|chart|benchmark|schematic|socket|\bdie\b|wafer|video|screenshot|award|\bbox\b|packaging|render|\bicon\b|symbol|graph\b|\btable\b|advert|poster|sticker|unboxing|teardown|pinout/i;

// ---- extract id/name/brand from each data file (handles quoted + unquoted keys) ----
function readComponents() {
  const out = [];
  for (const cat of CATS) {
    const txt = fs.readFileSync(path.join(DATA, `${cat}.ts`), "utf8");
    const grab = (key) => [...txt.matchAll(new RegExp(`^\\s*"?${key}"?\\s*:\\s*"([^"]+)"`, "gm"))].map((m) => m[1]);
    const ids = grab("id"), names = grab("name"), brands = grab("brand");
    if (ids.length !== names.length || ids.length !== brands.length)
      console.error(`! ${cat}: mismatch ids=${ids.length} names=${names.length} brands=${brands.length}`);
    for (let i = 0; i < ids.length; i++) out.push({ id: ids[i], name: names[i], brand: brands[i], category: cat });
  }
  return out;
}

const stripTags = (s) => (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((t) => t.length > 1);

function scoreCandidate(title, qTokens) {
  if (BAD.test(title)) return -1;
  const ttok = new Set(tokens(title));
  let overlap = 0;
  for (const q of qTokens) if (ttok.has(q)) overlap++;
  return overlap;
}

async function commonsSearch(q) {
  const search = encodeURIComponent(`filetype:bitmap ${q}`);
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search` +
    `&gsrnamespace=6&gsrlimit=6&gsrsearch=${search}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=400`;
  const { stdout } = await execP(`curl -sk --max-time 30 -H "User-Agent: ${UA}" "${url}"`, { maxBuffer: 1024 * 1024 * 8 });
  const j = JSON.parse(stdout);
  const pages = j?.query?.pages ? Object.values(j.query.pages) : [];
  pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  return pages;
}

function candidatesFrom(pages, qTokens) {
  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii?.thumburl) return null;
      const title = p.title.replace(/^File:/, "");
      return {
        title,
        score: scoreCandidate(title, qTokens),
        thumbUrl: ii.thumburl,
        pageUrl: ii.descriptionurl,
        artist: stripTags(ii.extmetadata?.Artist?.value).slice(0, 120),
        license: stripTags(ii.extmetadata?.LicenseShortName?.value),
      };
    })
    .filter(Boolean)
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score);
}

async function download(url, dest) {
  await execP(`curl -sk --max-time 45 -H "User-Agent: ${UA}" -o "${dest}" "${url}"`, { maxBuffer: 1024 * 1024 * 16 });
  if (fs.statSync(dest).size < 1200) { fs.rmSync(dest); throw new Error("too small"); }
}

async function handle(c) {
  const qTokens = [...new Set(tokens(`${c.brand} ${c.name}`))];
  const nameTok = tokens(c.name);
  const queries = [`${c.brand} ${c.name}`];
  // fallback: brand + first two name tokens (full SKU names are often too specific for Commons)
  if (nameTok.length > 2) queries.push(`${c.brand} ${nameTok.slice(0, 2).join(" ")}`);

  let scored = [];
  for (const q of queries) {
    let pages;
    try { pages = await commonsSearch(q); } catch { continue; }
    scored = candidatesFrom(pages, qTokens);
    if (scored.length) break;
  }
  if (!scored.length) return { ...c, picked: null, reason: "no-candidate" };

  const best = scored[0];
  const ext = best.thumbUrl.toLowerCase().includes(".png") ? "png" : "jpg";
  try { await download(best.thumbUrl, path.join(STAGE, `${c.id}.${ext}`)); }
  catch (e) { return { ...c, picked: null, reason: "dl-fail:" + e.message }; }
  return { ...c, picked: { ...best, file: `${c.id}.${ext}` } };
}

async function pool(items, n, fn) {
  const res = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const idx = i++; res[idx] = await fn(items[idx]); if (idx % 25 === 0) process.stdout.write(`.${idx}`); }
  }));
  return res;
}

(async () => {
  fs.rmSync(STAGE, { recursive: true, force: true });
  fs.mkdirSync(STAGE, { recursive: true });
  const comps = readComponents();
  console.log(`components: ${comps.length}`);
  const results = await pool(comps, 6, handle);
  fs.writeFileSync(path.join(__dirname, "_imgmeta.json"), JSON.stringify(results, null, 2));
  const byCat = Object.fromEntries(CATS.map((c) => [c, { found: 0, total: 0 }]));
  for (const r of results) { byCat[r.category].total++; if (r.picked) byCat[r.category].found++; }
  console.log(`\n\nFOUND ${results.filter((r) => r.picked).length}/${comps.length}`);
  for (const cat of CATS) console.log(`  ${cat.padEnd(7)} ${byCat[cat].found}/${byCat[cat].total}`);
})();
