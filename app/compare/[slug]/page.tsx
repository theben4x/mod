import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildSlug, compareComponents, parseSlug } from "@/lib/compare";
import { getComponent } from "@/lib/data";
import { getCategory } from "@/data/categories";
import { getPrices } from "@/lib/prices/provider";
import { getPopularComparisons } from "@/lib/content";
import { CompareTable } from "@/components/CompareTable";
import { RadarChart } from "@/components/RadarChart";
import { VerdictBanner } from "@/components/VerdictBanner";
import { ComparePicker } from "@/components/ComparePicker";
import { ComparisonCard } from "@/components/cards";
import { ComponentImage } from "@/components/ComponentImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareButton } from "@/components/ShareButton";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryGlow } from "@/components/CategoryGlow";
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from "@/lib/seo";
import { POPULAR_COMPARISONS } from "@/data/popular";
import type { Component } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POPULAR_COMPARISONS.map((pc) => ({ slug: buildSlug(pc.a, pc.b) }));
}

/** מאתר זוג רכיבים תקין מ-slug (אותה קטגוריה). */
function resolvePair(slug: string) {
  const parsed = parseSlug(decodeURIComponent(slug));
  if (!parsed) return null;
  const [aId, bId] = parsed;
  const a = getComponent(aId);
  const b = getComponent(bId);
  if (!a || !b || a.category !== b.category || a.id === b.id) return null;
  const category = getCategory(a.category);
  if (!category) return null;
  return { a, b, category };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pair = resolvePair(slug);
  if (!pair) return buildMetadata({ title: "השוואה לא נמצאה", noindex: true });
  const { a, b, category } = pair;
  const title = `${a.name} מול ${b.name}`;
  const description = `השוואה מלאה בין ${a.name} ל-${b.name} — מפרט טכני, ביצועים ומחירים מעודכנים. ${category.tagline}.`;
  return buildMetadata({
    title,
    description,
    path: `/compare/${slug}`,
    keywords: [`${a.name} מול ${b.name}`, `${a.name} vs ${b.name}`, category.nameHe, "השוואה", a.brand, b.brand],
  });
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const pair = resolvePair(slug);
  if (!pair) notFound();
  const { a, b, category } = pair;

  const result = compareComponents(category, a, b);
  const prices = await getPrices([a.id, b.id]);
  const priceA = prices[a.id];
  const priceB = prices[b.id];

  // השוואות קשורות באותה קטגוריה
  const related = getPopularComparisons(category.key)
    .filter((pc) => buildSlug(pc.a, pc.b) !== slug && buildSlug(pc.b, pc.a) !== slug)
    .map((pc) => {
      const ra = getComponent(pc.a);
      const rb = getComponent(pc.b);
      return ra && rb ? { a: ra, b: rb, label: pc.label } : null;
    })
    .filter((x): x is { a: Component; b: Component; label: string | undefined } => x !== null)
    .slice(0, 3);

  const title = `${a.name} מול ${b.name}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "בית", path: "/" },
            { name: category.pluralHe, path: `/category/${category.key}` },
            { name: title, path: `/compare/${slug}` },
          ]),
          productJsonLd({
            name: a.name,
            brand: a.brand,
            category: category.nameEn,
            price: priceA?.ils ?? null,
            url: `/component/${a.id}`,
            description: a.blurb,
          }),
          productJsonLd({
            name: b.name,
            brand: b.brand,
            category: category.nameEn,
            price: priceB?.ils ?? null,
            url: `/component/${b.id}`,
            description: b.blurb,
          }),
        ]}
      />

      <div className="relative mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <CategoryGlow category={category.key} />
        <Breadcrumbs
          items={[
            { name: "בית", href: "/" },
            { name: category.pluralHe, href: `/category/${category.key}` },
            { name: title },
          ]}
        />

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="ltr">{a.name}</span> <span className="text-muted">מול</span> <span className="ltr">{b.name}</span>
          </h1>
          <ShareButton title={title} />
        </div>

        {/* שורת מול-מול עם תמונות המוצרים */}
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <Link href={`/component/${a.id}`} className="group flex flex-col items-center gap-2.5 text-center">
            <ComponentImage
              component={a}
              className="h-28 w-28 transition-transform duration-300 group-hover:scale-[1.03] sm:h-32 sm:w-32"
              sizes="128px"
              iconSize={52}
            />
            <span className="ltr text-sm font-semibold leading-tight">{a.name}</span>
            <span className="mono text-[11px] uppercase tracking-wide text-muted">{a.brand}</span>
          </Link>

          <span className="mono rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-muted">VS</span>

          <Link href={`/component/${b.id}`} className="group flex flex-col items-center gap-2.5 text-center">
            <ComponentImage
              component={b}
              className="h-28 w-28 transition-transform duration-300 group-hover:scale-[1.03] sm:h-32 sm:w-32"
              sizes="128px"
              iconSize={52}
            />
            <span className="ltr text-sm font-semibold leading-tight">{b.name}</span>
            <span className="mono text-[11px] uppercase tracking-wide text-muted">{b.brand}</span>
          </Link>
        </div>

        <div className="mt-6 space-y-5">
          <VerdictBanner result={result} />
          <RadarChart result={result} />
          <CompareTable result={result} priceA={priceA} priceB={priceB} />
        </div>

        {/* עריכת ההשוואה */}
        <section className="mt-12">
          <SectionHeader title="שנו את ההשוואה" subtitle="החליפו רכיב או בחרו זוג אחר" />
          <ComparePicker initialCategory={category.key} initialA={a} initialB={b} />
        </section>

        {/* השוואות קשורות */}
        {related.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="השוואות קשורות" subtitle={`עוד ב${category.pluralHe}`} />
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {related.map((r, i) => (
                <ComparisonCard key={i} a={r.a} b={r.b} label={r.label} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
