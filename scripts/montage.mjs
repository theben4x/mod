// Phase 2a: build labeled contact sheets of all staged candidates so they can
// be visually verified in a few reads. Each cell = image + "#index · category · name".
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STAGE = path.join(__dirname, "_imgstage");
const OUT = path.join(__dirname, "_montage");
const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "_imgmeta.json"), "utf8"));
const picked = meta.filter((m) => m.picked);

const CW = 360, IMGH = 250, LABELH = 70, CH = IMGH + LABELH;
const COLS = 4, ROWS = 4, PER = COLS * ROWS;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function cell(item, idx) {
  let img;
  try {
    img = await sharp(path.join(STAGE, item.picked.file))
      .resize(CW - 10, IMGH - 10, { fit: "inside", background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .toBuffer();
  } catch {
    img = await sharp({ create: { width: CW - 10, height: IMGH - 10, channels: 3, background: "#fee2e2" } }).png().toBuffer();
  }
  const name = item.name.length > 30 ? item.name.slice(0, 29) + "…" : item.name;
  const label = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${LABELH}">
       <rect width="${CW}" height="${LABELH}" fill="#0f172a"/>
       <text x="10" y="27" font-family="Arial" font-size="20" font-weight="bold" fill="#34d399">#${idx} · ${esc(item.category)}</text>
       <text x="10" y="54" font-family="Arial" font-size="17" fill="#e2e8f0">${esc(name)}</text>
     </svg>`,
  );
  return sharp({ create: { width: CW, height: CH, channels: 3, background: "#ffffff" } })
    .composite([{ input: img, left: 5, top: 5 }, { input: label, left: 0, top: IMGH }])
    .png()
    .toBuffer();
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const indexMap = picked.map((m, i) => ({ idx: i, id: m.id, name: m.name, category: m.category, title: m.picked.title }));
  fs.writeFileSync(path.join(__dirname, "_montageindex.json"), JSON.stringify(indexMap, null, 2));

  let sheet = 0;
  for (let s = 0; s < picked.length; s += PER) {
    const batch = picked.slice(s, s + PER);
    const cells = await Promise.all(batch.map((it, i) => cell(it, s + i)));
    const rows = Math.ceil(batch.length / COLS);
    const canvas = sharp({ create: { width: COLS * CW, height: rows * CH, channels: 3, background: "#e5e7eb" } });
    const comp = cells.map((buf, i) => ({ input: buf, left: (i % COLS) * CW, top: Math.floor(i / COLS) * CH }));
    await canvas.composite(comp).png().toFile(path.join(OUT, `sheet-${String(sheet).padStart(2, "0")}.png`));
    sheet++;
  }
  console.log(`picked=${picked.length}, sheets=${sheet}`);
})();
