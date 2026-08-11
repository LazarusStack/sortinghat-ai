"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Each feature row gets one small film of the real product. They stay frozen
   until they scroll into view (`Stage`), then run their loop: a query types
   itself, a candidate changes stage, a lead moves down the pipeline, a
   quarter's numbers draw in. */

function Stage({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setPlay(e.isIntersecting),
      { rootMargin: "150px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-play={play}
      className={`mock-stage window-dark ${className}`}
    >
      <div className="flex h-9 items-center gap-2.5 border-b border-[#1c2026] px-3.5">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#242a31]" />
          <span className="h-2 w-2 rounded-full bg-[#242a31]" />
          <span className="h-2 w-2 rounded-full bg-[#242a31]" />
        </span>
        <span className="text-[10.5px] tracking-[0.06em] text-[#5f6874] uppercase">
          {label}
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[9.5px] text-[#5f6874]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#5ed39b]"
            style={{ animation: "sh-pulse 1.8s ease-in-out infinite" }}
          />
          Live
        </span>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ atoms */

function Ring({
  v,
  size = 26,
  delay = 0,
}: {
  v: number;
  size?: number;
  delay?: number;
}) {
  const r = (size - 3) / 2;
  const circ = 2 * Math.PI * r;
  const to = circ * (1 - v / 100);
  return (
    <span
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1e2a2f"
          strokeWidth="2.2"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#5ed39b"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{
            ["--circ" as string]: circ,
            ["--to" as string]: to,
            strokeDasharray: circ,
            strokeDashoffset: to,
            animation: `sh-ring 1.1s var(--ease-out-quint) ${delay}s both`,
          }}
        />
      </svg>
      <span className="absolute text-[8.5px] font-semibold tabular-nums text-[#5ed39b]">
        {v}
      </span>
    </span>
  );
}

function Tag({
  children,
  tone = "dim",
}: {
  children: ReactNode;
  tone?: "dim" | "green" | "hot" | "amber" | "violet";
}) {
  const map = {
    dim: "bg-white/[0.06] text-[#8e97a5]",
    green: "bg-[#5ed39b]/12 text-[#5ed39b]",
    hot: "bg-[#e2574c]/15 text-[#f08479]",
    amber: "bg-[#f2c14e]/12 text-[#f2c14e]",
    violet: "bg-[#7c6cf5]/15 text-[#a396ff]",
  } as const;
  return (
    <span
      className={`rounded px-1.5 py-[2px] text-[9px] font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function Dot({ t, c, size = 22 }: { t: string; c: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white"
      style={{ width: size, height: size, background: c }}
    >
      {t}
    </span>
  );
}

/* -------------------------------------------------------------- Talent Pool */

const RANKED = [
  {
    i: "AD",
    c: "#7c6cf5",
    n: "Aditya Dixit",
    r: "Frontend Architect · Cult.Fit",
    why: "10.4 yrs · Bangalore · open to relocate",
    src: "Naukri",
    s: 97,
  },
  {
    i: "VM",
    c: "#2f9e75",
    n: "Vijay Murukesan",
    r: "Senior Front End Developer · Augusta",
    why: "8.2 yrs · “can start the 15th”, WhatsApp",
    src: "Naukri",
    s: 96,
  },
  {
    i: "RJ",
    c: "#c2643c",
    n: "Rishabh Joshi",
    r: "Frontend Engineer · AVRL",
    why: "6.5 yrs · placed by us in 2023",
    src: "via Upload",
    s: 96,
  },
  {
    i: "MB",
    c: "#3f7fb8",
    n: "Megha B",
    r: "Senior Frontend Engineer · Sixt",
    why: "7.1 yrs · rate inside band",
    src: "LinkedIn",
    s: 93,
  },
];

export function MatchingMock() {
  return (
    <Stage label="Talent pool">
      <div className="min-h-[336px]">
        <div className="border-b border-[#1c2026] p-3.5">
          <div className="flex items-center gap-2 rounded-lg bg-[#0f1216] px-3 py-2.5 hairline-dark">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
              <path
                d="M8 1.6 9.5 6l4.5 1.5L9.5 9 8 13.4 6.5 9 2 7.5 6.5 6 8 1.6Z"
                fill="#7c6cf5"
              />
            </svg>
            <span className="overflow-hidden whitespace-nowrap">
              <span
                className="block overflow-hidden whitespace-nowrap text-[11.5px] text-[#c9d1dc]"
                style={{ animation: "sh-type 6s steps(58) infinite" }}
              >
                Frontend engineers, 6+ yrs React, Bangalore, open to relocate
              </span>
            </span>
            <span
              className="ml-auto h-3.5 w-px shrink-0 bg-[#7c6cf5]"
              style={{ animation: "sh-caret 1s steps(1) infinite" }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-[#5f6874]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#7c6cf5]"
              style={{ animation: "sh-pulse 1.6s ease-in-out infinite" }}
            />
            12,840 profiles ranked in 1.9s
            <span className="ml-auto">No Boolean. No filter builder.</span>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(94,211,155,0) 0%, rgba(94,211,155,0.09) 60%, rgba(94,211,155,0.30) 100%)",
              animation: "sh-scan 6s linear infinite",
            }}
          />
          {RANKED.map((m, i) => (
            <div
              key={m.n}
              className="flex items-center gap-3 border-b border-[#1c2026] px-3.5 py-[11px]"
              style={{
                animation: `sh-rise .6s var(--ease-out-quint) ${0.12 + i * 0.1}s both`,
              }}
            >
              <Dot t={m.i} c={m.c} size={28} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[12px] font-medium text-[#e8ecf1]">
                    {m.n}
                  </span>
                  {i === 0 ? <Tag tone="green">best match</Tag> : null}
                </span>
                <span className="mt-0.5 block truncate text-[10.5px] text-[#8e97a5]">
                  {m.r}
                </span>
                <span className="mt-1 flex items-center gap-1.5">
                  <Tag>{m.src}</Tag>
                  <span className="truncate text-[9.5px] text-[#5f6874]">
                    {m.why}
                  </span>
                </span>
              </span>
              <Ring v={m.s} delay={0.3 + i * 0.1} />
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/* ---------------------------------------------------------------- Workflow */

type JobCard = { n: string; r: string; s: number; src: string };

const JOB_BOARD: { t: string; n: number; cards: JobCard[] }[] = [
  {
    t: "Uploaded",
    n: 30,
    cards: [
      { n: "Vijay Murukesan", r: "Senior Front End Dev", s: 96, src: "Naukri" },
      { n: "Shaik Rafi", r: "Frontend Developer", s: 96, src: "Naukri" },
      { n: "Rishabh Joshi", r: "Frontend Engineer", s: 96, src: "Upload" },
    ],
  },
  {
    t: "Screening",
    n: 6,
    cards: [
      { n: "Megha B", r: "Senior Frontend Eng", s: 93, src: "AI call" },
      { n: "Ira Sequeira", r: "UI Engineer", s: 90, src: "Reminder 2 of 3" },
    ],
  },
  {
    t: "Interview",
    n: 3,
    cards: [
      { n: "Parakh Bansal", r: "Software Engineer", s: 93, src: "Thu 10:00" },
      { n: "Tanvi Rao", r: "Frontend Engineer", s: 88, src: "Notes → 3 actions" },
    ],
  },
];

const JOB_MOVER: JobCard = {
  n: "Aditya Dixit",
  r: "Frontend Architect",
  s: 97,
  src: "Naukri",
};

function JobCardView({ n, r, s, src, delay = 0 }: JobCard & { delay?: number }) {
  return (
    <div className="rounded-lg bg-[#12161b] px-2.5 py-2 hairline-dark">
      <div className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[10.5px] font-medium text-[#e8ecf1]">
            {n}
          </span>
          <span className="mt-0.5 block truncate text-[9px] text-[#8e97a5]">
            {r}
          </span>
          <span className="mt-1.5 flex">
            <Tag>{src}</Tag>
          </span>
        </span>
        <Ring v={s} size={22} delay={delay} />
      </div>
    </div>
  );
}

export function WorkflowMock() {
  return (
    <Stage label="Jobs · pipeline">
      <div className="flex min-h-[336px] flex-col">
        <div className="flex items-center gap-2 border-b border-[#1c2026] px-3.5 py-2.5">
          <span className="text-[11.5px] font-medium text-[#e8ecf1]">
            Frontend Engineer
          </span>
          <span className="text-[10px] text-[#5f6874]">#49599</span>
          <Tag tone="amber">Medium</Tag>
          <Tag tone="green">Active</Tag>
        </div>

        <div className="relative grid flex-1 grid-cols-3 gap-2.5 bg-[#0f1216] p-3">
          {JOB_BOARD.map((col, ci) => (
            <div key={col.t} className="flex min-w-0 flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-[#12161b] px-1.5 py-[3px] text-[8.5px] font-medium tracking-[0.08em] text-[#c9d1dc] uppercase hairline-dark">
                  {col.t}
                </span>
                <span className="relative text-[9.5px] tabular-nums text-[#5f6874]">
                  <span
                    style={{ animation: "sh-swap-out 9s ease-in-out infinite" }}
                  >
                    {col.n}
                  </span>
                  {ci !== 2 ? (
                    <span
                      className="absolute inset-0"
                      style={{ animation: "sh-swap-in 9s ease-in-out infinite" }}
                    >
                      {ci === 0 ? col.n - 1 : col.n + 1}
                    </span>
                  ) : null}
                </span>
              </div>

              {ci === 0 ? (
                <div
                  className="overflow-hidden"
                  style={{ animation: "sh-depart 9s ease-in-out infinite" }}
                >
                  <JobCardView {...JOB_MOVER} delay={0.4} />
                </div>
              ) : null}
              {ci === 1 ? (
                <div
                  className="overflow-hidden"
                  style={{ animation: "sh-land 9s ease-in-out infinite" }}
                >
                  <JobCardView {...JOB_MOVER} src="AI call booked" delay={0} />
                </div>
              ) : null}

              {col.cards.map((c, i) => (
                <div
                  key={c.n}
                  style={{
                    animation: `sh-rise .5s var(--ease-out-quint) ${0.1 + (ci * 2 + i) * 0.07}s both`,
                  }}
                >
                  <JobCardView {...c} delay={0.25 + i * 0.1} />
                </div>
              ))}
            </div>
          ))}

          <div
            aria-hidden
            className="pointer-events-none absolute top-[36px] left-3 w-[calc((100%-1.5rem-1.25rem)/3)] shadow-[0_16px_30px_-12px_rgba(0,0,0,0.85)]"
            style={{
              ["--tx" as string]: "calc(100% + 0.625rem)",
              ["--ty" as string]: "0px",
              animation: "sh-fly 9s var(--ease-out-quint) infinite",
            }}
          >
            <JobCardView {...JOB_MOVER} />
          </div>

          <div
            className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-lg bg-[#12161b] px-2.5 py-1.5 shadow-[0_12px_26px_-12px_rgba(0,0,0,0.8)] hairline-dark"
            style={{ animation: "sh-toast 9s ease-in-out infinite" }}
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[#5ed39b]">
              <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden>
                <path
                  d="M2.6 6.2 4.9 8.5 9.4 3.8"
                  stroke="#0b0d10"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[10px] text-[#c9d1dc]">
              AI interview booked · WhatsApp reminder queued
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-[#1c2026] px-3.5 py-2.5">
          <span className="text-[10.5px] text-[#8e97a5]">
            412 reminders, updates and follow-ups ran this month.
          </span>
          <span className="text-[10.5px] font-medium text-[#e8ecf1]">
            None by hand.
          </span>
        </div>
      </div>
    </Stage>
  );
}

/* -------------------------------------------------------- Revenue & Growth */

type Lead = { c: string; a: string; tag?: string; hot?: boolean };

const PIPELINE: { t: string; n: number; cards: Lead[] }[] = [
  {
    t: "Lead",
    n: 7,
    cards: [
      { c: "Zomato", a: "#c2643c" },
      { c: "BoAt", a: "#b8437f", tag: "Electricals" },
      { c: "Mamaearth", a: "#3f7fb8" },
      { c: "Dream11", a: "#4a8f8a", tag: "Consumer tech", hot: true },
    ],
  },
  {
    t: "Contacted",
    n: 7,
    cards: [
      { c: "Slice", a: "#3f7fb8", tag: "Fintech", hot: true },
      { c: "Rapido", a: "#2f9e75" },
      { c: "Whatfix", a: "#7c6cf5", tag: "Enterprise" },
      { c: "Chargebee", a: "#b8437f" },
    ],
  },
  {
    t: "Qualified",
    n: 4,
    cards: [
      { c: "Browserstack", a: "#2f9e75" },
      { c: "Khatabook", a: "#f2c14e" },
      { c: "Wakefit", a: "#7c6cf5", tag: "FMCD" },
      { c: "Netradyne", a: "#3f7fb8", tag: "Deep tech", hot: true },
    ],
  },
];

const LEAD_MOVER: Lead = {
  c: "Zepto",
  a: "#7c6cf5",
  tag: "Consumer tech",
  hot: true,
};

function LeadCardView({ c, a, tag, hot }: Lead) {
  return (
    <div className="rounded-lg bg-[#12161b] px-2.5 py-2 hairline-dark">
      <div className="flex items-center gap-2">
        <Dot t={c[0]} c={a} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1">
            <span className="truncate text-[10.5px] font-medium text-[#e8ecf1]">
              {c}
            </span>
            {hot ? <Tag tone="hot">hot</Tag> : null}
          </span>
          <span className="mt-0.5 block truncate text-[9px] text-[#5f6874]">
            {tag ?? "Created 3 hours ago"}
          </span>
        </span>
      </div>
    </div>
  );
}

export function PresentationMock() {
  return (
    <Stage label="Clients · lead conversion">
      <div className="flex min-h-[336px] flex-col">
        <div className="flex items-center gap-3 border-b border-[#1c2026] px-3.5 py-2.5">
          <span className="text-[11.5px] font-medium text-[#e8ecf1]">
            Lead conversion
          </span>
          <span className="flex gap-2.5 text-[9.5px] text-[#5f6874]">
            <span className="text-[#e8ecf1]">Lead</span>
            <span>Contacted</span>
            <span>Qualified</span>
            <span>Proposal</span>
            <span>Client</span>
          </span>
          <span className="ml-auto text-[9.5px] text-[#8e97a5]">€412k open</span>
        </div>

        <div className="relative grid flex-1 grid-cols-3 gap-2.5 bg-[#0f1216] p-3">
          {PIPELINE.map((col, ci) => (
            <div key={col.t} className="flex min-w-0 flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-[#12161b] px-1.5 py-[3px] text-[8.5px] font-medium text-[#c9d1dc] hairline-dark">
                  {col.t}
                </span>
                <span className="relative text-[9.5px] tabular-nums text-[#5f6874]">
                  <span
                    style={{ animation: "sh-swap-out 9s ease-in-out infinite" }}
                  >
                    ({col.n})
                  </span>
                  {ci !== 2 ? (
                    <span
                      className="absolute inset-0"
                      style={{ animation: "sh-swap-in 9s ease-in-out infinite" }}
                    >
                      ({ci === 0 ? col.n - 1 : col.n + 1})
                    </span>
                  ) : null}
                </span>
              </div>

              {ci === 0 ? (
                <div
                  className="overflow-hidden"
                  style={{ animation: "sh-depart 9s ease-in-out infinite" }}
                >
                  <LeadCardView {...LEAD_MOVER} />
                </div>
              ) : null}
              {ci === 1 ? (
                <div
                  className="overflow-hidden"
                  style={{ animation: "sh-land 9s ease-in-out infinite" }}
                >
                  <LeadCardView {...LEAD_MOVER} tag="Intro call booked" />
                </div>
              ) : null}

              {col.cards.map((c, i) => (
                <div
                  key={c.c}
                  style={{
                    animation: `sh-rise .5s var(--ease-out-quint) ${0.08 + (ci * 3 + i) * 0.06}s both`,
                  }}
                >
                  <LeadCardView {...c} />
                </div>
              ))}
            </div>
          ))}

          <div
            aria-hidden
            className="pointer-events-none absolute top-[36px] left-3 w-[calc((100%-1.5rem-1.25rem)/3)] shadow-[0_16px_30px_-12px_rgba(0,0,0,0.85)]"
            style={{
              ["--tx" as string]: "calc(100% + 0.625rem)",
              ["--ty" as string]: "0px",
              animation: "sh-fly 9s var(--ease-out-quint) infinite",
            }}
          >
            <LeadCardView {...LEAD_MOVER} />
          </div>

          <div
            className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-lg bg-[#12161b] px-2.5 py-1.5 shadow-[0_12px_26px_-12px_rgba(0,0,0,0.8)] hairline-dark"
            style={{ animation: "sh-toast 9s ease-in-out infinite" }}
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[#7c6cf5]">
              <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden>
                <path
                  d="M2.6 6.2 4.9 8.5 9.4 3.8"
                  stroke="#0b0d10"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[10px] text-[#c9d1dc]">
              Brief captured · proposal drafted from the call
            </span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* --------------------------------------------------------------- Analytics */

const TILES = [
  { l: "Active jobs", v: "30", d: "+4 this week" },
  { l: "Positions", v: "60", d: "12 desks" },
  { l: "Placements", v: "18", d: "month to date" },
];

const SPLIT = [
  { l: "Business & Ops", v: 40, c: "#7c6cf5" },
  { l: "Technology", v: 40, c: "#f2c14e" },
  { l: "Creative & Design", v: 20, c: "#2f9e75" },
];

/* A few of the 1,200+ built reports, each on its own send schedule. */
const REPORTS = [
  {
    n: "Revenue report",
    c: "Placements & revenue",
    t: "violet" as const,
    s: "Emailed daily, 09:00",
  },
  {
    n: "Recruiter activity",
    c: "Activity",
    t: "green" as const,
    s: "Weekly, Monday",
  },
  {
    n: "Invoice receivables",
    c: "Finance",
    t: "amber" as const,
    s: "3 rows 90+ days",
  },
];

const DESKS = [
  { l: "Technology", v: 92, c: "#7c6cf5", n: "€418k" },
  { l: "Business & Ops", v: 68, c: "#f2c14e", n: "€311k" },
  { l: "Creative", v: 41, c: "#5ed39b", n: "€186k" },
];

export function AnalyticsMock() {
  const r = 24;
  const circ = 2 * Math.PI * r;
  /* start angle of each wedge, so the donut assembles clockwise */
  const starts = SPLIT.reduce<number[]>(
    (a, d, i) => [...a, i === 0 ? 0 : a[i - 1] + SPLIT[i - 1].v],
    [],
  );

  return (
    <Stage label="Analytics · overview">
      <div className="min-h-[336px] p-3">
        <div className="grid grid-cols-3 gap-2">
          {TILES.map((t, i) => (
            <div
              key={t.l}
              className="rounded-lg bg-[#0f1216] px-3 py-2.5 hairline-dark"
              style={{
                animation: `sh-rise .5s var(--ease-out-quint) ${0.05 + i * 0.08}s both`,
              }}
            >
              <span className="block text-[9px] tracking-[0.08em] text-[#5f6874] uppercase">
                {t.l}
              </span>
              <span className="display mt-1 block text-[22px] text-[#e8ecf1]">
                {t.v}
              </span>
              <span className="mt-0.5 block text-[9px] text-[#5ed39b]">
                {t.d}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[#0f1216] p-3 hairline-dark">
            <span className="block text-[9px] tracking-[0.08em] text-[#5f6874] uppercase">
              Open roles
            </span>
            <div className="mt-2 flex items-center gap-3">
              <span className="relative grid place-items-center">
                <svg width="60" height="60" className="-rotate-90" aria-hidden>
                  <circle
                    cx="30"
                    cy="30"
                    r={r}
                    fill="none"
                    stroke="#1e2a2f"
                    strokeWidth="7"
                  />
                  {SPLIT.map((d, i) => {
                    const len = (circ * d.v) / 100;
                    const rot = (starts[i] / 100) * 360;
                    return (
                      <circle
                        key={d.l}
                        cx="30"
                        cy="30"
                        r={r}
                        fill="none"
                        stroke={d.c}
                        strokeWidth="7"
                        strokeDasharray={`${len} ${circ - len}`}
                        style={{
                          transformOrigin: "center",
                          transform: `rotate(${rot}deg)`,
                          ["--circ" as string]: len,
                          ["--to" as string]: 0,
                          strokeDashoffset: 0,
                          animation: `sh-ring .9s var(--ease-out-quint) ${0.25 + i * 0.18}s both`,
                        }}
                      />
                    );
                  })}
                </svg>
                <span className="absolute text-[12px] font-medium tabular-nums text-[#e8ecf1]">
                  30
                </span>
              </span>
              <span className="space-y-1.5">
                {SPLIT.map((d) => (
                  <span key={d.l} className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: d.c }}
                    />
                    <span className="text-[9.5px] text-[#8e97a5]">{d.l}</span>
                    <span className="text-[9.5px] tabular-nums text-[#5f6874]">
                      {d.v}%
                    </span>
                  </span>
                ))}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-[#0f1216] p-3 hairline-dark">
            <span className="block text-[9px] tracking-[0.08em] text-[#5f6874] uppercase">
              Revenue by desk
            </span>
            <div className="mt-2.5 space-y-2">
              {DESKS.map((b, i) => (
                <div key={b.l}>
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="text-[#8e97a5]">{b.l}</span>
                    <span className="tabular-nums text-[#e8ecf1]">{b.n}</span>
                  </div>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#1b2026]">
                    <span
                      className="block h-full origin-left rounded-full"
                      style={{
                        width: `${b.v}%`,
                        background: b.c,
                        animation: `sh-bar 1s var(--ease-out-quint) ${0.3 + i * 0.12}s both`,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 overflow-hidden rounded-lg hairline-dark">
          {REPORTS.map((rep, i) => (
            <div
              key={rep.n}
              className="flex items-center gap-2 border-b border-[#1c2026] px-3 py-[7px] last:border-b-0"
              style={{
                animation: `sh-rise .5s var(--ease-out-quint) ${0.5 + i * 0.09}s both`,
              }}
            >
              <span className="text-[10.5px] text-[#e8ecf1]">{rep.n}</span>
              <Tag tone={rep.t}>{rep.c}</Tag>
              <span className="ml-auto text-[9.5px] text-[#5f6874]">{rep.s}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#0f1216] px-3 py-2.5 hairline-dark">
          <span className="text-[10px] text-[#8e97a5]">Forecast, next quarter</span>
          <span className="display text-[15px] text-[#e8ecf1]">€1.04M</span>
          <span className="text-[9.5px] font-medium text-[#5ed39b]">
            ±6% on live pipeline
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[9.5px] text-[#5f6874]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#7c6cf5]"
              style={{ animation: "sh-pulse 2s ease-in-out infinite" }}
            />
            Emailed to the board every Monday
          </span>
        </div>
      </div>
    </Stage>
  );
}
