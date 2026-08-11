import Nav from "@/components/Nav";
import {
  FeatureGrid,
  FeatureRow,
  FinalCta,
  Footer,
  Hero,
  Migration,
  Pillars,
} from "@/components/sections";
import Integrations from "@/components/integrations";
import { Section } from "@/components/ui";
import {
  AnalyticsMock,
  MatchingMock,
  PresentationMock,
  WorkflowMock,
} from "@/components/mocks/FeatureMocks";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Pillars />

        <Section id="features" className="pb-2 md:pb-4 lg:pb-6">
          <h2 className="display text-center text-[clamp(2.2rem,5vw,3.4rem)] text-ink">
            Features
          </h2>
        </Section>

        <FeatureRow
          id="talent-pool"
          eyebrow="01 · Talent Pool"
          title="Every placeable person, one search away."
          body="Your own database, the job boards and LinkedIn in a single pool. Scored, enriched, and searchable in plain English."
          bullets={[
            {
              t: "Natural language search",
              d: "Describe the profile. No Boolean, no filter builder.",
            },
            {
              t: "Scoring and signals",
              d: "Every candidate ranked, with the evidence behind the score.",
            },
            {
              t: "Your existing database, revived",
              d: "Enriched, deduped and kept current. Dormant records become reachable.",
            },
            {
              t: "Inbound",
              d: "Job portals and a branded careers page feed straight in.",
            },
            {
              t: "Outbound",
              d: "Hunt profiles on LinkedIn and launch reachout campaigns.",
            },
          ]}
          mock={<MatchingMock />}
        />

        <FeatureRow
          id="workflow"
          eyebrow="02 · Workflow"
          title="The admin between stages, gone."
          body="Kanban or list, automated chasing, AI interviews, and call notes that write themselves onto the record."
          bullets={[
            {
              t: "Kanban or list",
              d: "Same jobs, either view. Drag between stages.",
            },
            {
              t: "Automated reminders",
              d: "Email, WhatsApp and AI calls chase candidates for you.",
            },
            {
              t: "AI interviews and call insights",
              d: "Schedule AI interviews or bring an assistant to your own. Transcripts turn into actionables.",
            },
            {
              t: "Preset campaigns",
              d: "Engage candidates without writing the sequence twice.",
            },
            {
              t: "One inbox",
              d: "Email, LinkedIn and WhatsApp in a single thread per person.",
            },
            {
              t: "Candidate reports",
              d: "Client-ready profiles built from real signals, not a reformatted CV.",
            },
          ]}
          mock={<WorkflowMock />}
          flip
          tone="cream"
        />

        <FeatureRow
          id="revenue"
          eyebrow="03 · Revenue & Growth"
          title="Win the client, then keep them."
          body="An AI-native CRM that understands the brief, works your prospect list, and chases what you are owed."
          bullets={[
            {
              t: "Sharper briefs",
              d: "The assistant pulls out what the client actually needs.",
            },
            {
              t: "Auto-updated client reports",
              d: "Progress reaches them without you writing it.",
            },
            {
              t: "Prospecting built in",
              d: "Find POCs through LinkedIn, enrich contacts, run campaigns.",
            },
            {
              t: "Never miss a lead",
              d: "Every enquiry tracked to a next step and an owner.",
            },
            {
              t: "Contracts, compliance and payments",
              d: "Documents, checks and invoice reminders on the same record.",
            },
          ]}
          mock={<PresentationMock />}
        />

        <FeatureRow
          id="analytics"
          eyebrow="04 · Analytics"
          title="Run the firm on numbers."
          body="Every recruiter's activity, every desk's margin, and a forecast you can plan headcount against."
          bullets={[
            {
              t: "Recruiter performance",
              d: "Activity and conversion per head, and where to coach.",
            },
            {
              t: "People and org planning",
              d: "Revenue, bonus, salaries, team allocation, headcount.",
            },
            {
              t: "Permissions and access",
              d: "Control who sees which desks, clients and conversations.",
            },
            {
              t: "1,200+ custom reports",
              d: "Build the view your board asks for, then save it.",
            },
            {
              t: "Revenue forecasting",
              d: "Predict the quarter from live pipeline, not last year.",
            },
          ]}
          mock={<AnalyticsMock />}
          flip
          tone="cream"
        />

        <FeatureGrid />
        <Integrations />
        <Migration />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
