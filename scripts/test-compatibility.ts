// בדיקות רגרסיה למנוע התאימות (lib/compatibility.ts).
// מריצים: `npm run test:compat`  (Node 24 מריץ TypeScript ישירות עם type-stripping).
// כל בדיקה משתמשת ברכיבים אמיתיים מהקטלוג ובודקת את הסטטוס שכלל מסוים מחזיר —
// כך כל שינוי עתידי בכללים שישבור התנהגות נכונה ייתפס מיד.

import { evaluateBuild } from "../lib/compatibility.ts";
import type { BuildSelection } from "../lib/compatibility.ts";
import type { Component, CategoryKey } from "../lib/types.ts";
import { cpus } from "../data/components/cpu.ts";
import { mobos } from "../data/components/mobo.ts";
import { ram } from "../data/components/ram.ts";
import { gpus } from "../data/components/gpu.ts";
import { psus } from "../data/components/psu.ts";
import { ssds } from "../data/components/ssd.ts";
import { cases } from "../data/components/case.ts";
import { coolers } from "../data/components/cooler.ts";

const ALL: Component[] = [...cpus, ...mobos, ...ram, ...gpus, ...psus, ...ssds, ...cases, ...coolers];

function C(id: string): Component {
  const c = ALL.find((x) => x.id === id);
  if (!c) throw new Error("missing fixture id: " + id);
  return c;
}

/** בונה בחירה ממיפוי קטגוריה→מזהה. */
function build(parts: Partial<Record<CategoryKey, string>>): BuildSelection {
  const sel: BuildSelection = {};
  for (const k of Object.keys(parts) as CategoryKey[]) sel[k] = C(parts[k] as string);
  return sel;
}

let passed = 0;
const failures: string[] = [];

function statusOf(sel: BuildSelection, checkId: string): string | null {
  const chk = evaluateBuild(sel).checks.find((c) => c.id === checkId);
  return chk ? chk.status : null;
}

function expectStatus(name: string, parts: Partial<Record<CategoryKey, string>>, checkId: string, expected: string) {
  const sel = build(parts);
  const chk = evaluateBuild(sel).checks.find((c) => c.id === checkId);
  const actual = chk ? chk.status : null;
  if (actual === expected) passed++;
  else failures.push(`${name}: expected ${checkId}=${expected}, got ${actual}${chk ? ` ("${chk.detail}")` : ""}`);
}

function expectStatusNot(name: string, parts: Partial<Record<CategoryKey, string>>, checkId: string, notExpected: string) {
  const actual = statusOf(build(parts), checkId);
  if (actual !== null && actual !== notExpected) passed++;
  else failures.push(`${name}: expected ${checkId} present and != ${notExpected}, got ${actual}`);
}

function expectNoCheck(name: string, parts: Partial<Record<CategoryKey, string>>, checkId: string) {
  if (statusOf(build(parts), checkId) === null) passed++;
  else failures.push(`${name}: expected NO ${checkId}, but it was present`);
}

function expectOverall(name: string, parts: Partial<Record<CategoryKey, string>>, expected: string | null) {
  const actual = evaluateBuild(build(parts)).overall;
  if (actual === expected) passed++;
  else failures.push(`${name}: expected overall=${expected}, got ${actual}`);
}

function expectOverallNot(name: string, parts: Partial<Record<CategoryKey, string>>, notExpected: string) {
  const actual = evaluateBuild(build(parts)).overall;
  if (actual !== notExpected) passed++;
  else failures.push(`${name}: expected overall != ${notExpected}, got ${actual}`);
}

// ── כלל 1: מעבד ↔ לוח אם (סוקט) ──
expectStatus("AM5 cpu + AM5 board (same year)", { cpu: "ryzen-7-7700x", mobo: "msi-mag-b650-tomahawk-wifi" }, "cpu-mobo-socket", "ok");
expectStatus("AM5 cpu + LGA1700 board", { cpu: "ryzen-7-9800x3d", mobo: "asus-rog-maximus-z790-hero" }, "cpu-mobo-socket", "error");
expectStatus("newer cpu on older board → BIOS warn", { cpu: "intel-core-i5-14600k", mobo: "asus-rog-maximus-z790-hero" }, "cpu-mobo-socket", "warn");

