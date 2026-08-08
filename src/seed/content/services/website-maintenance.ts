import type { ServiceSeed } from '@/seed/types'

const service: ServiceSeed = {
  slug: 'website-maintenance',
  category: 'build',
  title: 'Website Maintenance & Support',
  navLabel: 'Maintenance & Support',
  tagline: 'Monitoring, patching, backups and performance governance for an asset you already paid to build.',
  icon: 'ShieldCheck',
  metaTitle: 'Website Maintenance and Support | Digital Kingz',
  metaDescription:
    'Website maintenance and support covering uptime, security patching, tested backups and performance governance, so your site keeps earning instead of decaying.',
  heroEyebrow: 'Build / Maintenance and Support',
  heroHeading: 'Websites Do Not Hold Their Value on Their Own',
  heroSubheading:
    'Monitoring, security patching, tested backups, performance governance and content velocity, delivered as a retainer that protects the asset you have already paid to build.',
  intro: [
    'A website is the only significant business asset routinely expected to hold its value with no upkeep. Buildings get maintained, vehicles get serviced, software gets patched, and websites get left alone until something visibly breaks. By then the failure is rarely a single event. It is the accumulation of six quiet ones that nobody was watching for.',
    'Decay is gradual and mostly invisible from the inside. Dependencies fall behind their security releases. Images uploaded at full resolution slow pages down month by month. Tracking tags multiply. Broken links accumulate as other sites reorganize. Competitors publish while your content stays where it was at launch, and rankings drift without any single day where something went wrong.',
    'Maintenance is not insurance against disaster. It is the operating cost of keeping a revenue-generating asset in the condition you paid for. The alternative is not saving money. It is deferring an unpredictable cost, usually into the month when a security incident, a broken checkout or a ranking collapse gives you no choice at all about the timing.',
  ],
  problemsHeading: 'What Happens to an Unmaintained Site',
  problems: [
    {
      title: 'Security Debt Accumulates Silently',
      body: 'Every dependency, plugin and framework in your stack publishes security fixes. Skipping them does not preserve stability; it accumulates known, publicly documented vulnerabilities that automated scanners find faster than people do. The recovery cost of a compromised site includes cleanup, downtime, potential data notification obligations and the search suppression that follows a malware flag.',
    },
    {
      title: 'Performance Regresses After Launch',
      body: 'Sites are fastest on launch day. Then a marketing tag is added, a large hero image is uploaded uncompressed, an embedded widget pulls in third-party scripts, and a page that met Core Web Vitals thresholds no longer does. Nobody notices, because each change is incremental and nobody is measuring field data against a performance budget.',
    },
    {
      title: 'Content Stops Moving and Rankings Follow',
      body: 'Search results reward pages that stay accurate and useful. A site that has not published or updated anything in a year competes against businesses shipping content weekly. Stale service pages, outdated pricing, dead case studies and unanswered questions all reduce the reasons for a search engine, or an AI assistant, to keep citing you.',
    },
    {
      title: 'Nobody Knows Whether the Backups Work',
      body: 'Most sites have backups. Far fewer have backups that have ever been restored, stored somewhere separate from the server they protect, and retained long enough to recover from a problem discovered three weeks late. A backup nobody has tested is a belief rather than a control, and the test always happens at the worst possible moment.',
    },
  ],
  includedHeading: 'What the Retainer Covers',
  includedIntro:
    'Cover is scoped to the platform and the stakes, from a monitored brochure site to a store where an hour of downtime has a measurable price.',
  included: [
    {
      title: 'Uptime, Error and Certificate Monitoring',
      body: 'Continuous availability checks, error reporting and SSL certificate expiry alerts with a defined response path. You find out from us, not from a customer who could not reach the site or from a browser warning that appeared over a weekend.',
    },
    {
      title: 'Security Patching and Dependency Management',
      body: 'Scheduled review and application of framework, dependency, plugin and server updates, tested on a staging environment before they reach production. Vulnerability advisories relevant to your stack are triaged by severity, with urgent fixes handled outside the normal cycle.',
    },
    {
      title: 'Tested Backups and a Documented Recovery Path',
      body: 'Automated backups of files and database on a retention schedule matched to your risk, stored off the production server, with periodic restore tests. Recovery time and recovery point expectations are written down before the day you need them.',
    },
    {
      title: 'Performance Governance',
      body: 'Regular Core Web Vitals field data review, image and asset auditing, third-party script review and regression checks after content changes. Performance budgets are enforced continuously, so the site does not gradually return to where it was before the rebuild.',
    },
    {
      title: 'Content Updates and Publishing Support',
      body: 'A defined allocation for content changes, new pages, campaign landing pages and seasonal updates, handled by people who already know the design system. Requests are turned around in a predictable window rather than queued behind unrelated project work.',
    },
    {
      title: 'Technical SEO Health Checks',
      body: 'Crawl and index coverage monitoring, broken link and redirect auditing, structured data validation, sitemap accuracy and Search Console error triage. Technical problems get caught in the reporting cycle rather than after the traffic has already gone.',
    },
    {
      title: 'Reporting and a Roadmap, Not Just a Log',
      body: 'A monthly summary of what changed, what was found, what it means and what we recommend next, written in business terms. Maintenance should surface opportunities to improve the asset, not only evidence that nothing broke this month.',
    },
  ],
  approachHeading: 'How the Retainer Works',
  approach: [
    {
      step: '01',
      title: 'Baseline Audit',
      body: 'We document what exists: stack, dependencies, hosting, integrations, current performance field data, indexation health, backup configuration and known risks. This establishes the reference point everything is measured against, and it usually surfaces two or three issues worth fixing immediately. The audit stands on its own, even if the retainer never starts.',
    },
    {
      step: '02',
      title: 'Stabilise',
      body: 'Before ongoing cover begins we clear the backlog that would otherwise distort the service: outstanding critical updates, failing backups, broken redirects, missing monitoring and the performance regressions already present. Starting from a known-good state is what makes everything after it predictable.',
    },
    {
      step: '03',
      title: 'Operate on a Cycle',
      body: 'Monitoring runs continuously. Patching, backup verification, performance review, link checks and index checks follow a defined schedule with staging tests before any production change. Emergencies have a separate response path, so routine work is never the reason an urgent fix waits.',
    },
    {
      step: '04',
      title: 'Report in Business Terms',
      body: 'Each cycle produces a plain summary: what was updated, what was found, which risk was removed and what changed in performance and search health. No screenshots of dashboards without interpretation, because a report nobody can act on is a cost with no return attached.',
    },
    {
      step: '05',
      title: 'Improve, Not Just Preserve',
      body: 'Maintenance identifies what the site should do next: pages attracting traffic but no enquiries, content that has aged out of accuracy, templates worth extending, integrations worth adding. The retainer becomes a continuous improvement loop rather than a standing charge for keeping the lights on.',
    },
  ],
  outcomesHeading: 'What You Are Actually Buying',
  outcomesIntro:
    'The value of maintenance is measured in problems that never became incidents, which is why it is easy to undervalue and expensive to skip.',
  outcomes: [
    {
      title: 'Continuity You Do Not Have to Think About',
      body: 'The site stays available, current and monitored, and someone other than you is accountable for it. The attention that used to go into chasing website problems goes back into running the business.',
    },
    {
      title: 'Risk Moved Off the Table',
      body: 'Known vulnerabilities get patched, backups are tested, and recovery expectations are documented. The scenarios that turn into expensive weeks are the ones nobody prepared for, and preparation is considerably cheaper than recovery.',
    },
    {
      title: 'Performance and Rankings That Hold',
      body: 'Speed and search health are governed continuously instead of rediscovered during the next redesign. The investment already made in the build keeps returning rather than eroding a little every quarter.',
    },
    {
      title: 'A Site That Keeps Pace With the Business',
      body: 'New pages, offers and content ship on a predictable cadence. The website reflects what you sell now, which is the difference between a live marketing asset and an expensive brochure.',
    },
  ],
  deepDive: [
    {
      heading: 'Security Patching, Dependency Risk and the Cost of Doing Nothing',
      paragraphs: [
        'Modern websites are assembled from dozens of third-party components, each maintained by someone else on their own release schedule. When a vulnerability is disclosed the details become public, which means the window between a fix being published and automated exploitation attempts beginning is short. Not applying the patch is a decision to stay exposed for as long as the site is live, and it is a decision most businesses make by default rather than deliberately.',
        'The recovery cost is what makes this a financial question rather than a technical one. A compromised site can mean downtime during trading hours, cleanup and forensic work, a search engine malware flag that removes you from results until review, notification obligations if customer data was involved, and the reputational damage of a browser warning shown to anyone who tries to visit. Scheduled patching against a staging environment costs a fraction of any one of those.',
        'Discipline matters more than frequency. Updates are reviewed for severity, tested before production, and applied in batches small enough to identify the cause when something breaks. Dependencies abandoned upstream get replaced rather than pinned indefinitely, which is also why our web development practice keeps the dependency count deliberately low. Fewer moving parts remains the cheapest security control available to any business. Nothing you never installed can be exploited, and nothing removed needs patching.',
      ],
    },
    {
      heading: 'Why Set-and-Forget Websites Lose Rankings',
      paragraphs: [
        'Search rankings are relative. A page does not need to get worse to fall; the pages around it only need to get better. A competitor who publishes, updates and expands their coverage while your site stays static will eventually pass you, and the decline is gradual enough that it is usually noticed a year after it started, when someone finally asks why enquiries are down. By that point the recovery costs considerably more than the upkeep would have.',
        'Technical drift contributes as much as content stagnation. Redirect chains build up as pages move. External links rot as other sites reorganize. Structured data breaks when a template changes. Uploaded images bloat page weight until Core Web Vitals thresholds are missed on mobile. Individually none of these is urgent. Together they signal a site that is not being looked after, and they make crawling and indexing less efficient than they should be.',
        'This is why maintenance and SEO overlap more than most retainers admit. Crawl coverage monitoring, structured data validation, redirect hygiene and page speed governance are maintenance tasks with direct search consequences. Keeping content current is an editorial task with the same effect. A retainer covering both keeps the asset in the condition the original investment assumed, and gives the local SEO and content work something stable to build on. Otherwise the growth budget pays to repair what upkeep should have prevented.',
      ],
    },
    {
      heading: 'Retainer Economics: Predictable Cost Against Unpredictable Failure',
      paragraphs: [
        'The argument against a retainer is that nothing appears to happen. That is precisely what is being purchased. Maintenance converts an unpredictable and occasionally severe cost into a small, budgeted, predictable one, in the same way any other operational control does. The businesses that resist it are usually the ones that have not yet had the incident that reframes the calculation permanently. A premium always looks expensive right up until the claim.',
        'There is also a compounding argument. A maintained site accumulates value: content builds authority, performance stays within budget, the web design system gets extended, conversion optimization has a stable base to test against, integrations get added, and the technical foundation stays current enough that the next significant change is an enhancement rather than a rebuild. An unmaintained site accumulates the opposite, and the eventual rebuild gets priced accordingly by whoever inherits it. Two sites of identical age can differ by an entire project in replacement cost.',
        'The most useful framing we have found with finance teams is replacement cost. Take what the site cost to build, add what it currently generates in enquiries or orders, and compare that against an annual maintenance figure. The ratio usually makes the decision obvious, and it tends to reveal that the website is the least protected significant asset the business owns. Most companies insure vehicles worth a fraction of what the site produces.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What is included in a website maintenance retainer?',
      answer:
        'Monitoring, security patching, backups with restore testing, performance governance, technical SEO health checks, content updates and monthly reporting. The specific allocation depends on the platform and how much the site matters commercially. A store processing orders needs faster response commitments and tighter change control than a brochure site, so the retainer is scoped against that rather than sold as a single fixed package.',
    },
    {
      question: 'Do we need maintenance if our site is brand new?',
      answer:
        'Yes, and a new site is the cheapest possible point to start. Dependencies begin aging the day the site launches, and performance regression usually starts within the first few months as tags, images and content are added. Beginning maintenance at launch means the site is preserved from a known-good state, which is far less work than restoring one after two years of unmanaged change.',
    },
    {
      question: 'Can you maintain a site your team did not build?',
      answer:
        'Yes, starting with a baseline audit of the stack, dependencies, hosting, backups, integrations and current performance and indexation health. That audit tells us what needs stabilising before ongoing cover makes sense, and it is honest about anything we consider unmaintainable. Occasionally the responsible recommendation is a rebuild, and we would rather say so at the audit stage than bill monthly to hold something together.',
    },
    {
      question: 'How quickly do you respond when something breaks?',
      answer:
        'Urgent issues follow a separate response path from routine work, with response times agreed in the retainer rather than left implied. Site-down and checkout-failure scenarios are treated as immediate. Because monitoring runs continuously, we typically detect availability and certificate problems before anyone reports them. Non-urgent requests are turned around within a defined window so your team can plan around it.',
    },
    {
      question: 'Who owns the backups and the hosting?',
      answer:
        'You do. Backups are stored on infrastructure you control or in an account in your name, separate from the production server, and hosting remains under your ownership throughout. We document credentials, retention schedules and the recovery procedure so the arrangement never depends on us being available. Maintenance should reduce your dependency risk, not concentrate it in a single supplier.',
    },
    {
      question: 'Does maintenance include new features or new pages?',
      answer:
        'Content updates and new pages built from the existing design system are typically included within an agreed allocation. Substantial new functionality, integrations or template work is scoped separately, because that is development rather than upkeep. We keep the boundary explicit so the retainer does not quietly become an under-resourced development contract, which is how maintenance quality degrades in most agency relationships.',
    },
  ],
  relatedServices: ['web-development', 'seo', 'web-design', 'conversion-optimization'],
  relatedIndustries: ['professional-services', 'medical', 'law-firms', 'ecommerce-brands'],
  ctaHeading: 'Protect What You Already Paid For',
  ctaBody:
    'Give us access and we will run a baseline audit: what is out of date, what is exposed, what has regressed since launch, and what it costs to keep the site in the condition you bought.',
}

export default service
