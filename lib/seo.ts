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
