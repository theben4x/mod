import puppeteer from "puppeteer-core";
import fs from "node:fs";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:3000";
const OUT = "C:\\Users\\בן\\Desktop\\mod\\shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

async function measure(page, label) {
  const data = await page.evaluate(() => {
    const iw = window.innerWidth;
    const sw = document.documentElement.scrollWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // ב-RTL גלישה ימינה: right > innerWidth
      if (r.right > iw + 1 || r.left < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
        });
      }
    }
    offenders.sort((a, b) => b.right - a.right);
    return { iw, sw, overflow: sw - iw, offenders: offenders.slice(0, 12) };
  });
  console.log(`\n=== ${label} (innerWidth=${data.iw}, scrollWidth=${data.sw}, overflowX=${data.overflow}px) ===`);
  for (const o of data.offenders) console.log(`  ${o.tag}.${o.cls}  [l=${o.left} r=${o.right} w=${o.w}]`);
  return data;
}

const targets = [
  { url: "/", name: "home-d", w: 1280, h: 900, full: true },
  { url: "/compare/rtx-5090-vs-rtx-4090", name: "compare-d", w: 1100, h: 900, full: true },
  { url: "/category/gpu", name: "category-d", w: 1280, h: 900, full: false },
  { url: "/blog/how-much-vram-2026", name: "blog-d", w: 1100, h: 900, full: false },
];

for (const t of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: t.w, height: t.h, deviceScaleFactor: 1.5 });
  await page.goto(`${BASE}${t.url}`, { waitUntil: "networkidle0", timeout: 30000 });
  await measure(page, `${t.name} @${t.w}`);
  await page.screenshot({ path: `${OUT}\\${t.name}.png`, fullPage: t.full });
  await page.close();
}

await browser.close();
console.log("\ndone");
