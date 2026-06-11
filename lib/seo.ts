import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";

interface MetaInput {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  keywords?: string[];
  noindex?: boolean;
  publishedTime?: string;
  /** תמונת OG/Twitter ייעודית לעמוד (נתיב יחסי או מוחלט). מחליפה את ברירת המחדל. */
  image?: string;
  imageAlt?: string;
}

/**
 * בונה אובייקט Metadata עקבי לכל עמוד.
 * אם לא הועברה תמונה — נופלים לקונבנציית הקבצים opengraph-image.tsx (ברירת מחדל לאתר).
 * עמודים עם תמונה ייעודית (פוסט בלוג, מוצר) מעבירים image כדי לקבל כרטיס שיתוף ממוקד.
 */
export function buildMetadata(input: MetaInput = {}): Metadata {
  const title = input.title ? `${input.title} · ${SITE.name}` : SITE.longName;
  const description = input.description ?? SITE.description;
  const path = input.path ?? "/";
  const url = absoluteUrl(path);
  const images = input.image
    ? [{ url: input.image, alt: input.imageAlt ?? input.title ?? SITE.name }]
    : undefined;

  return {
    title,
    description,
    keywords: input.keywords ?? [...SITE.keywords],
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: absoluteUrl("/feed.xml"), title: `${SITE.name} — בלוג` }] },
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type: input.type ?? "website",
      siteName: SITE.name,
      title,
      description,
      url,
      locale: SITE.locale,
      ...(images ? { images } : {}),
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: SITE.twitter,
      ...(images ? { images } : {}),
    },
  };
}

// ─────────── JSON-LD builders ───────────

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: SITE.longName,
    url: SITE.url,
    inLanguage: "he-IL",
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/compare?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl("/icon.svg"),
    description: SITE.description,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function productJsonLd(opts: {
  name: string;
  brand: string;
  category: string;
  price?: number | null;
  currency?: "ILS" | "USD";
  url: string;
  description?: string;
  image?: string | null;
  sku?: string;
}) {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    brand: { "@type": "Brand", name: opts.brand },
    category: opts.category,
    url: absoluteUrl(opts.url),
  };
  if (opts.sku) node.sku = opts.sku;
  if (opts.image) node.image = absoluteUrl(opts.image);
  if (opts.description) node.description = opts.description;
  if (opts.price != null) {
    node.offers = {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: opts.currency ?? "ILS",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(opts.url),
    };
  }
  return node;
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  date: string;
  author: string;
  image?: string | null;
}) {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: "he-IL",
    datePublished: opts.date,
    dateModified: opts.date,
    author: { "@type": "Organization", name: opts.author },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(opts.path) },
  };
  if (opts.image) node.image = absoluteUrl(opts.image);
  return node;
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
