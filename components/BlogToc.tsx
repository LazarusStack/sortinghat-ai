"use client";

import { useEffect, useState } from "react";

/**
 * The right rail on a post. Section headings carry ids (s1, s2 …) written by
 * the article HTML, so the spy only has to find which one is currently above
 * the reading line — the last heading whose top has passed it.
 */
export default function BlogToc({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + 140;
      let current = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) {
          current = it.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav aria-label="Table of contents" className="sticky top-28">
      <p className="eyebrow">In this article</p>
      <ol className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <li key={it.id} className="relative pl-7">
            <span
              aria-hidden
              className={`absolute left-0 top-[3px] text-[10px] tabular-nums transition-colors ${
                active === it.id ? "text-accent" : "text-line"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${it.id}`}
              className={`block text-[13.5px] leading-snug transition-colors hover:text-ink ${
                active === it.id ? "font-medium text-ink" : "text-muted"
              }`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
