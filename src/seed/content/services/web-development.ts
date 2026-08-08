import type { ServiceSeed } from '@/seed/types'

const service: ServiceSeed = {
  slug: 'web-development',
  category: 'build',
  title: 'Web Development',
  navLabel: 'Web Development',
  tagline: 'Fast, secure Next.js builds engineered for Core Web Vitals and a low cost of change.',
  icon: 'Code2',
  metaTitle: 'Web Development: Next.js and TypeScript | Digital Kingz',
  metaDescription:
    'Web development in Next.js and TypeScript, engineered for Core Web Vitals, server-side rendering, security and a cost of change that falls instead of rising.',
  heroEyebrow: 'Build / Web Development',
  heroHeading: 'Engineering Quality Is a Balance Sheet Item',
  heroSubheading:
    'Server-rendered builds in Next.js and TypeScript, structured so the site keeps its speed, stays secure and remains cheap to change three years after launch.',
  intro: [
    'A website is software. It has dependencies that age, a security surface, a hosting bill, and a cost of change that rises every time a shortcut is taken. Businesses tend to evaluate a build on how it looks on launch day, then discover the real number two years later, when a small content change requires a developer and a new template takes a fortnight.',
    'The difference between a well-engineered site and a cheap one rarely shows on the first visit. It shows in the load time on a mid-range phone over a mobile connection, in whether search engines can render the content at all, in how long a security patch takes to apply safely, and in whether the marketing team can publish anything without filing a ticket.',
    'We build in Next.js and TypeScript because the combination gives server-side rendering for search and speed, a component model that stays maintainable as the surface grows, and a type system that catches whole classes of defect before deployment. The stack is chosen for the cost curve it produces over several years, not for how current it sounds in a proposal.',
  ],
  problemsHeading: 'The Hidden Costs of a Badly Built Website',
  problems: [
    {
      title: 'Speed Is Treated as a Nice-to-Have',
      body: "Google's Core Web Vitals define Largest Contentful Paint under 2.5 seconds, Interaction to Next Paint under 200 milliseconds and Cumulative Layout Shift under 0.1 as a good experience. Sites that miss those thresholds lose visitors before the page renders, and they pay more for every advertised click, because a slower landing experience converts less of the traffic it already bought.",
    },
    {
      title: 'Plugin Sprawl and Dependency Debt',
      body: 'A site assembled from thirty plugins inherits thirty release cycles, thirty security surfaces and thirty chances that an update breaks the layout. Each addition was rational on its own. The aggregate is a system nobody fully understands, where routine maintenance becomes risky and the safest-feeling option is to stop updating, which is the least safe option available.',
    },
    {
      title: 'Content Changes Require a Developer',
      body: 'When the content model is an afterthought, every edit becomes a code change. Marketing waits in a queue, campaign pages miss their window, and the site stops reflecting what the business currently sells. The real cost is not the developer hour. It is the opportunity that expired while the request sat in a backlog behind higher-priority work.',
    },
    {
      title: 'The Build Cannot Absorb Growth',
      body: 'Sites are frequently built for the page count they launch with. Adding twelve service pages, eight industry pages and a case study library then means duplicating templates by hand, because no structured content model exists to generate them. The second phase costs more than the first, and the third is usually a rebuild dressed up as a refresh.',
    },
  ],
  includedHeading: 'What We Build',
  includedIntro:
    'Every engagement produces a codebase your team owns, documented well enough that another competent developer could take it over without a discovery phase.',
  included: [
    {
      title: 'Next.js Application With Server-Side Rendering',
      body: 'Pages are rendered on the server or generated at build time, so content reaches both users and crawlers without waiting on client JavaScript. Routing, metadata, sitemaps and canonical tags are handled in code rather than bolted on afterwards.',
    },
    {
      title: 'TypeScript Throughout',
      body: 'Strict typing across components, data fetching and CMS schemas. Type errors surface during development instead of as broken pages in production, and the types double as living documentation for whoever maintains the codebase after us.',
    },
    {
      title: 'A Structured Content Model in a Headless CMS',
      body: 'Content is modeled as typed collections and reusable blocks in Payload CMS, so a new service or case study is an entry rather than a development task. Editors work in a clean admin interface, and the front end stays consistent by construction.',
    },
    {
      title: 'Core Web Vitals Engineering',
      body: 'Image optimization with modern formats, deliberate font loading strategy, code splitting, deferred third-party scripts and layout stability by design. Performance budgets are set at the start and measured in the build pipeline rather than discovered after launch.',
    },
    {
      title: 'Analytics, Conversion Tracking and CRM Handoff',
      body: 'Event tracking is implemented as part of the build: form submissions, calls, bookings and key interactions, wired to analytics and to the CRM or automation platform that receives the lead, with server-side handling where attribution accuracy matters.',
    },
    {
      title: 'Security and Reliability Baseline',
      body: 'HTTPS with correct headers, input validation and spam protection on forms, dependency auditing, environment-based secrets, role-scoped CMS access, automated backups and a documented rollback path. Deliberately boring, because the alternative is a bad week.',
    },
    {
      title: 'Deployment Pipeline and Documentation',
      body: 'Containerised deployment under version control, preview environments so work is reviewed before it reaches production, and written documentation covering architecture, environment variables and release process. You own the repository and the infrastructure it runs on.',
    },
  ],
  approachHeading: 'How We Build',
  approach: [
    {
      step: '01',
      title: 'Technical Discovery and Architecture',
      body: 'We define the data model, page types, integrations and performance budget before writing feature code. That includes how content is structured, which routes render statically, where server rendering is required, and how a lead travels from the form to the systems that are supposed to act on it.',
    },
    {
      step: '02',
      title: 'Foundation and Design System in Code',
      body: 'The design system is implemented as typed, reusable components with tokens for typography, spacing and color. Templates are built once and composed, so the twentieth page costs a fraction of the first and stays visually consistent without anyone policing it.',
    },
    {
      step: '03',
      title: 'Build and Integrate',
      body: 'Pages, CMS collections, forms, search, analytics and third-party integrations are built in reviewable increments with preview deployments at each stage. You see working pages throughout the project rather than a single reveal at the end, which is when expensive misunderstandings normally surface.',
    },
    {
      step: '04',
      title: 'Test, Audit and Harden',
      body: 'Cross-browser and real-device testing, accessibility checks, lab and field performance review against the agreed budget, form and integration testing, and a dependency audit. On a migration, redirects are mapped and verified before launch rather than after the traffic disappears from Search Console.',
    },
    {
      step: '05',
      title: 'Launch, Monitor and Hand Over',
      body: 'Deployment with uptime monitoring and error reporting in place from the first hour. After launch we watch field performance data, crawl coverage and conversion events, then fix what real traffic exposes. Documentation and repository access transfer to you as part of the engagement, not on request.',
    },
  ],
  outcomesHeading: 'What Good Engineering Buys You',
  outcomesIntro:
    'These are the operational and commercial effects of a well-built site. We do not attach invented numbers to them.',
  outcomes: [
    {
      title: 'Pages That Load Before Attention Runs Out',
      body: 'Fast pages hold visitors that slow pages lose, and they make every acquisition channel more efficient, because the traffic you already paid for reaches actual content instead of a loading state.',
    },
    {
      title: 'A Marketing Team That Is Not Blocked',
      body: 'Content, landing pages and campaign updates ship without a developer in the loop. The site keeps pace with what the business is selling this quarter rather than what it sold on launch day.',
    },
    {
      title: 'A Predictable Cost of Change',
      body: 'Adding pages, features or integrations is scoped in hours rather than negotiated as a project. Technical debt stops compounding, so the second and third year of ownership cost less than the first.',
    },
    {
      title: 'Infrastructure You Actually Own',
      body: 'The repository, the content database and the hosting are yours. No proprietary lock-in, no annual fee to reach your own content, and no forced rebuild if you decide to change agencies later.',
    },
  ],
  deepDive: [
    {
      heading: 'Core Web Vitals, Rendering Strategy and Why a Fast Site Is Cheaper to Advertise On',
      paragraphs: [
        "Core Web Vitals are Google's field measurements of loading, interactivity and visual stability: Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift. The published thresholds for a good experience are LCP under 2.5 seconds, INP under 200 milliseconds and CLS under 0.1, measured on real visits rather than in a lab. They matter as a ranking input, but the commercial case is simpler than that. Every second of delay happens after you have already paid to acquire the visitor.",
        'Rendering strategy is the largest lever. Next.js lets each route choose static generation, server-side rendering or incremental revalidation, so a service page can be prebuilt and served from cache while a stock-aware product page renders per request. The alternative, shipping a JavaScript bundle that assembles the page in the browser, delays the first meaningful paint on exactly the mid-range phones and unreliable connections that carry a large share of real traffic.',
        'Speed also changes the arithmetic on paid media. Google Ads and Meta Ads charge for the click whether or not the page renders in time. A landing page that loses part of its traffic to load abandonment raises the effective cost of every conversion it does produce. Performance work is one of the few investments that improves organic search, paid efficiency and conversion rate simultaneously, which is why we treat it as engineering rather than as post-launch optimization.',
      ],
    },
    {
      heading: 'Technical Debt Is a Cost Line, Not an Engineering Opinion',
      paragraphs: [
        'Technical debt is the interest you pay on decisions made in a hurry. On websites it appears as duplicated templates, unversioned custom code, abandoned plugins, hardcoded content and dependencies too old to upgrade safely. None of it is visible to a visitor. All of it shows up as an inflated quote the next time you ask for something, because the developer has to work around the accumulated shortcuts before they can begin the actual task.',
        'TypeScript and a component architecture are how we keep that number down. Strict types mean a change to a data shape fails at compile time instead of on a live page. Reusable components mean a fix applies everywhere at once. A structured content model in Payload CMS means editors change content without touching code. Together these decide whether year three of ownership is a maintenance line or a rebuild proposal.',
        'The same principle governs dependencies. Every package added to a project is a commitment to track its releases and its vulnerabilities for as long as the site is live. We add libraries when they solve a real problem and remove them when they stop earning their place, which is also the discipline that makes ongoing website maintenance affordable rather than open-ended. Every dependency removed is a future patch nobody has to test.',
      ],
    },
    {
      heading: 'Building for Search, Conversion and the Systems Behind Them',
      paragraphs: [
        'Search engines and AI systems can only credit content they can reach and parse. Server-rendered HTML, correct heading hierarchy, canonical tags, clean URL structure, XML sitemaps and schema.org structured data are development responsibilities, not tasks handed to an SEO team afterwards. When those foundations are built in, technical SEO becomes a matter of strategy and content rather than a long remediation project billed by the month. The foundation costs almost nothing to build correctly and a great deal to retrofit later.',
        'Conversion infrastructure deserves the same attention. A form is not finished when it submits. It is finished when the submission is validated, protected from spam, stored durably, delivered to the CRM with its source and campaign attached, acknowledged to the user, and recorded as a tracked event. That chain is what makes conversion optimization measurable, and what allows AI automation to qualify and route a lead the moment it arrives instead of the next working day.',
        'This is the practical meaning of a website that does not exist in isolation. The build is the layer where web design, branding, SEO, advertising, CRM and automation either connect into one system or remain separate tools that happen to share a logo. Engineering those connections during the build costs a fraction of retrofitting them once each piece has been bought separately and configured by a different supplier. Integration debt is the most expensive kind, because it spans systems nobody owns entirely.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Why Next.js instead of WordPress?',
      answer:
        'Next.js gives server-side rendering, fine-grained control over performance and a typed component architecture, which suits sites where speed, structured content and long-term maintainability carry commercial weight. WordPress remains reasonable for simple brochure sites with a small page count and no unusual functionality. The decision should turn on how much the site is expected to grow, how much custom logic it needs, and how much plugin-driven maintenance risk you are willing to carry.',
    },
    {
      question: 'Can our team still edit content without a developer?',
      answer:
        'Yes. Content lives in a headless CMS with typed collections and reusable blocks, so editors add pages, case studies and articles through an admin interface with no code involved. We model the content around what you actually publish, define which parts are editable and which are locked to protect layout integrity, and train your team on the workflow before handover rather than after it.',
    },
    {
      question: 'How do you handle migration from an existing site?',
      answer:
        'With a complete URL inventory and a one-to-one redirect map produced before launch. We export existing content, crawl the live site to capture every indexed URL, map each to its new destination, preserve the pages that earn traffic, and verify the redirects on a staging environment. After launch we monitor crawl coverage and rankings so any gap is caught within days rather than quarters.',
    },
    {
      question: 'Who owns the code and the hosting?',
      answer:
        'You do. The repository, the content database and the hosting accounts are yours, and we document the architecture, environment variables and deployment process so another developer can take over without reverse-engineering anything. We deploy with Docker to infrastructure you control, which keeps hosting costs transparent and avoids per-seat platform fees that scale up as your traffic grows.',
    },
    {
      question: 'How do you keep the site fast after launch?',
      answer:
        'Performance budgets are enforced continuously rather than checked once. We monitor field data for Core Web Vitals, review new pages and third-party scripts against the budget before they ship, and audit periodically for regressions. Most speed loss after launch comes from added tracking tags, unoptimised uploaded images and feature creep, all of which are governance problems as much as technical ones.',
    },
    {
      question: 'Do you build integrations with our CRM and other tools?',
      answer:
        'Yes. Form submissions, bookings and calls can be routed into your CRM with source, campaign and page attribution attached, using native APIs where they exist and a documented integration layer where they do not. We also handle server-side event tracking, notification routing and any automation triggers you want fired when a lead arrives, so the handoff happens instantly rather than manually.',
    },
  ],
  relatedServices: ['web-design', 'website-maintenance', 'ecommerce', 'seo'],
  relatedIndustries: ['b2b', 'professional-services', 'ecommerce-brands', 'real-estate'],
  ctaHeading: 'Build It Once, Properly',
  ctaBody:
    'Send us the current site and what you need it to do next. We will tell you honestly whether it should be improved, rebuilt, or left alone while the budget goes somewhere with a better return.',
}

export default service
