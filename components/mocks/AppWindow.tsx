"use client";

import { useEffect, useRef, useState } from "react";
import { MockScroller } from "../ui";

/* The hero window is the product itself: the real dark workspace, on a loop.
   Four modules rotate; each panel remounts, so its draw-in animations replay
   every cycle without any of them having to be infinite. */

const TABS = ["Talent Pool", "Workflow", "Revenue & Growth", "Analytics"] as const;
type Tab = (typeof TABS)[number];

/* How long each module holds before the next one takes over. The tab's
   progress fill is driven off the same number, so the sweep finishes exactly
   as the panel changes. */
const CYCLE_MS = 6400;

const NAV = [
  { label: "Talent pool", icon: "people" },
  { label: "Jobs", icon: "brief" },
  { label: "Clients", icon: "building" },
  { label: "Inbox", icon: "inbox" },
  { label: "Campaigns", icon: "send" },
  { label: "Analytics", icon: "chart" },
] as const;

const ACTIVE_NAV: Record<Tab, string> = {
  "Talent Pool": "Talent pool",
  Workflow: "Jobs",
  "Revenue & Growth": "Clients",
  Analytics: "Analytics",
};

const CREST: Record<Tab, { crumb: string; title: string; chip: string }> = {
  "Talent Pool": {
    crumb: "Talent pool",
    title: "Search everyone you can place",
    chip: "12,840 profiles",
  },
  Workflow: {
    crumb: "Jobs · Frontend Engineer",
    title: "#49599",
    chip: "Active",
  },
  "Revenue & Growth": {
    crumb: "Clients",
    title: "Lead conversion",
    chip: "18 open",
  },
  Analytics: {
    crumb: "Analytics",
    title: "Overview · This month",
    chip: "Live",
  },
};

function Icon({ name }: { name: string }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "people":
      return (
        <svg {...common} aria-hidden>
          <circle cx="6" cy="5.5" r="2.4" />
          <path d="M1.8 13.4c.5-2.2 2.2-3.4 4.2-3.4s3.7 1.2 4.2 3.4" />
          <path d="M11 3.6a2.2 2.2 0 0 1 0 4.2M12.4 13.4c-.2-1-.5-1.9-1-2.5" />
        </svg>
      );
    case "brief":
      return (
        <svg {...common} aria-hidden>
          <rect x="1.8" y="4.8" width="12.4" height="8.4" rx="1.6" />
          <path d="M5.8 4.8V3.6c0-.7.5-1.2 1.2-1.2h2c.7 0 1.2.5 1.2 1.2v1.2M1.8 8.4h12.4" />
        </svg>
      );
    case "building":
      return (
        <svg {...common} aria-hidden>
          <rect x="2.4" y="2.4" width="7.2" height="11.2" rx="1.2" />
          <path d="M9.6 6.4h2.8c.7 0 1.2.5 1.2 1.2v6H9.6M4.6 5.2h2.4M4.6 7.8h2.4M4.6 10.4h2.4" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common} aria-hidden>
          <rect x="1.8" y="3.2" width="12.4" height="9.6" rx="1.6" />
          <path d="M1.8 8.6h3.4l1 1.6h3.6l1-1.6h3.4" />
        </svg>
      );
    case "send":
      return (
        <svg {...common} aria-hidden>
          <path d="M13.8 2.4 7.4 8.8M13.8 2.4l-4.2 11.2-2.2-4.8-4.8-2.2 11.2-4.2Z" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden>
          <path d="M2.2 13.4h11.6M4.6 13.4V7.6M8 13.4V3.8M11.4 13.4V9.4" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ atoms */

function Ring({
  v,
  size = 30,
  delay = 0,
}: {
  v: number;
  size?: number;
  delay?: number;
}) {
  const r = (size - 3.5) / 2;
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
          strokeWidth="2.4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#5ed39b"
          strokeWidth="2.4"
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
      <span className="absolute text-[9.5px] font-medium tabular-nums text-[#5ed39b]">
        {v}
      </span>
    </span>
  );
}

