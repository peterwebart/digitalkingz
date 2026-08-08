import type { ServiceSeed } from '@/seed/types'

const service: ServiceSeed = {
  slug: 'google-ads',
  category: 'convert',
  title: 'Google Ads',
  navLabel: 'Google Ads',
  tagline: 'Buy intent, not impressions. Search accounts built to optimize toward closed revenue.',
  icon: 'Target',
  metaTitle: 'Google Ads Management That Buys Revenue',
  metaDescription:
    'Google Ads management built around unit economics: intent-led account structure, search term hygiene, conversion tracking and offline conversion imports.',
  heroEyebrow: 'Paid Search',
  heroHeading: 'The Shortest Distance Between a Problem and a Purchase',
  heroSubheading:
    'Google Ads is the one channel where you can appear at the exact moment someone is trying to solve the problem you solve. We build accounts that spend against that moment and almost nothing else.',
  intro: [
    'Search is the only channel where the demand already exists before you spend anything. Someone has a problem, they describe it in their own words, and an auction decides who gets to answer. That is a fundamentally different economic proposition to interrupting people who were not thinking about you, and it is why paid search is usually the fastest line to first revenue in a growth program.',
    'It is also the easiest place to lose money quietly. An account can look healthy on the surface while a meaningful share of budget flows to search terms that were never going to convert, to a landing page that answers a different question than the ad asked, or to an automated bidding strategy trained on the wrong success signal. Nothing visibly breaks. The spend simply underperforms.',
    'We treat a Google Ads account as a financial instrument rather than a marketing channel. What does a qualified lead cost, what share of those leads close, what is a customer worth over their lifetime, and how long is the payback period on the spend. Those four numbers decide whether an account should scale, hold or be rebuilt. Everything we do inside the platform serves them.',
  ],
  problemsHeading: 'Where Paid Search Budgets Quietly Leak',
  problems: [
    {
      title: 'The Account Is Optimizing Toward the Wrong Signal',
      body: 'Smart bidding does exactly what you tell it to do. If the conversion action is a form submission, the algorithm will find you the cheapest form submissions available, including from people who will never buy. Without revenue fed back into the platform, you are paying an increasingly capable machine to manufacture the wrong outcome at scale.',
    },
    {
      title: 'Nobody Reads the Search Terms Report',
      body: 'Keywords are what you bid on. Search terms are what people actually typed. The gap between the two is where broad match and automated campaign types spend money on research queries, job seekers, competitor staff and do-it-yourself intent. Left unattended for a quarter, that gap becomes the largest line item nobody has looked at.',
    },
    {
      title: 'The Landing Page Answers a Different Question',
      body: 'The ad promises one thing and the page delivers a general overview of the company. That mismatch costs twice. Visitors leave, and the landing page experience component of Quality Score pushes your cost per click up across the account. Paid traffic is the least forgiving audience you will ever buy.',
    },
    {
      title: 'Automation Running Without Guardrails',
      body: 'Performance Max and broad match with smart bidding can perform well, but only inside a structure that constrains them. Without brand exclusions, disciplined asset groups, audience signals and channel-level reporting, automated campaigns will happily take credit for demand you already had and push new budget toward the cheapest available inventory.',
    },
  ],
  includedHeading: 'What a Google Ads Engagement Includes',
  includedIntro:
    'Paid search management is measurement work, structural work and creative work in roughly equal parts. Skip any one of the three and the other two stop compounding.',
  included: [
    {
      title: 'Account Architecture',
      body: 'Campaigns segmented by buying intent and margin rather than by whatever structure was inherited. Budget boundaries that protect your highest-value service lines instead of letting one cheap, high-volume keyword absorb the account.',
    },
    {
      title: 'Keyword and Intent Mapping',
      body: 'Every term classified by where it sits in the buying decision, from early research through to ready to hire. Bids, ad copy and destination pages are then matched to that stage instead of treating all traffic as equally valuable.',
    },
    {
      title: 'Search Term Hygiene',
      body: 'A standing review of what people actually typed, with negative keyword sculpting at account, campaign and ad group level. Unglamorous, continuous work, and usually where the first efficiency gains come from.',
    },
    {
      title: 'Conversion Tracking Rebuilt From Scratch',
      body: 'Enhanced conversions, server-side tagging where the setup justifies it, consent handling, and deduplication across analytics and the ads platform. If the numbers in the account cannot be trusted, no decision made after this point can be either.',
    },
    {
      title: 'Offline Conversion Imports',
      body: 'A feedback loop from your CRM back into Google, so the platform learns which clicks became qualified opportunities and which became closed revenue. Bidding then optimizes toward the outcome that pays you, not the one that is easiest to count.',
    },
    {
      title: 'Ad Copy and Landing Page Match',
      body: 'Ad variations tested against the specific query set they serve, pointed at pages built to answer that query. Where the existing page is the constraint, we fix the page rather than bidding harder into a weak destination.',
    },
    {
      title: 'Performance Max Discipline and Budget Pacing',
      body: 'Brand exclusions, structured asset groups, audience signals and search theme control, plus pacing so budget is neither exhausted in the first three weeks of a month nor left unspent at the end of a quarter.',
    },
  ],
  approachHeading: 'How We Run Paid Search',
  approach: [
    {
      step: '01',
      title: 'Audit the Money Trail',
      body: 'We start with where the spend went and what it produced, not with keyword ideas. Search terms, wasted spend, conversion action definitions, tracking accuracy, destination pages, and the gap between conversions reported in the platform and actual sales recorded in your CRM.',
    },
    {
      step: '02',
      title: 'Fix Measurement Before Spending More',
      body: 'Nothing gets scaled on top of unreliable data. Conversion actions are redefined around commercially meaningful events, tracking is rebuilt with enhanced conversions, and duplicate or vanity conversions are removed so reported performance matches what the business actually experienced. Reporting then starts from a number the finance team can defend.',
    },
    {
      step: '03',
      title: 'Restructure Around Intent',
      body: 'Campaigns are rebuilt so budget follows margin and buying stage. High-intent service terms get protected budget and tight match control. Research-stage terms either earn a smaller allocation with a different offer, or leave the account entirely and get handed to SEO and content instead.',
    },
    {
      step: '04',
      title: 'Match the Destination',
      body: 'Ads point at pages designed for the query, carrying the offer, the proof and the form that query deserves. We test headline hierarchy, form length and the qualification questions that decide whether your sales team spends its day on real opportunities.',
    },
    {
      step: '05',
      title: 'Optimize Toward Closed Revenue',
      body: 'Once CRM outcomes flow back into the platform, bidding is retrained on qualified pipeline and closed deals. From that point the monthly conversation moves off cost per click and onto cost per qualified lead, close rate and payback period. Those are numbers a budget decision can actually be made on.',
    },
  ],
  outcomesHeading: 'What Changes When Paid Search Is Run Properly',
  outcomesIntro:
    "These are the shifts that show up inside a working engagement. We do not publish performance figures we cannot attribute to a named account with that client's permission on record.",
  outcomes: [
    {
      title: 'Spend That Follows Intent',
      body: 'Budget concentrates on queries from people actively trying to buy and stops funding curiosity, research and job seekers. The account often gets smaller before it gets bigger, and the pipeline improves while it does.',
    },
    {
      title: 'A Sales Team With Better Days',
      body: 'Fewer unqualified enquiries reaching the calendar means the people you pay to sell spend their hours on conversations that can close. Close rate tends to improve without anyone changing how they sell.',
    },
    {
      title: 'Bidding That Knows What a Customer Is Worth',
      body: 'With revenue data flowing back into the platform, the algorithm can pay more for clicks that become high-value customers and less for the ones that become cheap, low-margin work you did not want.',
    },
    {
      title: 'A Channel You Can Forecast',
      body: 'When cost per qualified lead and close rate are measured and stable, additional budget becomes a decision with a predictable output. That is the point where paid search reads as an investment case rather than a monthly expense.',
    },
  ],
  deepDive: [
    {
      heading: 'Why Most Google Ads Accounts Leak Money',
      paragraphs: [
        'The structural failure in most accounts is that they were built around what the business sells rather than around how people buy. Service lines with very different margins share one budget. Research queries and ready-to-hire queries sit in the same ad group competing for the same bid. When a cheap, high-volume term dominates impression share, it starves the terms that actually produce booked work, and the account keeps reporting a respectable cost per conversion while the pipeline gets worse.',
        'Quality Score compounds the problem. Google calculates it from expected clickthrough rate, ad relevance and landing page experience, and it feeds directly into what you pay per click and whether your ad shows at all. Generic ad copy pointed at a generic page is not only a conversion problem. It is a pricing problem, because you are bidding against competitors whose relevance is subsidizing their cost per click while yours inflates it.',
        'Then there is the search terms report, which almost nobody reviews at the cadence broad match demands. Automated match types and Performance Max will find query space you never intended to buy. Some of it is valuable and deserves promotion into its own campaign with its own budget. Most of it is not, and it only leaves the account when someone deliberately sculpts it out with negatives. That review is a standing weekly job, not a quarterly clean-up.',
      ],
    },
    {
      heading: 'Conversion Tracking Is the Product, Not the Reporting',
      paragraphs: [
        'Automated bidding is a machine that optimizes toward whatever you define as success. Define success as a form submission and you will get form submissions, including from people who wanted a job, a price list or a supplier introduction. The platform is not wrong. It is doing precisely what the conversion action told it to do, and it gets better at doing it every week the definition goes unchallenged. Left long enough, you have an account that is extremely efficient at buying the wrong thing.',
        'The repair is a measurement chain that reaches past the form. Enhanced conversions improve match quality on events you already capture. Server-side tagging makes those events more durable as browser restrictions tighten. Offline conversion imports then push information back the other way, so when a lead becomes a qualified opportunity in your CRM and later a closed deal, Google learns which click produced it. Bidding starts paying for revenue instead of paying for interest.',
        'This is where paid search and CRM systems stop being separate projects. Lead scoring, lifecycle stages and clean source attribution are not administrative tidiness. They are the training data your bidding strategy runs on. An account with that loop closed behaves very differently to one without it, and it is the only way to answer the question every owner eventually asks, which is not what a click cost but what a customer cost.',
      ],
    },
    {
      heading: 'Paid Search Should Not Run in Isolation',
      paragraphs: [
        'A Google Ads account is one link in a chain that runs from brand to website to traffic to conversion to CRM to revenue. Weakness anywhere along that chain surfaces as a paid media problem, because paid media is where the cost is visible and immediate. Slow pages raise the effective price of every click. Thin proof on the landing page lowers close rate. A CRM nobody follows up in turns expensive leads into sunk cost within days.',
        'That is why paid search engagements usually run alongside conversion optimization work on the destination pages, and why brand strength is a commercial variable rather than an aesthetic one. A recognized name earns a higher clickthrough rate from the same auction position, and expected clickthrough rate is one of the three inputs to Quality Score. Investment in branding lowers what you pay for the same click. The effect is marginal in any single auction and material across a year of spend.',
        'Search also has a ceiling. Only so many people type your terms in a given month, and once you own that demand, further growth has to come from creating it. That is the point at which Meta ads, content and SEO stop being alternatives to paid search and start being the way you keep feeding it. Knowing where your ceiling sits is far more useful than pretending it is not there.',
      ],
    },
  ],
  faqs: [
    {
      question: 'How much should we budget for Google Ads?',
      answer:
        'Start from the arithmetic rather than a round number. Estimate the cost per click in your category, the share of clicks that become enquiries on your current pages, the share of enquiries your team converts, and what a customer is worth. That chain tells you what a customer will cost to acquire and therefore what a meaningful test budget looks like. A budget too small to produce a readable number of conversions each month is not a cheap test, it is an unreadable one.',
    },
    {
      question: 'How long before Google Ads produces qualified leads?',
      answer:
        'Clicks arrive on day one, qualified leads take longer. The first few weeks are spent gathering search term data, removing waste and letting bidding strategies settle out of their learning behavior. Sound judgment about cost per qualified lead needs enough conversion volume to be statistically honest, which depends on your budget and deal frequency rather than a fixed calendar. Businesses with long sales cycles need longer still, because the outcome that matters happens weeks after the click.',
    },
    {
      question: 'Should we run Google Ads if we are already investing in SEO?',
      answer:
        'Usually yes, because they buy different things. SEO compounds and lowers your long-run cost of acquisition, but it does not let you choose which quarter it arrives in. Paid search gives you immediate presence, control over which terms you appear for, and a fast read on which messages and offers convert. That read then makes the SEO program sharper, because you learn which queries produce revenue before spending months earning them organically.',
    },
    {
      question: 'What is an offline conversion import and why does it matter?',
      answer:
        'An offline conversion import sends outcomes from your CRM back into Google Ads, tying a qualified opportunity or a closed deal to the original click. It matters because smart bidding optimizes toward whatever you define as success. If success is a form submission, you get form submissions. If success is closed revenue, the platform starts finding people who behave like buyers. For any business where lead quality varies widely, this is the highest-leverage change available in the account.',
    },
    {
      question: 'Is Performance Max worth running?',
      answer:
        'It can be, in the right conditions and with guardrails in place. Performance Max works best with strong creative assets, clean product or lead data, and enough conversion volume for the algorithm to learn from. It needs brand term exclusions so it does not claim demand you already own, disciplined asset groups, and channel-level reporting so you can see where spend actually went. Run without those controls, it tends to absorb budget and report flattering numbers.',
    },
    {
      question: 'Who owns the ad account and the data?',
      answer:
        'You do. We work inside your own Google Ads, analytics and tag management accounts with access granted to us rather than owned by us, so the spend history, audiences and conversion data stay with you if the relationship ends. Agencies that run client campaigns from their own accounts are holding an asset you paid to build. Account ownership is worth confirming in writing before any engagement begins, with us or with anyone else.',
    },
  ],
  relatedServices: ['conversion-optimization', 'seo', 'meta-ads', 'crm-systems'],
  relatedIndustries: ['law-firms', 'home-services', 'medical', 'professional-services'],
  ctaHeading: 'Find Out What Your Account Is Actually Buying',
  ctaBody:
    'Give us read access and we will show you where the spend goes, what the tracking is missing, and what the account looks like rebuilt around closed revenue. You keep the findings either way.',
}

export default service
