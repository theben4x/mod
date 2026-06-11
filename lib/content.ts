import type { BlogPost, CategoryKey, PopularComparison } from "./types";
import { BLOG_POSTS } from "@/data/blog";
import { POPULAR_COMPARISONS } from "@/data/popular";

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aShared = a.category === post.category ? 1 : 0;
      const bShared = b.category === post.category ? 1 : 0;
      return bShared - aShared;
    })
    .slice(0, limit);
}

export function getPopularComparisons(category?: CategoryKey): PopularComparison[] {
  return category ? POPULAR_COMPARISONS.filter((c) => c.category === category) : POPULAR_COMPARISONS;
}
