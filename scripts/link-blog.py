#!/usr/bin/env python3
"""Add contextual internal and external links to the post bodies.

Forty-seven of the sixty-four posts shipped with no in-body links at all. That
is how they were exported, not something the import dropped: the exports carry
a related-posts block and nothing else, so nothing in the running prose points
anywhere. Crawl discovery was never the problem, since the hub lists every post
and the related module reaches the rest. What was missing is the ordinary thing
a reader follows mid-sentence, and the link equity that travels with it.

Two passes, both anchored on words the author already wrote:

  Internal   the first mention of a subject another post owns becomes a link to
             that post. No sentence is added and no claim is made: if the prose
             says "vendor management programmes", that phrase now points at the
             post about vendor management programmes.
  External   the first mention of a named source or a named competitor becomes
             a link to it. Research bodies are followed; commercial pages the
             posts compare against are nofollow.

The rails all prefer writing nothing over writing a weak link:

  * running prose only. Headings, tables, figure captions, key-takeaway lists
    and the FAQ are left alone, because a link inside a summary block is a
    link the reader did not choose to be offered.
  * never inside an existing anchor, and never a post linking to itself.
  * one link per target per post. A post naming Bullhorn thirty times gets one
    Bullhorn link, on the first mention.
  * a competitor is linked to its own site on the pages that compare it, and to
    the comparison page everywhere else. Both are useful, neither competes.

Re-running is safe. A phrase already inside an anchor is skipped, so the second
run is a no-op and an edited body picks up only what is genuinely new.

    python3 scripts/link-blog.py [--dry-run]

Requires beautifulsoup4 and lxml.
"""

import json
import os
import re
import sys
from bs4 import BeautifulSoup, NavigableString

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = f"{ROOT}/content/blog"
DRY = "--dry-run" in sys.argv

# Blocks whose paragraphs are summary or reference furniture rather than prose.
SKIP_ANCESTORS = ("takeaways", "faq", "toc", "verdict", "insert", "stats")

# Per-post ceilings. Generous, because the ceiling is not what keeps this
# honest — one-link-per-target and first-mention-only are.
MAX_INTERNAL = 16
MAX_EXTERNAL = 6

# --------------------------------------------------------------- internal ---
# (pattern, target slug). Ordered: the more specific phrase wins the sentence.
# Every phrase names the target's subject, not merely a word it contains.
INTERNAL = [
    # Fifty of the posts share three long sections, so the phrases below were
    # taken from the corpus rather than guessed at: each one was counted across
    # every body before it earned a place here. A phrase that matched nothing
    # was dropped instead of being kept as a hopeful rule.
    #
    # Ordered specific first. Only one link per target is ever placed in a post,
    # so the more precise phrasing wins the sentence and the looser fallback
    # only fires where the precise one is absent.

    # the platform data the shared sections are built on
    (r"40 calls a day",                             "high-volume-recruiting-screening-day"),
    (r"3 million (?:records|candidates)",           "talent-pool-software-database-first-sourcing"),
    (r"job portal spend",                           "talent-pool-software-database-first-sourcing"),
    (r"own database",                               "talent-pool-software-database-first-sourcing"),
    (r"job portal",                                 "talent-pool-software-database-first-sourcing"),
    (r"(?:weighted )?evaluation criteria",          "candidate-scorecard-from-client-brief"),
    (r"scorecards?",                                "candidate-scorecard-from-client-brief"),
    (r"25 on WhatsApp",                             "candidate-response-rates-by-channel"),
    (r"response rates?",                            "candidate-response-rates-by-channel"),
    (r"video screening",                            "ai-screening-call-how-it-works"),
    (r"screening calls?",                           "ai-screening-call-how-it-works"),
    (r"natural[- ]language search",                 "natural-language-candidate-search-real-queries"),
    (r"pool search",                                "natural-language-candidate-search-real-queries"),
    (r"AI interviews?",                             "ai-interview-questions-scoring"),
    (r"record keeping",                             "recruiter-admin-time-automatic-capture"),
    (r"duplicates",                                 "duplicate-candidate-records-database-hygiene"),
    (r"prospect list",                              "recruitment-crm-beyond-storing-leads"),
    (r"recruitment CRM",                            "recruitment-crm-beyond-storing-leads"),
    (r"CRM",                                        "recruitment-crm-beyond-storing-leads"),
    (r"read-write API",                             "ats-integrations-one-way-two-way"),
    (r"integrations?",                              "ats-integrations-one-way-two-way"),
    (r"fill rate",                                  "staffing-kpis-four-numbers-daily"),
    (r"candidate ownership|ownership rules",        "candidate-ownership-rules-multi-desk"),
    (r"LinkedIn",                                   "linkedin-sourcing-chrome-extension"),

    # pricing, migration and the buying guides
    (r"published pricing",                          "ats-pricing-2026"),
    (r"per[- ]seat",                                "ats-pricing-2026"),
    (r"field mapping",                              "ats-migration-guide"),
    (r"submission history",                         "ats-migration-guide"),
    (r"migrat(?:ion|ing|e)",                        "ats-migration-guide"),
    (r"RPO firms?|RPO providers?",                  "best-ats-crm-rpo-firms"),

    # market and segment
    (r"manual sourcing",                            "how-ai-changed-recruitment-sourcing"),
    (r"timesheets?",                                "ai-staffing-back-office"),
    (r"back office",                                "ai-staffing-back-office"),
    (r"outbound",                                   "ai-outbound-recruiting-what-changed"),
    (r"inbound",                                    "ai-made-inbound-applicants-worse"),
    (r"contingency",                                "ai-contingency-recruitment-model"),
    (r"RPO delivery",                               "ai-in-rpo-delivery"),
    (r"RPO",                                        "ai-in-rpo-delivery"),
    (r"vendor management|VMS",                      "vms-msp-consolidation-agency-margins"),
    (r"global capability cent(?:re|er)s?|GCCs?",    "india-gcc-landscape-2026-staffing"),
    (r"candidate experience",                       "candidate-experience-cost-ai-screening"),
    (r"light industrial|temp desks?|hourly hiring", "ai-temp-light-industrial-staffing"),
    (r"mid[- ]tier",                                "mid-tier-it-services-growth-staffing"),
    (r"IT services",                                "mid-tier-it-services-growth-staffing"),
    (r"outsourcing",                                "is-bpo-dying-ai-outsourcing"),
    (r"skills (?:gap|deficit|shortage)",            "ai-talent-market-india-skills-gap"),
    (r"tier[- ]2|Pune|Hyderabad|Coimbatore",        "tier-2-city-hiring-india"),
    (r"US clients",                                 "us-staffing-market-2026-india-firms"),
    (r"agency fee|placement fee",                   "what-clients-pay-agencies-for-now"),
    (r"client retention|losing clients|account churn", "ai-client-retention-staffing"),
    (r"AI agents?",                                 "agentic-ai-vs-automation-rules-recruitment"),
    (r"AI adoption|adoption",                       "ai-adoption-plan-staffing-firm"),
    (r"valuations?|acquired",                       "staffing-agency-valuation-ma-2026"),
    (r"bench",                                      "it-services-outcome-based-bench-hiring"),
]

