// Phase 2b: objective cleanup before the final visual pass.
//  - drop corrupt/undecodable or tiny (<5KB, usually HTML error pages) downloads
//  - dedupe by Commons file title: if one image matched several components,
//    keep it only for the best-token-matching model, reject the rest
// Then re-montage the survivors (re-indexed) for a clean verification pass.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STAGE = path.join(__dirname, "_imgstage");
const OUT = path.join(__dirname, "_montage2");
const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "_imgmeta.json"), "utf8"));
const picked = meta.filter((m) => m.picked);

const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((t) => t.length > 1);
const overlap = (comp) => {
  const tt = new Set(tokens(comp.picked.title));
  return [...new Set(tokens(`${comp.brand} ${comp.name}`))].filter((t) => tt.has(t)).length;
};

(async () => {
  // 1) decode + size check
  const decoded = [];
  for (const m of picked) {
    const f = path.join(STAGE, m.picked.file);
    try {
      if (fs.statSync(f).size < 5000) throw new Error("tiny");
      const info = await sharp(f).metadata();
      if (!info.width || info.width < 80) throw new Error("toosmall");
      decoded.push(m);
    } catch {
      /* drop corrupt */
    }
  }

  // 2) dedupe by title
  const byTitle = new Map();
  for (const m of decoded) {
    const t = m.picked.title;
    const cur = byTitle.get(t);
    if (!cur || overlap(m) > overlap(cur)) byTitle.set(t, m);
  }
  const survivors = [...byTitle.values()];

  console.log(`picked=${picked.length} → decoded=${decoded.length} → afterDedup=${survivors.length}`);

  // 3) re-montage survivors
  const CW = 360, IMGH = 250, LABELH = 70, CH = IMGH + LABELH, COLS = 4, ROWS = 4, PER = COLS * ROWS;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(__dirname, "_finalindex.json"),
    JSON.stringify(survivors.map((m, i) => ({ idx: i, id: m.id, name: m.name, category: m.category, file: m.picked.file, title: m.picked.title, artist: m.picked.artist, license: m.picked.license, pageUrl: m.picked.pageUrl })), null, 2));

  async function cell(item, idx) {
    const img = await sharp(path.join(STAGE, item.picked.file))
      .resize(CW - 10, IMGH - 10, { fit: "inside", background: "#ffffff" }).flatten({ background: "#ffffff" }).toBuffer();
    const name = item.name.length > 30 ? item.name.slice(0, 29) + "…" : item.name;
    const label = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${LABELH}"><rect width="${CW}" height="${LABELH}" fill="#0f172a"/>` +
      `<text x="10" y="27" font-family="Arial" font-size="20" font-weight="bold" fill="#34d399">#${idx} · ${esc(item.category)}</text>` +
      `<text x="10" y="54" font-family="Arial" font-size="17" fill="#e2e8f0">${esc(name)}</text></svg>`);
    return sharp({ create: { width: CW, height: CH, channels: 3, background: "#ffffff" } })
      .composite([{ input: img, left: 5, top: 5 }, { input: label, left: 0, top: IMGH }]).png().toBuffer();
  }

  let sheet = 0;
  for (let s = 0; s < survivors.length; s += PER) {
    const batch = survivors.slice(s, s + PER);
    const cells = await Promise.all(batch.map((it, i) => cell(it, s + i)));
    const rows = Math.ceil(batch.length / COLS);
    await sharp({ create: { width: COLS * CW, height: rows * CH, channels: 3, background: "#e5e7eb" } })
      .composite(cells.map((buf, i) => ({ input: buf, left: (i % COLS) * CW, top: Math.floor(i / COLS) * CH })))
      .png().toFile(path.join(OUT, `s${String(sheet).padStart(2, "0")}.png`));
    sheet++;
  }
  console.log(`sheets=${sheet}`);
})();
