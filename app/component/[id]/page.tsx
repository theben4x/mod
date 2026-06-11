import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparisonCard } from "@/components/cards";
import { ComponentImage } from "@/components/ComponentImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryGlow } from "@/components/CategoryGlow";
import { PriceWithTime } from "@/components/PriceTag";
import { JsonLd } from "@/components/JsonLd";
import { allComponents, getByCategory, getComponent, relatedComponents } from "@/lib/data";
import { componentImage } from "@/lib/images";
import { getCategory } from "@/data/categories";
import { getPrice } from "@/lib/prices/provider";
import { formatSpec } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from "@/lib/seo";
import { TrophyIcon, CheckIcon } from "@/components/icons";
import { BUILD_SLOTS } from "@/lib/compatibility";
import { getVerification } from "@/data/verification";
import { FavoriteButton } from "@/components/FavoriteButton";
import { RecordView } from "@/components/RecordView";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return allComponents().map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = getComponent(id);
  if (!c) return buildMetadata({ title: "רכיב לא נמצא", noindex: true });
  const cat = getCategory(c.category)!;
  return buildMetadata({
    title: c.name,
    description: `${c.name} — מפרט טכני מלא, ביצועים ומחיר מעודכן. ${c.blurb ?? cat.tagline}.`,
    path: `/component/${c.id}`,
    keywords: [c.name, c.brand, cat.nameHe, "מפרט", "מחיר"],
    image: componentImage(c.id) ?? undefined,
    imageAlt: c.name,
  });
}

export default async function ComponentPage({ params }: Props) {
  const { id } = await params;
  const c = getComponent(id);
  if (!c) notFound();
  const cat = getCategory(c.category)!;
  const verification = getVerification(c.id);
  const price = await getPrice(c.id);
  const related = relatedComponents(c, 3);

  // דירוג בקטגוריה לפי ציון
  const ranked = [...getByCategory(c.category)].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const rank = ranked.findIndex((x) => x.id === c.id) + 1;
  const total = ranked.length;

  // מפרט-מפתח לסריקה מהירה
  const highlights = cat.fields.filter((f) => f.primary).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "בית", path: "/" },
            { name: cat.pluralHe, path: `/category/${cat.key}` },
            { name: c.name, path: `/component/${c.id}` },
          ]),
          productJsonLd({
            name: c.name,
            brand: c.brand,
            category: cat.nameEn,
            price: price.ils,
            url: `/component/${c.id}`,
            description: c.blurb,
            image: componentImage(c.id),
            sku: c.id,
          }),
        ]}
      />

      <RecordView id={c.id} />

      <div className="relative mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <CategoryGlow category={cat.key} />
        <Breadcrumbs
          items={[
            { name: "בית", href: "/" },
            { name: cat.pluralHe, href: `/category/${cat.key}` },
            { name: c.name },
          ]}
        />

        {/* כותרת */}
        <header className="card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-4 sm:items-center">
            <ComponentImage
              component={c}
              className="h-20 w-20 sm:h-24 sm:w-24"
              sizes="96px"
              iconSize={38}
            />
            <div className="min-w-0">
            <span className="mono text-[11px] uppercase tracking-wide text-muted">{c.brand} · {c.year}</span>
            <h1 className="ltr mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{c.name}</h1>
            {c.blurb && <p className="mt-2 text-sm text-muted">{c.blurb}</p>}
            {rank > 0 && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">
                <TrophyIcon width={13} height={13} />
                מקום {rank} מתוך {total} ב{cat.pluralHe}
              </span>
            )}
            {BUILD_SLOTS.includes(c.category) && (
              <div className="mt-3">
                <Link
                  href={`/compatibility?${c.category}=${c.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  בדקו תאימות לחומרה שלכם ←
                </Link>
              </div>
            )}
            {verification && (
              <div className="mt-2">
                <a
                  href={verification.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
                  title={`מקור: ${verification.source}`}
                >
                  <CheckIcon width={12} height={12} className="text-win" />
                  מפרט מאומת מול היצרן · {verification.verifiedAt}
                </a>
              </div>
            )}
            <div className="mt-3">
              <FavoriteButton id={c.id} name={c.name} />
            </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4 border-t border-border pt-4 sm:border-0 sm:pt-0">
            {typeof c.score === "number" && (
              <span className="mono grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-lg font-bold text-accent">
                {c.score}
              </span>
            )}
            <PriceWithTime ils={price.ils} usd={price.usd} updatedAt={price.updatedAt} />
          </div>
        </header>

        {/* מפרט-מפתח */}
        {highlights.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highlights.map((f) => {
              const d = formatSpec(f, c.specs[f.key] ?? null);
              return (
                <div key={f.key} className="card flex flex-col gap-1 p-4">
                  <span className="truncate text-xs text-muted">{f.label}</span>
                  <span className="mono text-lg font-semibold tabular-nums">
                    {d.value}
                    {d.unit ? <span className="text-xs font-normal text-muted"> {d.unit}</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* מפרט מלא */}
        <section className="mt-8">
          <h2 className="mb-3 px-1 text-sm font-medium text-muted">מפרט טכני מלא</h2>
          <div className="card divide-y divide-border overflow-hidden">
            {cat.fields.map((f) => {
              const d = formatSpec(f, c.specs[f.key] ?? null);
              return (
                <div key={f.key} className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-surface/60 sm:px-5">
                  <span
                    className={`text-sm text-muted ${f.hint ? "cursor-help underline decoration-dotted decoration-border underline-offset-2" : ""}`}
                    title={f.hint || undefined}
                    aria-label={f.hint ? `${f.label} — ${f.hint}` : undefined}
                  >
                    {f.label}
                  </span>
                  <span className="mono text-sm font-medium tabular-nums">
                    {d.value}
                    {d.unit ? <span className="text-muted"> {d.unit}</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* השווה עם */}
        {related.length > 0 && (
          <section className="mt-12">
            <SectionHeader title="השוו מול דגמים דומים" subtitle={`עוד ב${cat.pluralHe}`} />
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {related.map((r) => (
                <ComparisonCard key={r.id} a={c} b={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
