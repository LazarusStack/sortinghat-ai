/**
 * Shared origin and entity identity.
 *
 * The blog already emitted a full JSON-LD graph while the homepage emitted
 * none — so the page that should define what Sortinghat *is* said nothing a
 * machine could read, while a post about screening calls said everything.
 * These ids are the fixed points every page's graph refers back to.
 */
export const SITE = "https://sortinghat.ai";

export const ORG_ID = `${SITE}/#org`;
export const WEBSITE_ID = `${SITE}/#website`;
export const PRODUCT_ID = `${SITE}/#product`;

export const ORG_NAME = "Sortinghat";
export const ORG_SAME_AS = ["https://www.linkedin.com/company/sortinghatai/"];

/**
 * The author is an entity, not a byline string.
 *
 * Every post carried Person schema whose @id resolved to `/blog#author` — a
 * fragment on a listing page, with a single sameAs and no url. Nothing an
 * answer engine could follow to decide whether the person writing 125 posts
 * about staffing software knows the subject. The Person now has a page of its
 * own, and the profiles below are what tie the same human together across
 * sites, which is the whole job of sameAs.
 */
export const AUTHOR_PATH = "/authors/apoorv-tamrkar";
export const AUTHOR_ID = `${SITE}${AUTHOR_PATH}#person`;
export const AUTHOR_SAME_AS = [
  "https://www.linkedin.com/in/apoorvtamrkar/",
  "https://www.instagram.com/apoorvtamrkar/",
  "https://x.com/apoorv_tamrkar",
];
