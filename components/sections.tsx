import type { ReactNode } from "react";
import Link from "next/link";
import AppWindow from "./mocks/AppWindow";
import {
  BookDemo,
  Check,
  DEMO_URL,
  MockScroller,
  Section,
  Wordmark,
} from "./ui";

/* ------------------------------------------------------------ Customers */

/**
 * The customers' own logo files. Each arrived on a white background; that white
 * is lifted into transparency and the colour un-premultiplied, so the marks sit
 * on the card rather than in a white box.
 *
 * The files on disk stay full colour — brightness(0) does the blackening at
 * render time, and hover lifts it back to the real brand colours. Nothing is
 * baked in, so the treatment is one class away from changing.
 *
 * Heights are tuned per aspect ratio so a wide wordmark and a tall stacked mark
 * land on the same optical weight.
 */
const CUSTOMERS = [
  { n: "Atlass Partners", f: "atlass-partners.png", h: "h-11" },
  { n: "CodersBrain", f: "codersbrain.png", h: "h-14" },
  { n: "interned.io", f: "interned.png", h: "h-9" },
  { n: "Jigsaw Staffing", f: "jigsaw-staffing.png", h: "h-12" },
  { n: "Peoplefy", f: "peoplefy.png", h: "h-9" },
  { n: "Scrabble", f: "scrabble.png", h: "h-9" },
  { n: "Scalene Works", f: "scalene-works.png", h: "h-11" },
];

