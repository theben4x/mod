import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { CompatibilityChecker } from "@/components/CompatibilityChecker";
import { CategoryIcon } from "@/components/CategoryIcon";
import { allComponents, getComponent } from "@/lib/data";
import { getPrices } from "@/lib/prices/provider";
import { BUILD_SLOTS } from "@/lib/compatibility";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import type { CategoryKey } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "בדיקת תאימות חומרה",
  description:
    "שוקלים לקנות כרטיס מסך, מעבד או רכיב אחר? בדקו בחינם אם הוא מתאים לחומרה שכבר יש לכם — סוקט מעבד, תקן זיכרון, הספק ספק כוח, חריצי M.2 ועוד. הכול בעברית, בלי לנחש.",
  path: "/compatibility",
  keywords: [
    "בדיקת תאימות חומרה",
    "תאימות מעבד לוח אם",
    "תאימות זיכרון",
    "האם הכרטיס מסך מתאים",
    "בודק תאימות מחשב",
    "בניית מחשב",
    "PC compatibility checker",
  ],
});

// היחסים שנבדקים — להצגה בעמוד "מה בודקים"
const RELATIONS: { slots: CategoryKey[]; title: string; text: string }[] = [
  { slots: ["cpu", "mobo"], title: "מעבד ↔ לוח אם", text: "התאמת סוקט — התנאי הראשון להרכבה. כולל התראת עדכון BIOS כשהמעבד חדש מהלוח." },
  { slots: ["ram", "mobo"], title: "זיכרון ↔ לוח אם", text: "תקן DDR4/DDR5 חייב להתאים לחריץ, והקיבולת לא לחרוג מהמקסימום הנתמך." },
  { slots: ["ram", "cpu"], title: "זיכרון ↔ מעבד", text: "בקר הזיכרון של המעבד והמהירות הנקובה — מתי תצטרכו XMP/EXPO כדי להגיע למלוא הקצב." },
  { slots: ["gpu", "psu"], title: "כרטיס מסך ↔ ספק כוח", text: "הספק מול המלצת היצרן לכרטיס, ומחבר חשמל ATX 3.0 לכרטיסים עתירי הספק." },
  { slots: ["psu", "cpu"], title: "תקציב חשמל כולל", text: "הערכת צריכת המערכת בעומס (מעבד + מסך + מערכת) מול הספק, עם מרווח ביטחון מומלץ." },
  { slots: ["ssd", "mobo"], title: "כונן SSD ↔ לוח אם", text: "חריץ M.2 פנוי או יציאת SATA, ותאימות דור PCIe כדי לא לאבד מהירות." },
  { slots: ["cooler", "cpu"], title: "קירור ↔ מעבד", text: "תאימות סוקט וקיבולת קירור (TDP) — שהמקרר יתאים למעבד ויעמוד בעומס התרמי." },
  { slots: ["case", "mobo"], title: "מארז ↔ לוח אם", text: "תצורת הלוח (ATX / Micro-ATX / ITX) חייבת להתאים לגודל שהמארז תומך בו." },
  { slots: ["case", "cooler"], title: "מארז ↔ קירור", text: "גובה מקרר אוויר או גודל רדיאטור AIO מול המרווח הפיזי שיש במארז." },
];

const FAQ = [
  {
    q: "איך עובדת בדיקת התאימות?",
    a: "בוחרים את הרכיבים שכבר יש לכם ואת הרכיב שאתם שוקלים לקנות. המערכת מריצה את כל כללי התאימות הרלוונטיים — סוקט, תקן זיכרון, הספק חשמל, חריצי M.2 ועוד — ומציגה לכל יחס פסק דין: תואם, לתשומת לב, או לא תואם, עם הסבר.",
  },
  {
    q: "מספיק לבחור שני רכיבים?",
    a: "כן. הבדיקה רצה על כל תת-קבוצה — אפשר לבדוק רק מעבד מול לוח אם, או רק כרטיס מסך מול ספק כוח. ככל שתוסיפו רכיבים, יתווספו בדיקות.",
  },
  {
    q: "האם 'תואם' מבטיח שהכול יעבוד?",
    a: "הבדיקה מבוססת על מפרטי היצרן ומכסה את אי-ההתאמות הנפוצות. תאימות פיזית סופית — גודל המארז, אורך הכרטיס, גובה צלעות הקירור מעל הזיכרון — תלויה בדגם הספציפי, ולכן תמיד מומלץ לאמת מול היצרן לפני רכישה.",
  },
  {
    q: "מה ההבדל בין 'לא תואם' ל'לתשומת לב'?",
    a: "'לא תואם' (אדום) הוא חוסם הרכבה — למשל סוקט שונה או זיכרון מתקן אחר. 'לתשומת לב' (כתום) הוא דבר שיעבוד אך כדאי לדעת — למשל זיכרון מהיר שיורד למהירות המעבד, או ספק במרווח צר.",
  },
];

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CompatibilityPage({ searchParams }: Props) {
  const sp = await searchParams;

  // פענוח החריצים מה-query string (?cpu=...&gpu=...) — תקפים בלבד
  const initial: Partial<Record<CategoryKey, string>> = {};
  let focus: CategoryKey | null = null;
  for (const slot of BUILD_SLOTS) {
    const raw = sp[slot];
    const id = Array.isArray(raw) ? raw[0] : raw;
    if (!id) continue;
    const c = getComponent(id);
    if (c && c.category === slot) {
      initial[slot] = c.id;
      if (!focus) focus = slot;
    }
  }

  const prices = await getPrices(allComponents().map((c) => c.id));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "בית", path: "/" },
            { name: "בדיקת תאימות", path: "/compatibility" },
          ]),
          faqJsonLd(FAQ),
        ]}
      />

      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "בדיקת תאימות" }]} />

        <header className="mx-auto mt-8 max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">בדיקת תאימות חומרה</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            שוקלים לקנות רכיב חדש? בחרו את החומרה שכבר יש לכם ואת מה שאתם רוצים להוסיף — ונגיד לכם מיד אם הכול מתאים, מה המחיר הכולל ואיזה ספק כוח צריך.
          </p>
        </header>

        <div className="mt-8">
          <CompatibilityChecker initial={initial} focus={focus} prices={prices} />
        </div>

        {/* מה בודקים */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">מה בודקים</h2>
          <p className="mt-2 text-sm text-muted">יחסי התאימות המרכזיים שקובעים אם הרכבה תעבוד.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {RELATIONS.map((r) => (
              <div key={r.title} className="card p-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-accent">
                    {r.slots.map((s) => (
                      <CategoryIcon key={s} category={s} width={16} height={16} />
                    ))}
                  </span>
                  <h3 className="text-sm font-semibold">{r.title}</h3>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* שאלות נפוצות */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">שאלות נפוצות</h2>
          <div className="mt-5 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {item.q}
                  <span className="mono text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
