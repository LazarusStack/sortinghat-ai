import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import { Footer } from "@/components/sections";
import { AUTHOR, POSTS, SECTIONS, postsInSection } from "@/lib/blog";
import { personNode } from "@/lib/schema";
import { AUTHOR_ID, AUTHOR_PATH, ORG_ID, ORG_NAME, SITE } from "@/lib/seo";

/**
 * The author had schema but no page.
 *
 * Every post declared a Person whose @id pointed at `/blog#author` — a fragment
 * on a listing page, carrying one sameAs and no url. The exports linked to
 * /authors/apoorv-tamrakar, which 404'd, so the import unwrapped those anchors
 * rather than shipping dead links. This is the page they were pointing at.
 *
 * ProfilePage is the type Google documents for author pages, and mainEntity is
 * what ties it to the Person the 125 posts already reference. The three
 * profiles in sameAs are what let an answer engine decide the byline on this
 * site and the account on X are the same human.
 */

const TITLE = `${AUTHOR.name}: Founder of Sortinghat`;
const DESCRIPTION =
  "Apoorv Tamrkar is the founder of Sortinghat and writes the analysis on this site: recruiter capacity, sourcing economics, ATS pricing and what actually changes when AI reaches a delivery desk.";

export const metadata: Metadata = {
  title: `${TITLE} | Sortinghat`,
  description: DESCRIPTION,
  alternates: { canonical: AUTHOR_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: AUTHOR_PATH,
    siteName: "Sortinghat",
    type: "profile",
  },
};

const SOCIALS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: AUTHOR.linkedin },
  { label: "X", href: AUTHOR.x },
  { label: "Instagram", href: AUTHOR.instagram },
];

/* What the writing is actually built on. Every line here is a claim the posts
   themselves make and can be checked against, rather than a credential. */
const BASIS: [string, string][] = [
  [
    "Runs the platform the posts describe",
    "Sortinghat is an AI-native ATS and CRM used by staffing, search and RPO firms, including firms of 400+ employees. The operating numbers quoted across this site come from that platform rather than from a survey.",
  ],
  [
    "Writes from platform data, not category commentary",
    "The recurring figures — a 3 million record database audit that found 10% duplicates and 80% still-usable profiles, portal spend falling from $100 a role to $60, roughly 40 responses per 100 contacted by phone against 25 on WhatsApp and 12 to 15 by email, a manual desk's ceiling of about 40 calls a day — are measurements, and the posts say where each one comes from.",
  ],
  [
    "Publishes the limits as well as the wins",
    "Several posts here argue against the product's own category: most AI recruiting tools change no number that matters, nobody needs another resume screener, and there is a list of twelve things automation still cannot do in recruitment.",
  ],
  [
    "Names sources and withholds numbers that would not survive quoting",
    "Market figures are attributed to NASSCOM, Zinnov, Staffing Industry Analysts and the US Bureau of Labor Statistics. Where the spread inside a market exceeds the spread between markets — notice periods in India, recruitment fees by country — the posts say so and publish no average.",
  ],
];

export default function AuthorPage() {
  const total = POSTS.length;
  const sections = SECTIONS.map((s) => ({
    section: s,
    count: postsInSection(s).length,
  })).filter((s) => s.count > 0);
  const recent = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE}${AUTHOR_PATH}`,
        url: `${SITE}${AUTHOR_PATH}`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        mainEntity: { "@id": AUTHOR_ID },
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: ORG_NAME,
        url: SITE,
      },
      {
        ...personNode(AUTHOR.name, AUTHOR.role, AUTHOR.bio),
        knowsAbout: [
          "Applicant tracking systems",
          "Recruitment CRM",
          "Staffing agency operations",
          "AI in recruitment",
          "Candidate sourcing",
          "Global capability centre hiring",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}${AUTHOR_PATH}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Sortinghat", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: AUTHOR.name,
            item: `${SITE}${AUTHOR_PATH}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Nav />
      <main className="pt-28 md:pt-32">
        <div className="shell">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-faint uppercase"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Sortinghat
            </Link>
            <span aria-hidden>/</span>
            <span className="text-accent">Author</span>
          </nav>

          <div className="mt-7 grid gap-10 lg:grid-cols-[auto_minmax(0,44rem)]">
            <span
              aria-hidden
              className="display grid h-20 w-20 shrink-0 place-items-center rounded-full bg-ink text-[34px] text-white"
            >
              A
            </span>
            <div>
              <h1 className="display text-[clamp(2.1rem,4.4vw,3.2rem)] text-ink">
                {AUTHOR.name}
              </h1>
              <p className="mt-3 text-[15px] tracking-[0.02em] text-muted">
                {AUTHOR.role}, Sortinghat · Bengaluru
              </p>
              <p className="mt-6 text-[18.5px] leading-[1.55] text-ink-soft">
                {AUTHOR.bio}
              </p>
              <ul className="mt-7 flex flex-wrap items-center gap-3">
                {SOCIALS.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex h-9 items-center px-4 text-[13.5px] font-medium text-ink-soft hairline transition-colors hover:bg-ink hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:hello@sortinghat.ai"
                    className="inline-flex h-9 items-center px-4 text-[13.5px] font-medium text-ink-soft hairline transition-colors hover:bg-ink hover:text-white"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <section className="mt-16 border-t border-line pt-14 md:mt-20">
            <h2 className="display text-[clamp(1.5rem,2.6vw,2rem)] text-ink">
              What the writing is built on
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {BASIS.map(([h, d]) => (
                <div key={h}>
                  <h3 className="text-[16.5px] font-medium text-ink">{h}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-relaxed text-muted">
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 border-t border-line pt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="display text-[clamp(1.5rem,2.6vw,2rem)] text-ink">
                {total} articles on this site
              </h2>
              <Link
                href="/blog"
                className="text-[13.5px] text-muted transition-colors hover:text-ink"
              >
                All articles →
              </Link>
            </div>
            <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {sections.map(({ section, count }) => (
                <li
                  key={section.id}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-2.5"
                >
                  <Link
                    href={`/blog#${section.id}`}
                    className="text-[15px] text-ink-soft transition-colors hover:text-accent"
                  >
                    {section.title}
                  </Link>
                  <span className="text-[13px] text-faint">{count}</span>
                </li>
              ))}
            </ul>

            <h3 className="eyebrow mt-12">Most recent</h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {recent.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block bg-white p-5 transition-colors duration-200 hairline hover:bg-cream"
                  >
                    <span className="text-[11px] font-medium tracking-[0.1em] text-faint uppercase">
                      {p.tag} · {p.dateShort}
                    </span>
                    <span className="mt-2.5 block text-[15px] leading-snug text-ink transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
