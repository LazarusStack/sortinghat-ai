import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Footer } from "@/components/sections";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Security | Sortinghat",
  description:
    "How Sortinghat stores your candidate and client data, who can reach it, and what we will never do with it.",
};

/* Two plain lists rather than a wall of badges: what we do with your data, and
   what protects it. Every line is a commitment someone at the firm can be held
   to, which is the only kind worth printing. */

const PRIVACY: [string, string][] = [
  [
    "Your data is never used to train models",
    "Candidate records, notes, calls and client conversations are processed to produce results inside your workspace and nowhere else. Nothing you put into Sortinghat is used to train foundation models, ours or anyone else's.",
  ],
  [
    "Your records stay yours",
    "Export your database whenever you want it, and ask us to delete it when you're done. Leaving should never mean negotiating for your own data back.",
  ],
  [
    "Confidential by default",
    "Access to customer data by our own team is limited to the people who need it to run and support the service, for as long as that work takes and no longer.",
  ],
  [
    "The vendors behind the product, named",
    "Sortinghat runs on a deliberately small set of infrastructure and model providers, each chosen for how they handle customer data. Ask and we will name every one of them in writing.",
  ],
];

const PROTECTION: [string, string][] = [
  [
    "Encrypted in transit and at rest",
    "Traffic between you and Sortinghat is protected with TLS, and your data is encrypted where it is stored.",
  ],
  [
    "Access that follows your org chart",
    "Roles and permissions decide which desks, clients and conversations each person can open. The controls that stop two desks tripping over each other are the same ones that keep data where it belongs.",
  ],
  [
    "Monitoring and incident response",
    "We watch the platform and keep a defined process for investigating, containing and communicating incidents. If something affects your data, you hear it from us.",
  ],
  [
    "Reviewed before it ships",
    "Changes are reviewed before release, and access to production systems is granted narrowly rather than by default.",
  ],
];

function Points({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
      {items.map(([t, d]) => (
        <div key={t} className="bg-white p-8">
          <h3 className="display text-[20px] text-ink">{t}</h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{d}</p>
        </div>
      ))}
    </div>
  );
}

export default function SecurityPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden pt-32 pb-4 md:pt-40 md:pb-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(90,63,192,0.08) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div className="shell">
            <div className="max-w-3xl">
              <p className="eyebrow">Security</p>
              <h1 className="display mt-5 text-[clamp(2.1rem,5vw,3.4rem)] text-ink">
                Your database is the firm. We treat it that way.
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
                Sortinghat holds candidate records, client conversations and
                commercial terms &mdash; the three things a staffing firm cannot
                afford to lose. This is how that data is stored, who can reach
                it, and what we will never do with it.
              </p>
            </div>
          </div>
        </section>

        <Section>
          <h2 className="display text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink">
            Privacy
          </h2>
          <Points items={PRIVACY} />
        </Section>

        <Section className="bg-cream">
          <h2 className="display text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink">
            Protection
          </h2>
          <Points items={PROTECTION} />
        </Section>

        <Section>
          <div className="max-w-2xl">
            <h2 className="display text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink">
              Reviewing us before you sign?
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">
              Ask us anything about how the platform handles your data, and
              we&rsquo;ll answer in writing. If you believe you have found a
              vulnerability, mail the same address and we will come back to you.
            </p>
            <a
              href="mailto:hello@sortinghat.ai"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-none bg-ink px-5 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#000] hover:shadow-[0_8px_24px_-8px_rgba(25,25,25,0.5)] active:scale-[0.985]"
            >
              hello@sortinghat.ai
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
