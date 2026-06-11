import type { CategoryDef, Component, SpecComparison, SpecField, SpecValue } from "./types";

const SEP = "-vs-";

/** בונה slug להשוואה: "rtx-4090-vs-rx-7900-xtx" */
export function buildSlug(aId: string, bId: string): string {
  return `${aId}${SEP}${bId}`;
}

/** מפרק slug חזרה לשני מזהים. מחזיר null אם לא תקין. */
export function parseSlug(slug: string): [string, string] | null {
  const idx = slug.indexOf(SEP);
  if (idx <= 0) return null;
  const a = slug.slice(0, idx);
  const b = slug.slice(idx + SEP.length);
  if (!a || !b) return null;
  return [a, b];
}

function isNum(v: SpecValue): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

/** משווה שדה מפרט בודד בין שני ערכים */
export function compareSpec(field: SpecField, a: SpecValue, b: SpecValue): SpecComparison {
  let winner: SpecComparison["winner"] = null;
  let ratioA = 0;
  let ratioB = 0;

  if (field.higherIsBetter !== null) {
    if (isNum(a) && isNum(b)) {
      const max = Math.max(Math.abs(a), Math.abs(b)) || 1;
      ratioA = Math.min(1, Math.abs(a) / max);
      ratioB = Math.min(1, Math.abs(b) / max);
      if (a === b) winner = "tie";
      else if (field.higherIsBetter) winner = a > b ? "a" : "b";
      else winner = a < b ? "a" : "b";
    } else if (field.format === "boolean" && typeof a === "boolean" && typeof b === "boolean") {
      // בוליאני שבו true עדיף
      if (a === b) winner = "tie";
      else if (field.higherIsBetter) winner = a ? "a" : "b";
      else winner = a ? "b" : "a";
      ratioA = a ? 1 : 0.15;
      ratioB = b ? 1 : 0.15;
    }
  }

  return { field, a, b, winner, ratioA, ratioB };
}

export interface ComparisonResult {
  category: CategoryDef;
  a: Component;
  b: Component;
  rows: SpecComparison[];
  aWins: number;
  bWins: number;
  ties: number;
  /** המנצח הכולל — לפי ציון הביצועים אם קיים, אחרת לפי משקלי המפרט */
  overall: "a" | "b" | "tie";
  /** חלוקה ל-100 לכל צד (לבר בבאנר) */
  scoreA: number;
  scoreB: number;
  /** כיצד הוכרע: "score" = ציון ביצועים כולל | "specs" = ספירת מפרטים משוקללת */
  decidedBy: "score" | "specs";
}

/** משווה שני רכיבים בקטגוריה ומחזיר תוצאה מלאה */
export function compareComponents(category: CategoryDef, a: Component, b: Component): ComparisonResult {
  const rows = category.fields.map((field) => compareSpec(field, a.specs[field.key] ?? null, b.specs[field.key] ?? null));

  let aw = 0;
  let bw = 0;
  let ties = 0;
  let wA = 0; // משקל ניצחונות a
  let wB = 0;
  let totalW = 0;

  for (const r of rows) {
    const weight = r.field.weight ?? 1;
    if (r.winner === "a") {
      aw++;
      wA += weight;
      totalW += weight;
    } else if (r.winner === "b") {
      bw++;
      wB += weight;
      totalW += weight;
    } else if (r.winner === "tie") {
      ties++;
      wA += weight / 2;
      wB += weight / 2;
      totalW += weight;
    }
  }

  // קביעת המנצח הכולל:
  // אם לשני הרכיבים יש ציון ביצועים מנורמל (0–100) — הוא הקובע. הציון מגלם ביצועים
  // אמיתיים (כולל הבדלי דורות/ארכיטקטורה), בעוד שספירת מפרטים גולמית מטעה בין דורות
  // (למשל ליבות Ampere אינן שוות-ערך לליבות Blackwell). ספירת המפרטים נשמרת לטבלה.
  const sA = a.score;
  const sB = b.score;
  let overall: "a" | "b" | "tie";
  let scoreA: number;
  let scoreB: number;
  let decidedBy: "score" | "specs";

  if (typeof sA === "number" && typeof sB === "number" && (sA > 0 || sB > 0)) {
    decidedBy = "score";
    overall = sA === sB ? "tie" : sA > sB ? "a" : "b";
    scoreA = Math.round((sA / (sA + sB)) * 100);
    scoreB = 100 - scoreA;
  } else {
    decidedBy = "specs";
    overall = wA === wB ? "tie" : wA > wB ? "a" : "b";
    scoreA = totalW > 0 ? Math.round((wA / totalW) * 100) : 50;
    scoreB = totalW > 0 ? Math.round((wB / totalW) * 100) : 50;
  }

  return { category, a, b, rows, aWins: aw, bWins: bw, ties, overall, scoreA, scoreB, decidedBy };
}