// ── כלל 2: זיכרון ↔ לוח אם (תקן) ──
expectStatus("DDR5 board + DDR5 ram", { mobo: "msi-mag-b650-tomahawk-wifi", ram: "corsair-vengeance-ddr5-5600-cl36" }, "mobo-ram", "ok");
expectStatus("DDR5 board + DDR4 ram", { mobo: "msi-mag-b650-tomahawk-wifi", ram: "corsair-vengeance-lpx-ddr4-3200-cl16" }, "mobo-ram", "error");

// ── כלל 3: זיכרון ↔ מעבד (התיקון הקריטי ל-LGA1700) ──
expectStatus("LGA1700 + DDR4 board governs → NO false error", { cpu: "intel-core-i5-14600k", mobo: "msi-pro-b760m-a-wifi-ddr4", ram: "corsair-vengeance-lpx-ddr4-3200-cl16" }, "cpu-ram", "ok");
expectOverallNot("LGA1700 + DDR4 board build is valid (overall not error)", { cpu: "intel-core-i5-14600k", mobo: "msi-pro-b760m-a-wifi-ddr4", ram: "corsair-vengeance-lpx-ddr4-3200-cl16" }, "error");
expectStatus("LGA1700 dual-mode DDR4 no board → warn (not error)", { cpu: "intel-core-i5-14600k", ram: "corsair-vengeance-lpx-ddr4-3200-cl16" }, "cpu-ram", "warn");
expectStatus("AM4 cpu (DDR4) + DDR5 ram no board → error", { cpu: "ryzen-7-5800x3d", ram: "corsair-vengeance-ddr5-5600-cl36" }, "cpu-ram", "error");
expectStatus("AM5 cpu + DDR5 ram → ok", { cpu: "ryzen-7-9800x3d", ram: "corsair-vengeance-ddr5-5600-cl36" }, "cpu-ram", "ok");
expectStatus("RAM faster than cpu rated → speed warn", { cpu: "ryzen-7-9800x3d", ram: "gskill-trident-z5-rgb-ddr5-8000-cl38" }, "cpu-ram", "warn");

// ── כלל 4: כרטיס מסך ↔ ספק כוח ──
expectStatus("gpu rec met", { gpu: "rtx-5090", psu: "seasonic-prime-tx-1000-atx3" }, "gpu-psu", "ok");
expectStatus("gpu psu far below rec → error", { gpu: "rtx-5090", psu: "corsair-rm650e-2025" }, "gpu-psu", "error");
expectStatus("gpu psu slightly below rec → warn", { gpu: "rtx-5080", psu: "be-quiet-pure-power-12-m-750w" }, "gpu-psu", "warn");
expectNoCheck("all psus are ATX3 → no connector check", { gpu: "rtx-5090", psu: "seasonic-prime-tx-1000-atx3" }, "gpu-psu-connector");

// ── כלל 5: תקציב חשמל כולל ──
expectStatus("ample total power", { gpu: "rtx-5070-ti", cpu: "ryzen-9-9950x3d", psu: "seasonic-prime-tx-1000-atx3" }, "total-power", "ok");
expectStatus("insufficient total power", { gpu: "rtx-5090", cpu: "ryzen-9-9950x3d", psu: "corsair-rm650e-2025" }, "total-power", "error");

// ── כלל 6: כונן SSD ↔ לוח אם ──
expectStatus("SATA ssd fits any board", { ssd: "samsung-870-evo-1tb", mobo: "msi-mag-b650-tomahawk-wifi" }, "ssd-mobo", "ok");
expectStatusNot("M.2 ssd on modern board not error", { ssd: "samsung-990-pro-2tb", mobo: "msi-mag-b650-tomahawk-wifi" }, "ssd-mobo", "error");

// ── כלל 7: קירור ↔ מעבד ──
expectStatus("intel-only cooler + AM5 cpu → socket error", { cooler: "noctua-nh-l9i-17xx", cpu: "ryzen-7-9800x3d" }, "cooler-cpu", "error");
expectStatus("undersized cooler tdp → warn", { cooler: "noctua-nh-l9i-17xx", cpu: "intel-core-i5-14600k" }, "cooler-cpu", "warn");
expectStatus("ample cooler → ok", { cooler: "arctic-liquid-freezer-iii-360", cpu: "ryzen-9-9950x3d" }, "cooler-cpu", "ok");

