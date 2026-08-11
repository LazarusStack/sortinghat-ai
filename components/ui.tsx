import Link from "next/link";
import type { ReactNode } from "react";

/** Fallback for opening the scheduler directly; the page embeds it at #book. */
export const DEMO_URL = "https://calendar.app.google/uFqMYo7cLYAgRCrn7";

/** Every "Book a demo" scrolls to the embedded scheduler rather than leaving.
    Root-relative so it still reaches the scheduler from a standalone page like
    /security, where the section isn't on screen to jump to. */
export const BOOK_ANCHOR = "/#book";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      /* .display pins font-weight:400 for headlines, and it wins on source
         order — so the wordmark's weight has to be set here to stick. */
      style={{ fontWeight: 700 }}
      className={`display text-ink tracking-[-0.03em] ${className}`}
    >
      Sortinghat
    </span>
  );
}

export function BookDemo({
  className = "",
  children = "Book a demo",
  size = "md",
}: {
  className?: string;
  children?: ReactNode;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-[14px]";
  return (
    <Link
      href={BOOK_ANCHOR}
      className={`inline-flex items-center justify-center rounded-none bg-ink font-medium text-white transition-all duration-200 hover:bg-[#000] hover:shadow-[0_8px_24px_-8px_rgba(25,25,25,0.5)] active:scale-[0.985] ${pad} ${className}`}
    >
      {children}
    </Link>
  );
}

export function GhostLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-ink transition-colors hover:text-accent"
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="translate-y-px transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      >
        <path
          d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 lg:py-32 ${className}`}>
      <div className="shell">{children}</div>
    </section>
  );
}

/**
 * Product mocks are dense by design. Below the `min` width we let them scroll
 * sideways inside their own gutter rather than squashing the UI into noise.
 * The vertical padding keeps the window drop-shadow from being clipped.
 */
export function MockScroller({
  children,
  min = "min-w-[560px]",
}: {
  children: ReactNode;
  min?: string;
}) {
  return (
    <div className="-mx-6 -my-8 overflow-x-auto px-6 py-8 lg:mx-0 lg:overflow-x-visible lg:px-0">
      <div className={`${min} lg:min-w-0`}>{children}</div>
    </div>
  );
}

export function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-[3px] shrink-0"
      aria-hidden
    >
      <circle cx="8" cy="8" r="8" fill="#191919" />
      <path
        d="M4.6 8.2 6.9 10.4l4.4-4.6"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
