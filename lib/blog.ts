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
  {
    id: "market-updates-data",
    title: "Market Updates & Data",
    dek: "What the GCC, BPO, IT services and US staffing numbers actually say, read against what they change on a delivery desk rather than repeated as headlines.",
  },
  {
    id: "ai-impact-by-segment",
    title: "AI Impact by Segment",
    dek: "Where automation genuinely changes a desk and where it does not, taken one segment at a time: sourcing, outbound, RPO, temp, back office and the contingency model.",
  },
  {
    id: "talent-search-by-segment",
    title: "Talent Search by Segment",
    dek: "How the work actually differs by the kind of role being filled: blue collar, leadership, tech, business, healthcare, BFSI, volume ramps and the genuinely scarce.",
  },
  {
    id: "contrarian-opinion",
    title: "Contrarian / Opinion",
    dek: "Arguments the industry mostly avoids making out loud, each one committed to a position rather than surveying both sides and stopping.",
  },
  {
    id: "benchmarks",
    title: "Benchmarks",
    dek: "Numbers worth planning against, published with the methodology attached and without a single headline figure where the spread makes one dishonest.",
  },
  {
    id: "policy-salary-workplace",
    title: "Policy, Salary & Workplace",
    dek: "The rules a staffing firm operates inside: AI hiring law in the EU, the US states and India, candidate data under DPDP, contract labour, pay transparency, moonlighting and where people work.",
  },
  {
    id: "agency-growth-revenue",
    title: "Agency Growth & Revenue",
    dek: "Growing the top line without adding heads: what an existing client is already willing to buy, and which services are worth attaching to a desk that already delivers.",
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

/* -------------------------------------------------------------- related ---

   The `related` field comes from the export, and for 50 of the 64 posts it is
   the same three slugs. Rendered as-is, the module at the foot of a post says
   the same thing almost everywhere and carries no signal about what the post
   is actually next to.

   So it is computed here instead, corpus-wide, rather than trusted per post.
   Three properties are worth having and only the third needs explaining:

   1. Relevance. Same section, then overlap on the words in the title and
      description, which is what a reader is choosing between.
   2. Determinism. Ties break on slug, nothing reads the clock, so an unchanged
      corpus produces byte-identical output on every build.
   3. Every post is somebody's related post. Scoring alone leaves a tail of
      posts that are eligible everywhere and best nowhere, so ties break toward
      the least-linked candidate and a repair pass afterwards guarantees the
      property outright. That is why the assignment is computed for the whole
      corpus at once and cached, not derived per post on demand.
*/

const RELATED_COUNT = 4;

/** Words too common across a staffing blog to mean two posts are related. */
const STOP = new Set(
  ("a an and are as at be by for from how in is it its of on or that the to"
   + " what when where which who why with your you not now does do")
    .split(" "),
);

function terms(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

/**
 * Shared words are not worth the same. Every comparison title reads "Sortinghat
 * vs X: The 2026 Comparison for ... Firms", so counting matches evenly made the
 * boilerplate outweigh the subject: "Sortinghat vs Loxo" scored higher against
 * "Sortinghat vs Crelate" (five shared filler words) than against "Loxo
 * Alternatives" (the one word that actually names what both are about). Rarity
 * across the corpus is the correction — a word in two titles counts for far
 * more than a word in thirty.
 */
function rarity(): Map<string, number> {
  const df = new Map<string, number>();
  for (const p of POSTS) {
    for (const w of terms(`${p.title} ${p.description}`)) {
      df.set(w, (df.get(w) ?? 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  for (const [w, n] of df) idf.set(w, Math.log(POSTS.length / n));
  return idf;
}

const IDF = rarity();

function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const w of a) if (b.has(w)) n += IDF.get(w) ?? 0;
  return n;
}

/**
 * A related set shared by more than a handful of posts is export boilerplate,
 * not an editorial choice, so it is dropped rather than seeded from.
 */
function editorialSeeds(): Map<string, string[]> {
  const shared = new Map<string, number>();
  for (const p of POSTS) {
    const key = [...p.related].sort().join("|");
    if (key) shared.set(key, (shared.get(key) ?? 0) + 1);
  }
  const seeds = new Map<string, string[]>();
  for (const p of POSTS) {
    const key = [...p.related].sort().join("|");
    seeds.set(
      p.slug,
      key && (shared.get(key) ?? 0) <= 5
        ? p.related.filter((s) => POSTS.some((q) => q.slug === s))
        : [],
    );
  }
  return seeds;
}

function buildRelated(): Map<string, string[]> {
  const seeds = editorialSeeds();
  const words = new Map(
    POSTS.map((p) => [p.slug, terms(`${p.title} ${p.description}`)] as const),
  );
  const titles = new Map(POSTS.map((p) => [p.slug, terms(p.title)] as const));
  const inbound = new Map(POSTS.map((p) => [p.slug, 0]));

  const assigned = new Map<string, string[]>();
  for (const post of POSTS) {
    const picked = seeds.get(post.slug) ?? [];
    for (const s of picked) inbound.set(s, (inbound.get(s) ?? 0) + 1);

    const scored = POSTS.filter(
      (q) => q.slug !== post.slug && !picked.includes(q.slug),
    ).map((q) => ({
      slug: q.slug,
      // the title carries the subject; the description only supports it
      score:
        (q.section === post.section ? 3 : 0) +
        overlap(titles.get(post.slug)!, titles.get(q.slug)!) * 2 +
        overlap(words.get(post.slug)!, words.get(q.slug)!),
    }));

    scored.sort(
      (a, b) =>
        b.score - a.score ||
        (inbound.get(a.slug) ?? 0) - (inbound.get(b.slug) ?? 0) ||
        a.slug.localeCompare(b.slug),
    );

    for (const c of scored) {
      if (picked.length >= RELATED_COUNT) break;
      picked.push(c.slug);
      inbound.set(c.slug, (inbound.get(c.slug) ?? 0) + 1);
    }
    assigned.set(post.slug, picked);
  }

  // Repair: any post nobody links to displaces the weakest pick on the post it
  // scores best against, chosen among the sources that can spare a link.
  for (const orphan of POSTS.filter((p) => (inbound.get(p.slug) ?? 0) === 0)) {
    const hosts = POSTS.filter((p) => p.slug !== orphan.slug)
      .map((p) => ({
        slug: p.slug,
        fit:
          (p.section === orphan.section ? 3 : 0) +
          overlap(titles.get(p.slug)!, titles.get(orphan.slug)!) * 2 +
          overlap(words.get(p.slug)!, words.get(orphan.slug)!),
      }))
      .sort((a, b) => b.fit - a.fit || a.slug.localeCompare(b.slug));

    for (const host of hosts) {
      const list = assigned.get(host.slug)!;
      // only take a link from a target that has one to spare
      const idx = [...list]
        .reverse()
        .findIndex((s) => (inbound.get(s) ?? 0) > 1);
      if (idx === -1) continue;
      const at = list.length - 1 - idx;
      inbound.set(list[at], (inbound.get(list[at]) ?? 0) - 1);
      list[at] = orphan.slug;
      inbound.set(orphan.slug, 1);
      break;
    }
  }

  return assigned;
}

const RELATED = buildRelated();

export function relatedPosts(post: Post): Post[] {
  return (RELATED.get(post.slug) ?? [])
    .map((s) => POSTS.find((p) => p.slug === s))
    .filter((p): p is Post => Boolean(p));
}
