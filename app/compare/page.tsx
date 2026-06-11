import type { Metadata } from "next";
import { ComparePicker } from "@/components/ComparePicker";
import { ComparisonCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { getComponent } from "@/lib/data";
import { getPopularComparisons } from "@/lib/content";
import { isCategoryKey } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import type { CategoryKey } from "@/lib/types";

export const metadata: Metadata = buildMetadata({
  title: "השוואת רכיבים",
  description: "בחרו שני רכיבי חומרה והשוו ביניהם — כרטיסי מסך, מעבדים, זיכרון, SSD, ספקי כוח, לוחות אם, מארזים, קירור ועוד. מפרט מלא ומחירים מעודכנים.",
  path: "/compare",
});

interface Props {
  searchParams: Promise<{ cat?: string; a?: string; b?: string }>;
}

export default async function CompareBuilderPage({ searchParams }: Props) {
  const sp = await searchParams;
  const a = sp.a ? getComponent(sp.a) ?? null : null;
  const b = sp.b ? getComponent(sp.b) ?? null : null;
  const category: CategoryKey =
    a?.category ?? (sp.cat && isCategoryKey(sp.cat) ? sp.cat : "gpu");

  const popular = getPopularComparisons().slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
      <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "השוואה" }]} />

      <div className="mx-auto mt-8 max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">בנו השוואה</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          בחרו קטגוריה, חפשו שני רכיבים ולחצו להשוואה. תקבלו טבלת מפרט מלאה עם סימון מנצח בכל מדד.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <ComparePicker initialCategory={category} initialA={a} initialB={b} />
      </div>

      <section className="mt-16">
        <SectionHeader title="התחילו מהשוואה פופולרית" subtitle="הקרבות המבוקשים ביותר" />
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popular.map((pc, i) => {
            const ca = getComponent(pc.a);
            const cb = getComponent(pc.b);
            if (!ca || !cb) return null;
            return <ComparisonCard key={i} a={ca} b={cb} label={pc.label} />;
          })}
        </div>
      </section>
    </div>
  );
}
