import type { ArticleSeed } from '@/seed/types'

const article: ArticleSeed = {
  slug: 'how-much-does-a-business-website-cost',
  title: 'How Much Does a Business Website Cost in 2026?',
  metaTitle: 'How Much Does a Business Website Cost in 2026?',
  metaDescription:
    'What a business website really costs in 2026: the drivers behind every quote, what each tier of the market buys, and how to set a budget from lead value.',
  excerpt:
    'Quotes for what looks like the same website routinely differ by a factor of twenty. Here is what actually drives the number, what each tier of the market buys, and how to set a budget from your own economics.',
  category: 'web-design',
  publishedAt: '2026-02-11',
  author: 'digital-kingz',
  body: [
    {
      type: 'p',
      text: 'You have three quotes on the desk. One is a low four-figure number. One is mid five figures. One is close to the cost of hiring a salesperson for a year. All three describe what looks like the same thing: a website for your business. None of them explains why the gap exists, and the conversation that follows is usually about features rather than about what you are actually buying.',
    },
    {
      type: 'p',
      text: 'The gap is real and it is mostly not margin. A website is not a product with a fixed specification. It is a range of genuinely different things that happen to share a name, in roughly the way a rented van and a logistics contract both move goods. What separates them is how much of the work is done for you, how much of it is done deliberately, and how much of the cost is deferred to a later year rather than charged now.',
    },
    {
      type: 'p',
      text: 'What follows is a breakdown of what drives the number on a website quote, what each tier of the market genuinely buys, and how to set a budget from your own unit economics rather than from a figure someone published in an article. There are no prices for our work here, because a real price requires a real scope. There are order-of-magnitude market observations, which are more useful anyway.',
    },
    { type: 'h2', text: 'Why the Same Brief Produces Wildly Different Numbers' },
    {
      type: 'p',
      text: 'Ask five providers to quote a ten-page website for a professional services firm and you will get five different products, because the brief specifies the wrong variable. Page count is close to irrelevant as a cost driver. What costs money is the number of distinct design decisions, the number of systems the site has to talk to, the volume of original content someone has to produce, and the engineering required to make the result fast, accessible and maintainable by someone other than the person who built it.',
    },
    {
      type: 'p',
      text: 'A twenty-page site assembled from six well-designed layouts costs less than an eight-page site where every page is composed differently. A brochure site with a contact form costs less than a five-page site that has to authenticate users against an existing system. Once you know which variables carry cost, quotes stop looking arbitrary and start looking like descriptions of different amounts of work.',
    },
    { type: 'h2', text: 'The Cost Drivers Worth Understanding' },
    { type: 'h3', text: 'Scope, Measured in Unique Layouts Rather Than Pages' },
    {
      type: 'p',
      text: 'Design and build cost scales with unique layouts, not with URLs. A homepage, a service page template, an industry page template, a case study template, an article template, a contact page and a set of legal pages is seven design problems. Whether you then publish twelve pages or ninety against those templates changes content cost, not build cost. When a provider quotes per page, they are either pricing template work as if it were bespoke, or they are planning to build ninety one-off pages, which is worse.',
    },
    { type: 'h3', text: 'Custom Design Versus a Template' },
    {
      type: 'p',
      text: 'A purchased theme removes the most expensive part of the process, which is deciding what the site should look like and how it should behave. That is a legitimate trade in some situations. What it costs you is differentiation, control over performance, and the ability to express anything the theme author did not anticipate. Themes are built to demonstrate well in a gallery across every possible use case, which means they carry code paths your business will never use and design decisions that were made for someone else.',
    },
    {
      type: 'p',
      text: 'Custom design costs more because the work is genuinely open-ended: research, positioning, information architecture, a type and spacing system, component states, responsive behavior and interaction detail. The output that matters is not a set of attractive pages. It is a system that lets you add the fourteenth service page in two years without needing a designer, because the rules for what a service page looks like already exist.',
    },
    { type: 'h3', text: 'The Content Management Decision' },
    {
      type: 'p',
      text: 'Who edits the site after launch is a cost decision disguised as a technical one. A statically built site with no CMS is the cheapest to build and the most expensive to change, because every edit is a developer task. A full headless CMS costs more up front and reduces the marginal cost of every change to near zero. The right answer depends entirely on how often the content will actually change, which most businesses overestimate for the blog and underestimate for service pages.',
    },
    { type: 'h3', text: 'Integrations' },
    {
      type: 'p',
      text: 'Every system the website connects to adds cost that is invisible in a design mockup. CRM, email platform, calendar and booking, payment, inventory, practice management, quoting tools, analytics and consent management, live chat, review platforms. Each one requires mapping fields, handling failures, testing edge cases and maintaining the connection when the vendor changes their API. Integrations are also where projects overrun, because the scope of a connection is rarely understood until someone opens the documentation.',
    },
    { type: 'h3', text: 'Content Production' },
    {
      type: 'p',
      text: 'Content is the line item most often removed to make a quote look competitive, and it is the line item most likely to delay the launch by months. Someone has to write the service pages, describe the process, produce the photography, and decide what the business actually claims. If that person is you, the cost is your time and the launch date is whatever your calendar allows. If it is the provider, the cost is real and should be on the quote. A site that cannot launch because nobody wrote the About page has cost you everything it cost, plus the delay.',
    },
    { type: 'h3', text: 'The Technical SEO Foundation' },
    {
      type: 'p',
      text: 'Server-rendered HTML, a clean URL structure, correct canonical tags, an accurate sitemap, structured data, deliberate internal linking, and page speed inside Core Web Vitals thresholds. None of this is visible in a design review, and all of it determines whether the site can ever earn traffic that you did not pay for. Retrofitting it is more expensive than building it in, because the fix usually touches templates, routing and the content model at the same time.',
    },
    { type: 'h3', text: 'Accessibility and Legal Surface' },
    {
      type: 'p',
      text: 'Keyboard navigation, focus states, color contrast, alternative text, form labeling and semantic markup add a modest amount to a build done properly and a substantial amount to a remediation project. Depending on your sector and your customers, accessibility may also carry regulatory exposure. Treating it as a build standard costs a fraction of treating it as a defect found later.',
    },
    { type: 'h2', text: 'The Four Tiers of the Market and What Each One Buys' },
    {
      type: 'p',
      text: 'Broadly, there are four ways to get a website built. Each is a rational choice for some business at some stage. Each also has a characteristic failure, and knowing that failure in advance is more useful than any price comparison.',
    },
    {
      type: 'table',
      headers: [
        'Approach',
        'Typical use case',
        'Design',
        'Performance',
        'SEO foundation',
        'Ownership',
        'What breaks first',
      ],
      rows: [
        [
          'DIY site builder',
          'Testing an idea, or a business where the site is effectively a business card',
          'A template from a gallery, shared with thousands of other sites',
          'Constrained by the platform, generally heavy and not fixable by you',
          'Basic tags are editable, deeper technical control is not available',
          'You rent the platform. The site cannot be moved off it',
          'Growth. The first time you need something the platform does not offer',
        ],
        [
          'Freelancer',
          'A first real site for a small business with a clearly bounded scope',
          'Anywhere from excellent to templated, depending entirely on the individual',
          'Depends on the individual and on whether speed was ever in the brief',
          'Usually present at page level, rarely at architecture level',
          'Normally yours, if the contract says so and the accounts are handed over',
          'Availability. Support, changes and continuity all rest on one person',
        ],
        [
          'Small studio',
          'An established business that wants a considered site and a real design process',
          'Custom design within a defined system, usually strong visually',
          'Generally good, though rarely measured against field data after launch',
          'Solid on-page work, variable on architecture, schema and internal linking',
          'Yours, with a maintainable codebase in most cases',
          'The gap after launch. The site ships and then nobody owns its performance',
        ],
        [
          'Specialist growth agency',
          'A business where the site is a primary acquisition channel with revenue attached',
          'A design system rather than a set of pages, built to extend without a rebuild',
          'Engineered and monitored against Core Web Vitals field data',
          'Architecture, schema, internal linking and content model designed before build',
          'Yours, in your repository, on infrastructure you can move',
          'Your own capacity. The system can do more than the team feeds it',
        ],
      ],
    },
    {
      type: 'p',
      text: 'As a market observation rather than a quote, builder subscriptions commonly sit in the low three figures per year, freelance builds commonly land in four figures, studio work typically runs into five, and a specialist engagement that includes strategy, content, integrations and a measurement setup commonly sits in the upper five figures or beyond depending on scope. Those bands overlap heavily and any of them can be the correct decision. What determines correctness is not the number. It is whether the site has a revenue job to do.',
    },
    { type: 'h2', text: 'Sticker Price Is Roughly Half the Story' },
    {
      type: 'p',
      text: 'The build cost is a one-time number that is easy to compare. The cost of ownership is a recurring number that nobody puts in the proposal, and over a typical five-year life it frequently exceeds the build. Price the whole thing before you compare anything.',
    },
    {
      type: 'ol',
      items: [
        'Hosting and infrastructure, which scales with traffic and with how efficiently the site was built.',
        'Domain, certificates and transactional email delivery, small individually and permanent collectively.',
        'Platform, theme and plugin licenses, which renew annually and increase.',
        'Security patching and dependency updates, which are not optional and which nobody does for free.',
        'Content changes, priced either as developer time or as the cost of the CMS that avoided it.',
        'Analytics, consent and conversion tracking maintenance, which quietly break whenever a tag or a platform changes.',
        'Integration maintenance, because every connected vendor will eventually change something.',
        'Design and content drift, which becomes a redesign roughly every three to five years unless the system was built to extend.',
      ],
    },
    {
      type: 'p',
      text: 'The last item is the expensive one. A site built as a set of hard-coded pages reaches its limit the first time the business changes what it sells, and the only remedy is another build. A site built as a design system with a content model absorbs a new service line, a new industry page or a new case study format as configuration rather than as a project. That difference does not show up on the invoice. It shows up in whether you buy another website in year three or year eight.',
    },
    { type: 'h2', text: 'The Cost That Never Appears on Any Quote' },
    {
      type: 'p',
      text: 'A website has one financial job: to convert attention you have already paid for into enquiries worth having. Everything above is the cost of the asset. The larger number is usually the revenue the asset fails to produce, and that number is invisible because it never becomes a transaction anyone records.',
    },
    {
      type: 'callout',
      title: 'The number that decides your budget is not the price of the website',
      text: 'It is what a customer is worth to you and how many of them the current site is failing to convert. If a site turns one visitor in a hundred into an enquiry and a rebuilt version turns three, it has tripled the return on exactly the same traffic budget, with no increase in spend. Until you know your average customer value, your close rate and your current conversion rate, every quote in front of you is unpriceable, because you have no way to judge what it returns.',
    },
    {
      type: 'p',
      text: 'This is also why the cheap option is frequently the expensive one. A build that saves you a five-figure sum but converts at half the rate of the alternative pays that saving back within the first year in any business with meaningful traffic and a customer worth four figures. The saving is certain and immediate. The loss is uncertain, delayed and never invoiced, which is precisely why it wins arguments it should lose.',
    },
    { type: 'h2', text: 'A Budget Framework Built From Your Own Numbers' },
    {
      type: 'p',
      text: 'Ignore what websites are supposed to cost. Work out what this one is worth to you, then decide how much of that value you are prepared to invest to capture it.',
    },
    {
      type: 'ol',
      items: [
        'Establish average customer value. Take the gross profit on a typical engagement or order, then multiply by the average number of repeat purchases over the relationship. Use gross profit rather than revenue, because that is the money the website actually earns you.',
        'Establish your close rate from enquiry to customer. Most businesses have this number approximately, and approximately is enough to make the decision.',
        'Calculate what one qualified enquiry is worth: average customer value multiplied by close rate. This single figure reframes the entire budget conversation.',
        'Estimate the additional enquiries a better site would produce. Be conservative. Use your current traffic and a modest improvement in conversion rate, not a hoped-for increase in traffic.',
        'Multiply. Additional enquiries per month, multiplied by the value of an enquiry, multiplied by twelve, gives you the annual value of the improvement.',
        'Compare that annual value against the total cost of ownership over the same period, not against the build price. If the annual value clears the annual cost comfortably, the budget question is answered and the remaining question is which provider can actually deliver the improvement.',
      ],
    },
    {
      type: 'p',
      text: 'This framework produces uncomfortable results in both directions, which is the point. A business with a customer worth a modest amount and low traffic should probably not commission a bespoke build, and no honest provider should encourage it. A business where one new client is worth a five-figure sum and the site currently converts poorly is underinvesting at almost any quote on the table, and the delay costs more than the difference between the quotes.',
    },
    { type: 'h2', text: 'What to Ask Before You Accept Any Quote' },
    {
      type: 'p',
      text: 'The answers to these questions separate providers far more reliably than the price does. Ask all of them, and be suspicious of vagueness rather than of expense.',
    },
    {
      type: 'ul',
      items: [
        'Who owns the code, the domain, the hosting account and the analytics properties after launch, and is that in writing?',
        'Is the page content present in the server-rendered HTML, or assembled by JavaScript in the browser?',
        'What Core Web Vitals target are you building to, and will you measure field data after launch or only lab scores?',
        'Which parts of the site can we change ourselves, and which require a developer?',
        'What happens when we need a page type that was not in the original scope? Is that configuration or a new project?',
        'Is content production in scope? If not, exactly what are we responsible for writing and by when?',
        'What does conversion tracking include, and will we be able to see which pages produce enquiries?',
        'What is covered by support after launch, what is billed, and what is the response commitment?',
        'What does the handover include if we ever move to another provider?',
      ],
    },
    { type: 'h2', text: 'Deciding What to Actually Buy' },
    {
      type: 'p',
      text: 'The honest summary is that there is no correct price for a business website, only a correct decision for a specific business with specific economics. If the site is a credential that people check after a referral, buy the cheapest thing that looks credible and loads quickly, and spend the difference on whatever actually generates your demand. If the site is the front door of your acquisition, treat it as capital equipment: price the total cost of ownership, judge it against the value of the enquiries it should produce, and buy the version that can be extended rather than replaced.',
    },
    {
      type: 'p',
      text: 'The failure mode to avoid is the middle: paying real money for something built without a revenue job, without a measurement setup, and without an architecture that can grow. That is the version that gets rebuilt in two years by someone who asks why nobody set it up properly the first time.',
    },
    {
      type: 'p',
      text: 'If you want a number grounded in your situation rather than in an average, our web design and web development engagements start with scope, not with a package. Send us your current site, your traffic, and what a new customer is worth to you, and we will tell you where the value is, what it would take to capture it, and whether the investment is justified at all. Sometimes the correct recommendation is a smaller project than the one you came in asking for.',
    },
  ],
  faqs: [
    {
      question: 'How much should a small business budget for a website in 2026?',
      answer:
        'Budget from the value of an enquiry rather than from a market average. Multiply your average customer gross profit by your close rate to get what one enquiry is worth, then estimate how many additional enquiries a better site would produce annually. As a market observation, freelance builds commonly land in four figures and studio or agency work in five, but the right band is the one your enquiry economics justify.',
    },
    {
      question: 'Is a template or site builder ever the right choice?',
      answer:
        'Yes, when the website is a credential rather than an acquisition channel. If demand comes from referrals, a physical location or outbound sales, and the site mainly needs to look credible and load fast, a builder is a rational decision. It becomes the wrong decision the moment you need performance control, a content architecture that scales, or an integration the platform does not support.',
    },
    {
      question: 'Why do agencies charge more than freelancers for the same page count?',
      answer:
        'Because page count is not what either of them is pricing. An agency quote typically covers strategy, a reusable design system, content architecture, technical SEO foundations, integrations, accessibility, conversion tracking and continuity of support. A freelance quote often covers design and build against a scope you define. Both are legitimate, but they are different products, and comparing them by page count compares the only variable that barely matters.',
    },
    {
      question: 'What does it cost to maintain a business website each year?',
      answer:
        'Recurring costs include hosting, domain and certificates, platform and plugin licenses, security and dependency updates, content changes, analytics and tracking maintenance, and integration upkeep. Over a five-year life these commonly total more than the original build. The larger hidden cost is the redesign cycle, which arrives far sooner on a site built as fixed pages than on one built as an extensible design system.',
    },
    {
      question: 'How do I know when a website quote is too cheap?',
      answer:
        'Look for what is missing rather than at the number. If the quote has no line for content, no conversion tracking, no performance target, no accessibility standard and no statement of who owns the code, the work has been scoped out rather than priced down. The cost has not disappeared, it has been deferred to you, and it usually reappears as an underperforming site nobody can extend.',
    },
  ],
  relatedServices: ['web-design', 'web-development', 'conversion-optimization', 'seo'],
}

export default article
