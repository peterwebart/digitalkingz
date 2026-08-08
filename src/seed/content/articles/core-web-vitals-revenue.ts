import type { ArticleSeed } from '@/seed/types'

const article: ArticleSeed = {
  slug: 'core-web-vitals-and-revenue',
  title: 'Core Web Vitals and Revenue: What Site Speed Is Worth',
  metaTitle: 'Core Web Vitals and Revenue: What Speed Is Worth',
  metaDescription:
    'What Largest Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift measure, why slow pages cost revenue, and what actually fixes them.',
  excerpt:
    'Performance is a commercial variable, not a technical score. Here is what each metric measures, why field and lab tools disagree, and where the real losses come from.',
  category: 'web-design',
  publishedAt: '2026-05-19',
  author: 'petru-barabula',
  body: [
    {
      type: 'p',
      text: 'Performance work is usually sold as a score to improve and bought as a box to tick. That framing is why it keeps getting deprioritized: nobody can defend a budget for moving a number from 62 to 89 when the number has no stated relationship to money.',
    },
    {
      type: 'p',
      text: 'The relationship exists and it runs through three separate channels. Speed changes how many visitors convert, it changes what you pay per click for the same ad position, and on large sites it changes how much of your content gets crawled and indexed at all. Those are conversion, media cost and reach. None of them are technical concerns.',
    },
    { type: 'h2', text: 'What the Three Metrics Actually Measure' },
    {
      type: 'p',
      text: 'Core Web Vitals are Google-defined measurements of loading, responsiveness and visual stability, each with a published threshold for what counts as good. The thresholds below are documented standards rather than estimates, and they are assessed at the 75th percentile of real page loads.',
    },
    { type: 'h3', text: 'Largest Contentful Paint' },
    {
      type: 'p',
      text: 'LCP measures how long it takes for the largest visible content element in the viewport to finish rendering, counted from the moment navigation starts. That element is usually a hero image, a background image, a video poster or a large block of text. Good is under 2.5 seconds. It is a proxy for the question a visitor is actually asking, which is not whether the page has technically begun loading but whether the thing they came for is on screen yet.',
    },
    {
      type: 'p',
      text: 'LCP has two components people commonly conflate. There is the time before the browser receives anything useful from the server, and there is the time spent rendering once it has. A fast server with a bloated hero image fails. A perfectly optimized image behind a slow server response also fails. Diagnosing which half is responsible determines whether the fix is infrastructure or asset handling.',
    },
    { type: 'h3', text: 'Interaction to Next Paint' },
    {
      type: 'p',
      text: 'INP measures responsiveness across the whole visit rather than at a single moment. It observes the latency of interactions such as clicks, taps and key presses, and reports a value representing the worst of them, measured from the interaction until the next frame is painted with visible feedback. Good is under 200 milliseconds. It replaced First Input Delay because responsiveness at the first interaction says nothing about what happens on the fifth.',
    },
    {
      type: 'p',
      text: 'This is the metric most directly tied to whether a page feels broken. When someone taps a button and nothing visibly changes, they tap again, then assume the site is malfunctioning. INP failures are almost always long JavaScript tasks occupying the main thread, and the main thread is single-threaded: while a script is executing, the browser cannot paint a response to anything the user does.',
    },
    { type: 'h3', text: 'Cumulative Layout Shift' },
    {
      type: 'p',
      text: 'CLS measures how much visible content moves unexpectedly during the life of the page, scored on the proportion of the viewport affected and the distance moved. Good is under 0.1. Unlike the other two it is not about waiting, it is about instability, and it produces a specific commercial failure: the user reaches for one element, the page reflows, and their tap lands on something else. On a form or a checkout that is a lost transaction, and the analytics will record it as an abandonment with no visible cause.',
    },
    {
      type: 'table',
      headers: ['Metric', 'What it measures', 'Good threshold', 'Most common cause of failure'],
      rows: [
        [
          'Largest Contentful Paint (LCP)',
          'Time until the largest visible element in the viewport finishes rendering',
          'Under 2.5 seconds',
          'An oversized or lazy-loaded hero image, or a slow server response delaying everything after it',
        ],
        [
          'Interaction to Next Paint (INP)',
          'How quickly the page paints a visible response to user interactions across the whole visit',
          'Under 200 milliseconds',
          'Long JavaScript tasks blocking the main thread, usually from third-party tags and hydration',
        ],
        [
          'Cumulative Layout Shift (CLS)',
          'How much visible content moves unexpectedly while the page is open',
          'Under 0.1',
          'Images, ads and embeds without reserved dimensions, plus late-injected banners and font swaps',
        ],
      ],
    },
    { type: 'h2', text: 'Field Data, Lab Data, and Why Your Tools Disagree' },
    {
      type: 'p',
      text: 'Two teams can look at the same page and reach opposite conclusions because they are reading different kinds of measurement. Understanding the difference prevents a great deal of wasted argument.',
    },
    {
      type: 'p',
      text: 'Field data is what real visitors experienced. The Chrome User Experience Report collects it from consenting Chrome users on real devices and real connections, and reports it as a trailing window rather than a live figure. It reflects your actual audience, including the ones on older phones and weak signal, and it is the data that informs how these metrics are assessed. It is also slow to respond: fix something today and the field numbers improve gradually as the reporting window rolls forward.',
    },
    {
      type: 'p',
      text: 'Lab data is a simulated load. Lighthouse, which powers the lower half of a PageSpeed Insights report and the audit panel in Chrome, loads the page once on a defined device profile with throttled network and CPU settings. It is reproducible, immediate and diagnostic, which makes it the right tool for finding causes and for checking whether a change worked before it reaches production.',
    },
    {
      type: 'p',
      text: 'They disagree for structural reasons rather than because one is wrong. Lab tests one device at one moment while the field aggregates every device your audience owns. Field data trails by weeks while lab data is current. Lab cannot measure INP at all, because INP requires real interactions, so it substitutes Total Blocking Time as a proxy. And field data needs traffic to report: low-volume URLs return no page-level data and fall back to origin-level figures, which is why a landing page can show numbers describing a different page entirely.',
    },
    {
      type: 'callout',
      title: 'Your Grade Is Set by Your Slowest Quarter of Visits',
      text: 'These metrics are assessed at the 75th percentile, which means three out of four page loads must meet the threshold. Your average visit is irrelevant to the outcome. The visits that decide it are the ones on older devices, weaker connections and heavier pages, and those are exactly the visits nobody on the team ever experiences. Test on a mid-range phone on a throttled connection, because that visitor is the one setting your score.',
    },
    {
      type: 'p',
      text: 'The working rule is simple: field data decides whether you have a problem, lab data tells you what is causing it. Teams that only read lab scores optimize for a simulation. Teams that only read field data know they are failing and cannot say why.',
    },
    { type: 'h2', text: 'The Commercial Case for Speed' },
    { type: 'h3', text: 'Speed as a Conversion Variable' },
    {
      type: 'p',
      text: 'A visitor cannot distinguish between a page that is slow and a page that is broken, and they do not spend time trying. On a phone, on a connection that is not the one in your office, a blank viewport for several seconds is functionally identical to a site that failed to load. The visitor returns to the results page and opens the next option, and if the click was paid, you were charged for the entire experience.',
    },
    {
      type: 'p',
      text: 'Responsiveness compounds this at the point of maximum commercial value. The interactions that matter most, such as submitting a form, adding to a cart, opening a booking widget or advancing a multi-step flow, tend to be the ones that trigger the most JavaScript. That means the worst responsiveness on the site frequently occurs at the exact moment the visitor is deciding to commit. Layout instability adds a second failure mode at the same moment, because a shifting page produces mis-taps that read to the user as their own mistake and to you as an abandonment.',
    },
    {
      type: 'p',
      text: 'You do not need an industry statistic to price this. Segment your own conversion rate by device, then compare sessions on your slowest page templates against your fastest. The gap is your number, measured on your own audience, and it is the only version of the figure a finance team should accept.',
    },
    { type: 'h3', text: 'Speed as an Ad Efficiency Variable' },
    {
      type: 'p',
      text: 'This is the argument that usually moves budget, because it converts performance work directly into media savings. Google Ads factors landing page experience into ad rank, so the quality of the destination affects both the position you achieve and the price you pay to hold it. Two advertisers bidding identically do not pay identically, and a slow, poorly matched landing page is one of the things that widens the gap.',
    },
    {
      type: 'p',
      text: 'The second cost is more direct. Every visitor who abandons before the page renders was a click you already bought. That spend produced nothing, it is not recoverable, and it recurs on every impression served for as long as the page stays slow. For an account spending meaningfully every month, performance work on the top landing pages is often the fastest-paying engineering task available, because it reduces waste on traffic you have already committed to purchasing.',
    },
    { type: 'h3', text: 'Speed as a Crawl and Indexing Variable' },
    {
      type: 'p',
      text: 'Search engines allocate a finite amount of crawling to each site, influenced by how quickly the server responds and how much value the crawler finds. When responses are slow, crawl rate is reduced to avoid overloading the server, which means new and updated pages are discovered later. Content that only exists after client-side JavaScript executes adds another stage, because rendering is queued and processed separately rather than read directly from the initial response.',
    },
    {
      type: 'p',
      text: 'Be proportionate about this one. For a site of thirty pages, crawl budget is close to irrelevant, and any consultant who leads with it is padding the proposal. For a large catalog or a publisher with changing inventory it is a real constraint: pages crawled late are indexed late, and pages indexed late earn nothing in the window that mattered.',
    },
    { type: 'h2', text: 'Where the Time Actually Goes' },
    {
      type: 'p',
      text: 'Across most real sites, the same six causes account for the overwhelming majority of failures.',
    },
    {
      type: 'ul',
      items: [
        'Render-blocking resources. Stylesheets and synchronous scripts in the document head must be downloaded and processed before the browser paints anything, so every one of them adds directly to LCP. Most sites ship far more CSS and JavaScript on first load than the visible portion of the page requires.',
        'Unoptimized images in the wrong formats. Serving a large source image scaled down in the browser, using legacy formats where modern ones are supported, omitting responsive sizes so phones download desktop assets, and lazy-loading the hero image so the single most important element is deliberately delayed.',
        'Third-party scripts and tag manager sprawl. Analytics, heatmaps, chat widgets, review embeds, consent tools, remarketing pixels and abandoned test scripts accumulate over years with no owner and no removal process. Each executes on the main thread, and collectively they are the most common reason INP fails.',
        'Client-side rendering for content that should be server-rendered. When the initial response is an empty container and the content requires a JavaScript bundle to appear, you have added download, parse and execution time in front of every visitor and every crawler for content that never changes between users.',
        'Font loading strategy. Multiple weights and styles of a custom font, loaded from a third-party origin without preloading or a sensible display setting, produce either invisible text during load or a visible reflow when the font arrives. The reflow shows up directly in CLS.',
        'Bloated page builders. Visual editors generate deeply nested markup, load their full runtime on every page regardless of what is used, and frequently ship a stylesheet covering every feature in the product rather than the handful present on the page.',
      ],
    },
    { type: 'h2', text: 'What Actually Fixes Them' },
    {
      type: 'p',
      text: 'The fixes are well understood and mostly unglamorous. They are also ordered, because some create the headroom the others need.',
    },
    { type: 'h3', text: 'Handle Images Properly' },
    {
      type: 'p',
      text: 'Serve modern formats such as AVIF and WebP with appropriate fallbacks, generate responsive variants so devices download the size they will actually display, and set explicit dimensions on every image so the browser reserves the space before the file arrives. Identify the LCP element and give it priority loading rather than lazy loading it. Lazy loading is correct below the fold and actively harmful applied to the hero.',
    },
    { type: 'h3', text: 'Render on the Server Where the Content Allows It' },
    {
      type: 'p',
      text: 'Content that is identical for every visitor should arrive in the initial HTML response. Server-side rendering and static generation remove an entire class of delay for both users and crawlers, and reduce the amount of JavaScript required before the page becomes useful. Reserve client-side rendering for genuinely interactive, personalized or authenticated regions, and hydrate those selectively rather than shipping the whole page as an application.',
    },
    { type: 'h3', text: 'Audit Third-Party Scripts Like a Line-Item Budget' },
    {
      type: 'p',
      text: 'Inventory every tag on the site and require three things for each: a named owner, a stated business purpose, and a decision about whether the value exceeds the cost. Most sites can remove a meaningful share on the first pass because the campaign that needed the tag ended years ago. What survives should load after interaction or on the pages that need it rather than globally, and anything measuring behavior should be evaluated against what it changes rather than against how interesting it is to look at.',
    },
    { type: 'h3', text: 'Trim the Critical Path and the Fonts' },
    {
      type: 'p',
      text: 'Inline the styles needed for the visible portion of the page and defer the rest, remove unused CSS, defer non-essential scripts, and cut the font payload to the weights actually used. Self-host and preload the fonts that appear above the fold, and choose a display strategy that avoids either invisible text or a late reflow. Then address server response time with caching and a content delivery network, because no amount of asset work compensates for a slow origin.',
    },
    { type: 'h2', text: 'Performance Is an Architecture Decision, Not a Plugin' },
    {
      type: 'p',
      text: 'The reason optimization plugins disappoint is that they operate at the wrong layer. A plugin can compress images, concatenate files and add caching headers. It cannot change whether your content requires a large JavaScript bundle to exist, whether your platform generates six levels of unnecessary markup, or whether every page loads a runtime built for features you do not use. Those are decisions made when the site was architected, and they set a ceiling that no post-processing step can raise.',
    },
    {
      type: 'p',
      text: 'This is why performance is cheap to build in and expensive to retrofit. Choosing a rendering strategy that matches the content, keeping the dependency list short and justified, treating the main thread as a scarce resource, and establishing a page weight budget cost nothing during a build. Reversing those decisions afterward means rebuilding the parts of the site that carry the most commercial weight, usually while they are in active use.',
    },
    {
      type: 'p',
      text: 'It is also why performance regresses without governance. Sites get slower one reasonable request at a time: a chat widget for sales, a heatmap for a research project, a review embed, a pixel for a campaign. Nobody makes a bad decision, and the aggregate fails every threshold. A performance budget enforced in the deployment pipeline and a named owner for third-party scripts prevent more degradation than any annual optimization exercise recovers.',
    },
    { type: 'h2', text: 'Measure It Against Your Own Revenue First' },
    {
      type: 'p',
      text: 'Start with the pages that carry money: the templates paid traffic lands on, the top organic entry points, and the conversion path itself. Pull field data for each, note which thresholds they miss, then run the lab tools to find the cause. Segment conversion rate by device against those same templates. Within an afternoon you will know whether performance is a real constraint on revenue or a score somebody wants improved for its own sake.',
    },
    {
      type: 'p',
      text: 'If the constraint is real and the causes trace back to rendering strategy, platform overhead or accumulated dependencies, that is a web development engagement rather than a tuning exercise, and we scope it as one: the architecture changed at the layer where the problem lives, with the commercial pages prioritized first. Where the numbers are acceptable today, our website maintenance work exists to keep them that way, because the realistic failure mode is not a site that was built slow. It is a site that was built fast and left ungoverned.',
    },
  ],
  faqs: [
    {
      question: 'What are the current Core Web Vitals thresholds?',
      answer:
        'Largest Contentful Paint should be under 2.5 seconds, Interaction to Next Paint under 200 milliseconds, and Cumulative Layout Shift under 0.1. These are Google-documented thresholds and they are assessed at the 75th percentile of real page loads, meaning three quarters of visits must meet each threshold for a page to pass. Averages do not qualify, which is why slower devices and connections determine the outcome.',
    },
    {
      question: 'Why does PageSpeed Insights show different numbers each time I run it?',
      answer:
        'The lower half of the report is a lab test that loads your page once under simulated conditions, so network variance, server state and third-party response times produce different results run to run. The upper half is field data from the Chrome User Experience Report, aggregated across real visits over a trailing window, which is why it moves slowly and rarely matches the lab score. Use field data to judge and lab data to diagnose.',
    },
    {
      question: 'Will improving Core Web Vitals improve our rankings?',
      answer:
        'Expect a modest and conditional effect rather than a transformation. Page experience is one input among many, and relevance and authority carry far more weight, so a fast page with weak content will not outrank a slow page that answers the query better. Performance matters most as a differentiator between closely matched results, and its larger commercial returns come through conversion rate and paid media efficiency rather than through position.',
    },
    {
      question: 'Can a plugin fix our Core Web Vitals?',
      answer:
        'Partially, and usually not enough. Optimization plugins handle compression, caching and file concatenation, which addresses the surface layer. They cannot change your rendering strategy, reduce the JavaScript your platform requires to display content, or remove markup generated by a page builder. When failures trace back to those causes, the fix is architectural, and stacking additional plugins tends to add main thread work rather than remove it.',
    },
    {
      question: 'Our field data shows no results for an important landing page. Why?',
      answer:
        'The Chrome User Experience Report needs a minimum volume of qualifying visits before it will report on an individual URL, so lower-traffic pages return no page-level data and tools fall back to origin-level figures for the whole site. That fallback can look badly wrong for a page that differs from your typical template. For those pages, rely on lab testing plus your own real user monitoring if you have it deployed.',
    },
  ],
  relatedServices: [
    'web-development',
    'web-design',
    'website-maintenance',
    'conversion-optimization',
  ],
}

export default article
