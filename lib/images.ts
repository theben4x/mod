import fs from "node:fs";
import path from "node:path";

/**
 * פותר תמונת מוצר לרכיב לפי ה-id שלו, ע"י סריקת public/components/.
 * הקובץ נקרא בשם <id>.<ext> (webp/png/jpg/jpeg/avif). אם אין קובץ — מחזיר null
 * וה-UI מציג fallback. מודול זה רץ בצד-שרת בלבד (fs).
 */
const DIR = path.join(process.cwd(), "public", "components");
// סדר העדפה כשקיימות כמה סיומות לאותו id
const EXTS = [".webp", ".png", ".avif", ".jpg", ".jpeg"];

let cache: Map<string, string> | null = null;

function index(): Map<string, string> {
  // בפרודקשן צורבים פעם אחת; בפיתוח קוראים מחדש כדי שקובץ חדש יופיע בריענון
  if (cache && process.env.NODE_ENV === "production") return cache;

  const map = new Map<string, string>();
  try {
    for (const file of fs.readdirSync(DIR)) {
      const ext = path.extname(file).toLowerCase();
      if (!EXTS.includes(ext)) continue;
      const id = path.basename(file, ext);
      const existing = map.get(id);
      // אם כבר יש — מעדיפים את הסיומת המוקדמת יותר ברשימת EXTS
      if (existing && EXTS.indexOf(path.extname(existing).toLowerCase()) <= EXTS.indexOf(ext)) continue;
      map.set(id, `/components/${file}`);
    }
  } catch {
    // התיקייה עדיין לא קיימת / ריקה — הכול נופל ל-fallback בחן
  }
  cache = map;
  return map;
}

/** נתיב ציבורי לתמונת הרכיב, או null אם עוד לא הועלתה. */
export function componentImage(id: string): string | null {
  return index().get(id) ?? null;
}

/** האם קיימת תמונה לרכיב. */
export function hasComponentImage(id: string): boolean {
  return index().has(id);
}
