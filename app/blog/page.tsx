import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getAllPosts } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "הבלוג",
  description: "מדריכים, השוואות וטיפים לבניית מחשב — כרטיסי מסך, מעבדים, זיכרון ואחסון. כל מה שצריך לדעת לפני הרכישה הבאה.",
  path: "/blog",
});

const dateFmt = new Intl.DateTimeFormat("he-IL", { dateStyle: "long" });

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `הבלוג של ${SITE.name}`,
    url: absoluteUrl("/blog"),
    inLanguage: "he-IL",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.date,
      description: p.excerpt,
      ...(p.cover ? { image: absoluteUrl(p.cover) } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "בית", path: "/" }, { name: "בלוג", path: "/blog" }]), blogJsonLd]} />

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "בלוג" }]} />

        <header className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">הבלוג</h1>
          <p className="mt-3 max-w-xl text-muted">מדריכים, השוואות וטיפים שיעזרו לכם לבחור נכון.</p>
        </header>

        {/* כתבה מובילה */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="card group mt-8 flex flex-col gap-4 overflow-hidden p-0 transition-all duration-300 hover:border-accent/60 hover:shadow-card"
          >
            {featured.cover && (
              <div className="relative aspect-[21/9] w-full overflow-hidden border-b border-border bg-surface">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col gap-4 p-6 pt-2 sm:p-8 sm:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] text-accent">מומלץ</span>
              {featured.tags.slice(0, 2).map((t) => (
                <span key={t} className="mono rounded-md bg-surface px-2 py-0.5 text-[10px] text-muted">{t}</span>
              ))}
            </div>
            <h2 className="text-2xl font-semibold leading-snug transition-colors group-hover:text-accent sm:text-3xl">{featured.title}</h2>
            <p className="max-w-2xl leading-relaxed text-muted">{featured.excerpt}</p>
            <div className="mono flex items-center gap-3 text-xs text-muted">
              <span>{dateFmt.format(new Date(featured.date))}</span>
              <span className="text-border">/</span>
              <span>{featured.readingMinutes} דק׳ קריאה</span>
            </div>
            </div>
          </Link>
        )}

        {/* שאר הכתבות */}
        <div className="mt-4 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
            >
              {post.cover && (
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-surface">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="mono rounded-md bg-surface px-2 py-0.5 text-[10px] text-muted">{t}</span>
                ))}
              </div>
              <h3 className="text-base font-semibold leading-snug transition-colors group-hover:text-accent">{post.title}</h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <div className="mono mt-auto flex items-center gap-2 pt-1 text-[11px] text-muted">
                <span>{dateFmt.format(new Date(post.date))}</span>
                <span className="text-border">/</span>
                <span>{post.readingMinutes} דק׳</span>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
