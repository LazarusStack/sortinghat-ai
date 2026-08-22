/**
 * The marketing pages that used to be anchors on one long homepage.
 *
 * Everything a buyer compares on — the talent pool, the workflow, the CRM, the
 * analytics, what it integrates with, what a migration involves, how it is
 * priced and how data is handled — lived at `/#talent-pool`, `/#integrations`
 * and so on. A fragment is not a URL: it cannot be ranked, cited, linked to as
 * an answer, or returned on its own. Eight questions shared one page, one
 * title, one description and one H1 between them.
 *
 * Each page here is a real URL with its own H1, its own FAQ block and its own
 * schema. The homepage keeps its sections, because 125 blog posts link into
 * those fragments and a fragment cannot be redirected — but each section now
 * points at the page that answers it properly.
 *
 * The FAQ answers are lifted from the blog rather than written fresh. They were
 * researched and reviewed there, they already carry FAQPage schema on the post
 * they came from, and a marketing page is the worst place to introduce a claim
 * nobody has checked. Where a page needed a question the corpus does not
 * answer, the answer says what is true and stops.
 */

export type Faq = { q: string; a: string };

export type Block = {
  h: string;
  body: string;
  points?: { t: string; d: string }[];
};

export type Page = {
  /** path, without the origin */
  path: string;
  /** <title>, kept under 60 characters */
  metaTitle: string;
  description: string;
  /** the H1, which is allowed to run longer than the title */
  h1: string;
  dek: string;
  eyebrow: string;
  /** breadcrumb trail after Home, in order */
  crumbs: { name: string; path: string }[];
  intro: string[];
  blocks: Block[];
  faq: Faq[];
  /** posts that treat this subject at length */
  reading: string[];
};

const PLATFORM_CRUMB = { name: "Platform", path: "/platform" };