function CustomerLogos() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-[13.5px] font-medium tracking-[0.02em] text-muted">
        Our clients
      </p>
      <h2 className="display mt-2 max-w-2xl text-[clamp(1.4rem,3vw,2rem)] text-ink">
        Closed 1,200+ extra roles without increasing headcount.
      </h2>

      {/* One continuous line. The list is rendered twice and the track travels
          exactly -50%, so the seam lands on an identical frame and the loop is
          invisible. Edges are masked so logos arrive and leave rather than
          getting clipped mid-mark. */}
      <div
        className="mt-10 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <div className="marquee-track flex w-max gap-3">
          {[...CUSTOMERS, ...CUSTOMERS].map((c, i) => (
            <div
              key={`${c.f}-${i}`}
              className="flex h-24 w-56 shrink-0 items-center justify-center rounded-2xl bg-sand px-6 transition-colors duration-300 hover:bg-line-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/customers/${c.f}`}
                alt={i < CUSTOMERS.length ? c.n : ""}
                aria-hidden={i >= CUSTOMERS.length}
                title={c.n}
                className={`${c.h} w-auto max-w-full object-contain brightness-0 opacity-80 transition duration-300 hover:opacity-100 hover:brightness-100`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Hero */

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px]"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 78%, rgba(90,63,192,0.10) 0%, rgba(90,63,192,0.04) 38%, rgba(255,255,255,0) 72%), radial-gradient(45% 35% at 82% 12%, rgba(214,178,120,0.13) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] opacity-[0.35]"
        style={{
          maskImage:
            "radial-gradient(60% 50% at 50% 40%, #000 0%, transparent 75%)",
        }}
      />

      <div className="shell">
        <div className="mx-auto max-w-5xl text-center">
          <p
            className="reveal text-[13.5px] font-medium tracking-[0.02em] text-muted"
            style={{ animationDelay: "0.02s" }}
          >
            Full stack ATS + CRM
          </p>
          <h1
            className="display reveal mt-5 text-[clamp(2.25rem,5.2vw,3.9rem)] text-ink"
            style={{ animationDelay: "0.08s" }}
          >
            AI Native ATS
            <br /> Built for top 1% staffing firms
          </h1>
          <p
            className="reveal mx-auto mt-6 max-w-3xl text-[17px] leading-relaxed text-balance text-muted"
            style={{ animationDelay: "0.22s" }}
          >
            We don&rsquo;t just track roles. We 10x your recruiters
            and bet on your firm&rsquo;s growth.
          </p>
          <div
            className="reveal mt-9 flex justify-center"
            style={{ animationDelay: "0.3s" }}
          >
            <BookDemo />
          </div>
        </div>

        <div
          className="reveal mt-16 md:mt-20"
          style={{ animationDelay: "0.4s" }}
        >
          <AppWindow />
        </div>

        <div
          className="reveal mt-28 md:mt-40"
          style={{ animationDelay: "0.48s" }}
        >
          <CustomerLogos />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Pillars */

const PILLARS = [
  {
    t: "Talent Pool",
    d: "Utilise your existing pool plus run inbound and outbound campaigns.",
  },
  {
    t: "Workflow",
    d: "Even one recruiter can manage 30 jobs seamlessly.",
  },
  {
    t: "Revenue & Growth",
    d: "Deliver the best experience for clients and close more deals.",
  },
  {
    t: "Analytics",
    d: "Run the firm on numbers, and plan the next quarter.",
  },
];

export function Pillars() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden bg-ink py-20 md:py-28 lg:py-32"
    >
      {/* fine light grain, so the black reads as paper stock rather than a void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.075) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(80% 70% at 50% 45%, #000 0%, transparent 78%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(90,63,192,0.28) 0%, rgba(25,25,25,0) 72%)",
        }}
      />

      <div className="shell relative">
        <h2 className="display mx-auto max-w-3xl text-center text-[clamp(1.9rem,4.2vw,3rem)] text-balance text-white">
          Grow your firm with 1 workspace, not 6 disconnected tools.
        </h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <div
              key={p.t}
              className="group bg-ink px-6 py-10 text-center transition-colors duration-300 hover:bg-white/[0.035]"
            >
              <span className="text-[11px] tabular-nums text-accent-lift">
                0{i + 1}
              </span>
              <h3 className="display mt-3 text-[21px] text-white">{p.t}</h3>
              <span
                aria-hidden
                className="mx-auto mt-4 block h-px w-8 bg-white/20 transition-all duration-300 group-hover:w-14 group-hover:bg-accent-lift"
              />
              <p className="mx-auto mt-4 max-w-[17rem] text-[14px] leading-relaxed text-white/55">
                {p.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Feature rows */

export function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  mock,
  flip = false,
  tone = "paper",
  id,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: { t: string; d: string }[];
  mock: ReactNode;
  flip?: boolean;
  tone?: "paper" | "cream";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${tone === "cream" ? "bg-cream" : ""}`}
    >
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className={flip ? "lg:order-2" : ""}>
            <p className="eyebrow">{eyebrow}</p>
            <h3 className="display mt-4 text-[clamp(1.6rem,3.2vw,2.35rem)] text-ink">
              {title}
            </h3>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-muted">
              {body}
            </p>
            <ul className="mt-7 space-y-4">
              {bullets.map((b) => (
                <li key={b.t} className="flex gap-3">
                  <Check />
                  <span>
                    <span className="block text-[14.5px] font-medium text-ink">
                      {b.t}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] leading-relaxed text-muted">
                      {b.d}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={flip ? "lg:order-1" : ""}>
            <MockScroller>{mock}</MockScroller>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Feature grid */

const SMALL_FEATURES = [
  {
    t: "One inbox",
    d: "Email, LinkedIn and WhatsApp in a single thread per person.",
  },
  {
    t: "Availability-first filters",
    d: "Availability, location, rate and compliance applied before the search runs.",
  },
  {
    t: "Native deduplication",
    d: "Merge in two clicks, keeping every note, call and attachment.",
  },
  {
    t: "Custom attributes",
    d: "Add the fields your desk runs on. Filterable everywhere.",
  },
  {
    t: "Auto-saved views",
    d: "Columns, filters and sort order persist per recruiter.",
  },
  {
    t: "Scheduling built in",
    d: "Public scheduler and availability rules, inside the thread.",
  },
  {
    t: "Starters and finishers",
    d: "Who starts this week, who finishes next month, who to redeploy.",
  },
  {
    t: "Placement history",
    d: "Every person placed: when, where, and how it went.",
  },
  {
    t: "Mobile",
    d: "Record in-person meetings and search contacts on the move.",
  },
];

export function FeatureGrid() {
  return (
    <Section>
      <div className="max-w-2xl">
        <p className="eyebrow">Everything else</p>
        <h2 className="display mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">
          The small things you use a hundred times a day.
        </h2>
      </div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:grid-cols-3">
        {SMALL_FEATURES.map((f) => (
          <div
            key={f.t}
            className="bg-white p-7 transition-colors duration-200 hover:bg-cream"
          >
            <h3 className="text-[15px] font-medium text-ink">{f.t}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              {f.d}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- Migration */

const WEEKS = [
  {
    n: "01",
    t: "Week one",
    d: "Once we receive data from your existing ATS, our team handles the mapping and makes sure everything lines up. Your team keeps working as usual.",
  },
  {
    n: "02",
    t: "Week two",
    d: "We sit down with your team for the specifics. All your data is migrated into a dedicated environment, then validated, checked and rechecked.",
  },
  {
    n: "03",
    t: "End of week two",
    d: "The final migration goes up for review. Once approved, we move everything into Sortinghat with zero downtime and no surprises. A fresh final export makes sure nothing is missed.",
  },
];

export function Migration() {
  return (
    <Section id="migration" className="bg-cream">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="eyebrow">Migration</p>
          <h2 className="display mt-4 text-[clamp(1.9rem,4vw,2.9rem)] text-ink">
            You&rsquo;ll be live on Sortinghat in two weeks.
          </h2>
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
            White-glove migration from Bullhorn, JobAdder, Vincere, Loxo,
            Ceipal, Recruiterflow, Recruit CRM or a spreadsheet nobody admits
            to. Your team keeps billing throughout.
          </p>
        </div>
        <div className="space-y-px overflow-hidden rounded-2xl bg-line">
          {WEEKS.map((w) => (
            <div key={w.n} className="flex gap-6 bg-cream px-7 py-7">
              <span className="display shrink-0 text-[22px] text-faint">
                {w.n}
              </span>
              <span>
                <span className="block text-[16px] font-medium text-ink">
                  {w.t}
                </span>
                <span className="mt-2 block text-[14px] leading-relaxed text-muted">
                  {w.d}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- Final CTA */

const SCHEDULE_SRC =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2HW8M8T-xN5BjPU75LI2KBaasFXW8ovF0oo1nnavVKdGQ5MVnDh0gSaTmhxEj4mewYnPBRzDyl?gv=true";

export function FinalCta() {
  return (
    /* Sized to land in a single screen: the headline, the line under it and
       the whole scheduler, with no scrolling inside the section. */
    <section
      id="book"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink py-12 text-white md:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 110%, rgba(90,63,192,0.55) 0%, rgba(25,25,25,0) 70%), radial-gradient(40% 40% at 12% -10%, rgba(214,178,120,0.22) 0%, rgba(25,25,25,0) 70%)",
        }}
      />
      <div className="shell relative text-center">
        <h2 className="display mx-auto max-w-2xl text-[clamp(1.9rem,4.2vw,3rem)] text-white">
          Outplace everyone.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[15.5px] leading-relaxed text-balance text-white/60">
          You can&rsquo;t win tomorrow&rsquo;s placements with yesterday&rsquo;s
          tools.
        </p>
        {/* The scheduler itself, rather than a button through to it. Google
            serves it cross-origin on a white ground with no dark option, so the
            embed is inverted here instead: invert flips the paper to near-black
            and the 180° hue rotation puts the blues, greens and the avatar back
            on their own side of the wheel. 0.93 rather than a full invert keeps
            the ground just off pure black, matching the band it sits on. */}
        <div className="mx-auto mt-7 w-full max-w-4xl overflow-hidden rounded-2xl bg-[#0d0f12] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/12">
          <iframe
            src={SCHEDULE_SRC}
            title="Book a demo with Sortinghat"
            loading="lazy"
            /* grows with the viewport but never taller than the screen allows */
            className="block w-full border-0"
            style={{
              height: "clamp(420px, 60svh, 660px)",
              background: "#fff",
              filter:
                "invert(0.93) hue-rotate(180deg) saturate(1.15) contrast(0.96)",
            }}
          />
        </div>

        <p className="mt-3 text-[12px] text-white/40">
          Scheduler not loading?{" "}
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-white/70"
          >
            Open it in a new tab
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Footer */

function LinkedIn() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/* Root-relative fragments, so the footer works from /security too. */
const FOOTER = [
  {
    h: "Platform",
    items: [
      { l: "Talent Pool", href: "/#talent-pool" },
      { l: "Workflow", href: "/#workflow" },
      { l: "Revenue & Growth", href: "/#revenue" },
      { l: "Analytics", href: "/#analytics" },
    ],
  },
  {
    h: "Capabilities",
    items: [
      { l: "Natural language search", href: "/#talent-pool" },
      { l: "Scoring & signals", href: "/#talent-pool" },
      { l: "AI interviews", href: "/#workflow" },
      { l: "Automations", href: "/#workflow" },
      { l: "AI-native CRM", href: "/#revenue" },
      { l: "Custom reports", href: "/#analytics" },
      { l: "Integrations", href: "/#integrations" },
    ],
  },
  {
    h: "Built for",
    items: [
      { l: "Staffing agencies", href: "/#platform" },
      { l: "Contract & interim", href: "/#talent-pool" },
      { l: "Permanent placement", href: "/#talent-pool" },
      { l: "Executive search", href: "/#talent-pool" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Wordmark className="text-[30px]" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
              The AI native ATS &amp; CRM for the top 1% of staffing firms.
            </p>

            <div className="mt-10">
              <h4 className="eyebrow">Contact</h4>
              <address className="mt-4 space-y-2 text-[13.5px] leading-relaxed text-muted not-italic">
                <p>
                  Koramangala 1st Block
                  <br />
                  Bengaluru 560047
                </p>
                <p>
                  <a
                    href="mailto:hello@sortinghat.ai"
                    className="transition-colors hover:text-ink"
                  >
                    hello@sortinghat.ai
                  </a>
                </p>
              </address>
              <a
                href="https://www.linkedin.com/company/sortinghatai/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sortinghat on LinkedIn"
                className="mt-5 inline-grid h-9 w-9 place-items-center rounded-full text-muted hairline transition-colors duration-200 hover:bg-ink hover:text-white"
              >
                <LinkedIn />
              </a>
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {FOOTER.map((col) => (
              <div key={col.h}>
                <h4 className="eyebrow">{col.h}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((it) => (
                    <li key={it.l}>
                      <a
                        href={it.href}
                        className="text-[13.5px] text-muted transition-colors hover:text-ink"
                      >
                        {it.l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12.5px] text-faint">
            © {new Date().getFullYear()} Sortinghat. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            <Link
              href="/security"
              className="text-[12.5px] text-faint transition-colors hover:text-ink"
            >
              Security
            </Link>
            <span className="text-[12.5px] text-faint">sortinghat.ai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
