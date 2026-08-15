#!/usr/bin/env python3
"""Port the standalone blog package into the Next.js site.

Reads the exported HTML files, pulls each post apart into (metadata, body HTML,
image files), and writes them where the app can read them at build time.

The parts the app rebuilds in React — top bar, breadcrumb, post header, CTA,
author box, related grid, page footer, and the "show structure" annotations —
are dropped here so there is exactly one implementation of each.

Usage:

    python3 scripts/import-blog-package.py <folder of exported .html files>

Requires beautifulsoup4 and lxml.
"""

import base64
import json
import os
import re
import shutil
import sys
from bs4 import BeautifulSoup

SRC = sys.argv[1] if len(sys.argv) > 1 else "blog-package"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = f"{ROOT}/content/blog"
IMG = f"{ROOT}/public/blog"

# Order is the order they appear on the hub.
SLUGS = [
    "talent-pool-software-database-first-sourcing",
    "candidate-scorecard-from-client-brief",
    "ai-screening-call-how-it-works",
    "natural-language-candidate-search-real-queries",
    "linkedin-sourcing-chrome-extension",
]

os.makedirs(CONTENT, exist_ok=True)
if os.path.isdir(IMG):
    shutil.rmtree(IMG)
os.makedirs(IMG, exist_ok=True)


def soup_of(path):
    return BeautifulSoup(open(path, encoding="utf-8").read(), "lxml")


def save_data_img(src, out_path):
    m = re.match(r"data:image/(\w+);base64,(.+)", src, re.S)
    if not m:
        return None
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(m.group(2)))
    return out_path


def rewrite_href(href, published):
    """Return the new href, or None if the link should be unwrapped to text.

    The package was built for blog.sortinghat.ai. Everything moves under
    sortinghat.ai/blog, and any cross-link to a post that has not been written
    yet loses its anchor rather than shipping a 404.
    """
    if not href:
        return None
    href = href.strip()

    if href.startswith("#") or href.startswith("mailto:"):
        return href

    # absolute links back to the main site become same-origin
    href = re.sub(r"^https?://(www\.)?sortinghat\.ai", "", href) or "/"
    m = re.match(r"^https?://blog\.sortinghat\.ai(/.*)?$", href)
    if m:
        href = m.group(1) or "/"

    if href.startswith("http"):
        return href  # genuinely external

    # /slug.html and /blog/slug both mean the same post
    m = re.match(r"^/(?:blog/)?([a-z0-9-]+)(?:\.html)?/?(#.*)?$", href)
    if m:
        slug, frag = m.group(1), m.group(2) or ""
        if slug in published:
            return f"/blog/{slug}{frag}"
        return None  # not published yet — drop the anchor

    if href in ("/", "/index.html"):
        return "/blog"
    if href.startswith("/#"):
        return href
    return None


def clean_body(main, slug, published):
    """Strip the chrome the app owns, keep the article, fix links and images."""
    # annotation layer from the review build: .note sits in the margin, .hint
    # inline — both are hidden unless "show structure" is on, and both are
    # commentary about why the post is built the way it is, not reader copy.
    for note in main.select(".note, .hint"):
        note.decompose()
    # .anchor only existed to position those notes
    for a in main.select(".anchor"):
        a.unwrap()

    for sel in ("nav.bc", "header.post", ".cta", ".authorbox", ".related", "footer"):
        for el in main.select(sel):
            el.decompose()

    # images out of the HTML and onto disk
    figs = 0
    for img in main.find_all("img"):
        src = img.get("src", "")
        if src.startswith("data:"):
            figs += 1
            os.makedirs(f"{IMG}/{slug}", exist_ok=True)
            name = f"fig-{figs}.jpg"
            save_data_img(src, f"{IMG}/{slug}/{name}")
            img["src"] = f"/blog/{slug}/{name}"
            img["loading"] = "lazy"
            img["decoding"] = "async"

    for a in main.find_all("a"):
        new = rewrite_href(a.get("href"), published)
        if new is None:
            a.unwrap()
            continue
        a["href"] = new
        if new.startswith("http"):
            a["rel"] = "noopener"
            a["target"] = "_blank"

    html = main.decode_contents()
    html = re.sub(r"\n{3,}", "\n\n", html).strip()
    return html


