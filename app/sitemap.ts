import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { CATEGORY_ORDER } from "@/data/categories";
import { allComponents } from "@/lib/data";
import { componentImage } from "@/lib/images";
import { getAllPosts } from "@/lib/content";
import { POPULAR_COMPARISONS } from "@/data/popular";
import { buildSlug } from "@/lib/compare";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/compare"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/compatibility"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORY_ORDER.map((key) => ({
    url: absoluteUrl(`/category/${key}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const components: MetadataRoute.Sitemap = allComponents().map((c) => {
    const img = componentImage(c.id);
    return {
      url: absoluteUrl(`/component/${c.id}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
      ...(img ? { images: [absoluteUrl(img)] } : {}),
    };
  });

  const comparisons: MetadataRoute.Sitemap = POPULAR_COMPARISONS.map((pc) => ({
    url: absoluteUrl(`/compare/${buildSlug(pc.a, pc.b)}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
    ...(p.cover ? { images: [absoluteUrl(p.cover)] } : {}),
  }));

  return [...staticPages, ...categories, ...components, ...comparisons, ...posts];
}
