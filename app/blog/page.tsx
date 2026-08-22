import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Footer } from "@/components/sections";
import { PostCard } from "@/components/blog";
import { AUTHOR, POSTS, SECTIONS, postsInSection } from "@/lib/blog";
import { blogSchema } from "@/lib/schema";

const TITLE = "Blog | Sortinghat";
const DESCRIPTION =
  "Operating notes on recruiter capacity, sourcing economics, hiring scorecards and what actually changes when AI reaches a delivery desk.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
    siteName: "Sortinghat",
    type: "website",
  },
};

export default function BlogIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema(POSTS, SECTIONS, AUTHOR)),
        }}
      />
      <Nav />
      <main>
        {/* One headline, one line under it, then straight into the articles:
            nothing here should delay the first card. */}
        <section className="relative overflow-hidden border-b border-line pt-36 pb-16 text-center md:pt-44 md:pb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, rgba(90,63,192,0.10) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div className="shell">
            <h1 className="display mx-auto max-w-4xl text-[clamp(2.3rem,5vw,3.7rem)] text-balance text-ink">
              Notes from the builders of Sortinghat
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-balance text-muted">
              We share our journey and transparent case studies, to earn a
              little more of your trust.
            </p>
          </div>
        </section>

        {SECTIONS.map((section, i) => {
          const posts = postsInSection(section);
          return (
            <section
              key={section.id}
              id={section.id}
              className={`py-16 md:py-20 ${i % 2 ? "bg-cream" : ""}`}
            >
              <div className="shell">
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
                  <h2 className="display text-[clamp(1.6rem,3vw,2.1rem)] text-ink">
                    {section.title}
                  </h2>
                  <span className="text-[12.5px] text-faint">
                    {posts.length
                      ? `${posts.length} article${posts.length > 1 ? "s" : ""}`
                      : "Coming soon"}
                  </span>
                </div>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
                  {section.dek}
                </p>

                {posts.length ? (
                  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((p) => (
                      <PostCard key={p.slug} post={p} />
                    ))}
                  </div>
                ) : section.empty ? (
                  <div className="mt-10 bg-white p-8 hairline md:p-10">
                    <h3 className="display text-[20px] text-ink">
                      {section.empty.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-muted">
                      {section.empty.body}
                    </p>
                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {section.empty.upcoming.map((u) => (
                        <li
                          key={u}
                          className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-soft"
                        >
                          <span
                            aria-hidden
                            className="mt-[10px] h-px w-3 shrink-0 bg-accent"
                          />
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
