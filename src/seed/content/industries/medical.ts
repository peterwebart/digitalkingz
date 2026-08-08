import type { IndustrySeed } from '@/seed/types'

const industry: IndustrySeed = {
  slug: 'medical',
  title: 'Medical Practices & Clinics',
  navLabel: 'Medical',
  tagline: 'Provider-level search, privacy-aware measurement and booking systems that fill clinical capacity.',
  icon: 'Stethoscope',
  metaTitle: 'Medical Practice Marketing & SEO Systems | Digital Kingz',
  metaDescription:
    'Growth systems for medical practices: provider-level SEO, privacy-aware measurement, and booking and recall automation aimed at the capacity that pays.',
  heroEyebrow: 'Industries / Medical',
  heroHeading: 'Growth Systems for Practices Where Capacity, Not Demand, Is the Constraint',
  heroSubheading:
    'Provider-level search architecture, measurement designed around health privacy obligations, and booking, reminder and recall automation pointed at the appointments that actually produce margin.',
  intro: [
    'Most medical practices run two businesses on one marketing budget. Insured service lines are reimbursement-capped, so revenue moves with payer mix, procedure mix and schedule utilization rather than with raw patient volume. Cash-pay lines behave like consumer purchases, with genuine price sensitivity, active comparison shopping and an acquisition cost that can be justified directly. Marketing that treats both the same underperforms both.',
    'The constraint is rarely awareness. It is clinical capacity and how well it is used. An unfilled slot cannot be recovered, a no-show costs an empty room plus the staff time chasing it, and a schedule packed with low-margin visits while a high-margin line runs half empty still looks full on paper. Demand generation has to be aimed at the gaps.',
    "Health also carries obligations no other vertical shares. Information about a person's care is protected by privacy legislation that varies by jurisdiction, and the ordinary marketing stack of analytics, ad pixels, remarketing audiences and chat transcripts can quietly collide with it. Digital Kingz builds the full chain for clinics, from brand and website through SEO, traffic, conversion, CRM and automation, with measurement designed to be defensible.",
  ],
  challengesHeading: 'Where Medical Practices Lose Patients and Margin',
  challengesIntro:
    'Four problems that recur across single-site clinics and multi-location groups alike, and that generic agency work tends to make worse.',
  challenges: [
    {
      title: 'Insured and Cash-Pay Lines Need Separate Funnels',
      body: 'An insured visit is a capacity question: fill the slot with the right procedure and payer mix. A cash-pay procedure is a considered purchase involving price, financing, comparison and often months of research. Running both through one homepage and one contact form leaves the elective buyer without answers and the insured patient unable to confirm coverage.',
    },
    {
      title: 'The Marketing Stack Becomes a Privacy Exposure',
      body: 'Third-party analytics and advertising tags placed on condition pages, symptom tools, appointment forms and portal logins can transmit identifiers alongside health context. Remarketing audiences built from condition-specific visits are worse, because the audience itself is the disclosure. Privacy legislation differs by jurisdiction, but a default install of standard tracking is rarely the right starting point for a clinic.',
    },
    {
      title: 'Patients Choose a Provider While Sites Market a Clinic',
      body: 'People search for a named physician, then verify credentials, affiliations, languages spoken, conditions treated and whether that clinician is in network. Sites organized around departments answer none of it and give search engines no provider entity to associate with the practice. The clinic ranks; the individual the patient was actually looking for never appears.',
    },
    {
      title: 'The Front Desk Is a Marketing Channel',
      body: 'Most acquisition still arrives by phone, into a queue staffed by people simultaneously handling check-in, insurance verification and prescription requests. Calls are missed, callbacks are slow, and new-patient inquiries lose priority to existing-patient tasks. Every missed call is paid acquisition written off, and no dashboard shows it unless call tracking is in place to count it.',
    },
  ],
  buyerBehaviourHeading: 'How Patients Search for and Choose a Provider',
  buyerBehaviour: [
    'Patient search moves through predictable stages: symptom, then possible condition, then treatment options, then a specific provider. Most practices compete only at the final stage, the most crowded and most expensive. The stage easiest to miss is the insurance filter. Many insured patients begin inside a payer directory or health plan search rather than a search engine, and will not consider a provider they cannot confirm is in network, however good the website is.',
    "Reputation does more conversion work here than in almost any other category, and it attaches to the individual rather than the organization. Patients read reviews of the physician they were referred to, cross-check them against the clinic's profile and health directory listings, and weigh comments about wait times, front desk behaviour and whether they felt heard as heavily as anything clinical. Practices delivering excellent care with a thin review presence lose patients they had already earned.",
    'Booking behaviour then splits by service line. Insured patients still call, because they want coverage confirmed before committing to anything. Cash-pay and elective patients expect pricing context and online scheduling, frequently outside business hours, and abandon quickly when neither exists. Specialist practices carry a third audience entirely: referring physicians, who are quietly assessing whether referring is easy, whether they will hear back, and whether their patient will be seen quickly.',
  ],
  systemHeading: 'What a Complete Medical Growth System Includes',
  systemIntro:
    'Six components connecting brand and website through to booked, attended appointments and reporting that ties them back to source.',
  system: [
    {
      title: 'Provider Entity Layer',
      body: 'A real page for every clinician carrying credentials, board certification, affiliations, conditions treated, procedures performed, languages and accepted plans, marked up with structured data. This is how a practice becomes legible to search engines, AI assistants and patients searching by name.',
    },
    {
      title: 'Service Line Architecture',
      body: 'Separate paths for reimbursed care and cash-pay procedures, each with its own messaging, proof, pricing context and conversion action. Built during Web Design so the elective funnel is a properly designed journey rather than a subpage of a clinic brochure.',
    },
    {
      title: 'Privacy-Aware Measurement',
      body: 'Consent handling, server-side tagging where appropriate, suppression of health context in URLs and event parameters, and no condition-level remarketing audiences. Configured to be reviewed and signed off by your privacy officer or counsel, because obligations vary by jurisdiction.',
    },
    {
      title: 'Local and Directory Presence',
      body: 'Local SEO across a Google Business Profile for each location, health directories, payer directories and citation consistency, so the practice appears wherever patients verify a provider. Reviews are requested through workflows that never reference the reason for the visit.',
    },
    {
      title: 'Booking and Retention Automation',
      body: 'Online scheduling restricted to real availability, plus reminder sequences, waitlist backfill for cancellations, recall for follow-up and preventive visits, and reactivation of lapsed patients. Delivered through CRM Systems and AI Automation so it runs without front desk effort.',
    },
    {
      title: 'Referring Physician Channel',
      body: 'For specialist practices, a distinct referral path: pages written for referrers, frictionless submission, acknowledgement, outcome communication back to the referring office, and reporting on which sources actually send patients. Most practices treat this as relationship work and never measure it.',
    },
  ],
  deepDive: [
    {
      heading: 'Measuring Patient Acquisition Without Creating Privacy Exposure',
      paragraphs: [
        'The tension is real and it is not solved by switching analytics off. A clinic needs to know which service lines produce booked appointments, which channels waste money and where patients abandon. The problem is that the default way that data gets collected, with third-party tags firing on every page, full URLs passed to advertising platforms and form values captured by session recording tools, can carry health context alongside identifiers on pages about conditions, treatments and appointments.',
        'A defensible setup starts by deciding what may never leave the site. Condition and provider names stripped from URLs and event parameters. Conversion events reported as generic appointment requests rather than procedure-specific goals. Server-side tagging, so what is transmitted is controlled rather than assumed. Consent captured before any non-essential tag loads. Session recording excluded from clinical and form pages entirely. None of that stops you optimizing. It stops you optimizing with data you should never have sent.',
        'What it costs you is granularity inside the ad platforms, which is why offline conversion reporting matters more in health than almost anywhere else. Booked and attended appointments are matched back to source inside your own systems, and only aggregate, de-identified signal returns to the platforms. This shapes how we run Google Ads for clinics, and because requirements differ by jurisdiction, the configuration is built to be reviewed and approved by your counsel rather than assumed compliant.',
      ],
    },
    {
      heading: 'Provider Entities, Clinical Review and the Credibility Health Content Requires',
      paragraphs: [
        'Search engines and AI systems evaluate health content against a higher standard than almost any other subject, and the signals they look for map closely to what a cautious patient looks for. Who wrote this. What are their qualifications. When was it last reviewed and by whom. Does the organization exist, with a verifiable address, consistent listings and a real clinical team behind it. A practice publishing unattributed condition articles competes directly against institutions that attribute everything.',
        'Provider pages carry most of that weight, and they are consistently the most underbuilt pages on a clinic site. Done properly, each states credentials and board certification, hospital and academic affiliations, the specific conditions and procedures that clinician handles, languages spoken, accepted plans, and the locations and days they work. Structured data connects the individual to the organization and to each location. A patient searching a physician by name after a referral then lands somewhere that converts, not on a staff directory row.',
        "Condition and treatment content should be written for the stage the patient is actually in and reviewed by a clinician before publication, with the reviewer named and the review date shown. That is not a formality. It is the difference between content that reinforces the practice's authority and content that dilutes it. Conversion Optimization then works on the questions that decide booking, and our SEO work connects provider to condition to procedure to location as one entity graph.",
      ],
    },
  ],
  faqs: [
    {
      question: 'Can we run retargeting ads for our practice?',
      answer: 'Sometimes, but not the way most agencies configure it. Building audiences from visits to condition or procedure pages means the audience itself reveals health information, which is where practices get into difficulty. Broader audiences drawn from non-clinical pages, with conversion measurement handled server-side and in aggregate, is usually safer. Privacy legislation varies by jurisdiction, so have your counsel approve the configuration.',
    },
    {
      question: 'How is marketing a cash-pay service different from an insured one?',
      answer: 'Cash-pay services can be marketed on outcome, convenience and price, and they can carry a direct acquisition cost because the revenue is not capped by a reimbursement schedule. Insured services cannot. There the objective is filling specific capacity with the right procedure and payer mix, which usually means Local SEO, referral relationships and booking convenience rather than paid demand generation.',
    },
    {
      question: 'Do we need a page for every physician?',
      answer: 'Yes, for every clinician who sees patients. Patients search providers by name, referrals send people looking for one specific person, and search engines need an entity to attach credentials and reviews to. A real provider page also answers the questions that decide booking: conditions treated, accepted plans, locations, availability and languages. A directory row with a photo does none of that.',
    },
    {
      question: 'How do we build reviews without breaching patient privacy?',
      answer: 'Through a request workflow that never references why the patient was seen. Requests fire on a neutral trigger such as a completed visit, contain no clinical detail, and public responses acknowledge feedback without confirming the person was a patient. Staff need a scripted approach to negative reviews for the same reason. Confirm the workflow with your compliance lead.',
    },
    {
      question: 'Should we add online booking if our schedule is already full?',
      answer: 'Usually yes, but pointed at the right slots. Online booking is most valuable when restricted to the appointment types and providers you specifically need to fill, and combined with waitlist backfill so cancellations are recovered automatically. Opening the whole schedule tends to fill already in-demand providers faster while leaving the real capacity gaps untouched. The objective is utilization and mix, not volume.',
    },
    {
      question: 'How do you handle multiple locations and providers who work across them?',
      answer: 'With one location page per site and one provider page per clinician, linked in both directions rather than duplicated. Each location gets its own Google Business Profile, hours, access details and accepted plans where those differ. Each provider page states the locations and days they work. Copying a bio onto every location page splits authority and suppresses local rankings.',
    },
  ],
  relatedServices: [
    'web-design',
    'seo',
    'local-seo',
    'google-ads',
    'conversion-optimization',
    'crm-systems',
    'ai-automation',
  ],
  ctaHeading: 'See Where Your Schedule Is Leaking Revenue',
  ctaBody:
    'We will review your provider-level search presence, how your measurement handles health context, and where booked appointments are being lost between the first search and the front desk.',
}

export default industry
