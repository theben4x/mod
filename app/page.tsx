import Link from "next/link";
import type { Metadata } from "next";
import { ComparePicker } from "@/components/ComparePicker";
import { ComparisonCard } from "@/components/cards";
import { SectionHeader } from "@/components/SectionHeader";
import { Showcase } from "@/components/Showcase";
import { Reveal } from "@/components/Reveal";
import { CategoryIcon } from "@/components/CategoryIcon";
import { JsonLd } from "@/components/JsonLd";
import { SparkIcon, TrophyIcon, SearchIcon } from "@/components/icons";
import { ALL_CATEGORIES, categoryColor } from "@/data/categories";
import { getComponent, categoryCount } from "@/lib/data";
import { getPopularComparisons, getAllPosts } from "@/lib/content";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "השוו שני רכיבי חומרה זה מול זה — כרטיסי מסך, מעבדים, זיכרון, SSD, ספקי כוח, לוחות אם, מארזים, קירור ועוד. מפרט טכני מלא, מחירים מעודכנים וסימון מנצח בכל מדד.",
});

const FAQ = [
  { q: "איך משווים שני רכיבי חומרה ב-tested?", a: "בוחרים קטגוריה (כרטיס מסך, מעבד וכו'), מחפשים שני רכיבים בשדות החיפוש ולוחצים על 'השווה'. מקבלים טבלת מפרט מלאה עם סימון מנצח בכל מדד ומחירים מעודכנים." },
  { q: "האם המחירים מעודכנים?", a: "המחירים מוצגים בשקלים ובדולרים וניתנים להחלפה בלחיצה. הם מובאים לצורכי השוואה וייתכנו שינויים — מומלץ לאמת מול החנות לפני רכישה." },
  { q: "אילו קטגוריות נתמכות?", a: "עשר קטגוריות חומרה: כרטיסי מסך (GPU), מעבדים (CPU), זיכרון (RAM), כונני SSD, כוננים קשיחים, כוננים ניידים, ספקי כוח (PSU), לוחות אם, מארזים וקירור — כולן עם מפרט טכני מותאם." },
];

export default function HomePage() {
  const popular = getPopularComparisons().slice(0, 6);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
        {/* זוהר דו-גוני עדין מאחורי ה-Hero — ירוק + אינדיגו בשותפות */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-72 max-w-3xl">
          <div className="absolute end-[16%] top-2 h-56 w-72 rounded-full bg-accent/15 blur-[120px]" />
          <div className="absolute start-[16%] top-0 h-56 w-72 rounded-full bg-accent2/20 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.12] tracking-tight text-black dark:text-white sm:text-5xl sm:leading-[1.07] md:text-6xl lg:text-7xl">
            יותר מ-500 רכיבי חומרה להשוואה
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            כרטיס מסך מול כרטיס מסך, מעבד מול מעבד. מפרט טכני מלא, מחירים מעודכנים וסימון מנצח ברור בכל מדד — בעיצוב נקי ומהיר.
          </p>
        </div>

        {/* בורר ההשוואה */}
        <div className="mx-auto mt-10 max-w-3xl">
          <ComparePicker />
        </div>

        {/* פיצ'רים */}
        <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted">
          <li className="inline-flex items-center gap-1.5"><SearchIcon width={13} height={13} className="text-accent" /> חיפוש חכם</li>
          <li className="inline-flex items-center gap-1.5"><TrophyIcon width={13} height={13} className="text-accent" /> סימון מנצח בכל מדד</li>
          <li className="inline-flex items-center gap-1.5"><SparkIcon width={13} height={13} className="text-accent" /> מחירים ב-₪ / $</li>
        </ul>
      </section>

      {/* באנד איורים — לא רק טבלת מפרט */}
      <Reveal>
        <Showcase />
      </Reveal>

      {/* קטגוריות */}
      <Reveal as="section" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeader title="כל הקטגוריות" subtitle="בחרו סוג רכיב והתחילו להשוות" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/category/${cat.key}`}
              className="card group flex flex-col gap-3 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ color: `hsl(${categoryColor(cat.key)})`, backgroundColor: `hsl(${categoryColor(cat.key)} / 0.12)` }}
                >
                  <CategoryIcon category={cat.key} width={22} height={22} />
                </span>
                <span className="mono text-xs text-muted">{categoryCount(cat.key)} דגמים</span>
              </div>
              <div>
                <h3 className="text-base font-semibold">{cat.pluralHe}</h3>
                <p className="mt-0.5 text-xs text-muted">{cat.nameEn}</p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* מהבלוג */}
      <Reveal as="section" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeader title="מדריכים מהבלוג" subtitle="טיפים ומדריכי בנייה" action={{ href: "/blog", label: "לכל הכתבות" }} />
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group flex flex-col gap-3 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
            >
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="mono rounded-md bg-surface px-2 py-0.5 text-[10px] text-muted">{t}</span>
                ))}
              </div>
              <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-accent">{post.title}</h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <span className="mono mt-auto text-[11px] text-muted">{post.readingMinutes} דק׳ קריאה</span>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* השוואות פופולריות */}
      <Reveal as="section" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeader title="השוואות פופולריות" subtitle="הקרבות המבוקשים ביותר השבוע" />
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popular.map((pc, i) => {
            const a = getComponent(pc.a);
            const b = getComponent(pc.b);
            if (!a || !b) return null;
            return <ComparisonCard key={i} a={a} b={b} label={pc.label} />;
          })}
        </div>
      </Reveal>
    </>
  );
}
