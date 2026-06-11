import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SearchIcon, TrophyIcon, SparkIcon } from "@/components/icons";
import { CountUp } from "@/components/CountUp";
import { allComponents } from "@/lib/data";
import { ALL_CATEGORIES } from "@/data/categories";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "אודות",
  description: "tested היא פלטפורמה ישראלית להשוואת רכיבי חומרה זה מול זה — מתוך מטרה להפוך את הבחירה לפשוטה, שקופה ומהירה. הכירו את הגישה והמתודולוגיה שלנו.",
  path: "/about",
});

const FAQ = [
  { q: "איך נקבע המנצח בכל מדד?", a: "לכל שדה מפרט מוגדר כיוון: ברוב המקרים ערך גבוה יותר טוב יותר (למשל ליבות, מהירות), ובחלקם נמוך יותר טוב יותר (צריכת חשמל, השהיית CAS, מחיר). הצד עם הערך העדיף בכל מדד מסומן. המנצח הכולל מחושב לפי משקלל של המדדים המרכזיים." },
  { q: "מאיפה מגיעים הנתונים?", a: "המפרטים מבוססים על נתוני היצרנים והמחירים מובאים כהערכת מחיר רחוב. המערכת בנויה כך שניתן לחבר אליה מקור מחירים חי דרך API." },
  { q: "האם השירות בחינם?", a: "כן. tested חינמית לחלוטין לשימוש, ללא צורך בהרשמה." },
];

const VALUES = [
  { icon: SearchIcon, title: "שקיפות מלאה", text: "כל מדד גלוי, עם כיוון ברור של מה טוב יותר. בלי טריקים, בלי קידום סמוי." },
  { icon: TrophyIcon, title: "החלטה מהירה", text: "סימון מנצח חד בכל שורה ופסק דין כולל — כדי שתדעו במבט מה עדיף עבורכם." },
  { icon: SparkIcon, title: "עיצוב נקי", text: "ממשק מינימליסטי, מהיר ומותאם למובייל, עם פוקוס על המידע שחשוב." },
];

export default function AboutPage() {
  const count = allComponents().length;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "בית", path: "/" }, { name: "אודות", path: "/about" }]),
          faqJsonLd(FAQ),
        ]}
      />

      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "אודות" }]} />

        <header className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">בחירת חומרה לא צריכה להיות מסובכת</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            tested נולדה מתסכול פשוט: כדי להחליט בין שני רכיבים צריך לפתוח עשרה טאבים, לפענח טבלאות מפרט ולחפש מחירים בנפרד.
            החלטנו לרכז את הכל במקום אחד — נקי, מהיר ובעברית.
          </p>
        </header>

        {/* סטטיסטיקות */}
        <div className="mt-10 grid grid-cols-3 gap-3">
          {[
            { value: count, label: "רכיבים" },
            { value: ALL_CATEGORIES.length, label: "קטגוריות" },
            { value: "₪/$", label: "שני מטבעות" },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="mono text-2xl font-bold text-accent sm:text-3xl">
                {typeof s.value === "number" ? <CountUp value={s.value} /> : s.value}
              </div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ערכים */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">למה tested</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <v.icon width={18} height={18} />
                </span>
                <h3 className="mt-3 font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* מתודולוגיה */}
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">איך אנחנו משווים</h2>
          <div className="prose-mod mt-4 space-y-4 text-sm leading-relaxed text-muted">
            <p>
              לכל קטגוריה יש סכמת מפרט ייעודית. לכל מדד מוגדר כיוון: ברוב המקרים <strong className="text-foreground">גבוה = טוב יותר</strong> (ליבות,
              מהירות, קיבולת), ובמקרים מסוימים <strong className="text-foreground">נמוך = טוב יותר</strong> (צריכת חשמל, השהיית CAS, מחיר).
            </p>
            <p>
              המנצח הכולל מחושב לפי ניקוד משוקלל של המדדים המרכזיים, כך ששדות חשובים (כמו מספר ליבות או מהירות) משפיעים יותר. התוצאה היא
              פסק דין ברור — אך תמיד מומלץ להתחשב בצרכים האישיים שלכם.
            </p>
          </div>
        </section>

        {/* FAQ */}
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

        {/* CTA */}
        <section className="card mt-14 flex flex-col items-center gap-4 p-8 text-center">
          <h2 className="text-xl font-semibold">מוכנים להשוות?</h2>
          <p className="max-w-md text-sm text-muted">בחרו שני רכיבים וקבלו תשובה ברורה תוך שניות.</p>
          <Link
            href="/compare"
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-all hover:brightness-110"
          >
            התחילו השוואה ←
          </Link>
        </section>
      </div>
    </>
  );
}
