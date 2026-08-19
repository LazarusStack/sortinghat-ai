import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/**
 * robots.txt was returning 404, so the site had no crawl directives and no
 * pointer to a sitemap.
 *
 * AI answer engines are named explicitly rather than left to fall through to
 * `*`: buyers research an ATS comparatively ("best ATS for staffing firms",
 * "X vs Y"), and those queries increasingly resolve inside an assistant. An
 * explicit group also survives a future tightening of the wildcard rule that
 * an implicit allow would not.
 *
 * robots.txt semantics: a crawler obeys only its most specific matching group
 * and ignores `*` entirely, so each group repeats what the wildcard grants.
 */
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "ChatGPT-User",
  "Claude-User",
  "Perplexity-User",
  "GPTBot",
  "ClaudeBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
