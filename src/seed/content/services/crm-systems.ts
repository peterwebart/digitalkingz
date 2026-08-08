import type { ServiceSeed } from '@/seed/types'

const service: ServiceSeed = {
  slug: 'crm-systems',
  category: 'automate',
  title: 'CRM & Marketing Automation',
  navLabel: 'CRM & Automation',
  tagline: 'Where leads become pipeline instead of quietly dying in an inbox.',
  icon: 'Workflow',
  metaTitle: 'CRM and Marketing Automation That Closes the Loop',
  metaDescription:
    'CRM and marketing automation built around the lead-to-revenue pipeline: lifecycle stages, lead scoring, follow-up sequences, source attribution and reporting.',
  heroEyebrow: 'Revenue Operations',
  heroHeading: 'Most Leads Are Not Lost to Competitors. They Are Lost to Inboxes.',
  heroSubheading:
    'A CRM is not contact storage. It is the system that decides whether the money you spent earning attention ever becomes revenue, and whether anyone in the business can tell you which spending worked.',
  intro: [
    'Acquiring a lead is the expensive part. Following one up is nearly free. Most businesses invest heavily and deliberately in the first, then handle the second with whatever attention happens to be available that week. The result is a pipeline where the largest single source of lost revenue is not competitive defeat but silence, and silence never appears on any report.',
    'A CRM properly implemented is the operating system for that pipeline. It records what happened, decides who owns what, enforces the follow-up that would otherwise depend on memory, and preserves the link between the click that started everything and the invoice that ended it. Without that link, every conversation about where to spend next quarter is a conversation about opinions.',
    'Implementations fail for a predictable reason. They get designed for the person who wants the reports rather than the person doing the work, arriving as a wall of required fields that make an already busy day slower. Adoption collapses, the sales team retreats to a personal inbox, and the business now pays a license fee for a database that is confidently wrong.',
  ],
  problemsHeading: 'Why the Pipeline Leaks Between Enquiry and Invoice',
  problems: [
    {
      title: 'Follow-Up That Stops After Two Attempts',
      body: 'A prospect who did not reply immediately is not uninterested, they are busy. Most deals need more contact than an untracked process ever delivers, because the third and fourth attempts depend entirely on someone remembering. Every lead abandoned at attempt two was fully paid for at acquisition and produced nothing.',
    },
    {
      title: 'A Pipeline Nobody Believes',
      body: 'Stages that different people interpret differently, deals sitting untouched for months, and a forecast assembled from optimism the week it is due. When the numbers cannot be trusted, decisions about hiring, capacity and media spend get made on instinct, and the CRM becomes something people update before meetings.',
    },
    {
      title: 'No Line Between Spend and Revenue',
      body: 'Source information is captured on the form and then discarded at the handoff, so closed deals carry no memory of which campaign, keyword or channel produced them. Budget then gets allocated on cost per enquiry, which reliably favors the channel producing the cheapest and least valuable leads.',
    },
    {
      title: 'A System Built for Reporting, Not for Selling',
      body: 'Dozens of mandatory properties, workflows that fire at the wrong moment, and a layout that takes six clicks to log a call. The people expected to maintain it are the ones it slows down most, so they stop. Data quality degrades, and every report built on top of it inherits the damage.',
    },
  ],
  includedHeading: 'What a CRM Engagement Includes',
  includedIntro:
    'We implement around how your business actually sells, not around a template. The measure of success is whether the people using it daily would object to having it taken away.',
  included: [
    {
      title: 'Pipeline and Lifecycle Design',
      body: 'Stages defined by observable exit criteria rather than by feeling, so moving a deal forward means something specific happened. Separate pipelines where the sales motions genuinely differ, and a single one where they do not.',
    },
    {
      title: 'Lead Capture and Source Attribution',
      body: 'Campaign parameters persisted across the session, stored as hidden fields, and written onto the contact and deal record, so first touch and last touch survive the journey from advertisement to closed revenue.',
    },
    {
      title: 'Lead Scoring and Routing',
      body: 'Scoring that combines fit criteria such as industry, size and service need with behavioral signals such as pages viewed and forms completed, feeding routing rules that put each enquiry in front of the right person quickly.',
    },
    {
      title: 'Automated Follow-Up Sequences',
      body: 'Multi-step cadences across email and messaging that continue until someone replies or the sequence completes, with sensible exits so a prospect already in conversation never receives an automated nudge as though nothing happened.',
    },
    {
      title: 'Sales Enablement Inside the System',
      body: 'Task queues, templates, call logging, meeting sync and reminders configured so using the CRM is faster than working around it. Adoption is an interface problem before it is a discipline problem.',
    },
    {
      title: 'Reporting Someone Will Actually Read',
      body: 'A small number of numbers that drive decisions: source to revenue, cost per qualified lead, stage conversion, time to first response, deals stalling and why. Everything else stays available and stays out of the way.',
    },
    {
      title: 'Data Hygiene and Integrations',
      body: 'Deduplication rules, required-field discipline kept to what is genuinely required, webhook routing between your website, calendar, invoicing and support tools, and a documented map of what writes to what. Duplicate records get merged rather than tolerated.',
    },
  ],
  approachHeading: 'How We Implement',
  approach: [
    {
      step: '01',
      title: 'Map How You Actually Sell',
      body: 'We sit with the people handling enquiries and document the real sequence, including the informal steps nobody wrote down. Software that contradicts the working process loses, so the process gets described honestly before anything is configured. The informal workaround usually contains the real requirement.',
    },
    {
      step: '02',
      title: 'Design Stages Around Decisions',
      body: 'Each stage gets an entry condition, an exit condition and an owner. Stages that exist only to describe internal activity are removed, because a pipeline that measures effort rather than buyer commitment cannot produce a usable forecast. Two people should place the same deal in the same stage without conferring.',
    },
    {
      step: '03',
      title: 'Wire the Website in Properly',
      body: 'Forms, booking flows and any AI intake are connected so a submission becomes a complete record with source data intact, assigned owner, first response timer and the conversation history attached rather than sitting in a notification email. Source data survives the handoff, which is what makes attribution possible later.',
    },
    {
      step: '04',
      title: 'Automate What Does Not Need a Person',
      body: 'Immediate acknowledgment, task creation, reminders, nurture for prospects who are months away, and re-engagement for deals that went quiet. Automation covers the persistence humans forget while leaving the judgment where it belongs. Sequences exit the moment a real conversation starts, so nobody is nudged mid-negotiation.',
    },
    {
      step: '05',
      title: 'Build the Report, Then Build the Habit',
      body: 'A weekly view the owner and sales lead genuinely use, plus a short operating rhythm around it. Data quality is sustained by the reporting people rely on, never by asking them to be more diligent. People maintain a system that gives them something back.',
    },
  ],
  outcomesHeading: 'What Improves Once the Pipeline Is Instrumented',
  outcomesIntro:
    'The gains come from recovering revenue that was already inside the business, rather than from generating more demand at the front of the funnel.',
  outcomes: [
    {
      title: 'Fewer Leads Lost to Silence',
      body: 'Persistence stops depending on who remembered. Every enquiry gets acknowledged, assigned and followed up on a defined cadence, which recovers opportunities you had already paid to create. The recovery usually shows up inside the first month.',
    },
    {
      title: 'A Forecast That Means Something',
      body: 'When stages have real exit criteria and records stay current, pipeline value becomes a number you can plan capacity and hiring against instead of a figure assembled the morning of the meeting.',
    },
    {
      title: 'Budget Allocated on Evidence',
      body: 'Knowing which channels produce closed revenue rather than the cheapest enquiries changes where the next increment of spend goes, and usually reveals that the cheapest source was never the most profitable one.',
    },
    {
      title: 'A Business Less Exposed to Departures',
      body: "Relationship history, next steps and commitments live in a shared system rather than in one person's inbox, which reduces how much walks out of the door when somebody leaves. Continuity becomes a property of the company rather than of an individual.",
    },
  ],
  deepDive: [
    {
      heading: 'Why Leads Die in Inboxes',
      paragraphs: [
        'Consider what an unanswered enquiry actually represents. Someone paid for the impression, the click and the site visit. Someone built the page that persuaded the visitor to complete a form. The prospect then raised a hand, and the process failed at the cheapest step in the entire chain. That is why follow-up discipline returns more per unit of effort than almost any acquisition work available to a business. No competitor beat you to it. Nobody did anything at all.',
        'The failure is rarely negligence. A busy team responds to the enquiry in front of them, and the one from four days ago moves down the screen. Attempts stop at two or three, not because anyone decided to stop, but because nothing in the system insisted otherwise. Meanwhile the prospect who was genuinely interested but travelling that week concludes you were not that interested either. Nothing in the process failed loudly enough for anyone to notice.',
        'A sequence solves the part of this that is mechanical. Acknowledgment immediately, a defined cadence across channels, escalation when a lead scores highly, and a clean exit the moment a real conversation begins. It also produces something more valuable than the recovered deals: a record of exactly how many attempts your business makes, which is a number most owners have never seen, and one they almost always overestimate before it is measured.',
      ],
    },
    {
      heading: 'Lifecycle Stages, Lead Scoring and the Handoff to Sales',
      paragraphs: [
        'Lifecycle stages only work when each one has an observable definition. A stage that means somebody feels good about the deal is not a stage, it is a mood, and a pipeline built from moods produces a forecast that fails without warning. The useful test is whether two different people looking at the same record would place it identically. When they would not, the definitions need work before any automation is layered on top.',
        'Scoring should combine fit and behavior, because either alone misleads. A perfect-fit company that has read one page is not ready, and an enthusiastic browser who cannot buy what you sell is not an opportunity. Fit criteria come from your closed-won history: which industries, sizes, service needs and urgency levels actually convert. Behavior adds timing. Together they answer who to call first this morning, which is the only question the scoring model needs to answer well.',
        'The handoff is where context is most often lost. A salesperson who receives a name and an email address begins cold, while one who receives the pages viewed, the campaign that produced the enquiry, the intake answers and a summary of any AI conversation begins informed. That handoff quality is a conversion variable in its own right, and it depends on the connections between the website, the automation layer and the CRM being designed rather than improvised.',
      ],
    },
    {
      heading: 'Attribution Is a CRM Problem Before It Is an Advertising Problem',
      paragraphs: [
        'Ad platforms can only report what they can observe, which is the click and whatever event fires on your site. They cannot know that the enquiry was unqualified, that the deal closed at half the usual value, or that the customer cancelled in month two. All of that lives in the CRM, and if it never travels back, your optimization decisions are being made on a partial view of the outcome.',
        'The mechanics are unglamorous and decisive. Persist campaign parameters through the session so they survive multiple page views. Write first touch and last touch onto the record. Keep a self-reported attribution field on forms, because buyers often name a source no tracking script will ever capture. Then push closed outcomes back out through offline conversion imports so Google Ads and Meta learn which conversations became revenue rather than which produced form fills.',
        'This is what makes the wider system coherent. Brand creates recognition, SEO and paid media create traffic, conversion optimization turns traffic into enquiries, the CRM turns enquiries into pipeline, and the outcomes flow back to make the media smarter. Your website should not exist in isolation, and the CRM is the component that closes the circuit rather than leaving each channel to be judged on its own flattering dashboard. Closing that circuit is what turns separate marketing activities into a single system.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Which CRM should we use?',
      answer:
        'The one your team will maintain, which usually means the simplest system that supports your actual sales motion. Selection should be driven by how many pipelines you run, whether you need marketing automation in the same platform, what your invoicing and support tools integrate with, and the total cost once every seat and required tier is counted. We are not tied to a single vendor, and we would rather implement a modest platform well than an ambitious one that nobody adopts.',
    },
    {
      question: 'We already have a CRM and nobody uses it. What would change?',
      answer:
        'Almost always the configuration rather than the platform. Low adoption is a symptom of a system that costs more effort than it returns to the person using it: too many required fields, stages that do not match how deals really progress, and reporting that serves management without helping the salesperson. We rebuild around the daily workflow, remove what nothing depends on, and make the reporting useful to the people entering the data.',
    },
    {
      question: 'Is marketing automation just sending newsletters?',
      answer:
        'No. Newsletters are broadcast. Marketing automation is behavior-driven sequencing tied to where someone actually sits in the buying process: an immediate acknowledgment after an enquiry, a nurture track for prospects who are months from deciding, re-engagement for deals that stalled, reminders before appointments, and internal alerts when a scored lead becomes active again. Every message is triggered by something the contact did or failed to do rather than by a publishing calendar.',
    },
    {
      question: 'How do you decide what a lead score should be?',
      answer:
        'From your closed-won and closed-lost history rather than from a template. We look at which industries, company sizes, service requirements, budget ranges and urgency signals correlate with deals you actually won, and which correlate with time wasted. Those become the fit component. Behavioral signals such as pricing page visits, repeat sessions and form completions supply timing. The model is then reviewed against outcomes, because a score nobody validates becomes superstition.',
    },
    {
      question: 'How long does a CRM implementation take?',
      answer:
        'It depends far more on process clarity than on software configuration. Mapping how you sell, agreeing stage definitions and deciding what a qualified lead means typically take longer than building it. We prefer to launch a deliberately simple version early, get the team using it, then extend once real usage exposes what is missing. Long configuration projects that go live all at once tend to encode assumptions nobody tested.',
    },
    {
      question: 'Can you connect the CRM to our website forms and ad platforms?',
      answer:
        'Yes, and that connection is usually the most valuable part of the work. Website forms, booking flows and AI intake write directly into the CRM with source data attached, calendars and inboxes sync so activity is captured without manual logging, and closed outcomes are pushed back to the ad platforms through offline conversion imports. That last step lets bidding optimize toward revenue rather than toward form submissions.',
    },
  ],
  relatedServices: ['ai-automation', 'google-ads', 'conversion-optimization', 'meta-ads'],
  relatedIndustries: ['b2b', 'professional-services', 'real-estate', 'home-services'],
  ctaHeading: 'Find Out What Your Pipeline Is Losing',
  ctaBody:
    'We will trace a recent month of enquiries from first click to final outcome and show you where they stalled, what stopped being tracked, and what that gap is costing at your deal size.',
}

export default service
