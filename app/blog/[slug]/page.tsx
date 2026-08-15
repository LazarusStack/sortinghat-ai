import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { Footer } from "@/components/sections";
import { AuthorBox, BlogCta, RelatedCard } from "@/components/blog";
import BlogToc from "@/components/BlogToc";
import { AUTHOR, POSTS, getPost, postBody } from "@/lib/blog";
import "../article.css";

const SITE = "https://sortinghat.ai";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  /* No 1200×630 art exists yet, so the lead product screenshot stands in —
     a real preview card beats a broken image reference. */
  const image = `/blog/${post.slug}/fig-1.jpg`;
  return {
    title: `${post.metaTitle} | Sortinghat`,
    description: post.description,
    authors: [{ name: AUTHOR.name, url: AUTHOR.linkedin }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.description,
      url,
      siteName: "Sortinghat",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [AUTHOR.name],
      section: post.section,
      images: [{ url: image, width: 1280, height: 698 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.description,
      images: [image],
    },
  };
}

/** Article, FAQ and breadcrumb schema, carried over from the source package
    with every URL repointed at sortinghat.ai/blog. */
function schema(post: NonNullable<ReturnType<typeof getPost>>) {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#org`,
        name: "Sortinghat",
        url: SITE,
        sameAs: ["https://www.linkedin.com/company/sortinghatai/"],
      },
      {
        "@type": "Person",
        "@id": `${SITE}/blog#author`,
        name: AUTHOR.name,
        jobTitle: AUTHOR.role,
        worksFor: { "@id": `${SITE}/#org` },
        sameAs: [AUTHOR.linkedin],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "en",
        author: { "@id": `${SITE}/blog#author` },
        publisher: { "@id": `${SITE}/#org` },
        image: [`${SITE}/blog/${post.slug}/fig-1.jpg`],
        articleSection: post.section,
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Sortinghat", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE}/blog`,
          },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      ...(post.faq.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: post.faq.map((f) => ({
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const body = postBody(post.slug);
  const related = post.related
    .map((s) => getPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema(post)) }}
      />
      <main className="pt-28 pb-4 md:pt-32">
        <div className="shell">
          {/* Rails either side of a fixed measure: the article never runs wider
              than is comfortable to read, and the table of contents takes the
              right-hand rail once there is room for it. */}
          <div className="mx-auto grid max-w-3xl gap-16 xl:mx-0 xl:max-w-none xl:grid-cols-[1fr_minmax(0,42rem)_1fr]">
            <div className="hidden xl:block" />

            <article className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-faint uppercase"
              >
                <Link href="/" className="transition-colors hover:text-ink">
                  Sortinghat
                </Link>
                <span aria-hidden>/</span>
                <Link href="/blog" className="transition-colors hover:text-ink">
                  Blog
                </Link>
                <span aria-hidden>/</span>
                <span className="text-accent">{post.tag}</span>
              </nav>

              <h1 className="display mt-7 text-[clamp(2rem,4.4vw,3.1rem)] text-ink">
                {post.title}
              </h1>
              <p className="mt-6 text-[19px] leading-[1.55] text-muted">
                {post.dek}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line pb-7 text-[13.5px] text-muted">
                <span>
                  By{" "}
                  <a
                    href={AUTHOR.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink-soft underline decoration-line underline-offset-2 transition-colors hover:text-ink"
                  >
                    {AUTHOR.name}
                  </a>
                  , {AUTHOR.role}
                </span>
                <span aria-hidden className="h-3 w-px bg-line" />
                <time dateTime={post.date}>{post.dateLabel}</time>
                <span aria-hidden className="h-3 w-px bg-line" />
                <span>{post.read}</span>
              </div>

              {/* The body ships as HTML: it is authored content, not a
                  component tree, and it is read off disk on the server. */}
              <div
                className="article mt-9"
                dangerouslySetInnerHTML={{ __html: body }}
              />

              <BlogCta title={post.cta.title} body={post.cta.body} />
              <AuthorBox />

              {related.length ? (
                <div className="mt-14 border-t border-line pt-8">
                  <p className="eyebrow">Related reading</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {related.map((r) => (
                      <RelatedCard key={r.slug} post={r} />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-14 border-t border-line pt-6">
                <Link
                  href="/blog"
                  className="text-[13.5px] text-muted transition-colors hover:text-ink"
                >
                  ← All articles
                </Link>
              </div>
            </article>

            <aside className="hidden xl:block">
              {post.toc.length ? <BlogToc items={post.toc} /> : null}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