# Competitors resolve two ways: to the page that compares them where the reader
# is not already on it, and to the vendor's own site where they are.
COMPETITORS = {
    "bullhorn":      (r"Bullhorn",      "sortinghat-vs-bullhorn",      "https://www.bullhorn.com/pricing/"),
    "ceipal":        (r"Ceipal",        "sortinghat-vs-ceipal",        "https://www.ceipal.com/"),
    "recruiterflow": (r"Recruiterflow", "sortinghat-vs-recruiterflow", "https://recruiterflow.com/pricing"),
    "loxo":          (r"Loxo",          "sortinghat-vs-loxo",          "https://www.loxo.co/pricing"),
    "vincere":       (r"Vincere",       "sortinghat-vs-vincere",       "https://www.vincere.io/"),
    "jobdiva":       (r"JobDiva",       "sortinghat-vs-jobdiva",       "https://www.jobdiva.com/"),
    "zoho-recruit":  (r"Zoho Recruit",  "sortinghat-vs-zoho-recruit",  "https://www.zoho.com/recruit/pricing.html"),
    "manatal":       (r"Manatal",       "sortinghat-vs-manatal",       "https://www.manatal.com/pricing"),
    "jobadder":      (r"JobAdder",      "sortinghat-vs-jobadder",      "https://jobadder.com/pricing/"),
    "crelate":       (r"Crelate",       "sortinghat-vs-crelate",       "https://www.crelate.com/pricing"),
    "recruit-crm":   (r"Recruit CRM",   "sortinghat-vs-recruit-crm",   "https://recruitcrm.io/pricing/"),
    "targetrecruit": (r"TargetRecruit", "sortinghat-vs-targetrecruit", "https://targetrecruit.com/"),
    "tracker-rms":   (r"Tracker RMS",   "sortinghat-vs-tracker-rms",   "https://www.tracker-rms.com/"),
    "pcrecruiter":   (r"PCRecruiter",   "sortinghat-vs-pcrecruiter",   "https://www.pcrecruiter.net/"),
    "avionte":       (r"Avion(?:te|té)","sortinghat-vs-avionte",       "https://www.avionte.com/"),
}

