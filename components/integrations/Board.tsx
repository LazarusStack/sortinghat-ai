import { Section, Wordmark } from "../ui";

/* ---------------------------------------------------------------------------
   Sortinghat branches into five use cases, each holding a bunch of tools.

   Choreographed on a 5s loop: a pulse leaves the Sortinghat node, runs down
   one branch, and the moment it lands that bunch's tokens ripple. Five
   branches take turns, so something is always moving but nothing is busy.
   Pure CSS, no JS.

   Logos live in public/logos/. Replace any file in place to swap a mark.
   ------------------------------------------------------------------------- */

type Tool = { n: string; f: string };
type Bunch = { g: string; tools: Tool[] };

const BUNCHES: Bunch[] = [
  {
    g: "Messaging",
    tools: [
      { n: "WhatsApp", f: "whatsapp.svg" },
      { n: "Gmail", f: "gmail.svg" },
      { n: "Outlook", f: "outlook.png" },
      { n: "ElevenLabs", f: "elevenlabs.svg" },
      { n: "Vapi", f: "vapi.png" },
    ],
  },
  {
    g: "Scheduling",
    tools: [
      { n: "Google Meet", f: "google-meet.svg" },
      { n: "Zoom", f: "zoom.svg" },
      { n: "Microsoft Teams", f: "teams.png" },
    ],
  },
  {
    g: "Tracking",
    tools: [
      { n: "Google Calendar", f: "google-calendar.svg" },
      { n: "Google Sheets", f: "google-sheets.svg" },
      { n: "Notion", f: "notion.svg" },
      { n: "Slack", f: "slack.png" },
    ],
  },
  {
    g: "Outreach & assessment",
    tools: [
      { n: "Fireflies", f: "fireflies.png" },
      { n: "BarRaiser", f: "barraiser.png" },
      { n: "Juicebox", f: "juicebox.png" },
      { n: "Weekday", f: "weekday.png" },
    ],
  },
  {
    g: "Job portals",
    tools: [
      { n: "LinkedIn", f: "linkedin.svg" },
      { n: "Naukri", f: "naukri.png" },
      { n: "Indeed", f: "indeed.svg" },
      { n: "Handshake", f: "handshake.svg" },
    ],
  },
];

/* geometry, fixed at module scope so server and client agree */
const W = 1200;
const H = 400;
const ROOT_X = W / 2;
const ROOT_Y = 52;
const BUNCH_Y = 258;
const COLS = BUNCHES.map((_, i) => ((i + 0.5) / BUNCHES.length) * W);

/** A fanned hand of tokens: rotated out from the middle and arced. */
function Cluster({ b }: { b: Bunch }) {
  const mid = (b.tools.length - 1) / 2;
  return (
    <div className="flex items-end justify-center pl-3">
      {b.tools.map((t, i) => {
        const off = i - mid;
        return (
          <span
            key={t.f}
            title={t.n}
            className="branch-token -ml-3 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-[0_3px_12px_-4px_rgba(25,25,25,0.28)] ring-1 ring-line"
            style={{
              ["--rot" as string]: `${off * 9}deg`,
              ["--dy" as string]: `${Math.abs(off) * 3}px`,
              zIndex: b.tools.length - Math.abs(Math.round(off)),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${t.f}`}
              alt={t.n}
              width={22}
              height={22}
              className="h-[22px] w-[22px] rounded-[4px] object-contain"
            />
          </span>
        );
      })}
    </div>
  );
}

/* The root of the diagram is the brand, not a call to action — so it reads as
   the wordmark on paper, with the pulse ring as its only chrome. */
function RootNode() {
  return (
    <div className="relative grid place-items-center px-7 py-3.5">
      <span
        aria-hidden
        className="root-ring absolute inset-0 rounded-full ring-1 ring-accent"
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-white shadow-[0_0_0_10px_#fff,0_14px_34px_-20px_rgba(25,25,25,0.35)]"
      />
      <Wordmark className="relative text-[26px]" />
    </div>
  );
}

export default function Board() {
  return (
    <Section id="integrations">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Integrations</p>
        <h2 className="display mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)] text-ink">
          Plugs into the stack you already run on.
        </h2>
      </div>

      {/* ---------------- branching diagram (lg and up) ---------------- */}
      <div className="relative mt-4 hidden lg:block lg:pb-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
          {/* stem */}
          <line
            x1={ROOT_X}
            y1={ROOT_Y + 4}
            x2={ROOT_X}
            y2={ROOT_Y + 34}
            stroke="#e8e5e0"
            strokeWidth="1.5"
          />
          {COLS.map((x, i) => {
            const d = `M ${ROOT_X} ${ROOT_Y + 34} C ${ROOT_X} ${ROOT_Y + 130}, ${x} ${ROOT_Y + 96}, ${x} ${BUNCH_Y}`;
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke="#e8e5e0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* the branch lights as the pulse runs down it */}
                <path
                  d={d}
                  fill="none"
                  stroke="#5a3fc0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="branch-glow"
                  style={{ animationDelay: `${i}s` }}
                />
                {/* the pulse itself */}
                <path
                  d={d}
                  fill="none"
                  pathLength={100}
                  stroke="#5a3fc0"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="7 93"
                  className="branch-pulse"
                  style={{ animationDelay: `${i}s` }}
                />
                <circle cx={x} cy={BUNCH_Y} r="3.5" fill="#e8e5e0" />
                <circle
                  cx={x}
                  cy={BUNCH_Y}
                  r="3.5"
                  fill="#5a3fc0"
                  className="branch-dot"
                  style={{ animationDelay: `${i}s` }}
                />
              </g>
            );
          })}
        </svg>

        {/* root */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: "50%", top: `${(ROOT_Y / H) * 100}%` }}
        >
          <RootNode />
        </div>

        {/* bunches */}
        {BUNCHES.map((b, i) => (
          <div
            key={b.g}
            className="absolute w-[19%] -translate-x-1/2"
            style={{
              left: `${(COLS[i] / W) * 100}%`,
              top: `${((BUNCH_Y + 26) / H) * 100}%`,
            }}
          >
            <Cluster b={b} />
            <p className="mt-4 text-center text-[14px] font-medium text-ink">
              {b.g}
            </p>
          </div>
        ))}
      </div>

      {/* ---------------- stacked (below lg) ---------------- */}
      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:hidden">
        {BUNCHES.map((b) => (
          <div key={b.g} className="text-center">
            <Cluster b={b} />
            <p className="mt-4 text-[14px] font-medium text-ink">{b.g}</p>
          </div>
        ))}
      </div>

      <p className="mt-14 text-center text-[12.5px] text-faint lg:mt-6">
        Two-way sync, plus an open API for everything else.
      </p>
    </Section>
  );
}