// ── כלל 8: מארז ↔ לוח אם (Form Factor) ──
expectStatus("ITX case + ATX board → error", { case: "cooler-master-nr200p", mobo: "msi-mag-b650-tomahawk-wifi" }, "case-mobo", "error");
expectStatus("ITX case + Micro-ATX board → error", { case: "cooler-master-nr200p", mobo: "asrock-b650m-pg-riptide-wifi" }, "case-mobo", "error");
expectStatus("E-ATX case + ATX board → ok", { case: "lian-li-o11-dynamic-evo", mobo: "msi-mag-b650-tomahawk-wifi" }, "case-mobo", "ok");

// ── כלל 9: מארז ↔ קירור ──
expectStatus("ITX case + tall air cooler → error", { case: "cooler-master-nr200p", cooler: "noctua-nh-d15" }, "case-cooler", "error");
expectStatus("small case + 360 AIO → error", { case: "cooler-master-nr200p", cooler: "arctic-liquid-freezer-iii-360" }, "case-cooler", "error");
expectStatus("big case + 360 AIO → ok", { case: "lian-li-o11-dynamic-evo", cooler: "arctic-liquid-freezer-iii-360" }, "case-cooler", "ok");
expectStatus("big case + NH-D15 air → ok", { case: "lian-li-o11-dynamic-evo", cooler: "noctua-nh-d15" }, "case-cooler", "ok");

// ── כלל 10: מארז ↔ ספק כוח (ATX / SFX) ──
expectStatus("SFX case + ATX psu → error", { case: "cooler-master-nr200p", psu: "seasonic-prime-tx-1000-atx3" }, "case-psu", "error");
expectStatus("ATX case + ATX psu → ok", { case: "lian-li-o11-dynamic-evo", psu: "seasonic-prime-tx-1000-atx3" }, "case-psu", "ok");

// ── פסק דין כולל ──
expectOverallNot(
  "fully compatible AM5 build → not blocked",
  {
    cpu: "ryzen-7-9800x3d",
    mobo: "msi-mag-b650-tomahawk-wifi",
    ram: "corsair-vengeance-ddr5-5600-cl36",
    gpu: "rtx-5070-ti",
    psu: "seasonic-prime-tx-1000-atx3",
    ssd: "samsung-990-pro-2tb",
    cooler: "arctic-liquid-freezer-iii-360",
    case: "lian-li-o11-dynamic-evo",
  },
  "error",
);
expectOverall("socket-mismatch build → overall error", { cpu: "ryzen-7-9800x3d", mobo: "asus-rog-maximus-z790-hero" }, "error");

// ── שקיפות: notChecked ──
function expectNotCheckedContains(name: string, parts: Partial<Record<CategoryKey, string>>, sub: string) {
  const nc = evaluateBuild(build(parts)).notChecked;
  if (nc.some((s) => s.includes(sub))) passed++;
  else failures.push(`${name}: expected notChecked to contain "${sub}", got [${nc.join(" | ")}]`);
}
function expectNotCheckedEmpty(name: string, parts: Partial<Record<CategoryKey, string>>) {
  const nc = evaluateBuild(build(parts)).notChecked;
  if (nc.length === 0) passed++;
  else failures.push(`${name}: expected empty notChecked, got [${nc.join(" | ")}]`);
}

expectNotCheckedContains("gpu+case → GPU length surfaced with clearance", { gpu: "rtx-5090", case: "lian-li-o11-dynamic-evo" }, "אורך כרטיס המסך");
expectNotCheckedContains("gpu+case → includes the case's max length value", { gpu: "rtx-5090", case: "lian-li-o11-dynamic-evo" }, "426");
expectNotCheckedContains("mobo+ram build → QVL caveat", { mobo: "msi-mag-b650-tomahawk-wifi", ram: "corsair-vengeance-ddr5-5600-cl36" }, "QVL");
expectNotCheckedContains("ram + air cooler → RAM height caveat", { ram: "corsair-vengeance-ddr5-5600-cl36", cooler: "noctua-nh-d15" }, "גובה מקלות הזיכרון");
expectNotCheckedEmpty("single part → no notChecked", { gpu: "rtx-5090" });

// ── סיכום ──
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length > 0) {
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}
console.log("✓ all compatibility logic tests passed");