# --------------------------------------------------------------- external ---
# Every URL below was fetched before it was written down. Three hosts answer a
# datacentre IP with 403 from their bot filter (vincere.io, staffingindustry.com
# and www.bls.gov) while serving a valid certificate; for BLS the unemployment
# series on data.bls.gov answers 200 and is the figure actually cited, so that
# is the link. The other two are linked at their verified hostname.
SOURCES = [
    (r"NASSCOM",                    "https://nasscom.in/",                          "noopener"),
    (r"Zinnov",                     "https://zinnov.com/en-us/",                    "noopener"),
    (r"Staffing Industry Analysts", "https://www.staffingindustry.com/",            "noopener"),
    (r"(?:US )?Bureau of Labor Statistics", "https://data.bls.gov/timeseries/LNS14000000", "noopener"),
    (r"Textkernel",                 "https://www.textkernel.com/",                  "noopener nofollow"),
    (r"SourceBreaker",              "https://www.bullhorn.com/products/sourcebreaker/", "noopener nofollow"),
    (r"Naukri",                     "https://www.naukri.com/",                      "noopener nofollow"),
]


def prose_paragraphs(soup, sources_line=True):
    """Every <p> that is running prose, in document order.

    `sources_line` keeps or drops the small "Last reviewed ... figures from ..."
    paragraph. It is the right place for a source link and the wrong place for
    an internal one: "its published pricing" there means the vendor's page, not
    ours, so an internal link on that phrase would point somewhere the sentence
    is not talking about.
    """
    for p in soup.find_all("p"):
        classes = set(p.get("class") or [])
        if "lbl" in classes:
            continue
        if "rev" in classes and not sources_line:
            continue
        if p.find_parent(class_=lambda c: c and set(c) & set(SKIP_ANCESTORS)):
            continue
        yield p


def strings_outside_anchors(p):
    for node in p.find_all(string=True):
        if node.find_parent("a"):
            continue
        yield node


def place(root, soup, pattern, href, rel=None, sources_line=True):
    """Wrap the first prose match of `pattern` in a link to `href`.

    Returns False, changing nothing, if the document already links there. That
    guard is what makes the whole pass idempotent: one link per target per post
    holds across runs, not just within one.
    """
    if root.find("a", href=href):
        return False
    rx = re.compile(r"\b(" + pattern + r")\b")
    for p in prose_paragraphs(root, sources_line):
        for node in strings_outside_anchors(p):
            m = rx.search(node)
            if not m:
                continue
            before, hit, after = node[: m.start()], m.group(1), node[m.end():]
            tag = soup.new_tag("a", href=href)
            if rel:
                tag["rel"] = rel
                tag["target"] = "_blank"
            tag.string = hit
            node.replace_with(tag)
            if before:
                tag.insert_before(NavigableString(before))
            if after:
                tag.insert_after(NavigableString(after))
            return True
    return False


def main():
    posts = json.load(open(f"{CONTENT}/posts.json", encoding="utf-8"))["posts"]
    slugs = {p["slug"] for p in posts}
    report, tot_i, tot_e = [], 0, 0

    for post in posts:
        slug = post["slug"]
        path = f"{CONTENT}/{slug}.html"
        soup = BeautifulSoup(open(path, encoding="utf-8").read(), "lxml")
        # lxml wraps a fragment; work inside the body it invents
        root = soup.body or soup
        # The ceilings count what the post already has, not what this run adds.
        # Counting only new links let a second run add another full quota.
        existing = [a.get("href", "") for a in root.find_all("a")]
        n_i = sum(1 for h in existing if h.startswith("/"))
        n_e = sum(1 for h in existing if h.startswith("http"))
        was_i, was_e = n_i, n_e

        # competitors first: the most specific anchors in the corpus. A vendor
        # is linked to its own site on the pages that compare it, and to the
        # comparison page everywhere else.
        for key, (pat, vs_slug, url) in COMPETITORS.items():
            if key in slug or vs_slug == slug:
                if n_e < MAX_EXTERNAL and place(
                    root, soup, pat, url, "noopener nofollow"
                ):
                    n_e += 1
            elif vs_slug in slugs and n_i < MAX_INTERNAL:
                if place(root, soup, pat, f"/blog/{vs_slug}", sources_line=False):
                    n_i += 1

        for pat, url, rel in SOURCES:
            if n_e < MAX_EXTERNAL and place(root, soup, pat, url, rel):
                n_e += 1

        for pat, target in INTERNAL:
            if target == slug or target not in slugs or n_i >= MAX_INTERNAL:
                continue
            if place(root, soup, pat, f"/blog/{target}", sources_line=False):
                n_i += 1

        if n_i > was_i or n_e > was_e:
            out = root.decode_contents().strip() + "\n"
            if not DRY:
                open(path, "w", encoding="utf-8").write(out)
        report.append((slug, n_i - was_i, n_e - was_e))
        tot_i += n_i - was_i
        tot_e += n_e - was_e

    for slug, i, e in report:
        print(f"  {slug:46s} internal +{i:2d}  external +{e}")
    print(f"\n{len(report)} posts, +{tot_i} internal, +{tot_e} external"
          f"{'  (dry run, nothing written)' if DRY else ''}")


if __name__ == "__main__":
    main()
