import { ORG_ID, ORG_NAME, ORG_SAME_AS, PRODUCT_ID, SITE, WEBSITE_ID } from "@/lib/seo";

const DESCRIPTION =
  "AI Native ATS built for top 1% staffing firms. We don't just track roles. We 2X your recruiters and bet on your firm's growth.";

/**
 * The homepage graph: Organization, WebSite, and the product itself.
 *
 * SoftwareApplication rather than a bare Product because that is what an ATS
 * is, and because the properties that matter to a buyer comparing tools —
 * category, audience, operating environment — only exist on that type. Buyers
 * of recruiting software search comparatively, and those queries are resolved
 * through entity understanding rather than keyword matching, so leaving the
 * product undeclared is the expensive gap.
 *
 * Deliberately absent: offers/pricing, aggregateRating and reviewCount. There
 * is no pricing page and no collected reviews, and inventing either is the one
 * thing structured data must never be used for.
 */
export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: ORG_NAME,
        url: SITE,
        description: DESCRIPTION,
        sameAs: ORG_SAME_AS,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE,
        name: ORG_NAME,
        description: DESCRIPTION,
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": PRODUCT_ID,
        name: ORG_NAME,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Applicant Tracking System",
        operatingSystem: "Web",
        url: SITE,
        description: DESCRIPTION,
        publisher: { "@id": ORG_ID },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Staffing and recruiting firms",
        },
      },
    ],
  };
}

/* ------------------------------------------------------------- pages --- */

import { AUTHOR_ID, AUTHOR_PATH, AUTHOR_SAME_AS } from "@/lib/seo";
import type { Page } from "@/lib/pages";

/** The author as a first-class entity, referenced by @id from every page. */
export function personNode(name: string, role: string, bio: string) {
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name,
    jobTitle: role,
    description: bio,
    url: `${SITE}${AUTHOR_PATH}`,
    worksFor: { "@id": ORG_ID },
    sameAs: AUTHOR_SAME_AS,
  };
}

/**
 * The graph for a marketing page.
 *
 * WebPage rather than nothing, because a page that is not declared is a page an
 * answer engine has to infer from its own text. FAQPage because these pages
 * exist to answer the questions a buyer types, and a question with a marked
 * answer can be returned as one. BreadcrumbList because /platform/talent-pool
 * is now a real path with a real parent, which it was not when it was `#talent-pool`.
 */
export function pageSchema(page: Page) {
  const url = `${SITE}${page.path}`;
  const trail = [
    { "@type": "ListItem", position: 1, name: "Sortinghat", item: SITE },
    ...page.crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: c.name,
      item: `${SITE}${c.path}`,
    })),
    {
      "@type": "ListItem",
      position: page.crumbs.length + 2,
      name: page.eyebrow,
      item: url,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: page.h1,
        description: page.description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PRODUCT_ID },
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: trail },
      ...(page.faq.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: page.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}
