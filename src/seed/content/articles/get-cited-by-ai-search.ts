import type { ArticleSeed } from '@/seed/types'

const article: ArticleSeed = {
  slug: 'how-to-get-cited-by-chatgpt-and-ai-search',
  title: 'How to Get Your Business Cited by ChatGPT, Claude and Perplexity',
  metaTitle: 'How to Get Cited by ChatGPT, Claude and Perplexity',
  metaDescription:
    'How AI answer engines choose their sources, what makes a business quotable, and the practical work behind generative engine optimization and AI visibility.',
  excerpt:
    'AI assistants now answer the questions that used to start a search. Getting named in those answers depends on how these systems source information, which is not how classic search ranking works.',
  category: 'seo',
  publishedAt: '2026-05-06',
  author: 'petru-barabula',
  body: [
    {
      type: 'p',
      text: 'A buyer who would once have opened a search engine and compared ten blue links now asks an assistant to recommend three providers and explain the tradeoffs. They get an answer with two or three businesses named in it. Those businesses receive what a top ranking used to represent, except there is no second page, no ad slot, and no obvious way to appeal.',
    },
    {
      type: 'p',
      text: 'This is worth taking seriously without overstating it. Classic search is not disappearing, and the majority of commercial discovery still runs through it. But a growing share of high-intent questions now gets answered before anyone clicks anything, and the mechanism that decides who gets named is not the mechanism that decides who ranks. Some of the work overlaps with good SEO. Some of it is genuinely different, and the differences are where the opportunity currently sits.',
    },
    {
      type: 'p',
      text: 'What follows is how these systems actually source an answer, what makes a business citable, the practical implementation work, and an honest account of how badly this can currently be measured. Anyone offering you guaranteed placement in AI answers is describing something that does not exist.',
    },
    { type: 'h2', text: 'How an Answer Engine Sources an Answer' },
    {
      type: 'p',
      text: 'There are three distinct paths by which a business ends up inside an AI answer, and they respond to completely different work. Conflating them is the reason most advice on this subject is useless.',
    },
    { type: 'h3', text: 'Training Data' },
    {
      type: 'p',
      text: 'A model has absorbed an enormous amount of text during training, and some of what it knows about your industry, your category and occasionally your business comes from that. This is what produces an answer when no search is performed. You cannot influence it directly, it is frozen at a training cutoff, it carries no citation, and by the time it includes you the information may be years old. It rewards being widely written about over a long period, which is a brand outcome rather than a tactic.',
    },
    { type: 'h3', text: 'Retrieval Over an Index' },
    {
      type: 'p',
      text: 'Several answer engines maintain or license an index and retrieve passages from it to ground a response. The unit retrieved is typically a chunk of a page rather than the page as a whole, selected because its content is semantically close to the question. This is the path most responsive to how you write and structure content, because the system is looking for a self-contained passage that answers the question, not for a page that deserves to rank.',
    },
    { type: 'h3', text: 'Live Web Search Grounding' },
    {
      type: 'p',
      text: 'The assistant issues one or more search queries in the background, reads what comes back, and synthesizes an answer from those sources with citations attached. This path inherits conventional search visibility, which is the strongest argument against treating AI visibility as a separate discipline. If you are absent from the results a grounding search returns, you are absent from the answer. It also means the reformulated query the model issues, not the question the user typed, is what you need to be visible for.',
    },
    {
      type: 'p',
      text: 'The practical read: training data is a long-term brand effect, retrieval rewards content structure, and grounding rewards conventional search presence including third-party pages you do not control. A program that only addresses one of the three underperforms.',
    },
    { type: 'h2', text: 'What Actually Earns a Citation' },
    {
      type: 'callout',
      title: 'The unit of AI visibility is the passage, not the page',
      text: 'A ranking system evaluates a document. A retrieval system pulls a fragment and attributes it. That single difference reorganizes the priorities: every section of every page should be able to survive being lifted out of context and still make complete sense on its own. A paragraph that begins with "as we mentioned above" or "this approach" is unquotable, no matter how good the page is. Write so that any given block could be the only thing a reader ever sees from you.',
    },
    { type: 'h3', text: 'An Entity a Machine Can Resolve Without Guessing' },
    {
      type: 'p',
      text: 'These systems reason about businesses as entities: a named thing with attributes, relationships and a category. Before anything can cite you, it has to be confident that the name on your site, the name in a directory listing, the name in an industry publication and the name in a review platform all refer to the same organization. That confidence is built from consistency, and it is destroyed by trivia: a different legal suffix here, an old address there, a phone number that changed two years ago and was never updated on the profiles you forgot you had.',
    },
    { type: 'h3', text: 'The Answer in the First Sentence' },
    {
      type: 'p',
      text: 'Content written for classic search often builds toward its answer. Content that gets quoted states the answer immediately and then explains it. If the question is what a service costs to run, the first sentence of that section should say what it costs to run, in a complete sentence that names the subject rather than referring to it. Everything after that first sentence is there for the human. The first sentence is there for both.',
    },
    { type: 'h3', text: 'Comparison and Selection Content' },
    {
      type: 'p',
      text: 'A large share of high-intent AI queries are selection questions: which option suits a particular situation, what the tradeoffs are, what to choose given a constraint. These get answered from content that genuinely compares things, ideally in a structured form a model can parse cleanly. Honest comparisons that name when your approach is the wrong choice are more quotable than promotional pages, because they contain the discriminating information the question requires. A page that says every option is great supplies nothing worth extracting.',
    },
    { type: 'h3', text: 'Presence in the Sources That Get Retrieved' },
    {
      type: 'p',
      text: 'When a grounding search runs for a commercial recommendation, the results are frequently not vendor websites. They are directories, industry publications, review platforms, comparison sites, professional association listings and community forum threads. Being excellent on your own domain does not put you in those. This is the least comfortable part of the discipline for most businesses, because the work is not on your site and cannot be scheduled like a content calendar.',
    },
    {
      type: 'ul',
      items: [
        'Claim and complete every category-relevant directory and marketplace listing, with the same facts everywhere.',
        'Maintain review platform profiles that matter in your sector, since review content is heavily retrieved for recommendation questions.',
        'Earn coverage and named commentary in the trade publications your category is written about in.',
        'Participate genuinely in the community forums where your buyers ask for recommendations, under a real identity, without pitching.',
        'Get included in the roundups and comparison articles that already rank for the selection queries you care about.',
        'Publish something with original substance - your own operating data, a defined framework, a methodology with a name - because that is what other sources cite, and citations are what make a business appear across many documents at once.',
      ],
    },
    { type: 'h3', text: 'Fact Consistency Across the Web' },
    {
      type: 'p',
      text: 'If three sources say different things about what you do, where you operate or what you specialize in, a system synthesizing an answer has to decide which to trust, and the cheapest resolution is to use a competitor whose facts agree with each other. Consistency is not a ranking trick. It is the removal of a reason to skip you.',
    },
    { type: 'h2', text: 'The Machine-Readable Fact Layer' },
    {
      type: 'p',
      text: 'Structured data does not make a model like you. It removes ambiguity, and ambiguity is what stops a system committing to a statement about your business. Treat schema as the canonical fact sheet that every other source should agree with.',
    },
    {
      type: 'ol',
      items: [
        'Implement Organization schema on the site with the legal name, description, logo, contact points, address where applicable, and founding details. This is the anchor record.',
        'Populate sameAs with every profile the business genuinely controls: social accounts, the Business Profile, directories, association memberships, review platforms and any publication author profile. This is the explicit statement that all these records are one entity.',
        'Add Service schema for each service, with a plain description and the areas served, so the relationship between the organization and what it sells is stated rather than inferred.',
        'Use FAQPage markup where you have genuine question and answer content, because the format is already question-shaped and question-shaped content is what retrieval is matching against.',
        'Add Article schema with author and date on editorial content, and connect the author to a real person with a described background rather than to a generic company byline.',
        'Keep every value identical to what appears on the visible page and to what appears on third-party profiles. A structured data field that contradicts the page it sits on is worse than an absent one.',
        'Validate after every template change. Structured data breaks quietly and stays broken for months.',
      ],
    },
    { type: 'h2', text: 'Crawler Access, robots.txt and llms.txt' },
    {
      type: 'p',
      text: 'You cannot be retrieved from content nobody is permitted to read. Access is now a strategy decision with a genuine tradeoff on both sides, and it is worth making deliberately rather than inheriting whatever a plugin wrote into your robots file.',
    },
    {
      type: 'table',
      headers: ['Agent category', 'What it is for', 'Allowing it means', 'Blocking it means'],
      rows: [
        [
          'Training crawlers',
          'Collecting content that may be used to train future models',
          'Your material can inform what a model knows unprompted, with no citation and no referral',
          'You keep the content out of future training, and give up the unattributed recall',
        ],
        [
          'Search index crawlers',
          'Building the index an answer engine retrieves from',
          'Your pages are eligible to be retrieved and cited in answers',
          'You are effectively invisible to that engine regardless of content quality',
        ],
        [
          'User-triggered fetchers',
          'Fetching a page live because a user asked about it or pasted a link',
          'The assistant can read your page on demand and quote it accurately',
          'A user asking about your business gets an answer built without your own words',
        ],
        [
          'Conventional search crawlers',
          'Classic web search indexing',
          'Standard organic visibility, which also feeds grounding searches',
          'No organic presence at all, which is not a real option for most businesses',
        ],
      ],
    },
    {
      type: 'p',
      text: 'The major providers publish their user agent names and separate them by purpose, and the separations change, so the correct process is to check current documentation rather than copy a robots file from a blog post. For most service businesses the answer is straightforward: allow search index crawlers and user-triggered fetchers, because both produce attributed visibility, and make a considered decision on training crawlers. For publishers whose content is the product, the calculation is entirely different and blocking training access is a defensible commercial position.',
    },
    { type: 'h3', text: 'On llms.txt' },
    {
      type: 'p',
      text: 'The llms.txt convention proposes a plain markdown file at the root of a domain that points to the pages worth reading and describes what the site is. It costs almost nothing to publish, it forces a useful exercise in stating what your key pages are, and it does no harm. It should be described accurately: it is a proposed convention rather than a supported standard, adoption by the major providers is not confirmed, and it will not compensate for content nobody wants to cite. Publish it, keep it current, and do not build a strategy on it.',
    },
    { type: 'h2', text: 'Freshness and Why Stale Pages Stop Being Quoted' },
    {
      type: 'p',
      text: 'Systems that answer questions about the current state of anything prefer sources that appear current. A page with a visible publication date from several years ago, describing tools and prices that have changed, is a liability rather than an asset, and it is competing against your newer content for the same retrieval slot.',
    },
    {
      type: 'ul',
      items: [
        'Maintain a review cycle on commercially important pages rather than publishing and abandoning them.',
        'Show a genuine last-reviewed date, and only update it when something was actually reviewed. A rolling date on unchanged content is transparent and corrosive.',
        'Consolidate rather than accumulate. Three overlapping pages on one subject split retrieval and each one is weaker than the merged version.',
        'Retire or redirect content describing services you no longer offer, which otherwise gets quoted back at you by an assistant that has no way to know it is out of date.',
      ],
    },
    { type: 'h2', text: 'Measuring AI Visibility, Honestly' },
    {
      type: 'p',
      text: 'This is where the discipline is weakest and where most vendors are least honest. There is no equivalent of a rank tracker, because there is no rank. Answers are non-deterministic, vary by phrasing, vary by user context, and change without notice. Anything presenting an AI visibility score as a precise metric is presenting a sample as a measurement.',
    },
    {
      type: 'p',
      text: 'What you can do is build a repeatable sample and read it as a trend rather than as a number.',
    },
    {
      type: 'ol',
      items: [
        'Define a fixed panel of the questions a real buyer would ask in your category, including selection questions, comparison questions and problem-first questions. Twenty to fifty prompts is enough.',
        'Run the panel across the assistants that matter to you on a fixed schedule, from a clean session, and record whether you were named, which sources were cited, and which competitors appeared.',
        'Track the cited sources as carefully as the mentions. If a particular directory or publication supplies most of the citations in your category, that is a target, and it is more actionable than the mention count.',
        'Watch referral traffic from assistant domains in analytics, accepting that attribution is incomplete because many assistants send no referrer and many answers produce no click at all.',
        'Read server logs for AI user agents to confirm that the crawlers you allowed are actually fetching your pages, and which ones.',
        'Treat the whole thing as directional. The honest question is whether you appear more often across a stable panel this quarter than last, not what your score is.',
      ],
    },
    {
      type: 'p',
      text: 'It is also worth being clear about what a citation is worth. Many AI answers resolve the question without a click, which means the value is brand recall and inclusion in a shortlist rather than a session in your analytics. That is real commercial value, and it is largely unmeasurable with current tooling. Anyone claiming a precise return figure on this channel is estimating.',
    },
    { type: 'h2', text: 'Where to Start' },
    {
      type: 'p',
      text: 'The reassuring conclusion is that almost none of this is exotic. Define your entity precisely and make every source agree. Write pages whose sections stand alone and answer questions in their first sentence. Publish comparison content honest enough to be useful. Get into the third-party sources that grounding searches return. Ship a correct schema layer, make a deliberate crawler access decision, keep important pages current, and sample your visibility on a fixed panel of prompts so you can tell whether any of it worked.',
    },
    {
      type: 'p',
      text: 'The unreassuring part is that this is a compounding, unglamorous program rather than a setting to switch on, and the businesses that start now will be the ones the models have been reading for two years by the time this becomes a standard line item. The entity clarity, structured data and citable content that earn AI mentions are the same assets that earn conventional rankings, so the downside case is that you improved your SEO.',
    },
    {
      type: 'p',
      text: 'Generative engine optimization runs inside our SEO engagements rather than as a separate product, because separating them would mean doing the same entity and content architecture work twice. If you want to know where you currently stand, send us your domain and the questions your buyers ask before they choose someone. We will run the panel, show you who is being cited instead of you, and tell you which of those citations are winnable.',
    },
  ],
  faqs: [
    {
      question: 'How do AI assistants decide which businesses to mention?',
      answer:
        'Through three different paths. Training data supplies unattributed background knowledge frozen at a cutoff. Retrieval pulls passages from an index when they closely match the question. Live search grounding issues a background query and synthesizes an answer from what returns, which inherits conventional search visibility. Most commercial recommendations come from the second and third paths, which is why content structure and third-party presence matter more than brand size.',
    },
    {
      question: 'Is generative engine optimization different from SEO?',
      answer:
        'It overlaps heavily but emphasizes different things. Both depend on crawlability, authority and entity clarity. GEO additionally rewards self-contained passages that answer a question in the first sentence, honest comparison content, structured data as an unambiguous fact layer, and presence in the third-party sources an assistant retrieves. The practical approach is one program, since doing the entity and architecture work twice would be wasteful.',
    },
    {
      question: 'Should I block AI crawlers from my website?',
      answer:
        'Distinguish the purposes before deciding. Blocking search index crawlers and user-triggered fetchers removes you from attributed answers entirely, which most service businesses should not do. Blocking training crawlers keeps content out of future models at the cost of unattributed recall, which is a defensible choice for publishers whose content is the product. Check current provider documentation, since agent names and separations change.',
    },
    {
      question: 'Does llms.txt actually work?',
      answer:
        'It is a proposed convention rather than a confirmed standard, and adoption by the major providers is not established. Publishing one costs very little, produces a useful exercise in identifying your most important pages, and carries no downside. Treat it as good hygiene rather than as a mechanism. It will not make content citable that nobody would otherwise quote.',
    },
    {
      question: 'How can I tell if AI search is sending me business?',
      answer:
        'Imperfectly, and anyone claiming otherwise is estimating. Track referral traffic from assistant domains, accepting that many send no referrer and many answers generate no click. Run a fixed panel of buyer questions on a schedule and record whether you are named and which sources are cited. Add a how-did-you-hear field to your enquiry form. Read the result as a trend, not as a measurement.',
    },
  ],
  relatedServices: ['seo', 'local-seo', 'web-development', 'branding'],
}

export default article
