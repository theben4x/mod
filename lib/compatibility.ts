import type { CategoryKey, Component, SpecValue } from "./types";

// ───────────────────────────────────────────────────────────
// tested — מנוע בדיקת תאימות חומרה
// בודק האם רכיב שמתכננים לקנות מתאים לחומרה הקיימת:
// סוקט מעבד↔לוח, תקן/מהירות זיכרון, הספק ספק כוח, חריצי M.2 ועוד.
// כל הכללים נשענים על שדות מפרט אמיתיים מתוך data/components/*.
// ───────────────────────────────────────────────────────────

export type CompatStatus = "ok" | "warn" | "error";

export interface CompatCheck {
  /** מזהה יציב לבדיקה (למניעת כפילויות / מפתח React) */
  id: string;
  /** הקטגוריות המעורבות בבדיקה — לצביעה והדגשת השדות הרלוונטיים */
  slots: CategoryKey[];
  /** כותרת היחס שנבדק, למשל "מעבד ↔ לוח אם" */
  title: string;
  status: CompatStatus;
  /** הסבר בעברית — מה נבדק ומה המסקנה */
  detail: string;
}

export type BuildSelection = Partial<Record<CategoryKey, Component | null>>;

export interface CompatReport {
  checks: CompatCheck[];
  errors: number;
  warns: number;
  oks: number;
  /** סטטוס כולל: error אם יש אי-התאמה, warn אם יש הסתייגות, ok אם הכל תקין, null אם אין בדיקות */
  overall: CompatStatus | null;
  /** מספר הרכיבים שנבחרו מתוך חריצי הבנייה */
  selectedCount: number;
  /** היבטים רלוונטיים לבחירה הנוכחית שהכלי אינו בודק — לשקיפות (פסק דין ירוק ≠ ערובה מלאה) */
  notChecked: string[];
}

/** חריצי הבנייה שמשתתפים בבדיקת התאימות, לפי סדר תצוגה הגיוני. */
export const BUILD_SLOTS: CategoryKey[] = ["cpu", "mobo", "ram", "gpu", "ssd", "psu", "cooler", "case"];

/** סוקטים עם בקר זיכרון רב-תקני (DDR4 וגם DDR5) — הלוח קובע את התקן בפועל. */
const DUAL_DDR_SOCKETS = new Set<string>(["LGA1700"]);

// ─────────── עזרי פענוח מפרט ───────────

function asNum(v: SpecValue | undefined): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function asStr(v: SpecValue | undefined): string | null {
  return typeof v === "string" && v.trim() !== "" ? v : null;
}

/** מחלץ דור DDR ("DDR4" / "DDR5") ממחרוזת כלשהי. */
function ddrGen(v: SpecValue | undefined): string | null {
  const m = /DDR\s*([345])/i.exec(String(v ?? ""));
  return m ? `DDR${m[1]}` : null;
}

/** מחלץ מהירות זיכרון נקובה (MT/s) ממחרוזת כמו "DDR5-5600". */
function ddrSpeed(v: SpecValue | undefined): number | null {
  const m = /DDR\s*[345][\s-]*(\d{3,5})/i.exec(String(v ?? ""));
  return m ? Number(m[1]) : null;
}

/** מחלץ דור PCIe ("PCIe 5.0 x4" → 5) ממחרוזת ממשק. */
function pcieGen(v: SpecValue | undefined): number | null {
  const m = /PCIe\s*([345])/i.exec(String(v ?? ""));
  return m ? Number(m[1]) : null;
}

/** האם תצורת הכונן היא M.2 (להבדיל מ-2.5" SATA). */
function isM2(v: SpecValue | undefined): boolean {
  return /M\.?\s*2/i.test(String(v ?? ""));
}

/** עיגול הספק מומלץ כלפי מעלה ליחידות של 50W. */
function roundPsu(load: number): number {
  return Math.ceil((load * 1.3) / 50) * 50;
}

