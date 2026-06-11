import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparePicker } from "@/components/ComparePicker";
import { ComparisonCard } from "@/components/cards";
import { CategoryExplorer } from "@/components/CategoryExplorer";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_ORDER, getCategory, categoryColor } from "@/data/categories";
import { CategoryGlow } from "@/components/CategoryGlow";
import { getByCategory, getComponent, topComponents } from "@/lib/data";
import { componentImage } from "@/lib/images";
import { getPrices } from "@/lib/prices/provider";
import { getPopularComparisons } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return buildMetadata({ title: "קטגוריה לא נמצאה", noindex: true });
  return buildMetadata({
    title: `השוואת ${cat.pluralHe}`,
    description: `${cat.tagline}. השוו ${cat.pluralHe} זה מול זה — מפרט טכני מלא, ביצועים ומחירים מעודכנים ב-tested.`,
    path: `/category/${cat.key}`,
    keywords: [`השוואת ${cat.pluralHe}`, cat.nameEn, "מפרט", "מחירים", cat.nameHe],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const components = topComponents(cat.key, 100);
  const prices = await getPrices(components.map((c) => c.id));
  const images = Object.fromEntries(components.map((c) => [c.id, componentImage(c.id)]));
  const popular = getPopularComparisons(cat.key).slice(0, 3);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `השוואת ${cat.pluralHe}`,
    numberOfItems: components.length,
    itemListElement: components.slice(0, 20).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: absoluteUrl(`/component/${c.id}`),
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "בית", path: "/" },
            { name: cat.pluralHe, path: `/category/${cat.key}` },
          ]),
          itemListJsonLd,
        ]}
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <CategoryGlow category={cat.key} />
        <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: cat.pluralHe }]} />

        <header className="mt-6 flex items-center gap-4">
          <span
            className="grid h-14 w-14 place-items-center rounded-2xl"
            style={{ color: `hsl(${categoryColor(cat.key)})`, backgroundColor: `hsl(${categoryColor(cat.key)} / 0.12)` }}
          >
            <CategoryIcon category={cat.key} width={28} height={28} />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">השוואת {cat.pluralHe}</h1>
            <p className="mt-1 text-sm text-muted">{cat.tagline}</p>
          </div>
        </header>

        {/* בורר השוואה לקטגוריה */}
        <div className="mt-8">
          <ComparePicker initialCategory={cat.key} />
        </div>

        {/* השוואות פופולריות בקטגוריה */}
        {popular.length > 0 && (
          <section className="mt-14">
            <SectionHeader title="השוואות פופולריות" subtitle={`הקרבות המובילים ב${cat.pluralHe}`} />
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {popular.map((pc, i) => {
                const a = getComponent(pc.a);
                const b = getComponent(pc.b);
                if (!a || !b) return null;
                return <ComparisonCard key={i} a={a} b={b} label={pc.label} />;
              })}
            </div>
          </section>
        )}

        {/* כל הדגמים — סינון, מיון ובחירה להשוואה */}
        <section className="mt-14">
          <SectionHeader title={`כל ה${cat.pluralHe}`} subtitle={`חפשו, סננו ומיינו — או בחרו שניים להשוואה ישירה`} />
          <CategoryExplorer components={components} prices={prices} images={images} categoryKey={cat.key} />
        </section>
      </div>
    </>
  );
}
