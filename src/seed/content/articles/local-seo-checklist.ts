import type { ArticleSeed } from '@/seed/types'

const article: ArticleSeed = {
  slug: 'local-seo-checklist',
  title: 'The Local SEO Checklist That Actually Moves the Map Pack',
  metaTitle: 'Local SEO Checklist That Moves the Map Pack',
  metaDescription:
    'An execution-grade local SEO checklist: Google Business Profile completeness, citations, reviews, location pages, schema, links and grid rank tracking.',
  excerpt:
    'Most local SEO checklists list tasks nobody sequences. This one is ordered by what actually influences relevance and prominence, and by how quickly each item pays.',
  category: 'seo',
  publishedAt: '2026-03-24',
  author: 'digital-kingz',
  body: [
    {
      type: 'p',
      text: 'Three businesses sit above you in the map pack. You have better work, better staff and arguably a better website, and none of that is why they are there. The map pack is not a quality ranking. It is a machine deciding which three listings best answer a query from a specific place, using signals you can either supply properly or leave half-filled.',
    },
    {
      type: 'p',
      text: 'Most local SEO advice is a list of tasks with no sequence and no explanation of mechanism, which leaves you doing the cheap items and skipping the ones that matter. This checklist is ordered differently: by what the ranking system is described as using, by what you can actually influence, and by how quickly each item pays back the hour it costs.',
    },
    {
      type: 'p',
      text: 'Work through it in order. Most businesses find the first two sections alone account for the majority of what has been suppressing the listing, and neither requires a budget.',
    },
    { type: 'h2', text: 'The Three Factors, and Which Two You Can Move' },
    {
      type: 'p',
      text: 'Google describes local ranking through three factors: relevance, meaning how well a profile matches what was searched; distance, meaning how far the business is from the searcher or the searched location; and prominence, meaning how well known the business is. Everything worth doing maps to one of these, and only two of them are yours to change.',
    },
    {
      type: 'ul',
      items: [
        'Relevance is a completeness and specificity problem. It is the cheapest to fix and the most commonly neglected, because it lives in profile fields nobody has reviewed since the listing was created.',
        'Distance is fixed unless you open a location. What you can do is stop spending effort where distance rules you out, and redirect it toward organic positions beneath the map results in those areas.',
        'Prominence is built outside the profile: reviews, citations, links, mentions and the authority of the attached website. It is slowest to build and hardest to copy, which is why durable advantage lives there.',
      ],
    },
    {
      type: 'p',
      text: 'A practical consequence: if a competitor is physically closer, no amount of profile work beats them for a searcher standing at their door. You beat them across the rest of the grid, which is most of your market.',
    },
    { type: 'h2', text: 'Google Business Profile: The Completeness Audit' },
    {
      type: 'p',
      text: 'The profile is the ranking asset, not a signpost pointing at the website. Treat every field as a declaration the system can match against a query, because that is what it is.',
    },
    { type: 'h3', text: 'Categories' },
    {
      type: 'callout',
      title: 'The primary category is the single most consequential field on the profile',
      text: 'It is the strongest declaration of what the business is, and it is the field most often set once, carelessly, by whoever created the listing years ago. Before you touch anything else, check the primary category of the three businesses ranking above you for your most valuable query. If theirs differs from yours, you have found the cheapest available fix, and it takes about a minute to apply.',
    },
    {
      type: 'ol',
      items: [
        'Set the primary category to the single term that best describes your core revenue service, not the broadest term available. Specific beats general.',
        'Compare it against the primary categories of the businesses ranking above you. Their choice is evidence.',
        'Add every secondary category that genuinely applies and none that do not. Irrelevant categories dilute relevance rather than adding reach.',
        'Change the primary one step at a time, record the date, and capture visibility before and after so the effect is attributable rather than assumed.',
        'Re-audit every six months. Google adds and retires categories, and a more precise one may now exist.',
      ],
    },
    { type: 'h3', text: 'Services and Products' },
    {
      type: 'ol',
      items: [
        'List every service individually in the language customers search with, not internal naming. Twenty specific services can match twenty specific queries.',
        'Write a real description for each rather than leaving the auto-generated stub. It takes minutes per entry.',
        'Use the products section even for services where the format allows it. It renders visually and most competitors ignore it.',
        'Remove services you no longer deliver. Calls you have to decline cost staff time and damage conversion.',
      ],
    },
    { type: 'h3', text: 'Attributes, Hours and Special Hours' },
    {
      type: 'ul',
      items: [
        'Complete every attribute available for your category: accessibility, payment methods, service options, appointment requirements and identity attributes. Several act as filters in Maps, so a missing attribute removes you from a filtered result entirely.',
        'Set hours accurately, including days you are closed. A profile marked open when nobody answers sends the caller straight to a competitor.',
        'Populate special hours before every holiday and closure. This is the most reliably neglected field on the profile and it directly affects whether you show as open.',
        'Add more specific hours where supported: pickup, delivery, or a phone line that runs longer than the premises.',
      ],
    },
    { type: 'h3', text: 'Description, Photos, Q and A, Posts' },
    {
      type: 'ol',
      items: [
        'Write the description as a plain factual statement of what the business does, who it serves and where. Do not stuff service terms into it.',
        'Upload real photography across categories: exterior, interior, team, work in progress and completed work. Exterior shots help people find you, interior shots help them decide.',
        'Add photos on a monthly cadence rather than in one batch. A profile whose last image is three years old reads as abandoned.',
        'Seed the Q and A section with the questions you answer on the phone every week, then answer them from the business account. Unanswered questions get answered by strangers, in public.',
        'Publish posts for offers, events and updates. Honest framing: posts are a conversion and freshness surface more than a ranking one.',
      ],
    },
    { type: 'h2', text: 'NAP Consistency and Citation Cleanup' },
    {
      type: 'p',
      text: 'Name, address and phone number appear across directories, aggregators, social profiles and old listings you have forgotten. Inconsistency creates ambiguity about whether two records describe the same business, and ambiguity suppresses confidence. This work is finite: do it once properly, then maintain it.',
    },
    {
      type: 'ol',
      items: [
        'Define the canonical name, address and phone format exactly as it appears on the profile. Write it down. Every future listing uses this and nothing else.',
        'Do not add service terms or locations to the business name field. It violates the guidelines and is easily reported by the competitors it takes traffic from.',
        'Audit the major data aggregators and your sector top directories first. A few high-authority sources feed a long tail of smaller ones.',
        'Claim or remove duplicate listings, including ones created at a former address or by a former employee. Duplicates split signals and confuse customers.',
        'Correct old addresses and disconnected numbers everywhere, prioritizing sources that rank for your brand name.',
        'Add the industry and association directories your competitors are in and you are not. These outweigh generic mass-submission directories.',
        'Record every citation and login in one sheet. The next person doing this should not have to rediscover it.',
      ],
    },
    { type: 'h2', text: 'A Review Strategy That Survives Scrutiny' },
    {
      type: 'p',
      text: 'Reviews influence prominence and they influence the human comparing three listings. Both matter, and the second one converts.',
    },
    {
      type: 'ul',
      items: [
        'Velocity beats volume. Steady monthly arrivals signal a business currently serving customers. A block collected during one campaign two years ago signals history.',
        'Recency is read by the system and the reader. A recent review answering a current concern outweighs an older one that does not.',
        'Reviews naming the specific service and area add relevant language to the listing. You cannot script that, but you can ask what the customer had done and how it went.',
        'Respond to every review within a couple of days. Responses are read by prospects far more than by the people who left them.',
        'Answer negative reviews calmly and factually, without relitigating, with an offline route to resolution. A measured reply often persuades better than an unbroken run of perfect ratings, which readers increasingly discount.',
      ],
    },
    { type: 'h3', text: 'What Not to Do' },
    {
      type: 'ul',
      items: [
        'Do not offer discounts, entries or gifts for reviews. It is prohibited, and the removal risk applies to the whole profile.',
        'Do not gate requests so only happy customers are asked. It is a guidelines violation and produces a rating profile that reads as artificial.',
        'Do not buy reviews. Detection is better than the sellers claim and recovery costs more than the gain.',
        'Do not batch. Fifty reviews in a week after eighteen months of silence is a pattern, and patterns get inspected.',
        'Do not paste the same response to every review. It is visible, and it makes your genuine responses look automated too.',
      ],
    },
    {
      type: 'p',
      text: 'The sustainable version is a trigger, not a habit. The request should fire automatically from something that already happens, such as job completion or invoice payment, sent under the name of the person the customer dealt with, and completable on a phone in under a minute. Where a CRM exists this is configuration, not discipline.',
    },
    { type: 'h2', text: 'On-Site Local Signals' },
    {
      type: 'p',
      text: 'The website supplies prominence to the listing and captures the searches the map pack does not answer.',
    },
    { type: 'h3', text: 'Location Pages That Are Not Doorway Pages' },
    {
      type: 'p',
      text: 'A location page earns its place when it has something specific to say. If it could serve any other area through find-and-replace, it is a doorway page, and it will either be filtered or drag down the pages around it. One substantive page outperforms twenty thin ones and carries none of the risk.',
    },
    {
      type: 'ol',
      items: [
        'Name the services you genuinely deliver there, which are often not all of them.',
        'State response, travel or appointment expectations for that area honestly.',
        'Include local proof: photographs, a short case description, or reviews from customers there.',
        'Answer the questions people in that area actually ask, including anything regulatory, seasonal or logistical that differs.',
        'Name the responsible team member or branch. Specificity separates a location page from a template.',
        'Link it from a coverage index and from the relevant service pages, not only from the footer.',
      ],
    },
    { type: 'h3', text: 'Service-Area Architecture' },
    {
      type: 'ul',
      items: [
        'With no public premises, hide the address on the profile and define service areas honestly. Overstating coverage dilutes relevance and risks a suspension that removes the listing entirely.',
        'Cross services with areas only where you can support both dimensions with real content. Do not generate the full matrix.',
        'Keep one canonical page per service. Area pages support it, they do not compete with it.',
        'Use descriptive internal anchor text between service, area and case study pages so relationships are stated rather than inferred.',
      ],
    },
    { type: 'h3', text: 'Schema and the sameAs Graph' },
    {
      type: 'ol',
      items: [
        'Implement LocalBusiness schema, or the most specific subtype for your category, on every page representing a location.',
        'Include name, address, telephone, opening hours, geo coordinates, price range where relevant, and areaServed.',
        'Populate sameAs with the profile URLs you genuinely control: Business Profile, social accounts, directories, association listings and review platforms. This is how a machine confirms all those records are one entity.',
        'Keep every value identical to the canonical NAP you defined. A schema field that disagrees with the visible page is worse than no field.',
        'Add Service schema per service and FAQPage markup where you have genuine question and answer content.',
        'Validate after every template change. Structured data breaks silently and stays broken for months.',
      ],
    },
    { type: 'h3', text: 'Map Embeds and Internal Linking' },
    {
      type: 'ul',
      items: [
        'Embed a map on contact and location pages, loaded lazily so it does not cost you page speed. Its value is confidence more than ranking.',
        'Put the full NAP in crawlable HTML, not inside an image or a script-rendered widget.',
        'Link from the homepage to the areas index, and from every service page to the areas it is delivered in.',
        'Keep click depth shallow. A location page four levels down tells the crawler how important you consider it.',
      ],
    },
    { type: 'h2', text: 'Local Links That Are Not Spam' },
    {
      type: 'p',
      text: 'Prominence responds to being genuinely known in a place. That is earned through activity, which is slower than buying links and considerably more durable.',
    },
    {
      type: 'ul',
      items: [
        'Sponsor something real: a team, an event, a school program, a community organization. The link is a byproduct of a relationship that also produces customers.',
        'Join the trade associations relevant to your sector and complete the member listing properly.',
        'Offer genuine expert commentary to local publications and trade press. Journalists want a named practitioner who answers quickly.',
        'Publish something worth citing: a supply or pricing observation from your own operations, or a seasonal guide with real substance.',
        'Partner with adjacent non-competing businesses serving the same customers, and cross-reference where it genuinely helps the reader.',
        'Avoid paid link packages, mass directory submissions and reciprocal schemes. They are why your competitor gains do not hold.',
      ],
    },
    { type: 'h2', text: 'Tracking: Measure the Right Thing, Break Nothing' },
    {
      type: 'p',
      text: 'Local SEO fails budget reviews when the reporting is a screenshot of rankings. Three measurement decisions fix that.',
    },
    {
      type: 'ol',
      items: [
        'Track the map pack on a grid, not from one point. A single-point check hides the fact that you rank first at your own door and nowhere three streets away. Grid tracking shows visibility as a shape across the catchment, which is what you are actually buying.',
        'Read Business Profile insights for calls, direction requests, messages and website clicks as a trend. They describe listing performance, not website performance.',
        'Implement call tracking with dynamic number insertion, so the tracked number shows to website visitors while the canonical number stays in the page source and in structured data. Keep the profile primary number unchanged and add a tracked number only as a secondary. Never let a tracked number propagate into citations, because that breaks the consistency everything else depends on.',
        'Push calls and form submissions into a CRM with outcome logging, so the report says how many jobs local search produced rather than how many clicks it generated.',
      ],
    },
    { type: 'h2', text: 'The Order to Work Through This' },
    {
      type: 'p',
      text: 'Do the profile completeness audit first, because it is free, fast and frequently the whole reason the listing underperforms. Fix NAP and duplicates second, because inconsistency undermines everything built on top of it. Start the review process third, since it compounds over months and there is no reason to delay the clock. Then build the on-site foundation, earn local authority, and put measurement in place before you spend anything so you can tell whether the rest of it worked.',
    },
    {
      type: 'p',
      text: 'Most of this is executable by a capable person inside the business, and if that describes you, do it rather than pay someone. The parts that reliably need help carry technical or strategic risk: schema that must stay consistent with the profile, a service-area architecture that scales without becoming doorway pages, call tracking implemented without damaging NAP, and grid measurement that shows what actually changed.',
    },
    {
      type: 'p',
      text: 'That is the scope of our Local SEO engagements, and we run it alongside SEO and CRM systems rather than as an isolated exercise, because a phone call nobody logs is not a result. Send us the queries you want to be called for and the areas you cover, and we will map current visibility across that footprint and tell you which items on this list are holding you back.',
    },
  ],
  faqs: [
    {
      question: 'How long does it take to move into the local map pack?',
      answer:
        'Profile completeness and citation corrections can influence visibility within weeks, which makes local search faster than conventional organic work in most categories. Building review volume, earning local authority and ranking location pages takes months of consistent effort. The usual pattern is early movement from removing whatever was suppressing the listing, followed by gradual gains as reviews and prominence signals accumulate.',
    },
    {
      question: 'Does changing my primary category risk losing rankings?',
      answer:
        'It can, which is why you change it deliberately and record the date. The primary category is the strongest relevance declaration on the profile, so a wrong one caps performance and a better one can improve it materially. Change one thing at a time, capture grid visibility before and after, and give it a few weeks. If visibility falls, you have a documented baseline to revert to.',
    },
    {
      question: 'How many reviews do I need to rank in the map pack?',
      answer:
        'There is no threshold, because reviews are one prominence signal weighed against relevance, distance and everything else. The useful target is relative: a steady monthly arrival of recent reviews that keeps pace with the businesses ranking above you. Velocity and recency matter more than a total, and responses matter more than most businesses assume, because prospects read them.',
    },
    {
      question: 'Will call tracking numbers hurt my local SEO?',
      answer:
        'Not when implemented correctly. Use dynamic number insertion so the tracked number appears only to website visitors while the canonical business number remains in the page source and in structured data, and keep the primary number on the Business Profile unchanged. Problems occur when tracked numbers leak into citations and directories, which breaks the name, address and phone consistency that local ranking depends on.',
    },
    {
      question: 'Are location pages worth building for areas without an office?',
      answer:
        'Yes, for organic positions beneath the map results, which is where most of your out-of-radius demand is winnable. They only work when each page says something specific: the services actually delivered there, response expectations, local proof and genuine local questions. If a page could serve any other area through find-and-replace, it is a doorway page and it will hurt more than it helps.',
    },
  ],
  relatedServices: ['local-seo', 'seo', 'web-design', 'crm-systems'],
}

export default article
