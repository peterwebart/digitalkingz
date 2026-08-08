import type { ServiceSeed } from '@/seed/types'

const service: ServiceSeed = {
  slug: 'ai-automation',
  category: 'automate',
  title: 'AI Integration & Automation',
  navLabel: 'AI & Automation',
  tagline: 'Practical AI that answers faster, qualifies better and lowers cost to serve.',
  icon: 'Bot',
  metaTitle: 'AI Integration and Automation for Business Growth',
  metaDescription:
    'AI integration and automation for lead qualification, intake, follow-up and support deflection, built with retrieval grounding, CRM routing and human review.',
  heroEyebrow: 'AI & Automation',
  heroHeading: 'AI Is Worth Deploying Where It Changes the P&L',
  heroSubheading:
    'Response time, qualification quality, cost to serve and reclaimed staff hours. Those are the places AI reliably earns its keep in a business. We build for those and stay skeptical about the rest.',
  intro: [
    'Most AI projects fail for an unglamorous reason. They start with the technology and then look for somewhere to apply it. The result is a chat widget nobody uses, a summarization tool nobody trusts, and a line item that never appears in any financial conversation. The projects that work start from a process that already costs money and ask whether software can carry part of it.',
    'In practice there are four places AI consistently pays. How quickly a new enquiry gets a real response. How accurately an enquiry is qualified and routed before a person spends time on it. How many repetitive questions get answered without occupying staff. And how many hours a week disappear into moving information between systems that were never designed to speak to each other.',
    'There is also a category of work where AI should not be left alone. Anything that quotes a price, commits to a timeline, interprets a contract, or offers advice a regulator would care about needs a person in the loop and a system designed to hand over rather than improvise. Being clear about that boundary is what separates automation that compounds from automation that eventually embarrasses you.',
  ],
  problemsHeading: 'The Operational Costs AI Is Actually Good At Removing',
  problems: [
    {
      title: 'The Enquiry Goes Cold in the First Hour',
      body: 'Buyers rarely contact one provider. They contact several, and the one who responds first frames the conversation for everyone who follows. Forms submitted in the evening, at weekends or during a busy shift sit unanswered while the prospect books someone else. The lead was paid for, captured and lost, all before anyone opened the inbox.',
    },
    {
      title: 'Qualification Done by Your Most Expensive People',
      body: 'Senior staff spend hours each week asking the same opening questions to work out whether an enquiry is worth pursuing. That work is necessary, repetitive and almost entirely scripted. Paying senior hourly value to collect a project scope, a budget range and a timeline is one of the quietest margin leaks in a service business.',
    },
    {
      title: 'The Same Twelve Questions, Forever',
      body: 'Availability, pricing structure, service areas, process, timelines, what to prepare before an appointment. Answering them individually is cost that scales linearly with growth, and because the answers live in people rather than in a system, none of it accumulates into anything reusable when someone leaves.',
    },
    {
      title: 'Automation Built on Guesswork',
      body: 'A general-purpose assistant bolted onto a website will confidently invent a price, promise a turnaround, or state a policy that does not exist. The risk is not that it looks unpolished. The risk is that a plausible sentence creates an expectation your business then has to honor or publicly walk back.',
    },
  ],
  includedHeading: 'What We Build',
  includedIntro:
    'Every deployment is scoped against a process with a measurable cost. If we cannot describe what a component saves or earns in operational terms, we do not build it.',
  included: [
    {
      title: 'A Website Assistant Grounded in Your Content',
      body: "Retrieval-augmented generation over your real service pages, policies and documentation, so answers come from approved source material rather than from a model's general knowledge. It cites what it drew on and declines when the source does not cover the question.",
    },
    {
      title: 'Lead Qualification and Intake',
      body: 'A conversational or structured intake that collects scope, budget range, timeline and urgency, scores the result against your criteria, and routes it to the right person with the context already summarized.',
    },
    {
      title: 'Instant Response and Follow-up',
      body: 'Automatic acknowledgment within seconds of an enquiry, followed by a multi-step sequence across email and messaging that continues until someone replies or a person takes over the conversation. Every message is logged against the contact record.',
    },
    {
      title: 'Appointment Booking and Calendar Orchestration',
      body: 'Live availability, qualification before a slot is offered, confirmations, reminders and rescheduling handled without a phone call, with the resulting appointment written into your CRM and the assigned calendar. Reminders and no-show follow-up run automatically.',
    },
    {
      title: 'Support Deflection and Knowledge Operations',
      body: 'Repetitive questions answered from a maintained knowledge base, with unanswered questions logged as gaps so the source material improves each month instead of the same failure recurring indefinitely. Containment and escalation rates are reported monthly.',
    },
    {
      title: 'Internal Workflow Automation',
      body: 'Webhook routing between the systems you already run, document and proposal generation, data entry removal, onboarding checklists and internal handoffs, so information stops being re-typed by people who have better things to do.',
    },
    {
      title: 'Guardrails, Evaluation and Human Escalation',
      body: 'Written rules for what the system may never state, escalation triggers for pricing, complaints and regulated topics, a test set run against every change, and full conversation logging so behavior can be audited rather than assumed.',
    },
  ],
  approachHeading: 'How We Deploy AI',
  approach: [
    {
      step: '01',
      title: 'Find the Expensive Process',
      body: 'We start with where staff time and lost enquiries actually accumulate, not with a list of possible AI features. Response times, repeated questions, manual handoffs and the tasks people describe as the worst part of their week are where the recoverable cost sits.',
    },
    {
      step: '02',
      title: 'Write the Rules Before the Prompts',
      body: 'What the system is allowed to say, what it must never state, when it hands to a human, and what a good answer looks like. This is policy work rather than engineering work, and skipping it is why most deployments quietly get switched off.',
    },
    {
      step: '03',
      title: 'Ground It in Real Source Material',
      body: 'Answers are retrieved from your documented services, pricing logic, policies and process notes. Where the documentation does not exist, we write it first, because an assistant is only ever as accurate as the material it is permitted to read. That documentation becomes an asset the business owns regardless of who wrote it.',
    },
    {
      step: '04',
      title: 'Put a Human at Every Consequential Edge',
      body: 'Quotes, complaints, regulated advice, contractual commitments and anything emotionally sensitive escalate to a person with the full conversation attached. The system is designed to hand over gracefully rather than to improvise its way through. Escalations arrive with a summary attached, so the person picking it up is not starting from nothing.',
    },
    {
      step: '05',
      title: 'Measure, Then Extend',
      body: 'Response time, containment rate, qualification accuracy, escalation reasons and hours reclaimed are tracked from launch. Each subsequent build is justified by what the previous one demonstrably saved, which keeps the program tied to operations rather than to enthusiasm. Anything that fails to earn its running cost gets switched off.',
    },
  ],
  outcomesHeading: 'What Changes in the Business',
  outcomesIntro:
    'The gains from automation are operational before they are strategic. They show up first as time returned to people and enquiries that no longer expire unanswered.',
  outcomes: [
    {
      title: 'Enquiries Answered While Everyone Sleeps',
      body: 'Every enquiry receives a real, relevant response immediately, whatever the hour, so the prospect who submitted a form at midnight is still yours to win in the morning. Speed of first response is the cheapest competitive advantage most businesses have available.',
    },
    {
      title: 'Senior Time Returned to Senior Work',
      body: 'The scripted portion of qualification is handled before anyone picks up the phone, so experienced people arrive at conversations already briefed and spend their hours on the part only they can do.',
    },
    {
      title: 'Cost to Serve That Stops Scaling With Volume',
      body: 'Repetitive questions get answered by a system rather than a salary, which means growth no longer requires a proportional increase in administrative headcount to absorb it. Margin holds as volume rises instead of eroding quietly.',
    },
    {
      title: 'Institutional Knowledge That Persists',
      body: 'Documenting what the system may say forces the business to write down how it actually operates, which turns knowledge held informally by long-serving staff into an asset the company owns.',
    },
  ],
  deepDive: [
    {
      heading: 'Speed to Lead Is the Highest-Return Automation Available',
      paragraphs: [
        'Before anything sophisticated, most businesses have an unexploited advantage in simply responding first. Buyers researching a service typically contact more than one provider in a single sitting, and the first substantive reply anchors the comparison. It sets the framing, gets the first appointment offered and often ends the search. Everyone else is then competing against an incumbent conversation rather than a blank slate. Being second is not half as good as being first, it is materially worse.',
        'The failure is structural rather than lazy. Enquiries arrive at the times people are least available: evenings, weekends, and the middle of a busy working day. A form submitted at nine on a Saturday night that gets a reply on Monday morning has been dead for thirty-six hours, and the media budget that produced it was spent regardless. This is the cheapest thing to fix and the most commonly ignored.',
        'The automation required here is not clever. An immediate, specific acknowledgment, a short qualification exchange, an offer of real available times, and a persistent follow-up sequence that stops the moment a human takes over. What makes it valuable is not the intelligence of the response but its consistency, and consistency is precisely what a system provides and a busy team cannot. Nobody has to remember anything for it to keep working, which is the entire point.',
      ],
    },
    {
      heading: 'Where AI Should Not Be Trusted Without a Human',
      paragraphs: [
        'Language models generate plausible text, which is a different property from generating true text. Left ungrounded, an assistant will state a price it inferred, a lead time it invented, or a policy that sounds like something your industry might have. The output is fluent and confident, and that fluency is the danger, because customers reasonably treat statements on your website as commitments made by your business. Fluency is not accuracy, and a customer cannot tell the difference.',
        'Grounding is the primary control. Retrieval-augmented generation restricts answers to content you have approved, and the system is configured to say it does not know and route to a person when the source material does not cover the question. That refusal behavior is a feature worth engineering deliberately, and it is tested with an evaluation set that runs against every change so a prompt adjustment cannot silently break something that used to work.',
        'Some categories should escalate every time regardless of confidence. Specific quotes, contractual terms, complaints, anything a regulator governs, and anything where a customer is upset. In regulated fields such as legal, medical and dental practices, the correct role for AI is intake, scheduling and answering procedural questions, while advice remains with the licensed professional. Being explicit about that boundary is what makes the rest of the system safe to deploy.',
      ],
    },
    {
      heading: 'AI Plugs Into the CRM, It Does Not Replace It',
      paragraphs: [
        'An assistant is an interface, not a system of record. The conversation it has needs to become a contact, a lifecycle stage, a lead score, an owner and a follow-up task inside your CRM systems, or the intelligence evaporates the moment the browser tab closes. This is where most deployments underdeliver: the conversation was excellent and nothing durable happened as a result of it. A transcript is not a pipeline, and a notification email is not a follow-up process.',
        'Done properly, the chain runs from the website to the assistant to the CRM to the sales conversation, with source attribution intact the whole way. That attribution then feeds back into paid media through offline conversion imports, so Google Ads and Meta learn which conversations produced revenue. Your website should not exist in isolation, and neither should the automation layer sitting on top of it. Every step should make the step after it cheaper to complete.',
        'The same logic applies internally. Automating a workflow that ends in a spreadsheet nobody opens produces activity rather than leverage. We build toward the systems your business already uses to run itself, connecting them with webhook routing and clean data contracts, so the output of every automated step is something an actual process consumes. The test we apply before building anything is simple: name the person or system that consumes the output, and describe what they do differently because of it.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Will an AI assistant make things up about our business?',
      answer:
        'It will if you deploy a general-purpose model without constraints, which is why we do not. Answers are retrieved from your approved content rather than generated from general knowledge, the assistant is configured to decline and escalate when the source material does not cover a question, and sensitive categories such as pricing, contracts and complaints always route to a person. Behavior is verified against a test set before every change goes live and every conversation is logged for review.',
    },
    {
      question: 'Do we need AI, or do we just need better automation?',
      answer:
        'Often the second, and we will tell you when that is the case. Deterministic automation is cheaper, more predictable and easier to audit, so anything with fixed rules should be built that way: routing, reminders, sequences, data transfer, booking logic. AI earns its place where the input is unstructured language, such as understanding what an enquiry is actually asking for, summarizing a conversation, or answering questions phrased in a hundred different ways.',
    },
    {
      question: 'Will this replace members of our team?',
      answer:
        'In our experience it changes what they spend the day on rather than removing the role. The tasks that automate well are the scripted ones: initial acknowledgment, collecting standard details, answering repeat questions, moving data between systems. What remains is judgment, relationship and the parts of the work customers are actually paying for. The realistic outcome is absorbing more volume without adding administrative headcount at the same rate.',
    },
    {
      question: 'What does it cost to run an AI system like this?',
      answer:
        'Costs fall into three parts: the initial build, ongoing model usage that scales with conversation volume, and maintenance as your services and content change. The useful comparison is not the invoice but the cost of the process it replaces, measured in staff hours, response delay and enquiries lost outside working hours. We scope every deployment against that baseline so the decision is a return calculation rather than a technology purchase.',
    },
    {
      question: 'How do you keep it accurate as our business changes?',
      answer:
        'The source content becomes the control surface. Because answers are retrieved from your documented services, policies and pages, updating the documentation updates the assistant, and no prompt engineering is required to change a price list or a service area. Unanswered and escalated questions are logged and reviewed as content gaps, so the knowledge base improves on a schedule instead of drifting quietly out of date.',
    },
    {
      question: 'What happens to customer data in these systems?',
      answer:
        'It is a design decision made before the build, not an afterthought. We define what is collected, where it is stored, which vendors process it, how long it is retained and whether it can be used for model training, then configure the stack to match. For businesses handling health, legal or financial information, the architecture is scoped around the obligations you already operate under, and sensitive data paths are kept out of components that do not need them.',
    },
  ],
  relatedServices: ['crm-systems', 'conversion-optimization', 'web-development', 'seo'],
  relatedIndustries: ['home-services', 'medical', 'law-firms', 'professional-services'],
  ctaHeading: 'Start With the Process That Costs You Most',
  ctaBody:
    'Tell us where enquiries stall and where your team loses hours each week. We will map which parts are worth automating, which are not, and what the first build should be.',
}

export default service
