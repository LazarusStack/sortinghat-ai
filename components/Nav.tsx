"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookDemo, Wordmark } from "./ui";

/* Real pages, not homepage fragments. Each of these used to be an anchor on
   one long page, which meant the header offered five links to a single URL. */
const LINKS = [
  { label: "Platform", href: "/platform" },
  { label: "Integrations", href: "/integrations" },
  { label: "Migration", href: "/migration" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/70 bg-white/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      {/* three tracks: brand left, sections centred on the page, actions right */}
      <div className="shell grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-8">
        <Link href="/" className="justify-self-start" aria-label="Sortinghat home">
          <Wordmark className="text-[21px]" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <BookDemo size="sm" />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full hairline md:hidden"
          >
            <span className="space-y-[5px]">
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white md:hidden">
          <div className="shell flex flex-col py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-[15px] text-ink-soft"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
