import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareButton } from "@/components/ShareButton";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/content";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: "כתבה לא נמצאה", noindex: true });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: post.tags,
    publishedTime: post.date,
  });
}

const dateFmt = new Intl.DateTimeFormat("he-IL", { dateStyle: "long" });

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(post, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "בית", path: "/" },
            { name: "בלוג", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            date: post.date,
            author: post.author,
          }),
        ]}
      />

      <article className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
        <Breadcrumbs items={[{ name: "בית", href: "/" }, { name: "בלוג", href: "/blog" }, { name: post.title }]} />

        <header className="mt-6">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="mono rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">{t}</span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>
          <div className="mono mt-5 flex flex-wrap items-center gap-3 border-y border-border py-3 text-xs text-muted">
            <span>{post.author}</span>
            <span className="text-border">/</span>
            <span>{dateFmt.format(new Date(post.date))}</span>
            <span className="text-border">/</span>
            <span>{post.readingMinutes} דק׳ קריאה</span>
          </div>
        </header>

        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-code:font-mono
            prose-th:text-foreground prose-blockquote:border-accent prose-blockquote:text-muted"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Link href="/blog" className="text-sm text-muted transition-colors hover:text-foreground">→ חזרה לבלוג</Link>
          <ShareButton title={post.title} />
        </div>
      </article>

      {related.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
          <SectionHeader title="כתבות נוספות" />
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card group flex flex-col gap-2 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
              >
                <h3 className="font-semibold leading-snug transition-colors group-hover:text-accent">{p.title}</h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                <span className="mono mt-auto pt-1 text-[11px] text-muted">{p.readingMinutes} דק׳</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