/** דירוג גודל תצורת לוח אם בודדת — גדול יותר דורש מארז גדול יותר. */
function ffRank(s: string): number | null {
  if (/E-?ATX/i.test(s)) return 3;
  if (/(micro-?atx|m-?atx|matx)/i.test(s)) return 1;
  if (/mini-?itx|itx/i.test(s)) return 0;
  if (/atx/i.test(s)) return 2;
  return null;
}

/** הדירוג המרבי שמארז תומך בו (התצורה הגדולה ברשימת התמיכה). */
function caseMaxFfRank(s: string): number | null {
  if (/E-?ATX/i.test(s)) return 3;
  if (/(^|[^-\w])ATX/i.test(s)) return 2;
  if (/(micro-?atx|m-?atx|matx)/i.test(s)) return 1;
  if (/mini-?itx|itx/i.test(s)) return 0;
  return null;
}

const FF_LABEL: Record<number, string> = { 0: "Mini-ITX", 1: "Micro-ATX", 2: "ATX", 3: "E-ATX" };

/** האם מקרר תומך בסוקט נתון (חיפוש ברשימת הסוקטים הנתמכים). */
function coolerSupportsSocket(support: string, socket: string): boolean {
  return support.toUpperCase().includes(socket.toUpperCase());
}

// ─────────── מנוע הכללים ───────────

/**
 * מעריך תאימות בין הרכיבים שנבחרו. מריץ כל כלל רק אם שני (או שלושת)
 * הרכיבים הדרושים לו נבחרו — כך שניתן לבדוק גם תת-קבוצה (למשל מעבד + לוח בלבד).
 */
