import type { ServiceSeed } from '@/seed/types'

const service: ServiceSeed = {
  slug: 'ecommerce',
  category: 'build',
  title: 'E-commerce Development',
  navLabel: 'E-commerce',
  tagline: 'Stores engineered around conversion rate, average order value and customer lifetime value.',
  icon: 'ShoppingBag',
  metaTitle: 'E-commerce Development That Sells | Digital Kingz',
  metaDescription:
    'E-commerce development built on revenue mechanics: checkout friction, product schema, merchant feed quality, average order value and post-purchase automation.',
  heroEyebrow: 'Build / E-commerce',
  heroHeading: 'Every Point of Friction Has a Price',
  heroSubheading:
    'Storefronts engineered around the numbers that decide profitability: conversion rate, average order value, checkout completion and what a customer is worth over their lifetime.',
  intro: [
    'An online store is a machine with three dials: how many people arrive, what share of them buy, and how much each order is worth. Most store owners spend almost all of their budget on the first dial. The other two are where the margin lives, because improving them costs nothing per additional order and applies to every channel already running.',
    'Cart abandonment is rarely a mystery. People leave when shipping cost appears late, when guest checkout is not offered, when the payment method they use is missing, when the page is slow on a phone, or when a returns policy they cannot find makes the purchase feel risky. Each cause is fixable, and each fix keeps paying out on every future order.',
    'We build stores that treat the transaction as one part of a longer relationship. Product data feeds shopping channels, structured data makes listings eligible for rich results, checkout is stripped back to what is genuinely required, and post-purchase automation does the work of turning a first order into a second. Acquisition keeps getting more expensive. Retention is where the economics recover.',
  ],
  problemsHeading: 'Where Online Stores Lose Revenue',
  problems: [
    {
      title: 'Checkout Asks for More Than the Sale Requires',
      body: 'Every additional field, mandatory account creation and unexplained cost is an invitation to reconsider. Shipping charges revealed on the final step are the most reliable way to lose a customer who had already decided to buy. Checkout should collect what is legally and logistically necessary, present the total cost early, and offer the payment methods your customers actually use.',
    },
    {
      title: 'Product Pages Answer the Wrong Questions',
      body: 'Product pages built from supplier descriptions tell a shopper what the item is, not whether it solves their problem. Missing sizing detail, unclear delivery timing, no returns information, thin imagery and no reviews all push the decision into a comparison tab. The visitor rarely abandons the purchase. They complete it somewhere the answers were easier to find.',
    },
    {
      title: 'The Product Feed Is an Afterthought',
      body: 'Shopping campaigns and marketplace listings are only as good as the data behind them. Missing product identifiers, weak titles, poor category mapping and stale availability all suppress reach and waste budget on impressions that were never going to convert. Feed quality is a technical asset that quietly determines what your paid shopping spend is able to achieve.',
    },
    {
      title: 'Nothing Happens After the First Order',
      body: 'Most stores treat the confirmation email as the end of the relationship. No replenishment reminder, no complementary product sequence, no review request, no win-back for lapsed buyers. Acquiring a new customer costs money every single time; contacting an existing one costs almost nothing, and existing customers have already trusted you enough to pay once.',
    },
  ],
  includedHeading: 'What an E-commerce Build Includes',
  includedIntro:
    'Scope is set by the mechanics that move revenue for your catalog and your margins, not by a fixed feature checklist.',
  included: [
    {
      title: 'Commercial and Catalog Discovery',
      body: 'We map margin by product, order value distribution, repeat purchase behavior and the questions your support inbox answers most often. Those patterns decide navigation, bundling, merchandising and where the store should be pushing attention.',
    },
    {
      title: 'Conversion-Focused Product and Category Pages',
      body: 'Templates carrying imagery, variant selection, delivery expectation, returns clarity, stock signals, reviews and cross-sells in a sequence that answers doubt as it appears. Category pages are built as landing pages, with filtering that does not fragment the index.',
    },
    {
      title: 'Streamlined Checkout',
      body: 'Guest checkout, minimal fields, address autocomplete, transparent shipping and tax before the final step, saved payment options and the wallets your customers expect. Every removed step is a permanent gain applied to all future orders rather than a one-off improvement.',
    },
    {
      title: 'Product Schema and Merchant Feed Engineering',
      body: 'schema.org Product markup covering price, availability, ratings and shipping detail, plus a clean feed with complete identifiers, structured titles and accurate category mapping so shopping surfaces and AI shopping assistants can read the catalog correctly.',
    },
    {
      title: 'Performance Under Real Conditions',
      body: 'Image optimization across large catalogs, lazy loading that respects Core Web Vitals, cached category pages, fast on-site search and filtering, and a checkout that stays responsive during promotional traffic, when the cost of a slow page is highest.',
    },
    {
      title: 'Analytics and Revenue Attribution',
      body: 'Ecommerce event tracking from product view through to purchase, server-side events where accuracy matters, channel attribution, and reporting built around average order value, conversion rate by source and repeat purchase rate rather than session counts.',
    },
    {
      title: 'Post-Purchase and Lifecycle Automation',
      body: 'Abandoned cart recovery, order and delivery notifications, review requests timed to the product, replenishment reminders, cross-sell sequences and win-back campaigns, connected to your CRM so marketing and support see the same customer history.',
    },
  ],
  approachHeading: 'How We Build Stores',
  approach: [
    {
      step: '01',
      title: 'Unit Economics First',
      body: 'Before design, we look at what each order is worth, which products carry margin, what acquisition currently costs and how often customers return. A store built without those numbers optimizes for the wrong things, usually by discounting the products that were already profitable.',
    },
    {
      step: '02',
      title: 'Catalog and Content Architecture',
      body: 'Category structure, variant modeling, attribute taxonomy, filtering rules and URL patterns are designed together. This determines how shoppers navigate, how faceted pages behave in search, and how cleanly the catalog exports to shopping feeds and marketplaces later. Getting this wrong is expensive to unpick once the URLs are indexed.',
    },
    {
      step: '03',
      title: 'Design the Path to Purchase',
      body: 'Product, category, cart and checkout templates are designed as a single sequence rather than as separate screens. We remove steps, surface cost and delivery information early, and place proof where hesitation happens. Mobile is designed first, because that is where most browsing happens.',
    },
    {
      step: '04',
      title: 'Build, Integrate and Test',
      body: 'Storefront, payments, tax, shipping rules, inventory sync, fulfillment integrations and the marketing stack are built and tested against real order scenarios, including refunds, partial shipments and failed payments. Edge cases are considerably cheaper to find before customers do, and every one caught is a support ticket nobody has to answer.',
    },
    {
      step: '05',
      title: 'Launch and Optimize Continuously',
      body: 'After launch the work moves to the funnel: checkout completion, product page behavior, feed health, site search queries returning nothing, and the lifecycle sequences. A store is not a project that finishes. It is an asset that gets tuned against live data every month.',
    },
  ],
  outcomesHeading: 'What Changes in the Numbers That Matter',
  outcomesIntro:
    'The directional outcomes we work toward, stated without invented figures attached to them.',
  outcomes: [
    {
      title: 'Fewer Abandoned Carts for Reasons You Control',
      body: 'Total cost visible early, guest checkout available, familiar payment methods present and a fast mobile flow remove the avoidable reasons a decided buyer walks away at the final step. Recovery emails then handle real hesitation rather than self-inflicted friction.',
    },
    {
      title: 'Higher Value per Order',
      body: 'Bundling, considered cross-sells, thresholds set against real margin and merchandising informed by what genuinely sells together raise what a customer spends without raising what the visit cost you. Margin improves on orders you were already going to receive.',
    },
    {
      title: 'Shopping Channels That Can Read Your Catalog',
      body: 'Complete, structured product data makes listings eligible across shopping surfaces, comparison tools and the AI assistants now answering product questions directly, which is reach competitors with thin feeds cannot access.',
    },
    {
      title: 'Customers Who Come Back Without Being Rebought',
      body: 'Lifecycle automation keeps the store in front of people who have already paid once. Repeat revenue arrives without paying acquisition cost again, which is what makes advertising sustainable as you scale.',
    },
  ],
  deepDive: [
    {
      heading: 'Conversion Rate and Average Order Value: The Two Levers Traffic Cannot Replace',
      paragraphs: [
        'Store revenue is traffic multiplied by conversion rate multiplied by average order value. Traffic is the only one of the three that costs money every single time. The other two are structural: once checkout friction is removed or a bundling strategy works, the improvement applies to every order that follows, including the ones you have already paid to acquire. That is why we start with the mechanics rather than with the media plan.',
        'Average order value responds to merchandising far more than to discounting. Complementary products presented at the moment of decision, bundles priced against real margin, free shipping thresholds set slightly above your current average order value, and quantity options that match how the product is actually consumed all raise basket size without eroding price. Discounting raises volume and destroys margin, which is why it should be a deliberate tactic rather than a default setting.',
        'Conversion rate improvement, by contrast, is mostly subtraction. Fewer fields, fewer steps, fewer surprises, fewer unanswered questions. The most valuable work in e-commerce is usually identifying which specific doubt causes people to leave a particular product page, then answering it in place. Session recordings, checkout funnel data and site search queries that return nothing tell you where those doubts are, which is exactly where conversion optimization earns its fee. The answer is rarely the one the team assumed it would be.',
      ],
    },
    {
      heading: 'Product Data, Structured Markup and Being Found by Shopping Surfaces',
      paragraphs: [
        'Product data is infrastructure. Shopping campaigns, marketplace listings, comparison engines and increasingly AI shopping assistants all consume a structured feed, and they reward completeness. Titles built to a consistent pattern with brand, product type and key attributes, accurate GTINs and MPNs, correct product categorization, real-time availability and multiple images determine how often a listing is eligible to appear at all. Poor feed data does not produce an error message. It produces silence.',
        'On the site itself, schema.org Product markup with offers, price, currency, availability and aggregate ratings makes listings eligible for rich results and gives AI systems an unambiguous machine-readable description of what you sell. Combined with clear category pages and genuinely useful buying guides, this is how a store becomes the source a model cites when someone asks which product to buy. It is the same entity work that underpins our SEO practice, applied to a catalog, and it depends on the web development side exposing those fields correctly in the first place.',
        'The practical test is simple. Export your feed and read fifty rows as a stranger would. If you cannot tell what the product is, who it is for, which variant it represents and whether it is in stock, neither can the systems deciding whether to show it. Most feed problems turn out to be content problems wearing a technical costume, and fixing them usually costs less than a week of the advertising budget they are currently wasting.',
      ],
    },
    {
      heading: 'Lifetime Value, Post-Purchase Automation and Why Retention Funds Growth',
      paragraphs: [
        'Acquisition costs rise. Retention costs do not, and the gap between them determines whether an e-commerce business can afford to keep buying traffic. A customer who orders three times over two years is worth three times the acquisition spend that produced them, which means the ceiling on what you can pay for a click is set by what happens after the first purchase, not before it. Businesses that understand this can outbid the ones that do not.',
        'Post-purchase automation is where that value gets built. Order and delivery updates that reduce support load, review requests timed to when the product has actually been used, replenishment reminders calculated from real consumption cycles, cross-sell sequences based on what the customer already owns, and win-back campaigns for lapsed buyers. Each is a small automated sequence, and together they run continuously without adding headcount to the business. The build cost is one-off; the return arrives on every order that follows.',
        'Connecting all of this to a CRM matters more than any individual email. When order history, support conversations, marketing engagement and advertising audiences reference the same customer record, segmentation becomes real and AI automation can act on it: flagging a high-value customer to a human, suppressing ads for someone who bought yesterday, or routing a delivery complaint before it becomes a public review. Your store should not exist in isolation from the systems holding the customer relationship.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Which e-commerce platform do you recommend?',
      answer:
        'It depends on catalog complexity, order volume and how much custom functionality drives your revenue. Hosted platforms are efficient for straightforward catalogs where speed to launch matters most. A headless build with a Next.js storefront makes sense when performance, custom merchandising logic, complex product data or tight integration with other systems are commercially significant. We recommend against your operating model and total cost over several years, not against platform preference.',
    },
    {
      question: 'How do you reduce cart abandonment?',
      answer:
        'By removing the causes rather than only chasing the symptom with recovery emails. That means showing shipping and tax before the final step, offering guest checkout, cutting form fields to what fulfillment genuinely needs, supporting the payment methods your customers already use, keeping checkout fast on mobile, and making the returns policy visible at the point of decision. Recovery sequences then catch the remainder instead of doing all the work.',
    },
    {
      question: 'Can you improve our existing store instead of rebuilding it?',
      answer:
        'Usually yes, and it is often the better investment. We audit the funnel, product data quality, page performance and lifecycle automation, then rank fixes by revenue impact against effort. Many stores gain more from a checkout rebuild, a feed overhaul and a post-purchase sequence than from a full replatform. A rebuild is warranted when the platform itself blocks something the business needs to do.',
    },
    {
      question: 'Do you handle product feeds for shopping campaigns?',
      answer:
        'Yes. We build and maintain the feed as a technical asset: structured titles, complete identifiers, accurate categorization, correct availability and pricing sync, image requirements and attribute coverage. Feed quality directly limits what Google Ads shopping campaigns and marketplace listings can reach, so we treat it as engineering work rather than as an export button pressed once at launch and forgotten.',
    },
    {
      question: 'How do you handle selling into multiple countries?',
      answer:
        'Through currency, tax, shipping and content configuration decided before the build rather than patched on later. That covers localized pricing and payment methods, correct tax handling per region, hreflang implementation so search engines serve the right version, realistic delivery expectations by destination, and a returns process that is honest about cost. The technical work is manageable; the operational commitments behind it usually need scrutiny first.',
    },
    {
      question: 'What ongoing work does a store need after launch?',
      answer:
        'Continuous funnel and catalog attention: monitoring checkout completion, finding product pages that attract traffic but no add-to-carts, keeping the feed healthy as the catalog changes, reviewing site search terms with no results, testing lifecycle sequences, and applying platform and dependency updates. Stores decay faster than brochure sites because the catalog, the competition and the payment ecosystem all keep moving underneath you.',
    },
  ],
  relatedServices: ['web-development', 'conversion-optimization', 'google-ads', 'seo'],
  relatedIndustries: ['ecommerce-brands', 'b2b'],
  ctaHeading: 'Find the Revenue Already in Your Store',
  ctaBody:
    'Send us the store, your conversion rate and your average order value. We will show you where the funnel leaks, what the product feed is costing you, and which fixes pay back first.',
}

export default service
