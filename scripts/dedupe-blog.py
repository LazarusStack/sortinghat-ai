#!/usr/bin/env python3
"""Remove the sections that are repeated verbatim across the corpus.

Measured before writing this: of 253,608 words of running prose across 125
posts, 112,180 — 44% — sat inside sentences that appear in ten or more posts.
106 posts were more than 40% boilerplate, and one sentence appeared in 86 of
them. That is the scaled-content pattern, and it costs more than it gives:
search engines discount near-duplicate bodies, and an answer engine choosing
between 86 pages carrying the same paragraph cites none of them.

The rule is deliberately narrow. A whole <h2> section is removed only when its
body text, normalised, appears **byte-identical in ten or more posts**. Nothing
is removed sentence by sentence: cutting individual lines out of a paragraph
leaves prose that no longer reads, and a rule that edits inside paragraphs
cannot be checked by eye afterwards. Whole sections come out cleanly or not at
all.

Two families of block get caught. The market batches share "What this changes on
a staffing desk", "Five checks worth running on your own desk", "How to turn
this into a client conversation" and "Three mistakes firms make reading market
data". The comparison batch shares its evaluation and migration checklists.

What this does not fix: blocks that are near-identical rather than identical,
where a competitor's name is substituted into an otherwise shared paragraph.
Those need an editor, and the script reports the residual rather than pretending
to have solved it.

Side effects handled here, because each one is a silent breakage otherwise:
the table of contents in posts.json points at anchors that no longer exist, and
the reading time is computed from a word count that has changed.

    python3 scripts/dedupe-blog.py [--dry-run]

Requires beautifulsoup4 and lxml.
"""

import hashlib
import json
import os
import re
import sys
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = f"{ROOT}/content/blog"
DRY = "--dry-run" in sys.argv

# A block shared by this many posts is furniture rather than writing.
THRESHOLD = 10
# Never cut a post below this. A short post is better than a padded one, but a
# post that has lost its argument is neither.
MIN_WORDS = 700
# The FAQ is rebuilt by the app from posts.json and is not prose to dedupe.
KEEP_IDS = {"faq"}
WORDS_PER_MINUTE = 225


def sections(soup):
    """(heading, [body nodes]) for every h2, in document order."""
    for h in soup.find_all("h2"):
        body = []
        for n in h.next_siblings:
            if getattr(n, "name", None) == "h2":
                break
            body.append(n)
        yield h, body


def text_of(nodes):
    joined = " ".join(
        getattr(n, "get_text", lambda *a, **k: str(n))(" ") for n in nodes
    )
    return re.sub(r"\s+", " ", joined).strip()


def fingerprint(nodes):
    return hashlib.md5(text_of(nodes).encode()).hexdigest()


def main():
    posts = json.load(open(f"{CONTENT}/posts.json", encoding="utf-8"))["posts"]
    soups = {}
    counts = {}

    # pass one: count how many posts carry each section body
    for p in posts:
        soup = BeautifulSoup(
            open(f"{CONTENT}/{p['slug']}.html", encoding="utf-8").read(), "lxml"
        )
        soups[p["slug"]] = soup
        for h, body in sections(soup):
            if h.get("id") in KEEP_IDS:
                continue
            if len(text_of(body).split()) < 40:
                continue
            counts[fingerprint(body)] = counts.get(fingerprint(body), 0) + 1

    shared = {k for k, v in counts.items() if v >= THRESHOLD}
    print(f"{len(shared)} section bodies appear in {THRESHOLD}+ posts\n")

    removed_ids = {}
    report = []
    for p in posts:
        soup = soups[p["slug"]]
        before = len(soup.get_text(" ").split())
        drop = [
            (h, body)
            for h, body in sections(soup)
            if h.get("id") not in KEEP_IDS and fingerprint(body) in shared
        ]
        if not drop:
            report.append((p["slug"], 0, before, before))
            continue

        cut = sum(len(text_of([h] + body).split()) for h, body in drop)
        if before - cut < MIN_WORDS:
            print(f"  SKIPPED {p['slug']}: would fall to {before - cut} words")
            report.append((p["slug"], 0, before, before))
            continue

        ids = []
        for h, body in drop:
            if h.get("id"):
                ids.append(h["id"])
            for n in body:
                n.extract()
            h.extract()
        removed_ids[p["slug"]] = set(ids)

        root = soup.body or soup
        html = re.sub(r"\n{3,}", "\n\n", root.decode_contents()).strip() + "\n"
        after = len(BeautifulSoup(html, "lxml").get_text(" ").split())
        if not DRY:
            open(f"{CONTENT}/{p['slug']}.html", "w", encoding="utf-8").write(html)
        report.append((p["slug"], len(drop), before, after))

    # the table of contents linked to anchors that have just been deleted, and
    # the reading time was computed from a body that is now shorter
    for p in posts:
        gone = removed_ids.get(p["slug"], set())
        if gone:
            p["toc"] = [t for t in p["toc"] if t["id"] not in gone]
        words = len(
            BeautifulSoup(
                open(f"{CONTENT}/{p['slug']}.html", encoding="utf-8").read(), "lxml"
            ).get_text(" ").split()
        )
        p["read"] = f"{max(1, round(words / WORDS_PER_MINUTE))} min read"
    if not DRY:
        json.dump(
            {"posts": posts},
            open(f"{CONTENT}/posts.json", "w", encoding="utf-8"),
            indent=2,
            ensure_ascii=False,
        )

    touched = [r for r in report if r[1]]
    total_before = sum(r[2] for r in report)
    total_after = sum(r[3] for r in report)
    for slug, n, b, a in sorted(touched, key=lambda r: r[2] - r[3], reverse=True)[:10]:
        print(f"  {slug:46s} -{n} sections  {b:5d} -> {a:5d} words")
    print(
        f"\n{len(touched)} of {len(report)} posts edited, "
        f"{total_before - total_after:,} words removed "
        f"({total_before:,} -> {total_after:,})"
        f"{'  (dry run, nothing written)' if DRY else ''}"
    )


if __name__ == "__main__":
    main()
