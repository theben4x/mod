import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FavoritesView } from "@/components/FavoritesView";
import { allComponents } from "@/lib/data";
import { componentImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "המועדפים שלי",
  description: "הרכיבים ששמרתם והרכיבים שנצפו לאחרונה — במקום אחד.",
  path: "/favorites",
  noindex: true,
});

export default function FavoritesPage() {
  // מפת תמונות לכל הרכיבים — המועדפים נקבעים ב-client מ-localStorage, לכן מעבירים הכל
  const images = Object.fromEntries(allComponents().map((c) => [c.id, componentImage(c.id)]));

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
      <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "המועדפים שלי" }]} />

      <header className="mt-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">המועדפים שלי</h1>
        <p className="mt-3 text-muted">הרכיבים ששמרתם, והרכיבים שנצפו לאחרונה — נשמרים בדפדפן שלכם.</p>
      </header>

      <div className="mt-8">
        <FavoritesView images={images} />
      </div>
    </div>
  );
}
