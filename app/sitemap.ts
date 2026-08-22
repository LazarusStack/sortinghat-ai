import type { MetadataRoute } from "next";
import { POSTS, figuresOf } from "@/lib/blog";
import { PAGES } from "@/lib/pages";
import { AUTHOR_PATH } from "@/lib/seo";
import { SITE } from "@/lib/seo";

/**
 * sitemap.xml was returning 404: sixteen pages existed and nothing told a
 * crawler any of them were there.
 *
 * The 25 Product Comparison 101 posts carry real, distinct publication dates
 * across June 2026. The 14 founder posts still share 2026-08-15 from their
 * import, so lastModified is honest but uninformative for those until they get
 * dates of their own.
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
    // The pages split out of the homepage. They rank for what a buyer types
    // and were unreachable as fragments, so they sit above the posts.
    ...PAGES.map((page) => ({
      url: `${SITE}${page.path}`,
      lastModified: new Date(newest),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE}${AUTHOR_PATH}`,
      lastModified: new Date(newest),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Each post carries its two figures. Google discovers images from the page
    // anyway, but an image sitemap is the only place to state that they belong
    // to this URL, and 252 screenshots were previously announced nowhere.
    ...POSTS.map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: figuresOf(post.slug).map((f) => `${SITE}${f.src}`),
    })),
  ];
}