export function evaluateBuild(sel: BuildSelection): CompatReport {
  const checks: CompatCheck[] = [];
  const cpu = sel.cpu ?? null;
  const mobo = sel.mobo ?? null;
  const ram = sel.ram ?? null;
  const gpu = sel.gpu ?? null;
  const ssd = sel.ssd ?? null;
  const psu = sel.psu ?? null;
  const cooler = sel.cooler ?? null;
  const caseItem = sel.case ?? null;

  // 1) מעבד ↔ לוח אם — חייבים אותו סוקט
  if (cpu && mobo) {
    const cs = asStr(cpu.specs.socket);
    const ms = asStr(mobo.specs.socket);
    if (cs && ms) {
      if (cs === ms) {
        let detail = `שני הרכיבים בסוקט ${cs} — המעבד מתאים ללוח להתקנה ישירה.`;
        let status: CompatStatus = "ok";
        if (cpu.year > mobo.year) {
          detail += ` שימו לב: ייתכן שיידרש עדכון BIOS, מכיוון שהמעבד חדש מהלוח.`;
          status = "warn";
        }
        checks.push({ id: "cpu-mobo-socket", slots: ["cpu", "mobo"], title: "מעבד ↔ לוח אם", status, detail });
      } else {
        checks.push({
          id: "cpu-mobo-socket",
          slots: ["cpu", "mobo"],
          title: "מעבד ↔ לוח אם",
          status: "error",
          detail: `סוקט לא תואם: המעבד הוא ${cs} והלוח הוא ${ms}. נדרש לוח אם עם סוקט ${cs}.`,
        });
      }
    }
  }

  // 2) זיכרון ↔ לוח אם — תקן זהה (חריץ פיזי) + קיבולת מקסימלית
  if (mobo && ram) {
    const mg = ddrGen(mobo.specs.memoryType);
    const rg = ddrGen(ram.specs.type);
    if (mg && rg) {
      if (mg !== rg) {
        checks.push({
          id: "mobo-ram",
          slots: ["mobo", "ram"],
          title: "זיכרון ↔ לוח אם",
          status: "error",
          detail: `הלוח תומך ב-${mg} בלבד, והזיכרון הוא ${rg}. חריצי ${mg} ו-${rg} שונים פיזית — הזיכרון לא ייכנס לחריץ.`,
        });
      } else {
        const cap = asNum(ram.specs.capacity);
        const max = asNum(mobo.specs.maxMemory);
        if (cap && max && cap > max) {
          checks.push({
            id: "mobo-ram",
            slots: ["mobo", "ram"],
            title: "זיכרון ↔ לוח אם",
            status: "warn",
            detail: `התקן תואם (${rg}), אך קיבולת הערכה (${cap}GB) חורגת מהמקסימום שהלוח תומך בו (${max}GB).`,
          });
        } else {
          checks.push({
            id: "mobo-ram",
            slots: ["mobo", "ram"],
            title: "זיכרון ↔ לוח אם",
            status: "ok",
            detail: `הזיכרון ${rg} תואם לתקן הלוח${max ? ` (תמיכה עד ${max}GB)` : ""}.`,
          });
        }
      }
    }
  }

  // 3) זיכרון ↔ מעבד — בקר הזיכרון של המעבד (תקן + מהירות נקובה).
  // פלטפורמות אינטל LGA1700 (דור 12–14) תומכות גם ב-DDR4 וגם ב-DDR5, והלוח הוא
  // שקובע את התקן בפועל — לכן כשהלוח כבר תואם ל-RAM אין לדווח אי-התאמה (כלל 2).
  if (cpu && ram) {
    const cg = ddrGen(cpu.specs.memorySupport);
    const rg = ddrGen(ram.specs.type);
    if (cg && rg) {
      if (cg === rg) {
        const cSpeed = ddrSpeed(cpu.specs.memorySupport);
        const rSpeed = asNum(ram.specs.speed);
        if (cSpeed && rSpeed && rSpeed > cSpeed) {
          checks.push({
            id: "cpu-ram",
            slots: ["cpu", "ram"],
            title: "זיכרון ↔ מעבד",
            status: "warn",
            detail: `הזיכרון מדורג ל-${rSpeed}MT/s, מעל המהירות הרשמית של המעבד (${cSpeed}MT/s). יגיע למהירותו רק עם פרופיל XMP/EXPO; אחרת יפעל ב-${cSpeed}MT/s.`,
          });
        } else {
          checks.push({
            id: "cpu-ram",
            slots: ["cpu", "ram"],
            title: "זיכרון ↔ מעבד",
            status: "ok",
            detail: `המעבד תומך ב-${cg}${cSpeed ? ` עד ${cSpeed}MT/s` : ""} — הזיכרון בטווח הנתמך.`,
          });
        }
      } else {
        // דורות שונים — הלוח (אם נבחר) קובע, ומעבדי LGA1700 רב-תקניים.
        const moboGen = mobo ? ddrGen(mobo.specs.memoryType) : null;
        const cpuSocket = asStr(cpu.specs.socket);
        if (moboGen && moboGen === rg) {
          checks.push({
            id: "cpu-ram",
            slots: ["cpu", "ram"],
            title: "זיכרון ↔ מעבד",
            status: "ok",
            detail: `הלוח קובע את תקן הזיכרון (${rg}), והמעבד תומך בו דרך בקר זיכרון רב-תקני.`,
          });
        } else if (cpuSocket && DUAL_DDR_SOCKETS.has(cpuSocket)) {
          checks.push({
            id: "cpu-ram",
            slots: ["cpu", "ram"],
            title: "זיכרון ↔ מעבד",
            status: "warn",
            detail: `פלטפורמת ${cpuSocket} תומכת גם ב-DDR4 וגם ב-DDR5. הזיכרון הוא ${rg} — ודאו שהלוח שתבחרו תואם לתקן ${rg}.`,
          });
        } else {
          checks.push({
            id: "cpu-ram",
            slots: ["cpu", "ram"],
            title: "זיכרון ↔ מעבד",
            status: "error",
            detail: `בקר הזיכרון של המעבד תומך ב-${cg}, והזיכרון הוא ${rg}.`,
          });
        }
      }
    }
  }

  // 4) כרטיס מסך ↔ ספק כוח — הספק מול המלצת היצרן לכרטיס
  if (gpu && psu) {
    const rec = asNum(gpu.specs.recommendedPsu);
    const w = asNum(psu.specs.wattage);
    if (rec && w) {
      if (w >= rec) {
        checks.push({
          id: "gpu-psu",
          slots: ["gpu", "psu"],
          title: "כרטיס מסך ↔ ספק כוח",
          status: "ok",
          detail: `ספק של ${w}W עומד בהמלצת היצרן לכרטיס (${rec}W).`,
        });
      } else if (w >= rec * 0.85) {
        checks.push({
          id: "gpu-psu",
          slots: ["gpu", "psu"],
          title: "כרטיס מסך ↔ ספק כוח",
          status: "warn",
          detail: `הספק (${w}W) מעט מתחת להמלצת היצרן לכרטיס (${rec}W). ייתכן שיספיק בבנייה חסכונית, אך מומלץ מרווח גדול יותר.`,
        });
      } else {
        checks.push({
          id: "gpu-psu",
          slots: ["gpu", "psu"],
          title: "כרטיס מסך ↔ ספק כוח",
          status: "error",
          detail: `הספק (${w}W) נמוך משמעותית מהמומלץ לכרטיס (${rec}W) — סכנת כיבויים וקריסות תחת עומס. נדרש ספק חזק יותר.`,
        });
      }
    }

    // מחבר חשמל ייעודי לכרטיסים עתירי הספק
    const gTdp = asNum(gpu.specs.tdp);
    if (gTdp && gTdp >= 300 && psu.specs.atx3 !== true) {
      checks.push({
        id: "gpu-psu-connector",
        slots: ["gpu", "psu"],
        title: "מחבר חשמל לכרטיס",
        status: "warn",
        detail: `כרטיס עתיר הספק (${gTdp}W). מומלץ ספק בתקן ATX 3.0 עם מחבר 12V-2x6 ייעודי; ספק זה אינו מסומן כ-ATX 3.0 ויחייב מתאם ממחברי 8-pin.`,
      });
    }
  }

  // 5) תקציב חשמל כולל — הערכת צריכה בעומס מול הספק
  if (psu && (cpu || gpu)) {
    const w = asNum(psu.specs.wattage);
    const cpuTdp = asNum(cpu?.specs.tdp) ?? 0;
    const gpuTdp = asNum(gpu?.specs.tdp) ?? 0;
    if (w && (cpuTdp || gpuTdp)) {
      const SYSTEM_OVERHEAD = 100; // לוח אם, זיכרון, כוננים, מאווררים ופריפריאלים
      const load = cpuTdp + gpuTdp + SYSTEM_OVERHEAD;
      // רק הרכיבים שנבחרו בפועל — לאייקונים ולפירוט הצריכה
      const slots: CategoryKey[] = [
        "psu",
        ...(cpuTdp ? (["cpu"] as CategoryKey[]) : []),
        ...(gpuTdp ? (["gpu"] as CategoryKey[]) : []),
      ];
      const parts = [
        ...(cpuTdp ? [`מעבד ${cpuTdp}W`] : []),
        ...(gpuTdp ? [`מסך ${gpuTdp}W`] : []),
        `מערכת ~${SYSTEM_OVERHEAD}W`,
      ];
      const breakdown = `(${parts.join(" + ")})`;
      if (w >= load * 1.3) {
        checks.push({
          id: "total-power",
          slots,
          title: "תקציב חשמל כולל",
          status: "ok",
          detail: `צריכה משוערת בעומס ≈ ${load}W ${breakdown}. הספק ${w}W מספק מרווח בריא.`,
        });
      } else if (w >= load) {
        checks.push({
          id: "total-power",
          slots,
          title: "תקציב חשמל כולל",
          status: "warn",
          detail: `צריכה משוערת בעומס ≈ ${load}W ${breakdown}, והספק הוא ${w}W — מרווח צר. מומלץ ספק עם כ-30% מרווח (כ-${roundPsu(load)}W ומעלה).`,
        });
      } else {
        checks.push({
          id: "total-power",
          slots,
          title: "תקציב חשמל כולל",
          status: "error",
          detail: `צריכה משוערת בעומס ≈ ${load}W ${breakdown} חורגת מהספק (${w}W). נדרש ספק של כ-${roundPsu(load)}W לפחות.`,
        });
      }
    }
  }

  // 6) כונן SSD ↔ לוח אם — חריץ M.2 / יציאת SATA + תאימות PCIe
  if (ssd && mobo) {
    if (isM2(ssd.specs.formFactor)) {
      const m2 = asNum(mobo.specs.m2Slots) ?? 0;
      if (m2 >= 1) {
        const sg = pcieGen(ssd.specs.interface);
        const bg = pcieGen(mobo.specs.pcieVersion);
        if (sg && bg && sg > bg) {
          checks.push({
            id: "ssd-mobo",
            slots: ["ssd", "mobo"],
            title: "כונן SSD ↔ לוח אם",
            status: "warn",
            detail: `ללוח יש ${m2} חריצי M.2, אך הכונן בתקן PCIe ${sg}.0 והלוח תומך ב-PCIe ${bg}.0 — הכונן יעבוד אך יוגבל למהירות הנמוכה יותר.`,
          });
        } else {
          checks.push({
            id: "ssd-mobo",
            slots: ["ssd", "mobo"],
            title: "כונן SSD ↔ לוח אם",
            status: "ok",
            detail: `ללוח ${m2} חריצי M.2 — הכונן מתאים להתקנה ישירה.`,
          });
        }
      } else {
        checks.push({
          id: "ssd-mobo",
          slots: ["ssd", "mobo"],
          title: "כונן SSD ↔ לוח אם",
          status: "error",
          detail: `הכונן בתצורת M.2, אך ללוח אין חריצי M.2 פנויים. נדרש מתאם PCIe או לוח אחר.`,
        });
      }
    } else {
      checks.push({
        id: "ssd-mobo",
        slots: ["ssd", "mobo"],
        title: "כונן SSD ↔ לוח אם",
        status: "ok",
        detail: `כונן SATA — מתחבר ליציאת SATA הקיימת כמעט בכל לוח אם.`,
      });
    }
  }

  // 7) קירור ↔ מעבד — תאימות סוקט + קיבולת קירור מול ה-TDP
  if (cooler && cpu) {
    const support = asStr(cooler.specs.socketSupport);
    const socket = asStr(cpu.specs.socket);
    if (support && socket && !coolerSupportsSocket(support, socket)) {
      checks.push({
        id: "cooler-cpu",
        slots: ["cooler", "cpu"],
        title: "קירור ↔ מעבד",
        status: "error",
        detail: `המקרר אינו תומך בסוקט ${socket} של המעבד (נתמכים: ${support}). נדרשת ערכת התקנה תואמת או מקרר אחר.`,
      });
    } else {
      const cap = asNum(cooler.specs.tdpRating);
      const tdp = asNum(cpu.specs.tdp);
      // הגענו לכאן רק אם הסוקט נתמך, או אם רשימת הסוקטים חסרה — אל נאשר תאימות סוקט שלא נבדקה.
      const socketChecked = Boolean(support && socket);
      if (cap && tdp && cap < tdp) {
        checks.push({
          id: "cooler-cpu",
          slots: ["cooler", "cpu"],
          title: "קירור ↔ מעבד",
          status: "warn",
          detail: `קיבולת הקירור (${cap}W) נמוכה מ-TDP של המעבד (${tdp}W) — המעבד יחומם ועלול להאיט (Thermal Throttling) בעומס. מומלץ מקרר חזק יותר.`,
        });
      } else if (cap && tdp && cap < tdp * 1.15) {
        checks.push({
          id: "cooler-cpu",
          slots: ["cooler", "cpu"],
          title: "קירור ↔ מעבד",
          status: "warn",
          detail: socketChecked
            ? `המקרר תואם לסוקט ${socket}, אך קיבולת הקירור (${cap}W) קרובה ל-TDP של המעבד (${tdp}W). יעבוד, עם טמפרטורות גבוהות יחסית בעומס ממושך.`
            : `קיבולת הקירור (${cap}W) קרובה ל-TDP של המעבד (${tdp}W). יעבוד, עם טמפרטורות גבוהות יחסית בעומס ממושך.`,
        });
      } else {
        checks.push({
          id: "cooler-cpu",
          slots: ["cooler", "cpu"],
          title: "קירור ↔ מעבד",
          status: "ok",
          detail: socketChecked
            ? `המקרר תומך בסוקט ${socket}${cap && tdp ? `, וקיבולת הקירור (${cap}W) מספיקה ל-TDP של המעבד (${tdp}W)` : ""}.`
            : cap && tdp
              ? `קיבולת הקירור (${cap}W) מספיקה ל-TDP של המעבד (${tdp}W).`
              : `המקרר תואם למעבד.`,
        });
      }
    }
  }

  // 8) מארז ↔ לוח אם — תאימות תצורה (Form Factor)
  if (caseItem && mobo) {
    const support = asStr(caseItem.specs.motherboardSupport);
    const mff = asStr(mobo.specs.formFactor);
    const caseRank = support ? caseMaxFfRank(support) : null;
    const moboRank = mff ? ffRank(mff) : null;
    if (caseRank != null && moboRank != null) {
      if (moboRank <= caseRank) {
        checks.push({
          id: "case-mobo",
          slots: ["case", "mobo"],
          title: "מארז ↔ לוח אם",
          status: "ok",
          detail: `המארז תומך בלוח בתצורת ${mff} (תמיכה: ${support}).`,
        });
      } else {
        checks.push({
          id: "case-mobo",
          slots: ["case", "mobo"],
          title: "מארז ↔ לוח אם",
          status: "error",
          detail: `הלוח בתצורת ${mff} גדול מהתצורה המרבית שהמארז תומך בה (${FF_LABEL[caseRank]}). נדרש מארז גדול יותר.`,
        });
      }
    }
  }

  // 9) מארז ↔ קירור — מרווח פיזי (גובה לאוויר / רדיאטור ל-AIO)
  if (caseItem && cooler) {
    const radSize = asNum(cooler.specs.radiatorSize);
    const height = asNum(cooler.specs.height);
    if (radSize) {
      const maxRad = asNum(caseItem.specs.maxRadiator);
      if (maxRad) {
        checks.push(
          radSize <= maxRad
            ? { id: "case-cooler", slots: ["case", "cooler"], title: "מארז ↔ קירור", status: "ok", detail: `המארז תומך ברדיאטור עד ${maxRad}mm — ה-AIO בגודל ${radSize}mm נכנס.` }
            : { id: "case-cooler", slots: ["case", "cooler"], title: "מארז ↔ קירור", status: "error", detail: `רדיאטור ה-AIO (${radSize}mm) גדול מהמרווח המרבי של המארז (${maxRad}mm).` },
        );
      }
    } else if (height) {
      const maxH = asNum(caseItem.specs.maxCoolerHeight);
      if (maxH) {
        checks.push(
          height <= maxH
            ? { id: "case-cooler", slots: ["case", "cooler"], title: "מארז ↔ קירור", status: "ok", detail: `גובה המקרר (${height}mm) בתוך הגובה המרבי של המארז (${maxH}mm).` }
            : { id: "case-cooler", slots: ["case", "cooler"], title: "מארז ↔ קירור", status: "error", detail: `גובה מקרר האוויר (${height}mm) חורג מהגובה המרבי של המארז (${maxH}mm) — הפאנל לא ייסגר.` },
        );
      }
    }
  }

  // 10) מארז ↔ ספק כוח — תאימות תצורת ספק (ATX / SFX)
  if (caseItem && psu) {
    const casePsu = asStr(caseItem.specs.psuFormFactor);
    const psuFf = asStr(psu.specs.formFactor);
    if (casePsu && psuFf) {
      const caseWantsSfx = /sfx/i.test(casePsu) && !/atx/i.test(casePsu);
      const psuIsAtx = /atx/i.test(psuFf) && !/sfx/i.test(psuFf);
      if (caseWantsSfx && psuIsAtx) {
        checks.push({
          id: "case-psu",
          slots: ["case", "psu"],
          title: "מארז ↔ ספק כוח",
          status: "error",
          detail: `המארז מיועד לספק בתצורת ${casePsu}, וספק הכוח הוא ${psuFf} — לא יתאים פיזית. נדרש ספק ${casePsu}.`,
        });
      } else {
        checks.push({
          id: "case-psu",
          slots: ["case", "psu"],
          title: "מארז ↔ ספק כוח",
          status: "ok",
          detail: `תצורת ספק הכוח (${psuFf}) תואמת למארז.`,
        });
      }
    }
  }

  const errors = checks.filter((c) => c.status === "error").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const oks = checks.filter((c) => c.status === "ok").length;
  const overall: CompatStatus | null = checks.length === 0 ? null : errors > 0 ? "error" : warns > 0 ? "warn" : "ok";
  const selectedCount = BUILD_SLOTS.filter((k) => sel[k]).length;

  // שקיפות: היבטים שהבחירה הנוכחית מזמינה אך הכלי אינו מודד (כדי לא ליצור ביטחון-יתר).
  // היבטים אלו תלויים בדגם/רוויזיה ספציפיים ולכן נמסרים לאימות ידני במקום בדיקה מדומה.
  const notChecked: string[] = [];
  if (selectedCount >= 2) {
    if (gpu && caseItem) {
      const maxLen = asNum(caseItem.specs.maxGpuLength);
      notChecked.push(
        `אורך כרטיס המסך מול עומק המארז — המארז תומך בכרטיס באורך עד ${maxLen ?? "?"}mm, אך אורך הכרטיס משתנה בין יצרני-משנה (AIB) לאותו שבב. השוו ידנית את אורך הכרטיס שבחרתם למרווח זה.`,
      );
    }
    if (ram && cooler && asNum(cooler.specs.height)) {
      notChecked.push("מרווח גובה מקלות הזיכרון מתחת למקרר אוויר — זיכרון גבוה (RGB) עלול להתנגש בצלעות הקירור; ודאו את גובה הערכה.");
    }
    if (psu && caseItem) {
      notChecked.push("אורך ספק הכוח מול תא הספק במארז (נבדקה תצורת ATX/SFX אך לא האורך המדויק).");
    }
    if (mobo || ram) {
      notChecked.push("תאימות זיכרון מיטבית תלויה ברשימת התאימות (QVL) של היצרן לדגם הלוח ובגרסת ה-BIOS.");
    }
    notChecked.push("מפרטי היצרן עשויים להשתנות בין רוויזיות ובין יצרני-משנה — אמתו מול הדגם המדויק לפני רכישה.");
  }

  return { checks, errors, warns, oks, overall, selectedCount, notChecked };
}

/**
 * הערכת צריכת חשמל כוללת (Watt) + הספק מומלץ — לבונה המערכת.
 * מחזיר null אם אין נתוני TDP למעבד/כרטיס מסך.
 */
export function estimateBuildPower(sel: BuildSelection): { load: number; recommendedPsu: number } | null {
  const cpuTdp = asNum(sel.cpu?.specs.tdp) ?? 0;
  const gpuTdp = asNum(sel.gpu?.specs.tdp) ?? 0;
  if (!cpuTdp && !gpuTdp) return null;
  const load = cpuTdp + gpuTdp + 100; // + תקורת מערכת (לוח, זיכרון, כוננים, מאווררים)
  return { load, recommendedPsu: roundPsu(load) };
}
