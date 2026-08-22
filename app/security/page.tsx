import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Footer } from "@/components/sections";
import { Section } from "@/components/ui";
import { pageSchema } from "@/lib/schema";
import type { Page } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Security & Data Protection | Sortinghat",
  description:
    "How Sortinghat stores candidate and client data, who can reach it, what it is never used for, and how retention works under the GDPR and India's DPDP Act.",
  alternates: { canonical: "/security" },
};

/* The page had no FAQ block and no schema, which meant the questions a
   procurement reviewer actually types — is our data used to train models, how
   long is it kept, can we get it back — were answered in prose that nothing
   could extract. The answers below are the ones the blog already gives. */
const FAQ: Page["faq"] = [
  {
    q: "Is candidate data used to train AI models?",
    a: "No. Candidate records, notes, calls and client conversations are processed to produce results inside your workspace and nowhere else. There is no cross-customer training set and no secondary use of client data. This is a question worth asking every vendor you evaluate, and worth being suspicious of any answer that takes more than a sentence.",
  },
  {
    q: "How long is candidate data retained?",
    a: "For as long as the client remains on the platform, after which it is removed. Data is isolated per client, is not pooled across customers, and is not shared with third parties. Retention has to be defensible rather than indefinite: India's DPDP Act and the GDPR both require a lawful basis for holding personal data and a stated retention position.",
  },
  {
    q: "Can we export our database if we leave?",
    a: "Yes, whenever you want it, and you can ask us to delete it when you are done. Leaving should never mean negotiating for your own data back.",
  },
  {
    q: "Who at Sortinghat can access customer data?",
    a: "Access is limited to the people who need it to run and support the service, for as long as that work takes and no longer. Access to production systems is granted narrowly rather than by default, and changes are reviewed before release.",
  },
  {
    q: "How is data encrypted?",
    a: "Traffic between you and Sortinghat is protected with TLS, and your data is encrypted where it is stored. Roles and permissions decide which desks, clients and conversations each person can open.",
  },
  {
    q: "Do candidates need to be told their profile is in our database?",
    a: "Under the GDPR, the UK regime and India's DPDP Act, notice obligations apply to personal data you hold, including data gathered without direct contact. The platform can run notice campaigns over email, WhatsApp or call, but whether and when to send them is your decision to take with your own advice.",
  },
  {
    q: "Which vendors and subprocessors are involved?",
    a: "Sortinghat runs on a deliberately small set of infrastructure and model providers, each chosen for how they handle customer data. Ask and we will name every one of them in writing.",
  },
];

const SECURITY_PAGE: Page = {
  path: "/security",
  metaTitle: "Security & Data Protection",
  description:
    "How Sortinghat stores candidate and client data, who can reach it, what it is never used for, and how retention works under the GDPR and India's DPDP Act.",
  h1: "Your database is the firm. We treat it that way.",
  dek: "",
  eyebrow: "Security",
  crumbs: [],
  intro: [],
  blocks: [],
  faq: FAQ,
  reading: [],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema(SECURITY_PAGE)),
        }}
      />
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

        <Section id="faq">
          <h2 className="display text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink">
            Questions procurement asks
          </h2>
          <div className="mt-10 max-w-3xl">
            {FAQ.map((f) => (
              <div key={f.q} className="border-b border-line py-6 first:pt-0">
                <h3 className="text-[17px] font-medium text-ink">{f.q}</h3>
                <p className="mt-2.5 text-[16px] leading-relaxed text-muted">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="bg-cream">
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
