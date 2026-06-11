import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "הצהרת נגישות",
  description:
    'הצהרת הנגישות של אתר tested — מחויבות לנגישות בהתאם לתקנות שוויון זכויות, לתקן הישראלי ת"י 5568 ולהנחיות WCAG 2.0 ברמה AA.',
  path: "/accessibility",
});

const UPDATED = "10 ביוני 2026";
const CONTACT = "gavrielbentouchama@gmail.com";

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "הצהרת נגישות" }]} />

      <article className="mt-6 space-y-7 leading-relaxed">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">הצהרת נגישות</h1>
          <p className="mt-2 text-sm text-muted">עודכן לאחרונה: {UPDATED}</p>
        </header>

        <p>
          אתר <strong>tested</strong> רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשים ובהנגשת האתר לאנשים עם מוגבלות. אנו
          פועלים כדי שהאתר יהיה נגיש, נוח וקל לשימוש עבור כולם.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">רמת הנגישות באתר</h2>
          <p>
            האתר נבנה בהתאם להוראות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), ולתקן הישראלי{" "}
            <span className="ltr">ת"י 5568</span> המבוסס על הנחיות <span className="ltr">WCAG 2.0</span> ברמה{" "}
            <span className="ltr">AA</span>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">כלי הנגישות באתר</h2>
          <p>בכל עמוד מופיע כפתור נגישות בפינה השמאלית-תחתונה, הפותח תפריט המאפשר:</p>
          <ul className="list-inside list-disc space-y-1 text-muted">
            <li>הגדלה והקטנה של גודל הטקסט</li>
            <li>מצב ניגודיות גבוהה</li>
            <li>תצוגה בגווני אפור</li>
            <li>הדגשת קישורים</li>
            <li>מעבר לגופן קריא</li>
            <li>עצירת אנימציות ותנועה</li>
            <li>סמן עכבר גדול</li>
          </ul>
          <p>
            בנוסף, האתר תומך בניווט מקלדת מלא, מבנה כותרות סמנטי, טקסט חלופי לתמונות, סימון פוקוס ברור והתאמה לקוראי מסך.
            ההעדפות שתבחרו בתפריט הנגישות נשמרות בדפדפן שלכם להמשך הגלישה.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">החרגות ומגבלות ידועות</h2>
          <p>
            למרות מאמצינו להנגיש את כלל הדפים, ייתכן שחלקים מסוימים טרם הונגשו במלואם, או יוצגו בהם תכנים של צד שלישי שאינם
            בשליטתנו המלאה. אנו ממשיכים לשפר את נגישות האתר באופן שוטף.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">פנייה בנושא נגישות</h2>
          <p>נתקלתם בבעיית נגישות, או שיש לכם הצעה לשיפור? נשמח לקבל את פנייתכם ונטפל בה בהקדם האפשרי.</p>
          <p>
            רכז הנגישות:{" "}
            <a href={`mailto:${CONTACT}`} className="ltr inline-block text-accent hover:underline">
              {CONTACT}
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
