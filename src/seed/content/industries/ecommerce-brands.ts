import type { IndustrySeed } from '@/seed/types'

const industry: IndustrySeed = {
  slug: 'ecommerce-brands',
  title: 'E-commerce Brands',
  navLabel: 'E-commerce',
  tagline: 'Storefronts, feeds and lifecycle systems built around contribution margin.',
  icon: 'ShoppingCart',
  metaTitle: 'E-commerce Growth & Web Development | Digital Kingz',
  metaDescription:
    'Store builds, product feeds, SEO, paid media and lifecycle automation for e-commerce brands. Grow revenue without eroding contribution margin or cash.',
  heroEyebrow: 'Industries',
  heroHeading: 'Growth That Survives Contact With Your Margin.',
  heroSubheading:
    'Revenue is easy to buy and easy to lose money on. We build storefronts, product data, organic architecture and lifecycle automation around the number that decides how fast a store can grow: contribution margin after cost of goods, shipping, returns and media.',
  intro: [
    'Contribution margin governs everything. It is what remains from an order after cost of goods, payment fees, pick and pack, outbound shipping, returns and the advertising that produced the sale. A campaign that lifts revenue while compressing that figure makes the business larger, busier and poorer at the same time, which is why discounting, free shipping thresholds and channel mix are financial decisions before they are marketing ones.',
    'The second trap is lifetime value. Acquiring at a loss on the first order and recovering across the following year is a legitimate strategy only if the business has the cash to fund the gap while simultaneously buying inventory for the growth it is creating. Scaling on blended return on ad spend and a lifetime value model is the most common way a growing store runs out of money while its dashboards look excellent.',
    'Everything else compounds off those two constraints. Brand and website create the conversion rate, product data and SEO create traffic that is not rented, paid media buys the increment, and CRM, email, SMS and automation extract the repeat purchases that carry the highest margin in the business because they do not require buying attention twice.',
  ],
  challengesHeading: 'Where E-commerce Growth Stalls',
  challengesIntro:
    'These four problems suppress margin quietly, and none of them show up as an obvious failure in a revenue chart.',
  challenges: [
    {
      title: 'Product Data That Fails Quietly',
      body: 'Shopping surfaces and free product listings depend on structured attributes. Missing identifiers, an unset brand, a price or availability that disagrees between feed and landing page, weak variant and size fields, images that breach requirements: any of these cause disapprovals or exclusion from matching. Feed work is unglamorous, invisible to the founder, and frequently the single largest recoverable source of demand.',
    },
    {
      title: 'Organic Traffic Built on Pages That Disappear',
      body: 'Product pages churn. Lines get discontinued, seasonal ranges vanish, sizes sell through, and the authority accumulated by those URLs is lost or redirected badly. Collection and category pages are the durable organic asset because they match how people actually search for a type of product and survive complete turnover of the inventory underneath them.',
    },
    {
      title: 'Mobile Speed Treated as an Engineering Concern',
      body: 'Most traffic is mobile, and most storefronts carry a decade of accumulated apps: reviews, chat, upsell widgets, heatmaps, several analytics pixels, each adding blocking script. Combined with unoptimized imagery, this shows up directly as lost conversion and worse paid media efficiency. Performance work is conversion work with a different job title.',
    },
    {
      title: 'Post-Purchase Left to Chance',
      body: 'The second order is the most profitable revenue in the business because the customer has already been paid for once. Yet many stores have no replenishment timing, no winback sequence, no segmentation beyond a monthly campaign to everyone, and use a discount code where a reason to return would do. Returns go equally unexamined by product, variant and reason.',
    },
  ],
  buyerBehaviourHeading: 'How Shoppers Actually Find and Buy',
  buyerBehaviour: [
    'Discovery has moved off the storefront. Shoppers begin in marketplace search, social feeds, creator content, shopping surfaces and AI assistants that assemble product comparisons from structured data, specifications and reviews. Brands with complete attributes, genuine review volume and detailed specification content get represented accurately in those summaries. Brands without them get described from a marketplace listing they do not control, in language they did not write, at a price they did not set.',
    'Consideration is comparative and ruthlessly price-transparent. Several tabs are open, and the shopper is checking sizing, materials, delivery windows, return terms and the total landed cost including shipping and any duties. The bulk of checkout abandonment traces to cost revealed late, forced account creation, limited payment options, slow pages and vague delivery dates rather than to insufficient persuasion. The cart is a disclosure problem far more often than it is a copywriting problem.',
    'Repeat behavior is set by the category, not by the marketing plan. Consumables have a natural consumption cycle that supports subscription and predictable replenishment timing. Durable, considered goods do not, so lifetime value has to come from range extension, gifting, referral and accessories instead. Applying a subscription playbook to a product bought once every few years burns the flow, and ignoring replenishment timing in a consumable leaves the cheapest revenue in the business unclaimed.',
  ],
  systemHeading: 'The E-commerce Growth System',
  systemIntro:
    'Six components, sequenced so that media spend is the last thing turned up rather than the first.',
  system: [
    {
      title: 'A Margin Model Before Any Media Spend',
      body: 'Contribution by product line including shipping, packaging and expected returns, translated into an allowable acquisition cost and a break-even return on ad spend per line, applied before Google Ads or Meta Ads budgets are set. This also sets the free shipping threshold, the discount floor and which products should never be advertised.',
    },
    {
      title: 'Product Data and Feed Operations',
      body: 'Attribute completeness, identifiers, a coherent variant structure, availability and price synchronized with the site, feed rules for problem categories, and structured data on product pages. This is the substrate under Shopping, free listings and how AI systems describe your catalog.',
    },
    {
      title: 'Collection-Led Organic Architecture',
      body: 'SEO built on category and collection pages that match how the category is searched, with deliberate rules for which filtered views are indexable, a redirect policy for retired products, and buying guides that pass authority into the collections rather than into orphaned blog posts.',
    },
    {
      title: 'Checkout and Speed Engineering',
      body: 'Web Development covering an honest app and script audit, an image pipeline, guest checkout, wallet payments, landed cost shown early, and delivery and returns information placed before the point of hesitation instead of behind a policy link in the footer.',
    },
    {
      title: 'Lifecycle Email and SMS',
      body: 'AI Automation and CRM Systems driving welcome, browse and cart recovery, post-purchase education, replenishment timed to actual consumption, winback and VIP segments. The highest-margin revenue available to a store, because it does not require buying the customer twice.',
    },
    {
      title: 'Owned-Channel Diversification',
      body: 'Reducing dependence on any single marketplace or ad platform by building branded demand, first-party data and direct repeat purchase. Marketplace revenue is real revenue, but it is rented, and the terms can change without warning or negotiation.',
    },
  ],
  deepDive: [
    {
      heading: 'Collection Page SEO and Product Data Search Engines Can Use',
      paragraphs: [
        'The durable organic asset in e-commerce is the collection page, not the product page. Individual products are discontinued, restyled and reissued under new codes, and each change threatens whatever ranking that URL had earned. Category and collection pages persist through the churn, and they match the way people actually search, which is by type, use case or material rather than by a model number they have never seen. Product pages still matter, but they earn their traffic on branded and model-specific queries.',
        'Faceted navigation is where this usually goes wrong. Filter combinations generate near-infinite URLs, and left unmanaged they consume crawl budget and split relevance across thousands of near-identical pages. The discipline is deciding which facet combinations represent genuine demand and deserve an indexable, properly titled page, and which should be blocked entirely. Alongside that, retired products need a redirect policy that sends authority to the parent collection rather than to the homepage or a soft error page.',
        'Product data feeds the paid and AI side of the same problem. Shopping placements and free listings match on structured attributes, so identifiers, brand, condition, availability, price, and variant fields such as size, color and material determine whether a product is eligible and how well it matches a query. Feed values must agree with the landing page or items are disapproved. The same structured detail is what AI assistants read when a shopper asks them to compare options.',
      ],
    },
    {
      heading: 'Contribution Margin, Payback and the Cash Cost of Scaling',
      paragraphs: [
        'Break-even return on ad spend is a function of contribution margin, not an industry benchmark, and it differs by product line. A high-margin line can sustain aggressive acquisition; a low-margin bulky item with expensive shipping and a meaningful return rate may be unprofitable at any realistic acquisition cost, and should be sold as an attachment rather than advertised as an entry product. Returns belong in the calculation as a per-line rate, because averaging them across a catalog hides exactly the products doing the damage.',
        'Cash is the constraint people meet last and most painfully. Growth consumes working capital: inventory is paid for before it sells, advertising is paid for before the order ships, and lifetime value arrives months later. A store scaling on first-order losses is effectively lending money to its own customers while also financing stock. The safe version sets a payback period the balance sheet can actually fund, then uses Conversion Optimization, average order value and repeat rate to shorten it before spending harder.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What return on ad spend do we need to be profitable?',
      answer:
        'There is no universal figure, because break-even return on ad spend is simply the inverse of your contribution margin rate. Calculate margin after cost of goods, payment fees, fulfillment, shipping and expected returns, then derive the break-even point per product line rather than for the store overall. Also separate blended performance from channel performance, since blended figures include organic and repeat orders that advertising did not create.',
    },
    {
      question: 'Should we prioritize product pages or collection pages for SEO?',
      answer:
        'Collections first in almost every catalog. They match category-level search behavior, they survive inventory turnover, and they concentrate authority in URLs that will still exist next season. Product pages earn their place on branded, model and long-tail specification queries, and they need a redirect policy for the day the item is discontinued. A store that builds organic performance entirely on product URLs rebuilds it every time the range changes.',
    },
    {
      question: 'Why do our products keep getting disapproved in Merchant Center?',
      answer:
        'Almost always a mismatch or an omission. Common causes are missing product identifiers or brand values, a price or availability in the feed that disagrees with the landing page, incomplete variant attributes, images that breach requirements, and category-specific policy restrictions. Feed and storefront must be synchronized, not merely similar, because the check compares them directly. Review diagnostics on a schedule, not only when traffic drops.',
    },
    {
      question: 'How do we reduce cart and checkout abandonment?',
      answer:
        'Remove the surprises before adding the incentives. Show shipping cost and any duties early rather than at the final step, allow guest checkout, offer wallet and local payment methods, state a concrete delivery window, make the returns policy visible at the point of doubt, and fix mobile page speed in the checkout path. Recovery emails and messages then work on genuine hesitation rather than compensating for a self-inflicted problem.',
    },
    {
      question: 'Is a subscription model right for our store?',
      answer:
        'Only where consumption is genuinely recurring. Subscriptions work when a product runs out on a predictable cycle and reordering is a chore worth automating. Applied to durable or considered purchases they produce high churn, refund requests and support load that outweighs the retained revenue. For those catalogs, replenishment reminders timed to real usage, range extension and referral raise lifetime value without a commitment the customer resents.',
    },
    {
      question: 'How much does site speed really affect e-commerce revenue?',
      answer:
        'Enough to treat it as a revenue variable rather than a technical preference. Slower pages reduce mobile conversion and make every paid click more expensive to convert, so the loss compounds across channels. The usual causes are accumulated third-party apps, unoptimized images and blocking scripts, not the platform itself. Measure with field data from real visitors instead of lab scores, and audit the app stack on a schedule.',
    },
  ],
  relatedServices: [
    'ecommerce',
    'web-development',
    'seo',
    'google-ads',
    'meta-ads',
    'conversion-optimization',
    'crm-systems',
    'ai-automation',
  ],
  ctaHeading: 'Scale on Margin, Not on Revenue',
  ctaBody:
    'Send us your contribution margin by product line, your repeat purchase rate and your current channel mix. We will show you where margin is leaking, which lines can afford to be advertised and what the store needs before spend increases.',
}

export default industry
