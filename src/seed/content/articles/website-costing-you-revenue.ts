import type { ArticleSeed } from '@/seed/types'

const article: ArticleSeed = {
  slug: 'signs-your-website-is-costing-you-revenue',
  title: '9 Signs Your Website Is Costing You Revenue',
  metaTitle: '9 Signs Your Website Is Costing You Revenue',
  metaDescription:
    'Nine checkable symptoms of a website that quietly loses money, the mechanism behind each one, how to verify it yourself, and what fixing it involves.',
  excerpt:
    'A website rarely fails loudly. It keeps loading, the form keeps working, and the loss gets absorbed into a marketing budget that looks fine. Here is how to find it.',
  category: 'web-design',
  publishedAt: '2026-01-21',
  author: 'petru-barabula',
  body: [
    {
      type: 'p',
      text: 'A website rarely fails loudly. It keeps loading, the contact form keeps sending, and analytics keeps reporting sessions. What it quietly stops doing is turning attention into revenue. Because nothing visibly breaks, the loss is absorbed into a marketing budget that appears to be working, and it can run for years before anyone assigns it a number.',
    },
    {
      type: 'p',
      text: 'The cost is real whether or not it is visible. Every visitor who arrived with genuine intent and left without contacting you was paid for, in media spend, in the content that earned the ranking, or in the reputation that produced the referral. A site that converts poorly does not save you money. It raises the price of every customer you acquire, in every channel, at the same time.',
    },
    {
      type: 'p',
      text: 'The nine symptoms below are the ones that appear most often and cost the most. Each has a mechanism behind it, each can be checked in about ten minutes without hiring anyone, and each has a known fix. Work through them honestly and you will usually find that two or three account for most of the loss.',
    },
    { type: 'h2', text: 'What "Costing You Revenue" Actually Means' },
    {
      type: 'p',
      text: 'There are two distinct losses, and they are fixed differently. The first is direct: traffic arrives and a smaller share converts than your economics require. That one is easy to observe, because you can see the sessions. The second is suppression: demand that would have found you never arrives, because the site cannot rank for what you sell, cannot be understood by the systems that route buyers, or does not survive comparison against the next browser tab. That loss never appears in analytics, which is precisely why it grows.',
    },
    {
      type: 'p',
      text: 'Before reading further, do the arithmetic once. Take monthly visitors who arrive with commercial intent, the share that become enquiries, the share of enquiries that close, and the contribution a closed customer produces. Multiply them. Then rerun it with a conversion rate one percentage point higher. The difference between those two numbers is the annual budget the problem justifies, and it is usually larger than the cost of fixing it.',
    },
    { type: 'h2', text: 'The Nine Signs' },
    { type: 'h3', text: '1. The Site Is Slow on a Phone, on a Real Connection' },
    {
      type: 'p',
      text: 'Most first contact now happens on a phone, frequently on a connection worse than the one in your office. A page that takes several seconds to show its main content, or that stutters when someone taps a button, reads to a visitor as broken rather than slow. They do not diagnose it. They return to the results page and open the next result, and you are charged for the visit either way.',
    },
    {
      type: 'p',
      text: 'Check it by running your highest-value pages through PageSpeed Insights and reading the mobile field data at the top of the report rather than the lab score underneath it. Field data reflects what real visitors experienced. Largest Contentful Paint should be under 2.5 seconds, Interaction to Next Paint under 200 milliseconds, and Cumulative Layout Shift under 0.1. Fixing it usually means image formats and sizing, removing render-blocking resources, and auditing third-party scripts, in that order. It rarely requires a redesign, and it almost never requires a plugin.',
    },
    { type: 'h3', text: '2. There Is No Single Primary Conversion Action' },
    {
      type: 'p',
      text: 'Open your homepage on a phone and look only at what is visible without scrolling. If there are four things a visitor could do and no clear sense of which one you want, you have distributed your intent across every option and concentrated it in none. Every additional choice adds a small decision cost, and decision cost is paid in abandonment. Sites accumulate this by committee: sales wants a call button, marketing wants a download, someone wants a newsletter, and nobody removes anything.',
    },
    {
      type: 'p',
      text: 'The ten-minute check is to send that first screen to three people who do not work for you and ask what the site wants them to do. If you get three answers, the page has none. The fix is a hierarchy, not a deletion: one primary action stated in the language of the outcome the buyer wants, one secondary action for people who are not ready, and everything else demoted below the fold or into the navigation.',
    },
    { type: 'h3', text: '3. The Message Describes the Company Instead of the Problem' },
    {
      type: 'p',
      text: 'A visitor arrives mid-problem. They are not curious about your founding year, your values, or the number of disciplines you cover. They are trying to establish, in a few seconds, whether you solve the specific thing that brought them here. Copy that opens by describing the company forces them to do that work themselves, at the exact moment their attention is most fragile.',
    },
    {
      type: 'p',
      text: "Read the first twenty words of your homepage and count how many describe you versus how many describe the reader's situation. Then check message match: click your own ad or your own search listing and see whether the page confirms the promise that got the click, or opens with a general statement about the business. The fix is to lead with the problem and the outcome, name the buyer explicitly, and let the company description live further down the page where it belongs.",
    },
    { type: 'h3', text: '4. The Form Asks for More Than the Next Step Requires' },
    {
      type: 'p',
      text: 'Forms accumulate fields the way houses accumulate storage. Someone in reporting wanted company size. Someone in sales wanted a phone number. A field added for a campaign three years ago is still required. Each one is a small tax charged before the visitor has received anything, and the exits cluster in places that become obvious the moment field-level analytics are installed.',
    },
    {
      type: 'p',
      text: 'The check takes ten minutes: list every required field and ask what decision it changes in the next twenty-four hours. If nobody uses it to route, prioritize or prepare, it is costing you submissions for free. Then complete the form on your own phone and watch what happens on error, whether the keyboard type matches each field, and whether a mistyped entry wipes what you already entered.',
    },
    {
      type: 'p',
      text: 'The fix is not automatically a shorter form. Removing every qualifying question reliably increases submissions and can lower revenue, because the extra volume arrives from people who cannot buy while consuming the same sales time. High-value, low-volume businesses often benefit from asking more, positioned after the visitor has committed rather than before. The measure that settles it is contribution per visitor, not submission count.',
    },
    { type: 'h3', text: '5. There Is No Proof Architecture' },
    {
      type: 'p',
      text: 'Most sites have proof. Few have proof placed where doubt occurs. A row of unattributed praise on the homepage does nothing for the person hesitating over a phone number on the contact page, and a certification badge in the footer does nothing for the person deciding whether you have handled a project their size. Proof works positionally, and it works through specificity. Vague reassurance is decoration.',
    },
    {
      type: 'p',
      text: 'To check it, write down the three moments a buyer is most likely to hesitate in your sales path, then look at what evidence sits within sight of each. Typically the moments are before handing over contact details, before discussing budget, and before committing time to a call. The fix is to move concrete evidence next to each: named outcomes, process transparency, pricing context, and direct answers to the objection rather than a general claim of quality.',
    },
    { type: 'h3', text: '6. Conversion Tracking Is Broken, Duplicated, or Absent' },
    {
      type: 'p',
      text: 'This is the most expensive symptom on the list and the one least likely to be noticed, because a broken tracking setup still produces a dashboard. Numbers appear, meetings are held, and budget moves between channels on the strength of data that is wrong. Worse, automated bidding is trained on whatever signal you send it. Feed it a thank-you page that fires on every refresh and you have paid an extremely capable system to manufacture the wrong outcome at scale.',
    },
    {
      type: 'ul',
      items: [
        'Submit your own enquiry form and confirm it registers exactly once in analytics and exactly once in each ad platform.',
        'Reload the thank-you page and check whether a second conversion appears. If it does, every number built on it is inflated.',
        'Open your tag manager and look for the same event firing from two containers or from both a platform tag and a manual tag.',
        'Check whether phone calls, chat conversations and inbound emails are counted at all, or only web form submissions.',
        "Ask whether anyone can tell you which channel produced last month's closed revenue, not last month's leads.",
      ],
    },
    {
      type: 'p',
      text: 'The fix is a single agreed definition of a conversion, deduplicated firing, every meaningful contact method counted, and qualified and closed status fed back from the sales process so the platforms optimize toward revenue instead of form fills.',
    },
    {
      type: 'callout',
      title: 'Rank the Symptoms by Money, Not by Visibility',
      text: 'Teams reliably fix what they can see. The expensive failures are invisible: broken tracking, missing service pages and unworked leads cost more than any layout problem, because they compound silently across every channel at once and they corrupt the evidence you would use to catch them. Price each symptom before you schedule any of them.',
    },
    { type: 'h3', text: '7. Service Pages Are Thin or Missing Entirely' },
    {
      type: 'p',
      text: 'A single page listing everything you offer cannot rank for any of it. Search engines and AI answer systems need a specific, substantive page to associate with a specific commercial query, and buyers need somewhere to land that answers their question rather than announcing your breadth. The same gap raises paid costs, because an ad pointing at a general page has weaker landing page relevance than a competitor pointing at a dedicated one, and you pay the difference on every click.',
    },
    {
      type: 'p',
      text: 'List what you sell, ranked by revenue contribution, and check whether each line has its own URL with genuine depth: what the service is, who it is for, what it includes, how it works, what it costs to engage, and the questions buyers actually ask. Anything with a heading and two sentences is a placeholder, not a page. Fixing it means building one page per commercially meaningful service and linking them into a structure that makes the relationships between them explicit.',
    },
    { type: 'h3', text: '8. Leads Land in an Inbox With No CRM and No Follow-Up' },
    {
      type: 'p',
      text: 'Everything upstream of this point is acquisition spend. If enquiries arrive in a shared inbox, get answered when someone notices them, and receive one follow-up attempt before disappearing, then the website is working and the business is discarding the output. Response speed matters because buyers contact several providers in the same session and the sequence of replies shapes the shortlist. Persistence matters because most first attempts miss for reasons that have nothing to do with interest.',
    },
    {
      type: 'p',
      text: 'Test it directly: send a real enquiry through your own form on a weekday evening and time the first human response. Then ask how many contact attempts a non-responder receives, across how many channels, over how many days, and whether anyone could answer that from a record rather than from memory. The fix is routing with an owner, an immediate acknowledgment that sets expectations, a CRM record with a stage, and a defined follow-up sequence that runs whether or not anyone remembers.',
    },
    { type: 'h3', text: '9. The Design Signals a Different Price Tier Than You Charge' },
    {
      type: 'p',
      text: 'Buyers price you before you speak. Typography, spacing, photography, consistency and restraint all carry information about what kind of company this is and what it is likely to cost. When the site reads as budget and the proposal does not, the buyer experiences the gap as a discrepancy rather than as value, and you spend the first half of the sales conversation recovering ground you should not have lost. This is the difference between design as decoration and design as a pricing signal.',
    },
    {
      type: 'p',
      text: 'Check it comparatively, not in isolation. Open your site on a phone next to the three competitors you most often lose to, and ask which of the four looks most expensive. Then ask which one you would trust with a project at your top price point. The fix is rarely more visual noise. It is usually fewer elements, stronger typographic hierarchy, real photography instead of stock, and the kind of consistency that signals a company that controls its own details.',
    },
    { type: 'h2', text: 'The Symptoms Are Not Independent' },
    {
      type: 'p',
      text: 'Read as a list, these look like nine separate maintenance items. They are not. They are joints in a single chain that runs from a buyer noticing a problem to money arriving in an account, and the chain fails at whichever joint is weakest while every other joint keeps consuming budget as though the system worked.',
    },
    {
      type: 'p',
      text: 'The couplings are direct. A slow site suppresses organic visibility and raises paid costs through landing page experience, so speed is a traffic problem before it is a conversion problem. Thin service pages weaken both organic reach and ad relevance, so content architecture is a media efficiency problem. Broken tracking makes every other fix unverifiable, so you cannot tell which of the remaining eight actually paid. Leads arriving into no system waste all of it at the last step, after every other cost has already been incurred.',
    },
    {
      type: 'p',
      text: 'This is why isolated fixes disappoint. A redesign delivered on top of broken tracking, missing service pages and absent follow-up will produce a nicer site and roughly the same revenue, and the conclusion drawn afterward is usually that design does not pay. The correct conclusion is that a chain does not get stronger when you replace a link that was not the one failing.',
    },
    { type: 'h2', text: 'What to Fix First' },
    {
      type: 'p',
      text: 'Sequence by recovered revenue per unit of cost, not by how visible the problem is or how much anyone dislikes the current design. For most businesses that produces roughly this order.',
    },
    {
      type: 'ol',
      items: [
        'Fix measurement. Until conversions are counted once, counted honestly, and traceable to revenue, every later decision is a guess and every later improvement is unprovable.',
        'Fix what happens after the form. Routing, acknowledgment, a CRM record and a real follow-up sequence recover revenue you have already paid to generate, usually within weeks.',
        'Fix speed and the primary action. Both are cheap relative to their effect, both apply to every visitor from every channel, and neither requires new content.',
        'Fix the message and place the proof. Clarity of offer and evidence at the point of hesitation move more revenue than layout changes almost every time.',
        'Build the service pages. This is the slowest item with the longest payback, and it lifts organic reach and paid efficiency together.',
        'Then consider the redesign, with the knowledge of what actually converts rather than the hope that a new look will.',
      ],
    },
    { type: 'h2', text: 'Run the Diagnosis Before You Commission the Rebuild' },
    {
      type: 'p',
      text: 'Nothing on this list requires a vendor to identify. Work through the nine checks, write down what you find, and attach an estimated annual cost to each using your own deal size and close rate. That single page will tell you more about where to spend than any proposal you receive.',
    },
    {
      type: 'p',
      text: 'When you want the version done properly, our conversion optimization engagement starts exactly here: instrumentation validated, losses located and priced at your economics, and the fixes ranked by what they are worth rather than by how quickly they can be shipped. Where the findings point at the foundation rather than the funnel, that work moves into web design and development, and where they point past the form, into CRM systems and follow-up. Start with the diagnosis. The rebuild, if you need one, should be the conclusion rather than the opening move.',
    },
  ],
  faqs: [
    {
      question: 'How do I know whether my website is the problem or my traffic is?',
      answer:
        'Separate the two by segmenting. Look at visitors arriving on commercial-intent pages from sources you trust, and check what share of them convert. If high-intent traffic converts poorly, the site is the constraint. If intent-rich traffic converts acceptably but volume is low, acquisition is the constraint. Diagnosing this before spending is important, because a redesign will not fix a traffic problem and more media will not fix a conversion problem.',
    },
    {
      question: 'What is the fastest fix on this list?',
      answer:
        'Follow-up. Routing enquiries to a named owner, sending an immediate acknowledgment and running a defined sequence of contact attempts recovers revenue you have already paid to generate, and it can be implemented in days rather than months. Speed work is usually second fastest, since image handling and third-party script removal require no new content, no new copy and no design decisions from anyone.',
    },
    {
      question: 'Should we redesign the website or fix these issues individually?',
      answer:
        'Fix the measurable items first, then decide. Tracking, follow-up, speed, message clarity and proof placement can all be addressed on an existing site, and the results tell you what a redesign would need to preserve. A rebuild is justified when the underlying architecture blocks the fixes, when the platform makes performance unachievable, or when the design is actively pricing you below your rate.',
    },
    {
      question: 'How many of these signs are serious enough to act on alone?',
      answer:
        'Broken conversion tracking and absent follow-up both qualify on their own. Broken tracking corrupts every decision downstream of it, including the decision about what to fix next, and it actively misdirects automated bidding. Absent follow-up discards leads after every acquisition cost has already been paid. The other seven compound with each other, which means their combined effect is usually larger than the sum of the individual estimates.',
    },
    {
      question: 'Can we check page speed accurately without technical help?',
      answer:
        'Yes for diagnosis, usually not for repair. PageSpeed Insights gives you both real-visitor field data and a lab simulation for any public URL, and the field section tells you whether actual users are experiencing Largest Contentful Paint under 2.5 seconds, Interaction to Next Paint under 200 milliseconds and Cumulative Layout Shift under 0.1. Interpreting the causes and fixing them, particularly rendering strategy and third-party scripts, needs a developer.',
    },
  ],
  relatedServices: ['conversion-optimization', 'web-design', 'crm-systems', 'seo'],
}

export default article
