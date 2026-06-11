// One-off: stamp brand logos onto every GPU card image.
// rtx-* → NVIDIA RTX logo, gtx-* → NVIDIA GTX logo,
// rx-*  → AMD Radeon banner, arc-* → Intel logo.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DEST = path.join(ROOT, "public", "components");
const HOME = path.dirname(path.dirname(ROOT)); // C:\Users\בן  (…\Desktop\mod → …\)
const DESKTOP = path.join(HOME, "Desktop");

const SOURCES = {
  rtx: path.join(DESKTOP, "Nvidia-rtx-logo.png"),
  gtx: path.join(DESKTOP, "NVIDIA-GTX-LOGO.png"),
  rx: path.join(DESKTOP, "radeonrx6900xt-radeon-rx-graphics-banner.png"),
  arc: path.join(DESKTOP, "Intel_Inside_(logo,_2020).svg.png"),
};

// sanity: all sources present
for (const [k, p] of Object.entries(SOURCES)) {
  if (!fs.existsSync(p)) throw new Error(`missing source for ${k}: ${p}`);
}

// extract every GPU id from gpu.ts (one "id" per component, none nested in specs)
const gpuTs = fs.readFileSync(path.join(ROOT, "data", "components", "gpu.ts"), "utf8");
const ids = [...gpuTs.matchAll(/"id":\s*"([^"]+)"/g)].map((m) => m[1]);

const STALE_EXTS = [".webp", ".avif", ".jpg", ".jpeg"]; // png is overwritten directly
const counts = { rtx: 0, gtx: 0, rx: 0, arc: 0, skipped: [] };

for (const id of ids) {
  const key = id.startsWith("rtx-") ? "rtx"
    : id.startsWith("gtx-") ? "gtx"
    : id.startsWith("rx-") ? "rx"
    : id.startsWith("arc-") ? "arc"
    : null;
  if (!key) { counts.skipped.push(id); continue; }

  // remove any non-png variant so the logo is the single resolved image
  for (const ext of STALE_EXTS) {
    const stale = path.join(DEST, id + ext);
    if (fs.existsSync(stale)) fs.rmSync(stale);
  }
  fs.copyFileSync(SOURCES[key], path.join(DEST, id + ".png"));
  counts[key]++;
}

console.log(JSON.stringify({
  totalIds: ids.length,
  rtx: counts.rtx, gtx: counts.gtx, rx: counts.rx, arc: counts.arc,
  applied: counts.rtx + counts.gtx + counts.rx + counts.arc,
  skipped: counts.skipped,
}, null, 2));
