#!/usr/bin/env python3
"""Port exported blog posts into the Next.js site.

Reads a folder of exported .html files, pulls each post apart into (metadata,
body HTML, image files), and writes them where the app can read them at build
time: content/blog/posts.json, content/blog/<slug>.html, public/blog/<slug>/.

The parts the app rebuilds in React — top bar, breadcrumb, post header, CTA,
author box, related grid, page footer, and the "show structure" annotations —
are dropped here so there is exactly one implementation of each.

Every run rebuilds the whole set from the folder it is given, so re-exported
posts overwrite cleanly. That makes a partial package destructive:
the exports for the first fourteen posts are not kept anywhere, so running this
against a folder that lacks them deletes those posts and their images. Merge a
new batch into a scratch copy and copy the results across instead. Card thumbnails are the exception: the first import
took distinct crops from the package's index.html, and those are kept if they
are already on disk rather than replaced with the post's lead figure.

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

# Hub order. Slugs found in SRC but missing here are appended alphabetically,
# so a new export lands on the page without needing this edited first.
ORDER = [
    "talent-pool-software-database-first-sourcing",
    "candidate-scorecard-from-client-brief",
    "ai-screening-call-how-it-works",
    "natural-language-candidate-search-real-queries",
    "linkedin-sourcing-chrome-extension",
    "staffing-kpis-four-numbers-daily",
    "recruiter-admin-time-automatic-capture",
    "candidate-response-rates-by-channel",
    "high-volume-recruiting-screening-day",
    "recruitment-crm-beyond-storing-leads",
    "ai-interview-questions-scoring",
    "duplicate-candidate-records-database-hygiene",
    "candidate-ownership-rules-multi-desk",
    "ats-integrations-one-way-two-way",
    # Product Comparison 101, newest first
    "best-ats-crm-rpo-firms",
    "best-recruitment-software-gcc-partners",
    "best-ats-staffing-firms-india",
    "ats-migration-guide",
    "sortinghat-vs-targetrecruit",
    "sortinghat-vs-tracker-rms",
    "sortinghat-vs-pcrecruiter",
    "sortinghat-vs-avionte",
    "sortinghat-vs-jobadder",
    "sortinghat-vs-manatal",
    "sortinghat-vs-crelate",
    "sortinghat-vs-jobdiva",
    "sortinghat-vs-recruit-crm",
    "sortinghat-vs-zoho-recruit",
    "vincere-alternatives",
    "sortinghat-vs-vincere",
    "loxo-alternatives",
    "sortinghat-vs-loxo",
    "recruiterflow-alternatives",
    "sortinghat-vs-recruiterflow",
    "ceipal-alternatives",
    "sortinghat-vs-ceipal",
    "bullhorn-alternatives",
    "sortinghat-vs-bullhorn",
    "ats-pricing-2026",
    # Market Updates & Data, then AI Impact by Segment, newest first
    "ai-contingency-recruitment-model",
    "ai-adoption-plan-staffing-firm",
    "what-ai-cannot-do-in-recruitment",
    "candidate-experience-cost-ai-screening",
    "agentic-ai-vs-automation-rules-recruitment",
    "ai-staffing-back-office",
    "ai-temp-light-industrial-staffing",
    "what-clients-pay-agencies-for-now",
    "staffing-industry-2030",
    "it-services-outcome-based-bench-hiring",
    "ai-gcc-hiring-different-sport",
    "ai-in-rpo-delivery",
    "hiring-recruiters-in-the-ai-era",
    "ai-client-retention-staffing",
    "ai-outbound-recruiting-what-changed",
    "ai-made-inbound-applicants-worse",
    "how-ai-changed-recruitment-sourcing",
    "staffing-agency-valuation-ma-2026",
    "vms-msp-consolidation-agency-margins",
    "tier-2-city-hiring-india",
    "ai-talent-market-india-skills-gap",
    "us-staffing-market-2026-india-firms",
    "mid-tier-it-services-growth-staffing",
    "is-bpo-dying-ai-outsourcing",
    "india-gcc-landscape-2026-staffing",
]

MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()

# The exports spell the founder's surname "Tamrakar". The site uses the
# spelling he signs with, so it is corrected on the way in — otherwise every
# re-import quietly undoes it. Note the section name carries the surname too,
# and lib/blog.ts matches posts to sections on that exact string.
NAME_FIXES = {"Apoorv Tamrakar": "Apoorv Tamrkar"}


# The exports name the section after the founder's full name; the hub uses a
# different label, and lib/blog.ts matches posts to sections on this exact
# string, so a stale value here empties the section rather than erroring.
SECTION_FIXES = {"From Apoorv Tamrkar": "From Apoorv (Founder, Sortinghat)"}


def fix_names(value):
    """Apply NAME_FIXES to every string in a nested structure."""
    if isinstance(value, str):
        for wrong, right in NAME_FIXES.items():
            value = value.replace(wrong, right)
        return value
    if isinstance(value, list):
        return [fix_names(v) for v in value]
    if isinstance(value, dict):
        return {k: fix_names(v) for k, v in value.items()}
    return value


def soup_of(path):
    return BeautifulSoup(open(path, encoding="utf-8").read(), "lxml")


def save_data_img(src, out_path):
    m = re.match(r"data:image/(\w+);base64,(.+)", src, re.S)
    if not m:
        return False
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(m.group(2)))
    return True


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
    return re.sub(r"\n{3,}", "\n\n", html).strip()


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


def short_date(iso):
    y, m, d = iso.split("-")
    return f"{int(d)} {MONTHS[int(m) - 1]} {y}"


# ------------------------------------------------------------------ collect
found = sorted(
    os.path.splitext(f)[0]
    for f in os.listdir(SRC)
    if f.endswith(".html") and f != "index.html"
)
slugs = [s for s in ORDER if s in found] + [s for s in found if s not in ORDER]
published = set(slugs)

# Card thumbnails already on disk are distinct crops worth keeping, so they are
# held over the rebuild rather than regenerated from the post's lead figure.
kept_cards = {}
if os.path.isdir(f"{IMG}/cards"):
    for name in os.listdir(f"{IMG}/cards"):
        slug = os.path.splitext(name)[0]
        if slug in published:
            kept_cards[slug] = open(f"{IMG}/cards/{name}", "rb").read()

if os.path.isdir(IMG):
    shutil.rmtree(IMG)
os.makedirs(f"{IMG}/cards")
os.makedirs(CONTENT, exist_ok=True)
for f in os.listdir(CONTENT):
    os.remove(f"{CONTENT}/{f}")

# -------------------------------------------------------------------- posts
posts = []
for slug in slugs:
    doc = soup_of(f"{SRC}/{slug}.html")
    header = doc.select_one("header.post")
    time_el = header.find("time")
    byline = header.select_one(".byline").get_text(" ", strip=True)
    read = re.search(r"\d+ min read", byline)

    # every value below is pulled out as a string here, because clean_body
    # decomposes these elements and a decomposed tag returns nothing
    crumb = doc.select_one("nav.bc b")
    tag = crumb.get_text(strip=True) if crumb else ""
    section = fix_names(meta_of(doc, prop="article:section") or "")
    section = SECTION_FIXES.get(section, section)
    title = header.find("h1").get_text(strip=True)
    dek = header.select_one(".dek").get_text(strip=True)
    date = time_el.get("datetime") or meta_of(doc, prop="article:published_time")
    date_label = time_el.get_text(strip=True)

    lead = doc.select_one("figure img")
    card_alt = (lead.get("alt") if lead else "") or title

    cta_el = doc.select_one(".cta")
    cta = {
        "title": cta_el.find("h3").get_text(strip=True),
        "body": cta_el.find("p").get_text(strip=True),
    } if cta_el else None

    # exports vary between /slug.html and /blog/slug for the same post
    related = []
    for r in doc.select("a.rcard"):
        m = re.match(r"^/(?:blog/)?([a-z0-9-]+?)(?:\.html)?/?$", r.get("href", ""))
        rslug = m.group(1) if m else None
        if rslug in published and rslug != slug and rslug not in related:
            related.append(rslug)

    body = clean_body(doc.select_one("main.col"), slug, published)

    # the hub card leads on the post's first screenshot unless an earlier
    # import already saved a purpose-made crop
    if slug in kept_cards:
        open(f"{IMG}/cards/{slug}.jpg", "wb").write(kept_cards[slug])
    elif os.path.exists(f"{IMG}/{slug}/fig-1.jpg"):
        shutil.copyfile(f"{IMG}/{slug}/fig-1.jpg", f"{IMG}/cards/{slug}.jpg")

    posts.append(
        {
            "slug": slug,
            "title": title,
            "metaTitle": doc.title.get_text(strip=True),
            "description": meta_of(doc, name="description"),
            "section": section,
            "dek": dek,
            "date": date,
            "dateLabel": date_label,
            "dateShort": short_date(date),
            "tag": tag,
            "read": read.group(0) if read else "",
            "cardImageAlt": card_alt,
            "toc": toc_of(doc),
            "faq": faq_of(doc),
            "related": related,
            "cta": cta,
        }
    )
    open(f"{CONTENT}/{slug}.html", "w", encoding="utf-8").write(
        fix_names(body) + "\n"
    )

json.dump(
    {"posts": fix_names(posts)},
    open(f"{CONTENT}/posts.json", "w", encoding="utf-8"),
    indent=2,
    ensure_ascii=False,
)

print(f"{len(posts)} posts")
for p in posts:
    figs = len(os.listdir(f"{IMG}/{p['slug']}")) if os.path.isdir(f"{IMG}/{p['slug']}") else 0
    card = "kept" if p["slug"] in kept_cards else "from fig-1"
    print(
        f"  {p['slug']:48s} {p['tag']:16s} {figs} figs  card {card:9s} "
        f"toc {len(p['toc']):2d}  faq {len(p['faq'])}  related {len(p['related'])}"
    )
