import fs from "node:fs";
import path from "node:path";

/**
 * Posts live as data on disk rather than in the component tree: `posts.json`
 * for metadata and one HTML file per post for the body. Both are read on the
 * server at build time, so no article markup reaches the client bundle.
 */

export type Post = {
  slug: string;
  /** the H1, which runs longer than the <title> on purpose */
  title: string;
  /** the shorter <title>, kept under 60 characters for search results */
  metaTitle: string;
  description: string;
  section: string;
  dek: string;
  /** ISO, for <time> and JSON-LD */
  date: string;
  /** "15 August 2026", for the byline */
  dateLabel: string;
  /** "15 Aug 2026", for the compact card meta */
  dateShort: string;
  tag: string;
  read: string;
  cardImageAlt: string;
  toc: { id: string; label: string }[];
  faq: { q: string; a: string }[];
  related: string[];
  /** the post's own closing pitch, rebuilt as a panel at the foot of the page */
  cta: { title: string; body: string } | null;
};

export type Section = {
  id: string;
  title: string;
  dek: string;
  /** shown in place of the card grid while the section has no posts */
  empty?: { title: string; body: string; upcoming: string[] };
};

const DIR = path.join(process.cwd(), "content/blog");

export const POSTS: Post[] = (
  JSON.parse(fs.readFileSync(path.join(DIR, "posts.json"), "utf8")) as {
    posts: Post[];
  }
).posts;

/**
 * The section a post belongs to is the `section` field in posts.json, which
 * comes from the post's own metadata. Adding a section means adding it here;
 * adding a post to one means writing that section's name into the post.
 */
export const SECTIONS: Section[] = [
  {
    id: "from-apoorv",
    title: "From Apoorv (Founder, Sortinghat)",
    dek: "Founder-written pieces on how the platform works in practice, built around real platform data rather than category commentary.",
  },
  {
    id: "product-comparison-101",
    title: "Product Comparison 101",
    dek: "Honest, side-by-side comparisons of the tools staffing firms actually evaluate, including where the incumbents genuinely win.",
    empty: {
      title: "Nothing published here yet",
      body: "This section will hold the comparison and migration pieces: what carries over when you switch systems, what does not, and which firm profile each platform actually suits.",
      upcoming: [
        "Sortinghat vs Ceipal, Bullhorn, Recruiterflow and Zoho Recruit",
        "Alternatives round-ups by firm size and desk type",
        "ATS pricing and total cost of ownership",
        "Migration guides by source system",
      ],
    },
  },
];

export function postsInSection(section: Section): Post[] {
  return POSTS.filter((p) => p.section === section.title);
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function postBody(slug: string): string {
  return fs.readFileSync(path.join(DIR, `${slug}.html`), "utf8");
}

export const AUTHOR = {
  name: "Apoorv Tamrkar",
  role: "Founder",
  linkedin: "https://www.linkedin.com/in/apoorvtamrkar/",
  bio: "Founder of Sortinghat, an AI-native ATS and CRM for staffing, search and RPO firms. Writes about recruiter capacity, sourcing economics and what actually changes when AI reaches a delivery desk.",
};
