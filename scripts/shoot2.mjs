import puppeteer from "puppeteer-core";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUT = "C:\\Users\\בן\\Desktop\\mod\\shots";

const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });

async function shotShowcase(name, w) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 30000 });
  const handle = await page.evaluateHandle(() => {
    const h = [...document.querySelectorAll("h2")].find((e) => e.textContent.includes("לא רק טבלת מפרט"));
    return h ? h.closest("section") : document.body;
  });
  const el = handle.asElement();
  await el.scrollIntoView();
  await el.screenshot({ path: `${OUT}\\${name}.png` });
  await page.close();
}

await shotShowcase("showcase-d", 1280);
await shotShowcase("showcase-m", 412);
await browser.close();
console.log("done");
