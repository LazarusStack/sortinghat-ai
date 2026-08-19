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
