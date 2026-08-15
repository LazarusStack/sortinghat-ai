import Image from "next/image";
import Link from "next/link";
import { AUTHOR, type Post } from "@/lib/blog";
import { BOOK_ANCHOR } from "./ui";

/** Tag · date · read time, the meta line above every card title. */
function CardMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-faint">
      <span className="font-medium text-accent">{post.tag}</span>
      <span aria-hidden className="h-3 w-px bg-line" />
      <time dateTime={post.date}>{post.dateShort}</time>
      <span aria-hidden className="h-3 w-px bg-line" />
      <span>{post.read}</span>
    </div>
  );
}

/**
 * The hub card. The screenshot is doing real work here — every post is about
 * something visible in the product — so it leads, at the same 720×392 crop the
 * source package shipped.
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white transition-colors duration-200 hairline hover:bg-cream"
    >
      <Image
        src={`/blog/cards/${post.slug}.jpg`}
        alt={post.cardImageAlt}
        width={720}
        height={392}
        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
        className="aspect-[720/392] w-full border-b border-line bg-[#0c0c0c] object-cover"
      />
      <div className="flex flex-1 flex-col p-6">
        <CardMeta post={post} />
        <h3 className="display mt-3 text-[19px] leading-[1.25] text-ink">
          {post.cardTitle}
        </h3>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          {post.cardDek}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors group-hover:text-accent">
          Read
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
            className="translate-y-px transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path
              d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/** The compact variant, used for related reading at the foot of a post. */
export function RelatedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white p-5 transition-colors duration-200 hairline hover:bg-cream"
    >
      <span className="text-[11px] font-medium tracking-[0.1em] text-faint uppercase">
        {post.tag}
      </span>
      <p className="mt-2.5 text-[15px] leading-snug text-ink transition-colors group-hover:text-accent">
        {post.cardTitle}
      </p>
    </Link>
  );
}

export function AuthorBox() {
  return (
    <div className="mt-14 flex gap-4 bg-cream p-6 hairline">
      <span
        aria-hidden
        className="display grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-[18px] text-white"
      >
        A
      </span>
      <div>
        <p className="text-[15.5px] font-medium text-ink">{AUTHOR.name}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          {AUTHOR.bio}{" "}
          <a
            href={AUTHOR.linkedin}
            target="_blank"
            rel="noopener noreferrer me"
            className="text-accent underline underline-offset-2"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  );
}

/** Closing CTA on a post, pointing at the same scheduler as everything else.
    The button is written out rather than reusing <BookDemo>, which is ink on
    paper; this one is the inverse, sitting on the ink panel. */
export function BlogCta({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-14 bg-ink px-8 py-9 text-white">
      <h2 className="display text-[25px] text-white">{title}</h2>
      <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-white/60">
        {body}
      </p>
      <Link
        href={BOOK_ANCHOR}
        className="mt-6 inline-flex h-11 items-center justify-center bg-white px-5 text-[14px] font-medium text-ink transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(255,255,255,0.35)] active:scale-[0.985]"
      >
        Book a demo
      </Link>
    </div>
  );
}