def toc_of(doc):
    out = []
    for li in doc.select(".toc li"):
        a = li.find("a")
        if a and a.get("href", "").startswith("#"):
            out.append({"id": a["href"][1:], "label": a.get_text(strip=True)})
    return out


def meta_of(doc, name=None, prop=None):
    el = doc.find("meta", attrs={"name": name} if name else {"property": prop})
    return el.get("content") if el else None


def faq_of(doc):
    for s in doc.find_all("script", type="application/ld+json"):
        data = json.loads(s.string)
        for node in data.get("@graph", []):
            if node.get("@type") == "FAQPage":
                return [
                    {"q": q["name"], "a": q["acceptedAnswer"]["text"]}
                    for q in node["mainEntity"]
                ]
    return []


published = set(SLUGS)

# ---------------------------------------------------------------- hub cards
hub = soup_of(f"{SRC}/index.html")
cards = {}
os.makedirs(f"{IMG}/cards", exist_ok=True)
for card in hub.select("a.card"):
    slug = re.sub(r"^/|\.html$", "", card["href"])
    thumb = card.find("img")
    save_data_img(thumb["src"], f"{IMG}/cards/{slug}.jpg")
    spans = card.select(".meta span")
    cards[slug] = {
        "tag": spans[0].get_text(strip=True),
        "dateShort": spans[1].get_text(strip=True),
        "read": spans[2].get_text(strip=True),
        "cardTitle": card.find("h3").get_text(strip=True),
        "cardDek": card.find("p").get_text(strip=True),
        "cardImageAlt": thumb.get("alt", ""),
    }

# ------------------------------------------------------------------- posts
posts = []
for slug in SLUGS:
    doc = soup_of(f"{SRC}/{slug}.html")
    header = doc.select_one("header.post")
    h1 = header.find("h1").get_text(strip=True)
    dek = header.select_one(".dek").get_text(strip=True)
    time_el = header.find("time")
    # read these out before clean_body decomposes the header
    date, date_label = time_el["datetime"], time_el.get_text(strip=True)

    # likewise: the related grid is inside main, and clean_body removes it
    related = []
    for r in doc.select("a.rcard"):
        rslug = re.sub(r"^/|\.html$", "", r["href"])
        if rslug in published and rslug != slug:
            related.append(rslug)

    # each post closes on its own CTA copy; the panel is rebuilt in React but
    # the words are worth keeping
    cta_el = doc.select_one(".cta")
    cta = {
        "title": cta_el.find("h3").get_text(strip=True),
        "body": cta_el.find("p").get_text(strip=True),
    }

    body = clean_body(doc.select_one("main.col"), slug, published)

    posts.append(
        {
            "slug": slug,
            "title": h1,
            "metaTitle": doc.title.get_text(strip=True),
            "description": meta_of(doc, name="description"),
            "section": meta_of(doc, prop="article:section"),
            "dek": dek,
            "date": date,
            "dateLabel": date_label,
            "toc": toc_of(doc),
            "faq": faq_of(doc),
            "related": related,
            "cta": cta,
            **cards[slug],
        }
    )
    open(f"{CONTENT}/{slug}.html", "w", encoding="utf-8").write(body + "\n")

json.dump({"posts": posts}, open(f"{CONTENT}/posts.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)

print(f"{len(posts)} posts")
for p in posts:
    n = len(os.listdir(f"{IMG}/{p['slug']}")) if os.path.isdir(f"{IMG}/{p['slug']}") else 0
    print(f"  {p['slug']}: {len(open(f'{CONTENT}/{p['slug']}.html').read())//1024}KB body, "
          f"{n} figures, toc {len(p['toc'])}, faq {len(p['faq'])}, related {p['related']}")