export const PAGES: Page[] = [
  /* ------------------------------------------------------------ platform */
  {
    path: "/platform",
    metaTitle: "The Sortinghat Platform: ATS and CRM in One",
    description:
      "One platform for the talent pool, the workflow between stages, the client CRM and the analytics a staffing firm runs on. What each part does, and where it stops.",
    h1: "One platform, four jobs a staffing desk actually has",
    dek: "Sourcing, delivery, the client relationship and the numbers underneath all three. Most firms buy these as four systems and spend the difference reconciling them.",
    eyebrow: "Platform",
    crumbs: [],
    intro: [
      "A staffing desk does four things: it finds people, it moves them through a process, it wins and keeps the client paying for that, and it reports on all of it. The software market sells those separately, which is why the average firm runs an ATS, a CRM, a sourcing tool and a BI layer, and why the recruiters spend part of every day moving information between them.",
      "Sortinghat is one platform carrying all four, with a single licence rather than a base tier and a module quote. The pages below describe each part in detail, including where it does not help.",
    ],
    blocks: [
      {
        h: "Talent Pool",
        body: "Your own database, the job boards and LinkedIn as a single searchable pool, ranked rather than listed. This is where most of the recoverable cost sits: firms routinely pay a portal for people already in their records.",
      },
      {
        h: "Workflow",
        body: "The admin between stages. Automated chasing across email, WhatsApp and calls, AI screening and interviews, and notes that write themselves onto the record instead of onto a recruiter's notepad.",
      },
      {
        h: "CRM",
        body: "The client half of the business. Briefs turned into criteria, prospecting built in, client reports that update without anyone writing them, and the contracts, checks and invoice chasing on the same record.",
      },
      {
        h: "Analytics",
        body: "Activity and conversion per recruiter, margin per desk, permissions that follow the org chart, and a forecast built from live pipeline rather than last year's shape.",
      },
    ],
    faq: [
      {
        q: "Is Sortinghat an ATS or a CRM?",
        a: "Both, in one platform and one licence. The distinction matters commercially rather than technically: most vendors sell the ATS and put the sales CRM on a higher tier, so the working setup costs more than the advertised one.",
      },
      {
        q: "Does Sortinghat require any other platform licence?",
        a: "No. It is a single platform with a single licence, including full front and back office and 400+ pre-built integrations.",
      },
      {
        q: "Is Sortinghat built for large staffing firms?",
        a: "Yes. Our customers include firms of 400+ employees, with full front and back office including pay-and-bill, timesheets and invoicing, 400+ pre-built integrations and an open read-write API.",
      },
      {
        q: "What problem does an AI-native ATS solve that a normal one does not?",
        a: "Throughput. A recruiter running manual screening manages around 40 calls a day and finds three or four people worth submitting. Filtering before dialling changes that arithmetic. If your constraint is record keeping rather than recruiter capacity, a conventional ATS is the cheaper answer and worth saying so.",
      },
    ],
    reading: [
      "recruitment-crm-beyond-storing-leads",
      "ats-pricing-2026",
      "best-ats-staffing-firms-india",
      "most-ai-recruiting-tools-do-nothing",
    ],
  },

  /* -------------------------------------------------------- talent pool */
  {
    path: "/platform/talent-pool",
    metaTitle: "Talent Pool Software: Search Your Own Database First",
    description:
      "Your database, the job boards and LinkedIn as one ranked pool, searchable in plain English. What database-first sourcing changes, and what it does not.",
    h1: "Every placeable person, one search away",
    dek: "Your own database, the job boards and LinkedIn in a single pool. Scored, enriched, and searchable in a sentence rather than a Boolean string.",
    eyebrow: "01 · Talent Pool",
    crumbs: [PLATFORM_CRUMB],
    intro: [
      "Most staffing firms are sitting on the cheapest source of candidates they will ever have and paying a job portal instead. In an audit of one firm's 3 million candidate records, about 10% were duplicates and about 10% held no usable company information. The remaining 80% were unique, real profiles that were out of date rather than worthless.",
      "The reason nobody searches them is not indifference. It is that keyword search over a stale database returns noise, so the portal is genuinely faster. Fix the ranking and the enrichment and the arithmetic reverses.",
    ],
    blocks: [
      {
        h: "What the pool contains",
        body: "One search surface over three sources, deduplicated at the point of entry rather than cleaned up later.",
        points: [
          { t: "Your existing database, revived", d: "Enriched, deduped and kept current, so dormant records become reachable again rather than being archived." },
          { t: "Inbound", d: "Job portals and a branded careers page feed straight in, with duplicates resolved against what you already hold." },
          { t: "Outbound", d: "Hunt profiles on LinkedIn through the extension and launch reachout campaigns from the same record." },
        ],
      },
      {
        h: "Search in a sentence",
        body: "Describe the person you need the way you would describe them to a colleague. No Boolean, no filter builder, no training day. Vague queries still return vague results, which is a property of the question rather than the engine.",
      },
      {
        h: "Ranked, with the evidence",
        body: "Every candidate carries a score and the signals behind it, so triage means reading a ranked list rather than a raw one. On a volume role a pool search surfacing around 1,200 relevant profiles narrows to roughly 10 submission-ready ones in hours rather than days.",
      },
    ],
    faq: [
      {
        q: "How much of an old staffing database is still usable?",
        a: "In our audit of 3 million candidate records at one firm, about 10% were duplicates and about 10% held no usable company information. The remaining 80% were unique, real profiles that were out of date rather than worthless.",
      },
      {
        q: "Does database-first sourcing replace job portals like Naukri?",
        a: "No. It reduces how often you need them. Genuinely new skill requirements, new geographies and roles you have never worked still justify a fresh portal pull. The change is that these become the exception rather than the default.",
      },
      {
        q: "How do you deduplicate a candidate database?",
        a: "By matching on an identifier at the point of entry rather than cleaning up later. We use email address as the unique key. That catches the common case cleanly, and it will not catch someone who applies from a work address and later from a personal one.",
      },
      {
        q: "What candidate data does a LinkedIn sourcing extension collect?",
        a: "Publicly visible profile information: work experience, education, skills and the About section. It does not collect private fields, connection graphs, message content, or anything behind a paid tier you do not hold.",
      },
      {
        q: "How long can a staffing firm keep candidate data?",
        a: "Retention has to be defensible rather than indefinite. India's DPDP Act and the GDPR both require a lawful basis for holding personal data and a stated retention position.",
      },
    ],
    reading: [
      "talent-pool-software-database-first-sourcing",
      "natural-language-candidate-search-real-queries",
      "duplicate-candidate-records-database-hygiene",
      "linkedin-sourcing-chrome-extension",
    ],
  },

  /* ----------------------------------------------------------- workflow */
  {
    path: "/platform/workflow",
    metaTitle: "Recruitment Workflow Software: Automate the Admin",
    description:
      "Automated chasing across email, WhatsApp and calls, AI screening and interviews, and notes that reach the record without anyone typing them.",
    h1: "The admin between stages, gone",
    dek: "Kanban or list, automated chasing, AI interviews, and call notes that write themselves onto the record.",
    eyebrow: "02 · Workflow",
    crumbs: [PLATFORM_CRUMB],
    intro: [
      "The hours a recruiter loses are not in the conversations. They are in the chasing, the scheduling, the note-writing and the reformatting of a CV into a client-ready profile. None of that work is skilled and all of it is load-bearing, which is why it gets done badly rather than not at all.",
      "The fix is capture rather than discipline. Calls, meetings, emails and WhatsApp thread onto the record automatically, which means the firm keeps the history even when it loses the person who made it.",
    ],
    blocks: [
      {
        h: "Move the work, not the window",
        body: "The same jobs in Kanban or list, dragged between stages, with one inbox threading email, LinkedIn and WhatsApp per person rather than per channel.",
        points: [
          { t: "Automated reminders", d: "Email, WhatsApp and AI calls chase candidates so a recruiter does not have to remember who has gone quiet." },
          { t: "Preset campaigns", d: "Engage a segment without writing the sequence a second time." },
          { t: "Candidate reports", d: "Client-ready profiles built from real signals rather than a reformatted CV." },
        ],
      },
      {
        h: "Screening that happens before the dial",
        body: "AI voice and video screening runs the first pass, and what the candidate said reaches the record as structured detail rather than a recruiter's recollection. Around 70% of candidates complete an automated screen; the ones who abandon are filtering for patience as much as capability, which is worth reading honestly rather than as a quality signal.",
      },
      {
        h: "Interviews and call insight",
        body: "Schedule an AI interview, or bring an assistant to your own call. Transcripts become actionables against the record, so the next person to open it is not starting from a blank note field.",
      },
    ],
    faq: [
      {
        q: "What does an AI screening call actually ask?",
        a: "Questions generated from the role's own criteria rather than a generic template: availability, notice, compensation expectation, location and the specific experience the brief calls for, with follow-ups where an answer is incomplete.",
      },
      {
        q: "Do candidates complete AI screening calls?",
        a: "Around 70% do, in three to seven minutes. Completion is a measure of patience as well as capability, so read the drop-off as a funnel property rather than proof that the ones who left were unqualified.",
      },
      {
        q: "Does automated call logging require candidate consent?",
        a: "Recording consent rules vary by jurisdiction. India, several US states and the EU all impose requirements, and some require disclosure before recording begins. If your desks place across borders, the requirement is set by the candidate's location rather than yours.",
      },
      {
        q: "How much recruiter time does automatic capture actually save?",
        a: "The honest answer is that it removes a category of work rather than a fixed number of hours: chasing, note-writing and re-keying. A recruiter running manual screening manages around 40 calls a day and finds three or four people worth submitting; filtering before dialling is what moves that number, not faster typing.",
      },
      {
        q: "Where does a human still have to be in the loop?",
        a: "The brief, the shortlist decision and the offer conversation. Automation is good at the pass that removes obviously unsuitable people and bad at the judgement that decides between two suitable ones.",
      },
    ],
    reading: [
      "ai-screening-call-how-it-works",
      "ai-interview-questions-scoring",
      "recruiter-admin-time-automatic-capture",
      "high-volume-recruiting-screening-day",
      "what-ai-cannot-do-in-recruitment",
    ],
  },

  /* ---------------------------------------------------------------- crm */
  {
    path: "/platform/crm",
    metaTitle: "Recruitment CRM: Win the Client, Then Keep Them",
    description:
      "An AI-native recruitment CRM that reads the brief, works the prospect list, updates client reports on its own and chases what you are owed.",
    h1: "Win the client, then keep them",
    dek: "An AI-native CRM that understands the brief, works your prospect list, and chases what you are owed.",
    eyebrow: "03 · CRM",
    crumbs: [PLATFORM_CRUMB],
    intro: [
      "Most recruitment CRMs are a contact database with a pipeline drawn on top. That is enough to store names and not enough to win the client, deliver the role or collect the money, which is the actual sequence a staffing firm gets paid for.",
      "Staffing firms rarely lose clients over delivery quality. They lose them to silence, to slowness, and to the departure of the person who held the relationship. All three are system problems before they are people problems.",
    ],
    blocks: [
      {
        h: "The brief, read properly",
        body: "The assistant pulls out what the client actually needs and turns it into weighted evaluation criteria agreed before the search starts. Wasted submissions are a briefing failure that surfaces three weeks later, not a sourcing failure.",
      },
      {
        h: "Prospecting inside the system",
        body: "Find points of contact through LinkedIn, enrich them, and run campaigns without exporting a list. Every enquiry is tracked to a next step and an owner, so nothing depends on a recruiter's memory of a conversation.",
        points: [
          { t: "Auto-updated client reports", d: "Progress reaches the client without anyone writing it, which removes the most common cause of an account going quiet." },
          { t: "Never miss a lead", d: "Every enquiry carries a next step and an owner." },
          { t: "Contracts, compliance and payments", d: "Documents, checks and invoice reminders sit on the same record as the placement they belong to." },
        ],
      },
      {
        h: "The relationship survives the recruiter",
        body: "Calls, meetings, emails and WhatsApp thread onto the client record automatically. When the relationship holder leaves, the firm keeps the history rather than the individual taking it with them.",
      },
    ],
    faq: [
      {
        q: "What should a recruitment CRM do beyond storing names?",
        a: "Three things a contact database does not: win the client, deliver the role and collect the money. That means prospecting and brief capture at the front, delivery progress in the middle, and contracts, compliance and invoice chasing at the end, all on one record.",
      },
      {
        q: "Why do clients actually leave staffing agencies?",
        a: "Rarely delivery quality. Silence, slowness and the departure of the relationship holder account for most of it, and all three are preventable with capture and reporting rather than with better candidates.",
      },
      {
        q: "Does a staffing firm need a separate sales CRM?",
        a: "Not with Sortinghat, where the client side is in the same platform and the same licence. With most vendors the sales CRM sits on a higher or quote-only tier, which is worth pricing before you compare headline numbers.",
      },
      {
        q: "What keeps a client account once delivery is fine?",
        a: "Being visible. Progress the client can see without asking for it, a next step against every enquiry, and a history that does not walk out with a recruiter.",
      },
    ],
    reading: [
      "recruitment-crm-beyond-storing-leads",
      "ai-client-retention-staffing",
      "why-clients-leave-staffing-agencies",
      "client-retention-playbook",
    ],
  },

  /* ---------------------------------------------------------- analytics */
  {
    path: "/platform/analytics",
    metaTitle: "Staffing Analytics: Run the Firm on Real Numbers",
    description:
      "Activity and conversion per recruiter, margin per desk, permissions that follow the org chart, and a forecast built from live pipeline rather than last year.",
    h1: "Run the firm on numbers, not on last month's report",
    dek: "Every recruiter's activity, every desk's margin, and a forecast you can plan headcount against.",
    eyebrow: "04 · Analytics",
    crumbs: [PLATFORM_CRUMB],
    intro: [
      "Most staffing reporting was built to answer what happened last month, because that is what the accounts need. Those reports then get repurposed as management tools, which they were never designed to be. Revenue reporting and operating reporting are different jobs and should be different screens.",
      "The numbers that move a week are leading ones: live submissions, interviews scheduled, offers in play, and receivables past 60 days. Fill rate and time-to-fill are quarterly quality signals and produce anxiety rather than decisions when checked daily.",
    ],
    blocks: [
      {
        h: "Per recruiter, per desk",
        body: "Activity and conversion per head, and where to coach. Activity metrics measure effort rather than output, so they are shown next to the conversion they are supposed to produce rather than on their own.",
        points: [
          { t: "People and org planning", d: "Revenue, bonus, salaries, team allocation and headcount in one view." },
          { t: "Permissions and access", d: "Control who sees which desks, clients and conversations. The controls that stop two desks tripping over each other are the same ones that keep data where it belongs." },
          { t: "1,200+ custom reports", d: "Build the view your board asks for, then save it." },
        ],
      },
      {
        h: "A forecast from live pipeline",
        body: "Offers in play multiplied by your own historical offer-to-join rate, not an industry average, gives a revenue picture four to six weeks ahead of the P&L. That is a number you can plan headcount against.",
      },
    ],
    faq: [
      {
        q: "Which staffing KPIs should an owner check daily?",
        a: "Four: live submissions this week, interviews scheduled read as a ratio against submissions, offers in play, and receivables past 60 days. Each one moves before the outcome it predicts.",
      },
      {
        q: "Why not run the week on fill rate and time-to-fill?",
        a: "Both are useful and neither is actionable daily. Time-to-fill is measured from a start point you often do not control to an end point the client entirely controls. Fill rate moves on noise week to week because the denominator is small.",
      },
      {
        q: "Are recruiter activity metrics worth measuring?",
        a: "Only next to the conversion they are meant to produce. Rewarding activity on its own produces predictable dysfunction: more calls, more submissions, and no more placements.",
      },
      {
        q: "How do permissions work across multiple desks?",
        a: "Roles decide which desks, clients and conversations each person can open, which is the same mechanism that prevents two desks contacting the same candidate and the same mechanism that keeps client data compartmentalised.",
      },
    ],
    reading: [
      "staffing-kpis-four-numbers-daily",
      "recruiter-productivity-myth",
      "candidate-ownership-rules-multi-desk",
      "ai-in-rpo-delivery",
    ],
  },

  /* ------------------------------------------------------- integrations */
  {
    path: "/integrations",
    metaTitle: "ATS Integrations: 400+ Connections and an Open API",
    description:
      "Job portals, messaging, calendars, assessments and finance systems, plus an open read-write API. Which connections sync both ways, and which only pull in.",
    h1: "400+ pre-built integrations and an open read-write API",
    dek: "Job portals, messaging, calendar, assessment, interview and finance systems, connected in both directions where that is what the work requires.",
    eyebrow: "Integrations",
    crumbs: [],
    intro: [
      "The question that decides whether an integration is useful is not whether it exists. It is whether data flows in both directions. A one-way integration pulls data in, which means your team still works in the source system for anything that involves writing back.",
      "The list below is the honest split. Job portals, assessment platforms, interview tools and calendars are one-way by nature, because they are the system of record for their own data. Messaging, email and collaboration are where two-way sync earns its keep.",
    ],
    blocks: [
      {
        h: "Two-way where it matters",
        body: "Email, WhatsApp and LinkedIn thread onto the candidate and client record and write back out from it, so the conversation lives in one place rather than on individual recruiters' phones.",
      },
      {
        h: "One-way where that is correct",
        body: "Job portals including Naukri, assessment platforms, interview tools and calendars feed in. Applications, full profiles and CVs come across, and duplicates are resolved against your existing database at the point of entry rather than through periodic cleanup.",
      },
      {
        h: "The open API for everything else",
        body: "A read-write API covers what no pre-built connector will: the client's own system, an internal tool, a finance stack nobody else integrates with. If your desk depends on something the platform does not yet have, we build it during the migration window.",
      },
    ],
    faq: [
      {
        q: "What is a two-way ATS integration?",
        a: "One where data flows in both directions, so a change made in either system appears in the other. A one-way integration only pulls data in, which means your team still has to work in the source system for anything that involves writing back.",
      },
      {
        q: "Which ATS integrations are usually one-way?",
        a: "Job portals, assessment platforms, interview tools and calendars typically flow in one direction, because they are the system of record for their own data. Messaging, email and collaboration tools are where two-way sync matters and is worth paying for.",
      },
      {
        q: "Does Sortinghat integrate with Naukri?",
        a: "Yes, natively, alongside WhatsApp threading onto the candidate record. Duplicates are handled at the point of entry rather than through periodic cleanup.",
      },
      {
        q: "How often should an ATS sync with connected tools?",
        a: "Real time for anything a recruiter acts on during the day, such as messages, email and calendar. Batch or scheduled sync is acceptable for reporting feeds and analytics, where a few hours of lag changes nothing.",
      },
      {
        q: "What should you ask a vendor about integrations before signing?",
        a: "Six things: is it one-way or two-way, what is the sync frequency, which specific fields map, does it cost extra now or at renewal, who maintains it when the other vendor changes their API, and what does the open API cover for everything not on the list.",
      },
      {
        q: "Why does WhatsApp integration matter for recruitment in India?",
        a: "Because it is the channel most candidates actually respond on. Without it threaded into the candidate record, the majority of the conversation history sits on individual recruiters' phones and leaves the firm when they do.",
      },
    ],
    reading: [
      "ats-integrations-one-way-two-way",
      "recruiter-admin-time-automatic-capture",
      "best-ats-staffing-firms-india",
      "candidate-response-rates-by-channel",
    ],
  },

  /* ----------------------------------------------------------- migration */
  {
    path: "/migration",
    metaTitle: "ATS Migration: Switch Without Losing Your Notes",
    description:
      "Two weeks, with notes, calls, attachments and submission history carried across and validated before go-live. What breaks in a migration and who should own it.",
    h1: "Switch without losing ten years of notes",
    dek: "Two weeks. Week one is export, field mapping and validation while your team keeps billing. Week two is your own environment and full validation before sign-off.",
    eyebrow: "Migration",
    crumbs: [],
    intro: [
      "Most firms who lose data in a migration lose it because the vendor sent an export file rather than running a migration. Notes, call history, attachments, submission and placement history all carry across when someone handles the mapping and validation properly, and none of it does when nobody owns that work.",
      "Implementation, migration and training are included in the licence here rather than quoted as professional services. That is a commercial position rather than a technical one, and it is worth checking against whatever else you are comparing.",
    ],
    blocks: [
      {
        h: "Week one: export, map, validate",
        body: "Field mapping is decided rather than discovered. Your team keeps billing throughout, because nothing changes in the system they are working in until the mapping is agreed.",
      },
      {
        h: "Week two: your environment, then sign-off",
        body: "Your own environment, populated and validated by your team before go-live rather than after. Cutover happens with no downtime.",
      },
      {
        h: "What to clean, and what not to",
        body: "Clean the active segment, archive the historical one, and delete records with no reachable contact and no placement history. Trying to clean everything first is the most common reason migrations slip by months.",
      },
    ],
    faq: [
      {
        q: "How long does an ATS migration take?",
        a: "Two weeks with Sortinghat, including validation before go-live. Complex long-tenured instances with heavy customisation take longer to map, and we scope that before committing rather than after.",
      },
      {
        q: "Will I lose my notes when I switch ATS?",
        a: "You should not, and most firms do because the vendor sent an export file rather than running a migration. Notes, call history, attachments and submission history all carry across when someone handles the mapping and validation properly.",
      },
      {
        q: "What does an ATS migration cost?",
        a: "It varies widely and is frequently quoted separately from the licence. With Sortinghat, implementation, migration and training are included rather than billed as professional services.",
      },
      {
        q: "What is the hardest ATS to migrate from?",
        a: "Bullhorn and Ceipal, for different reasons. Bullhorn's object model does not map one to one and long instances carry heavy customisation. Ceipal's standard export omits activity history and some attachment types.",
      },
      {
        q: "Should you clean your data before migrating?",
        a: "Partially. Clean the active segment, archive the historical one, and delete records with no reachable contact and no placement history. Trying to clean everything first is the most common reason migrations slip by months.",
      },
      {
        q: "Does payroll and timesheet history transfer?",
        a: "Assignment and timesheet history carry across and are validated explicitly. Because Sortinghat carries back office, this moves with the front office rather than being left behind.",
      },
    ],
    reading: [
      "ats-migration-guide",
      "duplicate-candidate-records-database-hygiene",
      "ats-integrations-one-way-two-way",
      "why-your-ats-demo-lied",
    ],
  },

  /* ------------------------------------------------------------ pricing */
  {
    path: "/pricing",
    metaTitle: "Sortinghat Pricing: One Licence, No Module Quotes",
    description:
      "How Sortinghat is priced: a single licence with implementation, migration and training included, and no separate quote for AI, automation or analytics.",
    h1: "One licence. The AI is in the platform, not on the invoice",
    dek: "There is no published rate card on this page, because the number depends on your seat count and desk mix. What is published here is the shape of the bill, which is the part that surprises people.",
    eyebrow: "Pricing",
    crumbs: [],
    intro: [
      "The headline price of an ATS is rarely the price of a working setup. Most vendors publish an entry tier and quote AI search, automation, analytics, SMS and onboarding on top, so two firms on the same platform can pay very different amounts for what they both describe as the product.",
      "We do not publish a rate card, and we would rather say that plainly than print a number that is wrong for most readers. What we can state is what is inside the licence and what is not, which is the comparison that actually decides the total.",
    ],
    blocks: [
      {
        h: "Inside the licence",
        body: "One platform, one licence, no second vendor contract required.",
        points: [
          { t: "The AI, not as an add-on", d: "Plain-language search, voice and video screening, AI interviews and the notetaker are in the platform rather than quoted separately." },
          { t: "Front and back office", d: "Pay-and-bill, timesheets and invoicing, rather than a separate finance module." },
          { t: "Implementation, migration and training", d: "Included, rather than billed as professional services on top of year one." },
          { t: "400+ integrations and the open API", d: "Included, rather than metered per connector." },
        ],
      },
      {
        h: "How to compare it to anything else",
        body: "Ask every vendor for a three-year total that includes the licence, implementation, migration, training, every module you would actually license, and renewal escalation. Then add the recruiter hours the platform does or does not remove, and the job portal spend it does or does not displace. Those two lines are usually larger than the invoice and never appear on it.",
      },
      {
        h: "Getting a number",
        body: "Bring a live role and a sample of your database to a demo. We will run the search, build the scorecard and show you the shortlist against your own criteria, and quote against your actual seat count and desk mix rather than a tier.",
      },
    ],
    faq: [
      {
        q: "How much does Sortinghat cost?",
        a: "We quote against seat count and desk mix rather than publishing a rate card, because the tier a firm would actually use varies more than the list price suggests. What is fixed is what the licence includes: the AI capabilities, front and back office, implementation, migration, training and the integrations.",
      },
      {
        q: "Does Sortinghat require any other platform licence?",
        a: "No. It is a single platform with a single licence, including full front and back office and 400+ pre-built integrations. Salesforce-based systems require a second contract, which is worth including in any comparison.",
      },
      {
        q: "Is the AI an add-on?",
        a: "No. Voice and video screening, AI interviews, plain-language search and the call notetaker are in the platform. Several vendors deliver equivalent capability as separately quoted modules arranged with an account manager.",
      },
      {
        q: "What does implementation and migration cost?",
        a: "Nothing beyond the licence. Implementation, migration and training are included rather than billed as professional services, which is the line most commonly quoted separately elsewhere.",
      },
      {
        q: "What should a staffing firm compare on when pricing an ATS?",
        a: "A three-year total including implementation, migration and every module you would license, plus renewal escalation. Then the two costs that are not on the invoice: recruiter hours and job portal spend.",
      },
    ],
    reading: [
      "ats-pricing-2026",
      "sortinghat-vs-bullhorn",
      "best-ats-staffing-firms-india",
      "cfo-ai-contract-clauses",
    ],
  },

  /* -------------------------------------------------------------- about */
  {
    path: "/about",
    metaTitle: "About Sortinghat: What This Site Is and Covers",
    description:
      "Sortinghat is an AI-native ATS and CRM for staffing firms. This site is the product and a 125-post library on staffing operations, pricing, market data and AI.",
    h1: "What Sortinghat is, and what this site now covers",
    dek: "A plain statement of the company, the product, the editorial standard behind 125 articles, and who all of it is for.",
    eyebrow: "About",
    crumbs: [],
    intro: [
      "Sortinghat is an AI-native applicant tracking system and CRM for staffing, search and RPO firms, built in Bengaluru and used by firms up to 400+ employees. It carries the front office and the back office in one platform: sourcing, screening, the client relationship, pay-and-bill, timesheets and invoicing.",
      "This site is now two things rather than one. It is the product, described page by page rather than as a single scrolling pitch. And it is a library of 125 articles on how staffing firms actually operate, published between June and August 2026 — which is the part most people arrive at first, and the part this page exists to define.",
    ],
    blocks: [
      {
        h: "What the writing covers",
        body: "Ten subject areas, each a standing section rather than a tag: side-by-side comparisons of the platforms staffing firms evaluate; what AI changes segment by segment, from sourcing to RPO to back office; market data on GCCs, BPO, mid-tier IT services and the US staffing cycle; how the work differs by role type, from blue collar to leadership search; arguments the industry avoids making out loud; the rules a firm operates inside, from the EU AI Act to India's DPDP Act to contract labour; growing revenue without adding heads; and selling a desk across borders.",
      },
      {
        h: "The standard the articles are held to",
        body: "Every headline figure is traced to where it came from. Market numbers are attributed to NASSCOM, Zinnov, Staffing Industry Analysts or the US Bureau of Labor Statistics and linked to the source. Operating numbers come from the platform and say so. Where the variation inside a market exceeds the variation between markets, the post publishes no average and explains why: notice periods in India and recruitment fees by country are both handled that way rather than reduced to a figure that would be quoted as a benchmark it cannot support.",
      },
      {
        h: "Where the writing argues against its own category",
        body: "Several articles here make the case that the product category is oversold. Most AI recruiting tools change no number on a staffing P&L. Nobody needs another resume screener. There is a list of twelve things automation still cannot do in recruitment, and a piece on why claimed AI adoption in staffing far exceeds anyone actually using it. Those pages exist because a library that only argues one way is advertising.",
      },
      {
        h: "Who it is for",
        body: "Owners and operators of staffing, search and RPO firms, mostly between five and five hundred people, in India, the US, the UK, Europe, Australia and the Gulf. Not HR teams hiring for themselves, and not candidates.",
      },
    ],
    faq: [
      {
        q: "What does Sortinghat do?",
        a: "It is an AI-native ATS and CRM for staffing, search and RPO firms: one platform carrying the talent pool, the workflow between stages, the client CRM and the analytics, plus pay-and-bill, timesheets and invoicing.",
      },
      {
        q: "Who writes the articles on this site?",
        a: "Apoorv Tamrkar, the founder. Every post carries the byline and the same author entity, and the author page sets out what the writing is based on.",
      },
      {
        q: "Where do the numbers in the articles come from?",
        a: "Two sources, kept distinct. Market figures are attributed to NASSCOM, Zinnov, Staffing Industry Analysts or the US Bureau of Labor Statistics and linked. Operating figures come from the platform, including an audit of 3 million candidate records at one firm and channel response rates measured across live roles.",
      },
      {
        q: "Is this site the product or a blog?",
        a: "Both, deliberately. The product pages describe what the platform does and where it stops. The 125 articles cover staffing operations generally, including subjects the product has nothing to do with and comparisons where an incumbent genuinely wins.",
      },
      {
        q: "Where is Sortinghat based?",
        a: "Bengaluru, India, with customers placing into India, the US, the UK, Europe, Australia and the Middle East.",
      },
    ],
    reading: [
      "talent-pool-software-database-first-sourcing",
      "most-ai-recruiting-tools-do-nothing",
      "ats-pricing-2026",
      "india-gcc-landscape-2026-staffing",
    ],
  },
];

export const PAGE_BY_PATH = new Map(PAGES.map((p) => [p.path, p]));

/** The four platform sub-pages, in the order the homepage introduces them. */
export const PLATFORM_PAGES = PAGES.filter((p) =>
  p.path.startsWith("/platform/"),
);
