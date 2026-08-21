import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/seo";

/**
 * sitemap.xml was returning 404: sixteen pages existed and nothing told a
 * crawler any of them were there.
 *
 * Every post currently carries the same date, so lastModified is honest but
 * uninformative until the posts get real dates — a crawler reading sixteen
 * identical timestamps learns only that they were imported together.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const newest = POSTS.reduce(
    (max, p) => (p.date > max ? p.date : max),
    "1970-01-01",
  );

  return [
    {
      url: SITE,
      lastModified: new Date(newest),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE}/blog`,
      lastModified: new Date(newest),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      // Dated like the rest: an entry with no lastModified gives a crawler
      // nothing to decide a recrawl on, and it was the one URL here missing it.
      url: `${SITE}/security`,
      lastModified: new Date(newest),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...POSTS.map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
