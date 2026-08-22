import Link from "next/link";
import Nav from "@/components/Nav";
import { Footer } from "@/components/sections";
import { BookDemo, Check } from "@/components/ui";
import { getPost } from "@/lib/blog";
import { pageSchema } from "@/lib/schema";
import type { Page } from "@/lib/pages";

/**
 * One shell for every page split out of the homepage.
 *
 * They share a shape deliberately: breadcrumb, H1, dek, prose, the substance,
 * an FAQ block, then the posts that treat the subject at length. The FAQ is
 * rendered as real headings and paragraphs rather than a details/summary
 * accordion, because content hidden behind a click is content a reader has to
 * find and an extractor has to guess at.
 */
export default function MarketingPage({ page }: { page: Page }) {
  const reading = page.reading
    .map((s) => getPost(s))
    .filter((p): p is NonNullable<ReturnType<typeof getPost>> => Boolean(p));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema(page)) }}
      />
      <Nav />
      <main className="pt-28 md:pt-32">
        <div className="shell">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-faint uppercase"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Sortinghat
            </Link>
            {page.crumbs.map((c) => (
              <span key={c.path} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href={c.path} className="transition-colors hover:text-ink">
                  {c.name}
                </Link>
              </span>
            ))}
            <span aria-hidden>/</span>
            <span className="text-accent">{page.eyebrow}</span>
          </nav>

          <div className="mt-7 max-w-3xl">
            <h1 className="display text-[clamp(2.1rem,4.6vw,3.4rem)] text-balance text-ink">
              {page.h1}
            </h1>
            <p className="mt-6 text-[19px] leading-[1.55] text-muted">{page.dek}</p>
            <div className="mt-8 border-t border-line pt-8">
              {page.intro.map((p) => (
                <p key={p} className="mb-5 text-[17px] leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
            <BookDemo className="mt-2" />
          </div>

          <div className="mt-16 grid gap-12 border-t border-line pt-14 md:mt-20 md:pt-16 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-20">
            <div className="min-w-0">
              {page.blocks.map((b) => (
                <section key={b.h} className="mb-12 last:mb-0">
                  <h2 className="display text-[clamp(1.5rem,2.6vw,2rem)] text-ink">
                    {b.h}
                  </h2>
                  <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
                    {b.body}
                  </p>
                  {b.points?.length ? (
                    <ul className="mt-6 space-y-4">
                      {b.points.map((pt) => (
                        <li key={pt.t} className="flex gap-3">
                          <Check />
                          <span className="text-[15.5px] leading-relaxed text-muted">
                            <strong className="font-medium text-ink">{pt.t}.</strong>{" "}
                            {pt.d}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <section
                id="faq"
                className="mt-14 border-t border-line pt-10"
                aria-labelledby="faq-heading"
              >
                <h2
                  id="faq-heading"
                  className="display text-[clamp(1.5rem,2.6vw,2rem)] text-ink"
                >
                  Questions
                </h2>
                <div className="mt-7">
                  {page.faq.map((f) => (
                    <div key={f.q} className="border-b border-line py-6 first:pt-0">
                      <h3 className="text-[17px] font-medium text-ink">{f.q}</h3>
                      <p className="mt-2.5 text-[16px] leading-relaxed text-muted">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              {reading.length ? (
                <>
                  <h2 className="eyebrow">Read the long version</h2>
                  <ul className="mt-5 space-y-4">
                    {reading.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="group block bg-white p-4 transition-colors duration-200 hairline hover:bg-cream"
                        >
                          <span className="text-[11px] font-medium tracking-[0.1em] text-faint uppercase">
                            {p.tag}
                          </span>
                          <span className="mt-2 block text-[14.5px] leading-snug text-ink transition-colors group-hover:text-accent">
                            {p.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <div className="mt-8 bg-cream p-6 hairline">
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  Bring a live role and a sample of your database. We will run it
                  on your own data rather than a demo database.
                </p>
                <BookDemo className="mt-5" size="sm" />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