function Chip({
  children,
  tone = "dim",
}: {
  children: React.ReactNode;
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

function Avatar({ t, c, size = 26 }: { t: string; c: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-[9.5px] font-semibold text-white"
      style={{ width: size, height: size, background: c }}
    >
      {t}
    </span>
  );
}

/* A hairline that sweeps down a list, the way a scoring pass reads it. */
function Scan() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-10"
      style={{
        background:
          "linear-gradient(180deg, rgba(94,211,155,0) 0%, rgba(94,211,155,0.10) 60%, rgba(94,211,155,0.34) 100%)",
        animation: "sh-scan 5.2s linear infinite",
      }}
    />
  );
}

/* ------------------------------------------------------------ Talent Pool */

const POOL = [
  {
    i: "AD",
    c: "#7c6cf5",
    n: "Aditya Dixit",
    r: "Frontend Architect · Cult.Fit",
    e: "B.E. Mumbai University · 10.4 yrs",
    src: "Naukri",
    s: 97,
  },
  {
    i: "VM",
    c: "#2f9e75",
    n: "Vijay Murukesan",
    r: "Senior Front End Developer · Augusta",
    e: "University of Madras · 8.2 yrs",
    src: "Naukri",
    s: 96,
  },
  {
    i: "RJ",
    c: "#c2643c",
    n: "Rishabh Joshi",
    r: "Frontend Engineer · AVRL",
    e: "Delhi Technological University · 6.5 yrs",
    src: "via Upload",
    s: 96,
  },
  {
    i: "MB",
    c: "#3f7fb8",
    n: "Megha B",
    r: "Senior Frontend Engineer · Sixt",
    e: "BVB College of Engineering · 7.1 yrs",
    src: "LinkedIn",
    s: 93,
  },
  {
    i: "PB",
    c: "#b8437f",
    n: "Parakh Bansal",
    r: "Software Engineer · WebEngage",
    e: "Swami Keshvanand Institute · 5.8 yrs",
    src: "Naukri",
    s: 93,
  },
  {
    i: "SR",
    c: "#4a8f8a",
    n: "Shaik Rafi",
    r: "Frontend Developer · Ninestars",
    e: "B.Tech KSRM College · 6.0 yrs",
    src: "Careers page",
    s: 91,
  },
];

function TalentPoolPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#1c2026] px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-[#232830] bg-[#0f1216] px-3 py-2">
          <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
            <path
              d="M8 1.6 9.5 6l4.5 1.5L9.5 9 8 13.4 6.5 9 2 7.5 6.5 6 8 1.6Z"
              fill="#7c6cf5"
            />
          </svg>
          <span className="relative overflow-hidden whitespace-nowrap">
            <span
              className="block overflow-hidden whitespace-nowrap text-[11.5px] text-[#c9d1dc]"
              style={{ animation: "sh-type 5.2s steps(52) infinite" }}
            >
              Frontend engineers, 6+ yrs, React, Bangalore, open to relocate
            </span>
          </span>
          <span
            className="ml-auto h-3 w-px bg-[#5ed39b]"
            style={{ animation: "sh-caret 1s steps(1) infinite" }}
          />
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#6c7683]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#5ed39b]"
            style={{ animation: "sh-pulse 1.6s ease-in-out infinite" }}
          />
          12,840 profiles ranked in 1.9s
          <span className="ml-auto">Score</span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Scan />
        {POOL.map((p, i) => (
          <div
            key={p.n}
            className="flex items-center gap-3 border-b border-[#161a1f] px-4 py-[11px]"
            style={{
              animation: `sh-rise .55s var(--ease-out-quint) ${0.1 + i * 0.1}s both`,
            }}
          >
            <Avatar t={p.i} c={p.c} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-[12px] font-medium text-[#e8ecf1]">
                  {p.n}
                </span>
                {i === 0 ? <Chip tone="green">new</Chip> : null}
              </span>
              <span className="mt-0.5 block truncate text-[10.5px] text-[#8e97a5]">
                {p.r}
              </span>
              <span className="mt-1 flex items-center gap-1.5">
                <Chip>{p.src}</Chip>
                <span className="truncate text-[9.5px] text-[#5f6874]">
                  {p.e}
                </span>
              </span>
            </span>
            <Ring v={p.s} delay={0.25 + i * 0.1} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Workflow */

type Card = { n: string; r: string; s: number; src: string };

const BOARD: { t: string; n: number; cards: Card[] }[] = [
  {
    t: "Uploaded",
    n: 30,
    cards: [
      { n: "Vijay Murukesan", r: "Senior Front End Dev", s: 96, src: "Naukri" },
      { n: "Shaik Rafi", r: "Frontend Developer", s: 96, src: "Naukri" },
      { n: "Rishabh Joshi", r: "Frontend Engineer", s: 96, src: "Upload" },
      { n: "Nikhil Menon", r: "React Engineer", s: 89, src: "LinkedIn" },
    ],
  },
  {
    t: "Applied",
    n: 6,
    cards: [
      { n: "Megha B", r: "Senior Frontend Eng", s: 93, src: "Careers page" },
      { n: "Ira Sequeira", r: "UI Engineer", s: 90, src: "Naukri" },
    ],
  },
  {
    t: "Interested",
    n: 3,
    cards: [
      { n: "Parakh Bansal", r: "Software Engineer", s: 93, src: "Naukri" },
      { n: "Tanvi Rao", r: "Frontend Engineer", s: 88, src: "Upload" },
      { n: "Aman Kohli", r: "Web Engineer", s: 86, src: "LinkedIn" },
    ],
  },
];

/* The one candidate who changes stage while you watch. */
const MOVER: Card = {
  n: "Aditya Dixit",
  r: "Frontend Architect",
  s: 97,
  src: "Naukri",
};

function KanbanCard({ n, r, s, src, delay = 0 }: Card & { delay?: number }) {
  return (
    <div className="rounded-lg border border-[#232830] bg-[#12161b] px-2.5 py-2">
      <div className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-medium text-[#e8ecf1]">
            {n}
          </span>
          <span className="mt-0.5 block truncate text-[9.5px] text-[#7c8593]">
            {r}
          </span>
          <span className="mt-1.5 flex">
            <Chip>{src}</Chip>
          </span>
        </span>
        <Ring v={s} size={24} delay={delay} />
      </div>
    </div>
  );
}

function WorkflowPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[#1c2026] px-4 py-2.5">
        <span className="text-[12px] font-medium text-[#e8ecf1]">
          Frontend Engineer
        </span>
        <span className="text-[10px] text-[#5f6874]">#49599</span>
        <Chip tone="amber">Medium</Chip>
        <Chip tone="green">Active</Chip>
        <span className="ml-auto flex items-center gap-1.5 text-[9.5px] text-[#6c7683]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#7c6cf5]"
            style={{ animation: "sh-pulse 1.8s ease-in-out infinite" }}
          />
          412 reminders ran this month
        </span>
      </div>

      <div className="relative grid min-h-0 flex-1 grid-cols-3 gap-2.5 p-3">
        {BOARD.map((col, ci) => (
          <div key={col.t} className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-white/[0.06] px-1.5 py-[3px] text-[9px] font-medium tracking-[0.08em] text-[#a8b1bd] uppercase">
                {col.t}
              </span>
              <span className="relative text-[9.5px] tabular-nums text-[#6c7683]">
                <span style={{ animation: "sh-swap-out 8s ease-in-out infinite" }}>
                  {col.n}
                </span>
                {ci !== 2 ? (
                  <span
                    className="absolute inset-0"
                    style={{ animation: "sh-swap-in 8s ease-in-out infinite" }}
                  >
                    {ci === 0 ? col.n - 1 : col.n + 1}
                  </span>
                ) : null}
              </span>
            </div>

            {/* The seat Aditya leaves in Uploaded, and the one he takes in
                Applied — both first in their column, so the flight is a
                straight sideways hop no matter how the board reflows. */}
            {ci === 0 ? (
              <div
                className="overflow-hidden"
                style={{ animation: "sh-depart 8s ease-in-out infinite" }}
              >
                <KanbanCard {...MOVER} delay={0.4} />
              </div>
            ) : null}
            {ci === 1 ? (
              <div
                className="overflow-hidden"
                style={{ animation: "sh-land 8s ease-in-out infinite" }}
              >
                <KanbanCard {...MOVER} src="Moved just now" delay={0} />
              </div>
            ) : null}

            {col.cards.map((c, i) => (
              <div
                key={c.n}
                style={{
                  animation: `sh-rise .5s var(--ease-out-quint) ${0.1 + (ci * 2 + i) * 0.07}s both`,
                }}
              >
                <KanbanCard {...c} delay={0.2 + i * 0.1} />
              </div>
            ))}
          </div>
        ))}

        {/* the in-flight copy, riding above the board */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[37px] left-3 w-[calc((100%-1.5rem-1.25rem)/3)] shadow-[0_16px_30px_-12px_rgba(0,0,0,0.85)]"
          style={{
            ["--tx" as string]: "calc(100% + 0.625rem)",
            ["--ty" as string]: "0px",
            animation: "sh-fly 8s var(--ease-out-quint) infinite",
          }}
        >
          <KanbanCard {...MOVER} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- Revenue & Growth */

const LEADS: {
  t: string;
  n: number;
  cards: { c: string; a: string; tag?: string; hot?: boolean }[];
}[] = [
  {
    t: "Lead",
    n: 7,
    cards: [
      { c: "Zomato", a: "#c2643c" },
      { c: "BoAt", a: "#b8437f", tag: "Electricals" },
      { c: "Mamaearth", a: "#3f7fb8" },
      { c: "Dream11", a: "#4a8f8a", tag: "Consumer tech", hot: true },
      { c: "ShareChat", a: "#c2643c" },
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
      { c: "MoEngage", a: "#c2643c", tag: "Tech product" },
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
      { c: "Darwinbox", a: "#9cae66" },
    ],
  },
];

function LeadCard({
  c,
  a,
  tag,
  hot,
}: {
  c: string;
  a: string;
  tag?: string;
  hot?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#232830] bg-[#12161b] px-2.5 py-2">
      <div className="flex items-center gap-2">
        <Avatar t={c[0]} c={a} size={22} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1">
            <span className="truncate text-[11px] font-medium text-[#e8ecf1]">
              {c}
            </span>
            {hot ? <Chip tone="hot">hot</Chip> : null}
          </span>
          <span className="mt-0.5 block truncate text-[9px] text-[#6c7683]">
            {tag ?? "Created 3 hours ago"}
          </span>
        </span>
      </div>
    </div>
  );
}

function RevenuePanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-[#1c2026] px-4 py-2.5">
        <span className="text-[12px] font-medium text-[#e8ecf1]">
          Lead conversion
        </span>
        <span className="flex gap-3 text-[10px] text-[#6c7683]">
          <span className="text-[#e8ecf1]">Lead</span>
          <span>Contacted</span>
          <span>Qualified</span>
          <span className="hidden sm:inline">Proposal</span>
          <span className="hidden sm:inline">Client</span>
        </span>
        <span className="ml-auto text-[9.5px] text-[#6c7683]">
          €412k open pipeline
        </span>
      </div>

      <div className="relative grid min-h-0 flex-1 grid-cols-3 gap-2.5 p-3">
        {LEADS.map((col, ci) => (
          <div key={col.t} className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-white/[0.06] px-1.5 py-[3px] text-[9px] font-medium text-[#a8b1bd]">
                {col.t}
              </span>
              <span className="relative text-[9.5px] tabular-nums text-[#6c7683]">
                <span style={{ animation: "sh-swap-out 8s ease-in-out infinite" }}>
                  ({col.n})
                </span>
                {ci !== 2 ? (
                  <span
                    className="absolute inset-0"
                    style={{ animation: "sh-swap-in 8s ease-in-out infinite" }}
                  >
                    ({ci === 0 ? col.n - 1 : col.n + 1})
                  </span>
                ) : null}
              </span>
            </div>

            {ci === 0 ? (
              <div
                className="overflow-hidden"
                style={{ animation: "sh-depart 8s ease-in-out infinite" }}
              >
                <LeadCard c="Zepto" a="#7c6cf5" tag="Consumer tech" hot />
              </div>
            ) : null}

            {ci === 1 ? (
              <div
                className="overflow-hidden"
                style={{ animation: "sh-land 8s ease-in-out infinite" }}
              >
                <LeadCard c="Zepto" a="#7c6cf5" tag="Intro call booked" hot />
              </div>
            ) : null}

            {col.cards.map((c, i) => (
              <div
                key={c.c}
                style={{
                  animation: `sh-rise .5s var(--ease-out-quint) ${0.08 + (ci * 3 + i) * 0.06}s both`,
                }}
              >
                <LeadCard {...c} />
              </div>
            ))}
          </div>
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute top-[37px] left-3 w-[calc((100%-1.5rem-1.25rem)/3)] shadow-[0_16px_30px_-12px_rgba(0,0,0,0.85)]"
          style={{
            ["--tx" as string]: "calc(100% + 0.625rem)",
            ["--ty" as string]: "0px",
            animation: "sh-fly 8s var(--ease-out-quint) infinite",
          }}
        >
          <LeadCard c="Zepto" a="#7c6cf5" tag="Consumer tech" hot />
        </div>

        <div
          className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-lg border border-[#2a3b33] bg-[#12191a] px-2.5 py-1.5"
          style={{ animation: "sh-toast 8s ease-in-out infinite" }}
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
          <span className="text-[10px] text-[#cfd8e2]">
            Intro call booked · proposal drafted
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Analytics */

const TILES = [
  { l: "Active jobs", v: "30", d: "+4 this week" },
  { l: "Open positions", v: "60", d: "12 desks" },
  { l: "Q4 forecast", v: "€1.04M", d: "±6% on pipeline" },
  { l: "Placements", v: "18", d: "MTD" },
];

const JOBS_ROWS = [
  { c: "#49599", t: "Frontend Engineer", cl: "Swiggy", d: "Technology", p: 30 },
  { c: "#26764", t: "Engineering Manager", cl: "Zerodha", d: "Technology", p: 18 },
  { c: "#85648", t: "Category Manager", cl: "Nykaa", d: "Business & Ops", p: 12 },
  { c: "#68533", t: "Senior Product Designer", cl: "Swiggy", d: "Creative", p: 9 },
];

const DONUT = [
  { l: "Business & Ops", v: 40, c: "#7c6cf5" },
  { l: "Technology", v: 40, c: "#f2c14e" },
  { l: "Creative & Design", v: 20, c: "#5ed39b" },
];

/* Each arc starts where the previous one ended. Precomputed here rather than
   accumulated mid-render, which is not safe across re-renders. */
const DONUT_START = DONUT.reduce<number[]>(
  (starts, d, i) => [...starts, (starts[i] ?? 0) + d.v],
  [0],
);

function AnalyticsPanel() {
  const r = 26;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="grid grid-cols-4 gap-2">
        {TILES.map((t, i) => (
          <div
            key={t.l}
            className="rounded-lg border border-[#232830] bg-[#12161b] px-3 py-2.5"
            style={{
              animation: `sh-rise .5s var(--ease-out-quint) ${0.05 + i * 0.07}s both`,
            }}
          >
            <span className="block text-[9px] tracking-[0.08em] text-[#6c7683] uppercase">
              {t.l}
            </span>
            <span className="display mt-1 block text-[21px] text-[#e8ecf1]">
              {t.v}
            </span>
            <span className="mt-0.5 block text-[9px] text-[#5ed39b]">
              {t.d}
            </span>
          </div>
        ))}
      </div>

      <div className="grid h-[150px] shrink-0 grid-cols-2 gap-2">
        <div className="rounded-lg border border-[#232830] bg-[#12161b] p-3">
          <span className="block text-[9.5px] tracking-[0.08em] text-[#6c7683] uppercase">
            Open roles distribution
          </span>
          <div className="mt-2 flex items-center gap-4">
            <span className="relative grid place-items-center">
              <svg width="64" height="64" className="-rotate-90" aria-hidden>
                <circle
                  cx="32"
                  cy="32"
                  r={r}
                  fill="none"
                  stroke="#1b2026"
                  strokeWidth="7"
                />
                {DONUT.map((d, i) => {
                  const len = (circ * d.v) / 100;
                  const rot = (DONUT_START[i] / 100) * 360;
                  return (
                    <circle
                      key={d.l}
                      cx="32"
                      cy="32"
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
              <span className="absolute text-[13px] font-medium tabular-nums text-[#e8ecf1]">
                30
              </span>
            </span>
            <span className="space-y-1.5">
              {DONUT.map((d) => (
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

        <div className="rounded-lg border border-[#232830] bg-[#12161b] p-3">
          <span className="block text-[9.5px] tracking-[0.08em] text-[#6c7683] uppercase">
            Placements by desk
          </span>
          <div className="mt-3 space-y-2.5">
            {[
              { l: "Technology", v: 92, c: "#7c6cf5", n: "€418k" },
              { l: "Business & Ops", v: 68, c: "#f2c14e", n: "€311k" },
              { l: "Creative", v: 41, c: "#5ed39b", n: "€186k" },
            ].map((b, i) => (
              <div key={b.l}>
                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="text-[#8e97a5]">{b.l}</span>
                  <span className="tabular-nums text-[#cfd8e2]">{b.n}</span>
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

      {/* the report the board actually opens on Monday */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-[#232830] bg-[#12161b]">
        <div className="flex items-center gap-2 border-b border-[#1c2026] px-3 py-2">
          <span className="text-[9.5px] tracking-[0.08em] text-[#6c7683] uppercase">
            Jobs report
          </span>
          <Chip tone="violet">Scheduled · Mondays 09:00</Chip>
          <span className="ml-auto text-[9px] text-[#5f6874]">
            30 of 30 rows
          </span>
        </div>
        <div className="grid grid-cols-[64px_1fr_92px_74px_54px] px-3 py-1.5 text-[8.5px] tracking-[0.08em] text-[#5f6874] uppercase">
          <span>Job</span>
          <span>Title</span>
          <span>Client</span>
          <span>Desk</span>
          <span className="text-right">Pipeline</span>
        </div>
        {JOBS_ROWS.map((j, i) => (
          <div
            key={j.c}
            className="grid grid-cols-[64px_1fr_92px_74px_54px] items-center border-t border-[#161a1f] px-3 py-[6px] text-[10px]"
            style={{
              animation: `sh-rise .45s var(--ease-out-quint) ${0.35 + i * 0.07}s both`,
            }}
          >
            <span className="tabular-nums text-[#6c7683]">{j.c}</span>
            <span className="truncate text-[#cfd8e2]">{j.t}</span>
            <span className="truncate text-[#8e97a5]">{j.cl}</span>
            <span className="truncate text-[#8e97a5]">{j.d}</span>
            <span className="text-right tabular-nums text-[#5ed39b]">
              {j.p}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<Tab, () => React.ReactElement> = {
  "Talent Pool": TalentPoolPanel,
  Workflow: WorkflowPanel,
  "Revenue & Growth": RevenuePanel,
  Analytics: AnalyticsPanel,
};

export default function AppWindow() {
  const [tab, setTab] = useState<Tab>("Talent Pool");
  const [auto, setAuto] = useState(true);
  const [play, setPlay] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setPlay(e.isIntersecting),
      { rootMargin: "150px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !play) return;
    const id = setInterval(() => {
      setTab((t) => TABS[(TABS.indexOf(t) + 1) % TABS.length]);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [auto, play]);

  const Panel = PANELS[tab];
  const crest = CREST[tab];

  return (
    <div>
      {/* A flat strip rather than a pill group: square edges, one weight for
          every label, and the current module marked by a plain sheet instead of
          a filled button. While the reel is running, an ink bar sweeps that
          sheet in time with the cycle and the label inverts behind it — the
          progress is the selection, so nothing has to be bolded to read as on. */}
      <div className="mb-5 flex justify-center">
        <div className="inline-flex flex-wrap justify-center bg-cream/85 hairline">
          {TABS.map((t) => {
            const active = tab === t;
            const sweeping = active && auto && play;
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setAuto(false);
                }}
                aria-pressed={active}
                className={`relative flex items-center justify-center px-4 py-2 text-[13px] transition-colors duration-200 ${
                  active ? "text-ink" : "text-ink/60 hover:text-ink"
                }`}
              >
                {active && (
                  <span aria-hidden className="absolute inset-0 bg-white" />
                )}
                {sweeping && (
                  <span
                    key={t}
                    aria-hidden
                    className="tab-fill absolute inset-y-0 left-0 bg-ink"
                    style={{ animationDuration: `${CYCLE_MS}ms` }}
                  />
                )}
                <span className="relative">{t}</span>
                {sweeping && (
                  <span
                    key={`${t}-wipe`}
                    aria-hidden
                    className="tab-wipe absolute inset-0 flex items-center justify-center px-4 text-white"
                    style={{ animationDuration: `${CYCLE_MS}ms` }}
                  >
                    {t}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <MockScroller min="min-w-[680px]">
        <div
          ref={stage}
          data-play={play}
          className="mock-stage window-dark relative mx-auto max-w-5xl"
        >
          {/* the workspace's own ambient light */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 45% at 88% 4%, rgba(124,108,245,0.16) 0%, rgba(11,13,16,0) 70%), radial-gradient(50% 40% at 4% 96%, rgba(94,211,155,0.10) 0%, rgba(11,13,16,0) 70%)",
            }}
          />

          <div className="relative flex h-[420px] md:h-[460px]">
            {/* icon rail */}
            <aside className="hidden w-[52px] shrink-0 flex-col items-center gap-1 border-r border-[#1c2026] bg-[#0e1114] py-3 sm:flex">
              <span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-[#7c6cf5]/15 text-[11px] font-semibold text-[#a396ff]">
                S
              </span>
              {NAV.map((n) => {
                const active = ACTIVE_NAV[tab] === n.label;
                return (
                  <span
                    key={n.label}
                    title={n.label}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition-colors duration-300 ${
                      active
                        ? "bg-white/[0.08] text-[#e8ecf1]"
                        : "text-[#5f6874]"
                    }`}
                  >
                    <Icon name={n.icon} />
                  </span>
                );
              })}
              <span className="mt-auto grid h-7 w-7 place-items-center rounded-full bg-[#c2643c] text-[10px] font-semibold text-white">
                A
              </span>
            </aside>

            {/* main */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-11 shrink-0 items-center gap-3 border-b border-[#1c2026] px-4">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#242a31]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#242a31]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#242a31]" />
                </span>
                <span className="hidden items-center gap-2 text-[10.5px] text-[#6c7683] md:flex">
                  {crest.crumb}
                  <span className="text-[#39404a]">/</span>
                  <span className="text-[#cfd8e2]">{crest.title}</span>
                </span>
                <span className="flex-1 truncate rounded-md border border-[#232830] bg-[#0f1216] px-3 py-1.5 text-[11px] text-[#5f6874]">
                  Ask anything, &ldquo;who did we place at Quantix last
                  year?&rdquo;
                </span>
                <span className="hidden rounded-full bg-[#7c6cf5]/15 px-2 py-1 text-[10px] font-medium text-[#a396ff] md:inline">
                  AI on
                </span>
              </div>

              <div key={tab} className="min-h-0 flex-1 animate-[sh-fade_.4s_ease-out]">
                <Panel />
              </div>
            </div>
          </div>
        </div>
      </MockScroller>
    </div>
  );
}
