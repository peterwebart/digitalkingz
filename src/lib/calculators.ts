/**
 * Calculator definitions.
 *
 * Twenty tools, one engine. Each calculator is data — fields in, a pure compute
 * function out — so a new tool is a config entry rather than a new page, and
 * every tool inherits the same layout, formatting, structured data and sitemap
 * handling automatically.
 *
 * The arithmetic here is deliberately transparent. Every tool states its formula
 * on the page, because a calculator that hides its working is a lead magnet
 * pretending to be an instrument.
 */

export type FieldType = 'currency' | 'percent' | 'number' | 'select'

export type Field = {
  name: string
  label: string
  type: FieldType
  default: number | string
  min?: number
  max?: number
  step?: number
  help?: string
  options?: { label: string; value: string; factor: number }[]
}

export type ResultFormat = 'currency' | 'percent' | 'number' | 'ratio' | 'months' | 'text'

export type Result = {
  label: string
  value: number | string
  format: ResultFormat
  emphasis?: boolean
  help?: string
}

export type CalculatorCategory = 'SEO' | 'PPC' | 'Website' | 'Marketing' | 'GEO'

export type Calculator = {
  slug: string
  title: string
  category: CalculatorCategory
  tagline: string
  description: string
  fields: Field[]
  compute: (v: Record<string, number>) => Result[]
  formula: string
  notes?: string[]
}

// --- helpers ---------------------------------------------------------------

const n = (v: Record<string, number>, key: string) => Number(v[key]) || 0
const pct = (v: Record<string, number>, key: string) => (Number(v[key]) || 0) / 100
const div = (a: number, b: number) => (b === 0 ? 0 : a / b)

const currency = (name: string, label: string, def: number, help?: string): Field => ({
  name, label, type: 'currency', default: def, min: 0, step: 100, help,
})
const percent = (name: string, label: string, def: number, help?: string): Field => ({
  name, label, type: 'percent', default: def, min: 0, max: 100, step: 0.1, help,
})
const count = (name: string, label: string, def: number, help?: string): Field => ({
  name, label, type: 'number', default: def, min: 0, step: 1, help,
})

/** Organic CTR by position. Rounded from published click-share studies. */
const CTR_BY_POSITION: Record<number, number> = {
  1: 0.27, 2: 0.15, 3: 0.11, 4: 0.08, 5: 0.06,
  6: 0.05, 7: 0.04, 8: 0.03, 9: 0.026, 10: 0.022,
}
const ctrFor = (position: number): number => {
  const p = Math.max(1, Math.round(position))
  if (p <= 10) return CTR_BY_POSITION[p]
  if (p <= 20) return 0.01
  return 0.003
}

// --- SEO -------------------------------------------------------------------

const seoRoi: Calculator = {
  slug: 'seo-roi-calculator',
  title: 'SEO ROI Calculator',
  category: 'SEO',
  tagline: 'What organic search returns against what it costs.',
  description:
    'Turns monthly SEO investment, organic lead volume, close rate and deal value into return on investment over a chosen period.',
  formula: 'Revenue = leads x close rate x deal value. ROI = (revenue - cost) / cost.',
  fields: [
    currency('spend', 'Monthly SEO investment', 3500),
    count('months', 'Months', 12, 'SEO compounds. Twelve months is the shortest honest window.'),
    count('leads', 'Organic leads per month', 25),
    percent('closeRate', 'Lead to customer close rate', 20),
    currency('dealValue', 'Average deal value', 4000),
    percent('margin', 'Gross margin', 60, 'ROI on revenue flatters. Margin is what you keep.'),
  ],
  compute: (v) => {
    const months = n(v, 'months')
    const cost = n(v, 'spend') * months
    const customers = n(v, 'leads') * pct(v, 'closeRate') * months
    const revenue = customers * n(v, 'dealValue')
    const profit = revenue * pct(v, 'margin')
    return [
      { label: 'Total investment', value: cost, format: 'currency' },
      { label: 'Customers won', value: Math.round(customers), format: 'number' },
      { label: 'Revenue generated', value: revenue, format: 'currency' },
      { label: 'Gross profit', value: profit, format: 'currency' },
      { label: 'Return on investment', value: div(profit - cost, cost) * 100, format: 'percent', emphasis: true },
      { label: 'Return per $1 spent', value: div(profit, cost), format: 'ratio' },
    ]
  },
  notes: ['Assumes lead volume is steady. Real SEO ramps, so early months usually under-deliver and later months over-deliver.'],
}

const seoTraffic: Calculator = {
  slug: 'seo-traffic-potential-calculator',
  title: 'SEO Traffic Potential Calculator',
  category: 'SEO',
  tagline: 'The traffic a ranking position is actually worth.',
  description:
    'Estimates monthly sessions, leads and revenue from a keyword set at a target ranking position, using click-through rates by position.',
  formula: 'Sessions = search volume x CTR at target position. Leads = sessions x conversion rate.',
  fields: [
    count('volume', 'Combined monthly search volume', 12000),
    { name: 'position', label: 'Target average position', type: 'number', default: 3, min: 1, max: 30, step: 1, help: 'Position one takes roughly 27% of clicks. Position ten takes about 2%.' },
    { name: 'currentPosition', label: 'Current average position', type: 'number', default: 15, min: 1, max: 100, step: 1 },
    percent('conversionRate', 'Session to lead conversion rate', 2.5),
    percent('closeRate', 'Lead to customer close rate', 20),
    currency('dealValue', 'Average deal value', 4000),
  ],
  compute: (v) => {
    const volume = n(v, 'volume')
    const target = volume * ctrFor(n(v, 'position'))
    const current = volume * ctrFor(n(v, 'currentPosition'))
    const gain = Math.max(0, target - current)
    const leads = gain * pct(v, 'conversionRate')
    const revenue = leads * pct(v, 'closeRate') * n(v, 'dealValue')
    return [
      { label: 'Sessions at current position', value: Math.round(current), format: 'number' },
      { label: 'Sessions at target position', value: Math.round(target), format: 'number' },
      { label: 'Additional sessions per month', value: Math.round(gain), format: 'number', emphasis: true },
      { label: 'Additional leads per month', value: Math.round(leads * 10) / 10, format: 'number' },
      { label: 'Additional revenue per month', value: revenue, format: 'currency', emphasis: true },
      { label: 'Additional revenue per year', value: revenue * 12, format: 'currency' },
    ]
  },
  notes: ['Click-through rates vary enormously by intent and by how much of the page Google gives to ads and AI overviews.'],
}

const seoBudget: Calculator = {
  slug: 'seo-budget-calculator',
  title: 'SEO Budget Calculator',
  category: 'SEO',
  tagline: 'What the work actually costs at your level of ambition.',
  description:
    'Estimates a monthly SEO budget range from market competitiveness, the number of keywords targeted and how much content and technical work is required.',
  formula: 'Base rate x competition factor x scope factor, expressed as a range.',
  fields: [
    {
      name: 'competition', label: 'Market competitiveness', type: 'select', default: 'medium',
      options: [
        { label: 'Local or niche', value: 'low', factor: 0.6 },
        { label: 'Regional or moderately contested', value: 'medium', factor: 1 },
        { label: 'National', value: 'high', factor: 1.7 },
        { label: 'Highly contested (legal, finance, insurance)', value: 'extreme', factor: 2.6 },
      ],
    },
    count('keywords', 'Priority keywords targeted', 40),
    count('content', 'New content pieces per month', 4),
    {
      name: 'technical', label: 'Technical condition of the site', type: 'select', default: 'average',
      options: [
        { label: 'Modern, fast, well structured', value: 'good', factor: 0.85 },
        { label: 'Average', value: 'average', factor: 1 },
        { label: 'Slow, legacy, or needs rebuilding', value: 'poor', factor: 1.35 },
      ],
    },
  ],
  compute: (v) => {
    // Base assumes a working retainer floor, then scales with scope. Content is
    // costed separately because it is the line that varies most between agencies.
    const base = 1500
    const keywordLoad = Math.min(3, 0.6 + n(v, 'keywords') / 60)
    const contentCost = n(v, 'content') * 450
    const core = (base * keywordLoad + contentCost) * n(v, 'competition') * n(v, 'technical')
    return [
      { label: 'Suggested monthly budget', value: core, format: 'currency', emphasis: true },
      { label: 'Realistic range (low)', value: core * 0.75, format: 'currency' },
      { label: 'Realistic range (high)', value: core * 1.35, format: 'currency' },
      { label: 'Twelve month commitment', value: core * 12, format: 'currency' },
      { label: 'Of which content', value: contentCost, format: 'currency', help: 'The line most often cut first, and most often the reason results stall.' },
    ]
  },
  notes: ['This is a planning range, not a quote. Anyone quoting a fixed price before auditing your site is guessing.'],
}

const keywordOpportunity: Calculator = {
  slug: 'keyword-opportunity-calculator',
  title: 'Keyword Opportunity Calculator',
  category: 'SEO',
  tagline: 'Whether a keyword is worth the work it will take.',
  description:
    'Scores a single keyword on traffic value against ranking difficulty, so effort goes to terms that can realistically be won.',
  formula: 'Value = incremental sessions x conversion rate x close rate x deal value, weighted against difficulty.',
  fields: [
    count('volume', 'Monthly search volume', 1800),
    { name: 'difficulty', label: 'Keyword difficulty (0-100)', type: 'number', default: 35, min: 0, max: 100, step: 1 },
    { name: 'authority', label: 'Your domain authority (0-100)', type: 'number', default: 30, min: 0, max: 100, step: 1 },
    { name: 'currentPosition', label: 'Current position (100 if unranked)', type: 'number', default: 100, min: 1, max: 100, step: 1 },
    percent('conversionRate', 'Session to lead conversion rate', 2.5),
    percent('closeRate', 'Lead to customer close rate', 20),
    currency('dealValue', 'Average deal value', 4000),
  ],
  compute: (v) => {
    const gap = n(v, 'authority') - n(v, 'difficulty')
    // Winnable when authority meets or exceeds difficulty; falls away sharply
    // past a 30 point deficit.
    const winnability = Math.max(0.05, Math.min(1, 0.5 + gap / 60))
    const realistic = gap > 10 ? 3 : gap > -10 ? 6 : 12
    const gain = Math.max(0, n(v, 'volume') * (ctrFor(realistic) - ctrFor(n(v, 'currentPosition'))))
    const leads = gain * pct(v, 'conversionRate')
    const value = leads * pct(v, 'closeRate') * n(v, 'dealValue')
    return [
      { label: 'Realistic position to target', value: realistic, format: 'number' },
      { label: 'Winnability', value: winnability * 100, format: 'percent', emphasis: true },
      { label: 'Additional sessions per month', value: Math.round(gain), format: 'number' },
      { label: 'Monthly revenue value', value: value, format: 'currency', emphasis: true },
      { label: 'Annual revenue value', value: value * 12, format: 'currency' },
      { label: 'Opportunity score', value: Math.round(winnability * Math.min(100, value / 50)), format: 'number', help: 'Value weighted by how likely you are to win it. Compare across keywords.' },
    ]
  },
}

// --- PPC -------------------------------------------------------------------

const adsBudget: Calculator = {
  slug: 'google-ads-budget-calculator',
  title: 'Google Ads Budget Calculator',
  category: 'PPC',
  tagline: 'The spend required to hit a lead target.',
  description:
    'Works backwards from a monthly lead goal to the clicks and budget needed at your cost per click and conversion rate.',
  formula: 'Clicks = leads / conversion rate. Budget = clicks x CPC.',
  fields: [
    count('targetLeads', 'Leads wanted per month', 40),
    currency('cpc', 'Average cost per click', 6, 'Check the keyword planner. Legal and trades run far higher.'),
    percent('conversionRate', 'Landing page conversion rate', 5),
    percent('closeRate', 'Lead to customer close rate', 25),
    currency('dealValue', 'Average deal value', 4000),
  ],
  compute: (v) => {
    const clicks = div(n(v, 'targetLeads'), pct(v, 'conversionRate'))
    const budget = clicks * n(v, 'cpc')
    const customers = n(v, 'targetLeads') * pct(v, 'closeRate')
    const revenue = customers * n(v, 'dealValue')
    return [
      { label: 'Clicks required per month', value: Math.round(clicks), format: 'number' },
      { label: 'Monthly budget required', value: budget, format: 'currency', emphasis: true },
      { label: 'Daily budget', value: div(budget, 30.4), format: 'currency' },
      { label: 'Cost per lead', value: div(budget, n(v, 'targetLeads')), format: 'currency' },
      { label: 'Cost per customer', value: div(budget, customers), format: 'currency', emphasis: true },
      { label: 'Expected revenue', value: revenue, format: 'currency' },
      { label: 'Return per $1 spent', value: div(revenue, budget), format: 'ratio' },
    ]
  },
}

const adsRoi: Calculator = {
  slug: 'google-ads-roi-calculator',
  title: 'Google Ads ROI Calculator',
  category: 'PPC',
  tagline: 'What the account returned, after margin.',
  description: 'Measures return on ad spend and on gross profit from actual spend, conversions and close rate.',
  formula: 'ROI = (gross profit - ad spend) / ad spend.',
  fields: [
    currency('spend', 'Ad spend', 8000),
    count('conversions', 'Conversions recorded', 60),
    percent('closeRate', 'Conversion to customer close rate', 25),
    currency('dealValue', 'Average deal value', 4000),
    percent('margin', 'Gross margin', 55),
  ],
  compute: (v) => {
    const spend = n(v, 'spend')
    const customers = n(v, 'conversions') * pct(v, 'closeRate')
    const revenue = customers * n(v, 'dealValue')
    const profit = revenue * pct(v, 'margin')
    return [
      { label: 'Customers won', value: Math.round(customers * 10) / 10, format: 'number' },
      { label: 'Revenue', value: revenue, format: 'currency' },
      { label: 'Gross profit', value: profit, format: 'currency' },
      { label: 'Cost per conversion', value: div(spend, n(v, 'conversions')), format: 'currency' },
      { label: 'Cost per customer', value: div(spend, customers), format: 'currency' },
      { label: 'ROAS', value: div(revenue, spend), format: 'ratio' },
      { label: 'ROI on gross profit', value: div(profit - spend, spend) * 100, format: 'percent', emphasis: true },
    ]
  },
  notes: ['A healthy ROAS with a thin margin can still lose money. The profit line is the one that matters.'],
}

const costPerLead: Calculator = {
  slug: 'cost-per-lead-calculator',
  title: 'Cost Per Lead Calculator',
  category: 'PPC',
  tagline: 'What each enquiry costs, and what it can afford to cost.',
  description: 'Calculates cost per lead from spend and volume, then compares it against the maximum you could afford to pay.',
  formula: 'CPL = spend / leads. Maximum CPL = deal value x margin x close rate.',
  fields: [
    currency('spend', 'Total spend', 8000),
    count('leads', 'Leads generated', 90),
    percent('closeRate', 'Lead to customer close rate', 22),
    currency('dealValue', 'Average deal value', 4000),
    percent('margin', 'Gross margin', 55),
    percent('targetProfit', 'Profit you want to keep per sale', 40, 'The share of gross profit you are not willing to spend on acquisition.'),
  ],
  compute: (v) => {
    const cpl = div(n(v, 'spend'), n(v, 'leads'))
    const profitPerCustomer = n(v, 'dealValue') * pct(v, 'margin')
    const maxCpa = profitPerCustomer * (1 - pct(v, 'targetProfit'))
    const maxCpl = maxCpa * pct(v, 'closeRate')
    return [
      { label: 'Cost per lead', value: cpl, format: 'currency', emphasis: true },
      { label: 'Cost per customer', value: div(cpl, pct(v, 'closeRate')), format: 'currency' },
      { label: 'Gross profit per customer', value: profitPerCustomer, format: 'currency' },
      { label: 'Maximum affordable cost per customer', value: maxCpa, format: 'currency' },
      { label: 'Maximum affordable cost per lead', value: maxCpl, format: 'currency', emphasis: true },
      { label: 'Headroom per lead', value: maxCpl - cpl, format: 'currency', help: 'Negative means you are buying leads at a loss.' },
    ]
  },
}

const roas: Calculator = {
  slug: 'roas-calculator',
  title: 'ROAS Calculator',
  category: 'PPC',
  tagline: 'Return on ad spend, with the margin reality check.',
  description: 'Calculates return on ad spend and the profit-adjusted figure that tells you whether the campaign actually made money.',
  formula: 'ROAS = revenue / ad spend. Profit ROAS = (revenue x margin) / ad spend.',
  fields: [
    currency('revenue', 'Revenue attributed to ads', 42000),
    currency('spend', 'Ad spend', 10000),
    percent('margin', 'Gross margin', 45),
  ],
  compute: (v) => {
    const revenue = n(v, 'revenue')
    const spend = n(v, 'spend')
    const profit = revenue * pct(v, 'margin')
    return [
      { label: 'ROAS', value: div(revenue, spend), format: 'ratio', emphasis: true },
      { label: 'ROAS as a percentage', value: div(revenue, spend) * 100, format: 'percent' },
      { label: 'Gross profit', value: profit, format: 'currency' },
      { label: 'Profit after ad spend', value: profit - spend, format: 'currency', emphasis: true },
      { label: 'Profit ROAS', value: div(profit, spend), format: 'ratio', help: 'Below 1.0 means the campaign lost money regardless of how good the headline ROAS looks.' },
    ]
  },
}

const breakEvenRoas: Calculator = {
  slug: 'break-even-roas-calculator',
  title: 'Break-Even ROAS Calculator',
  category: 'PPC',
  tagline: 'The number below which you are paying to lose money.',
  description: 'Finds the return on ad spend at which a campaign covers its own cost, given your gross margin and other variable costs.',
  formula: 'Break-even ROAS = 1 / contribution margin.',
  fields: [
    percent('margin', 'Gross margin', 45),
    percent('variableCosts', 'Other variable costs per order', 8, 'Payment fees, shipping, packaging, returns.'),
    percent('targetProfit', 'Target profit margin on ad-driven sales', 15),
  ],
  compute: (v) => {
    const contribution = Math.max(0.01, pct(v, 'margin') - pct(v, 'variableCosts'))
    const breakEven = div(1, contribution)
    const target = div(1, Math.max(0.01, contribution - pct(v, 'targetProfit')))
    return [
      { label: 'Contribution margin', value: contribution * 100, format: 'percent' },
      { label: 'Break-even ROAS', value: breakEven, format: 'ratio', emphasis: true },
      { label: 'ROAS needed for target profit', value: target, format: 'ratio', emphasis: true },
      { label: 'Maximum cost per $100 of revenue', value: contribution * 100, format: 'currency' },
    ]
  },
  notes: ['Break-even ROAS ignores fixed costs and the value of a repeat customer. Use lifetime value if you have it.'],
}

// --- Website ---------------------------------------------------------------

const websiteCost: Calculator = {
  slug: 'website-cost-calculator',
  title: 'Website Cost Calculator',
  category: 'Website',
  tagline: 'What a build of this scope actually costs.',
  description: 'Estimates a website build range from page count, design approach, integrations and content requirements.',
  formula: 'Page cost x complexity, plus integrations, content and design, expressed as a range.',
  fields: [
    count('pages', 'Number of pages', 15),
    {
      name: 'design', label: 'Design approach', type: 'select', default: 'custom',
      options: [
        { label: 'Template, lightly customised', value: 'template', factor: 0.5 },
        { label: 'Custom design on a proven structure', value: 'custom', factor: 1 },
        { label: 'Fully bespoke, brand-led', value: 'bespoke', factor: 1.8 },
      ],
    },
    count('integrations', 'Integrations (CRM, booking, payments)', 2),
    count('contentPages', 'Pages needing written content', 10),
    { name: 'ecommerce', label: 'E-commerce', type: 'select', default: 'no', options: [
      { label: 'No', value: 'no', factor: 0 },
      { label: 'Yes, simple catalogue', value: 'simple', factor: 6000 },
      { label: 'Yes, complex catalogue', value: 'complex', factor: 18000 },
    ] },
  ],
  compute: (v) => {
    const pages = n(v, 'pages') * 550 * n(v, 'design')
    const integrations = n(v, 'integrations') * 1800
    const content = n(v, 'contentPages') * 400
    const shop = n(v, 'ecommerce')
    const total = pages + integrations + content + shop
    return [
      { label: 'Design and build', value: pages, format: 'currency' },
      { label: 'Integrations', value: integrations, format: 'currency' },
      { label: 'Content', value: content, format: 'currency' },
      ...(shop > 0 ? [{ label: 'E-commerce', value: shop, format: 'currency' as const }] : []),
      { label: 'Estimated total', value: total, format: 'currency', emphasis: true },
      { label: 'Realistic range', value: `${Math.round(total * 0.8).toLocaleString()} - ${Math.round(total * 1.4).toLocaleString()}`, format: 'text' },
      { label: 'Ongoing support per month', value: total * 0.02, format: 'currency', help: 'A site is an asset under maintenance, not a one-off purchase.' },
    ]
  },
  notes: ['A planning range only. Scope, not page count, is what moves the number.'],
}

const websiteRoi: Calculator = {
  slug: 'website-roi-calculator',
  title: 'Website ROI Calculator',
  category: 'Website',
  tagline: 'How long the build takes to pay for itself.',
  description: 'Compares build and running costs against the revenue the site generates, and works out the payback period.',
  formula: 'Payback months = build cost / monthly gross profit from the site.',
  fields: [
    currency('buildCost', 'Build cost', 25000),
    currency('monthlyCost', 'Monthly running cost', 500),
    count('sessions', 'Monthly sessions', 3000),
    percent('conversionRate', 'Session to lead conversion rate', 3),
    percent('closeRate', 'Lead to customer close rate', 25),
    currency('dealValue', 'Average deal value', 4000),
    percent('margin', 'Gross margin', 55),
  ],
  compute: (v) => {
    const leads = n(v, 'sessions') * pct(v, 'conversionRate')
    const revenue = leads * pct(v, 'closeRate') * n(v, 'dealValue')
    const profit = revenue * pct(v, 'margin') - n(v, 'monthlyCost')
    const payback = div(n(v, 'buildCost'), profit)
    const year1 = profit * 12 - n(v, 'buildCost')
    return [
      { label: 'Leads per month', value: Math.round(leads * 10) / 10, format: 'number' },
      { label: 'Revenue per month', value: revenue, format: 'currency' },
      { label: 'Gross profit per month', value: profit, format: 'currency' },
      { label: 'Payback period', value: payback > 0 ? payback : 0, format: 'months', emphasis: true },
      { label: 'Year one net', value: year1, format: 'currency', emphasis: true },
      { label: 'Three year net', value: profit * 36 - n(v, 'buildCost'), format: 'currency' },
    ]
  },
}

const websiteConversion: Calculator = {
  slug: 'website-conversion-calculator',
  title: 'Website Conversion Calculator',
  category: 'Website',
  tagline: 'What a conversion rate improvement is worth.',
  description: 'Shows the revenue difference between your current conversion rate and a target rate, on the traffic you already have.',
  formula: 'Additional revenue = sessions x (target rate - current rate) x close rate x deal value.',
  fields: [
    count('sessions', 'Monthly sessions', 5000),
    percent('current', 'Current conversion rate', 1.8),
    percent('target', 'Target conversion rate', 3.2),
    percent('closeRate', 'Lead to customer close rate', 25),
    currency('dealValue', 'Average deal value', 4000),
  ],
  compute: (v) => {
    const sessions = n(v, 'sessions')
    const nowLeads = sessions * pct(v, 'current')
    const thenLeads = sessions * pct(v, 'target')
    const extra = thenLeads - nowLeads
    const revenue = extra * pct(v, 'closeRate') * n(v, 'dealValue')
    return [
      { label: 'Leads now', value: Math.round(nowLeads * 10) / 10, format: 'number' },
      { label: 'Leads at target rate', value: Math.round(thenLeads * 10) / 10, format: 'number' },
      { label: 'Additional leads per month', value: Math.round(extra * 10) / 10, format: 'number', emphasis: true },
      { label: 'Relative uplift', value: div(extra, nowLeads) * 100, format: 'percent' },
      { label: 'Additional revenue per month', value: revenue, format: 'currency', emphasis: true },
      { label: 'Additional revenue per year', value: revenue * 12, format: 'currency' },
    ]
  },
  notes: ['The cheapest growth available is the traffic you are already paying for.'],
}

// --- Marketing -------------------------------------------------------------

const marketingBudget: Calculator = {
  slug: 'marketing-budget-calculator',
  title: 'Marketing Budget Calculator',
  category: 'Marketing',
  tagline: 'A defensible number to take to the board.',
  description: 'Sets a marketing budget as a share of revenue, adjusted for growth ambition and how established the business is.',
  formula: 'Budget = revenue x base share x growth factor.',
  fields: [
    currency('revenue', 'Annual revenue', 2000000, undefined),
    {
      name: 'stage', label: 'Business stage', type: 'select', default: 'growth',
      options: [
        { label: 'Established, holding position', value: 'hold', factor: 0.05 },
        { label: 'Growing steadily', value: 'growth', factor: 0.09 },
        { label: 'Aggressive growth or new market', value: 'aggressive', factor: 0.15 },
      ],
    },
    percent('growthTarget', 'Revenue growth target', 25),
    percent('margin', 'Gross margin', 55),
  ],
  compute: (v) => {
    const base = n(v, 'revenue') * n(v, 'stage')
    // Ambition costs money: each point of growth target above 10% adds pressure.
    const adjusted = base * (1 + Math.max(0, pct(v, 'growthTarget') - 0.1))
    return [
      { label: 'Annual marketing budget', value: adjusted, format: 'currency', emphasis: true },
      { label: 'Monthly budget', value: div(adjusted, 12), format: 'currency', emphasis: true },
      { label: 'As a share of revenue', value: div(adjusted, n(v, 'revenue')) * 100, format: 'percent' },
      { label: 'As a share of gross profit', value: div(adjusted, n(v, 'revenue') * pct(v, 'margin')) * 100, format: 'percent' },
      { label: 'Revenue this must generate to break even', value: div(adjusted, pct(v, 'margin')), format: 'currency' },
    ]
  },
}

const cac: Calculator = {
  slug: 'customer-acquisition-cost-calculator',
  title: 'Customer Acquisition Cost Calculator',
  category: 'Marketing',
  tagline: 'What a customer costs you, fully loaded.',
  description: 'Calculates acquisition cost including sales salaries and tooling, not just media spend, and compares it against payback.',
  formula: 'CAC = (marketing + sales cost) / new customers.',
  fields: [
    currency('marketing', 'Marketing spend', 20000),
    currency('sales', 'Sales team cost', 15000, 'Salaries, commission, tooling. Leaving this out is the most common way CAC gets understated.'),
    count('customers', 'New customers acquired', 25),
    currency('dealValue', 'Average first order value', 4000),
    percent('margin', 'Gross margin', 55),
  ],
  compute: (v) => {
    const total = n(v, 'marketing') + n(v, 'sales')
    const cacValue = div(total, n(v, 'customers'))
    const profit = n(v, 'dealValue') * pct(v, 'margin')
    return [
      { label: 'Total acquisition cost', value: total, format: 'currency' },
      { label: 'Customer acquisition cost', value: cacValue, format: 'currency', emphasis: true },
      { label: 'CAC excluding sales cost', value: div(n(v, 'marketing'), n(v, 'customers')), format: 'currency', help: 'The flattering version most dashboards report.' },
      { label: 'Gross profit per customer', value: profit, format: 'currency' },
      { label: 'Profit after acquisition', value: profit - cacValue, format: 'currency', emphasis: true },
      { label: 'Orders needed to recover CAC', value: Math.max(1, Math.ceil(div(cacValue, profit))), format: 'number' },
    ]
  },
}

const clv: Calculator = {
  slug: 'customer-lifetime-value-calculator',
  title: 'Customer Lifetime Value Calculator',
  category: 'Marketing',
  tagline: 'What a customer is worth over the whole relationship.',
  description: 'Calculates lifetime value from order value, purchase frequency and retention, and tests it against acquisition cost.',
  formula: 'CLV = order value x purchases per year x lifespan x gross margin.',
  fields: [
    currency('orderValue', 'Average order value', 1200),
    { name: 'frequency', label: 'Purchases per year', type: 'number', default: 3, min: 0, step: 0.1 },
    { name: 'lifespan', label: 'Average customer lifespan (years)', type: 'number', default: 3, min: 0, step: 0.1 },
    percent('margin', 'Gross margin', 55),
    currency('cac', 'Customer acquisition cost', 900),
  ],
  compute: (v) => {
    const annual = n(v, 'orderValue') * n(v, 'frequency')
    const revenue = annual * n(v, 'lifespan')
    const value = revenue * pct(v, 'margin')
    const ratio = div(value, n(v, 'cac'))
    return [
      { label: 'Annual revenue per customer', value: annual, format: 'currency' },
      { label: 'Lifetime revenue', value: revenue, format: 'currency' },
      { label: 'Lifetime value (gross profit)', value: value, format: 'currency', emphasis: true },
      { label: 'LTV to CAC ratio', value: ratio, format: 'ratio', emphasis: true, help: 'Below 3:1 usually means acquisition is too expensive or retention too weak.' },
      { label: 'Profit per customer after acquisition', value: value - n(v, 'cac'), format: 'currency' },
      { label: 'Months to recover acquisition cost', value: div(n(v, 'cac'), div(annual * pct(v, 'margin'), 12)), format: 'months' },
    ]
  },
}

const marketingRoi: Calculator = {
  slug: 'marketing-roi-calculator',
  title: 'Marketing ROI Calculator',
  category: 'Marketing',
  tagline: 'Return across the whole marketing programme.',
  description: 'Measures return on total marketing investment on both revenue and gross profit, with incremental revenue separated out.',
  formula: 'ROI = (incremental gross profit - cost) / cost.',
  fields: [
    currency('cost', 'Total marketing cost', 60000),
    currency('revenue', 'Revenue attributed to marketing', 320000),
    percent('baseline', 'Revenue you would have earned anyway', 20, 'Attribution overstates. This discounts what would have happened without the spend.'),
    percent('margin', 'Gross margin', 55),
  ],
  compute: (v) => {
    const incremental = n(v, 'revenue') * (1 - pct(v, 'baseline'))
    const profit = incremental * pct(v, 'margin')
    const cost = n(v, 'cost')
    return [
      { label: 'Attributed revenue', value: n(v, 'revenue'), format: 'currency' },
      { label: 'Incremental revenue', value: incremental, format: 'currency', emphasis: true },
      { label: 'Incremental gross profit', value: profit, format: 'currency' },
      { label: 'Net gain', value: profit - cost, format: 'currency', emphasis: true },
      { label: 'ROI', value: div(profit - cost, cost) * 100, format: 'percent', emphasis: true },
      { label: 'Return per $1 spent', value: div(profit, cost), format: 'ratio' },
    ]
  },
}

const leadGen: Calculator = {
  slug: 'lead-generation-calculator',
  title: 'Lead Generation Calculator',
  category: 'Marketing',
  tagline: 'How many leads a revenue target actually requires.',
  description: 'Works backwards from a revenue goal through the funnel to the number of leads and sessions needed to hit it.',
  formula: 'Leads = (revenue target / deal value) / close rate.',
  fields: [
    currency('target', 'Revenue target', 1000000),
    currency('dealValue', 'Average deal value', 8000),
    percent('closeRate', 'Opportunity to customer close rate', 22),
    percent('leadToOpp', 'Lead to opportunity rate', 35),
    percent('conversionRate', 'Session to lead conversion rate', 2.5),
    count('months', 'Months to hit the target', 12),
  ],
  compute: (v) => {
    const deals = div(n(v, 'target'), n(v, 'dealValue'))
    const opportunities = div(deals, pct(v, 'closeRate'))
    const leads = div(opportunities, pct(v, 'leadToOpp'))
    const sessions = div(leads, pct(v, 'conversionRate'))
    const months = Math.max(1, n(v, 'months'))
    return [
      { label: 'Customers needed', value: Math.ceil(deals), format: 'number' },
      { label: 'Opportunities needed', value: Math.ceil(opportunities), format: 'number' },
      { label: 'Leads needed', value: Math.ceil(leads), format: 'number', emphasis: true },
      { label: 'Sessions needed', value: Math.ceil(sessions), format: 'number' },
      { label: 'Leads per month', value: Math.ceil(div(leads, months)), format: 'number', emphasis: true },
      { label: 'Sessions per month', value: Math.ceil(div(sessions, months)), format: 'number' },
    ]
  },
}

// --- GEO -------------------------------------------------------------------

/**
 * The three GEO tools are scored self-assessments, not live checks.
 *
 * Nothing here queries ChatGPT, Perplexity or Google's AI overviews. Calling a
 * self-assessment a "checker" without saying so would be dishonest, so each one
 * states what it does and does not do on the page.
 */
const yesNo = (name: string, label: string, weight: number, help?: string): Field => ({
  name, label, type: 'select', default: 'no', help,
  options: [
    { label: 'No', value: 'no', factor: 0 },
    { label: 'Partly', value: 'partly', factor: weight / 2 },
    { label: 'Yes', value: 'yes', factor: weight },
  ],
})

const scoreOut = (v: Record<string, number>, keys: string[], max: number): Result[] => {
  const score = keys.reduce((sum, k) => sum + n(v, k), 0)
  const pctScore = div(score, max) * 100
  const band =
    pctScore >= 80 ? 'Strong' : pctScore >= 55 ? 'Workable' : pctScore >= 30 ? 'Weak' : 'Not ready'
  return [
    { label: 'Score', value: `${Math.round(score)} / ${max}`, format: 'text', emphasis: true },
    { label: 'Percentage', value: pctScore, format: 'percent' },
    { label: 'Band', value: band, format: 'text', emphasis: true },
  ]
}

const aiVisibility: Calculator = {
  slug: 'ai-visibility-score',
  title: 'AI Visibility Score',
  category: 'GEO',
  tagline: 'How findable your business is to AI answer engines.',
  description:
    'Scores the signals that determine whether an AI assistant can identify, understand and cite your business. This is a self-assessment, not a live query of any AI system.',
  formula: 'Weighted score across entity, citation and content signals.',
  fields: [
    yesNo('entity', 'Consistent name, address and contact details everywhere online', 15),
    yesNo('schema', 'Organization structured data with sameAs links', 15),
    yesNo('wikidata', 'Presence in Wikipedia, Wikidata or an industry register', 10),
    yesNo('citations', 'Cited or quoted by publications you do not control', 20, 'The single strongest signal, and the hardest to fake.'),
    yesNo('answers', 'Content that answers questions directly rather than burying the answer', 15),
    yesNo('freshness', 'Content updated and dated within the last twelve months', 10),
    yesNo('crawlable', 'Content readable without JavaScript', 15, 'Several AI crawlers do not execute JavaScript.'),
  ],
  compute: (v) => scoreOut(v, ['entity', 'schema', 'wikidata', 'citations', 'answers', 'freshness', 'crawlable'], 100),
  notes: ['Self-reported. It measures whether the groundwork exists, not whether any assistant currently mentions you.'],
}

const geoReadiness: Calculator = {
  slug: 'geo-readiness-assessment',
  title: 'GEO Readiness Assessment',
  category: 'GEO',
  tagline: 'Whether your site is built for generative search.',
  description:
    'Assesses technical and editorial readiness for generative engine optimisation across structure, sourcing and machine access.',
  formula: 'Weighted score across technical, content and authority readiness.',
  fields: [
    yesNo('structure', 'Pages use a clear heading hierarchy and short, extractable paragraphs', 15),
    yesNo('sources', 'Claims and statistics carry named sources', 20, 'Unsourced numbers are the fastest way to be ignored or contradicted.'),
    yesNo('llms', 'An llms.txt or equivalent machine-readable summary exists', 10),
    yesNo('speed', 'Core Web Vitals pass on mobile', 10),
    yesNo('faq', 'Genuine question-and-answer content, not keyword padding', 15),
    yesNo('author', 'Named authors with verifiable credentials', 15),
    yesNo('robots', 'AI crawlers are allowed rather than blocked by default', 15, 'Many sites block them by accident through an over-broad robots.txt.'),
  ],
  compute: (v) => scoreOut(v, ['structure', 'sources', 'llms', 'speed', 'faq', 'author', 'robots'], 100),
  notes: ['Self-reported. Use it to find gaps, not to predict rankings.'],
}

const aiSearchVisibility: Calculator = {
  slug: 'ai-search-visibility-checker',
  title: 'AI Search Visibility Checker',
  category: 'GEO',
  tagline: 'A structured audit of your presence in AI answers.',
  description:
    'Walks through the checks worth running manually against AI assistants and scores what you find. It does not query those systems for you.',
  formula: 'Weighted score across observed mentions, accuracy and competitive position.',
  fields: [
    yesNo('named', 'Assistants name your business when asked about your category', 25),
    yesNo('accurate', 'What they say about you is accurate and current', 20),
    yesNo('cited', 'Your own pages are cited as the source', 20),
    yesNo('competitors', 'You appear alongside or ahead of your main competitors', 15),
    yesNo('branded', 'Asking for you by name returns a correct description', 10),
    yesNo('monitoring', 'You check this on a repeating schedule rather than occasionally', 10),
  ],
  compute: (v) => scoreOut(v, ['named', 'accurate', 'cited', 'competitors', 'branded', 'monitoring'], 100),
  notes: [
    'This tool does not query ChatGPT, Perplexity, Gemini or Google AI overviews. It structures a manual audit and scores what you observe.',
    'Answers vary by session, region and model version. Test the same prompts repeatedly before drawing conclusions.',
  ],
}

// --- registry --------------------------------------------------------------

export const CALCULATORS: Calculator[] = [
  seoRoi, seoTraffic, seoBudget, keywordOpportunity,
  adsBudget, adsRoi, costPerLead, roas, breakEvenRoas,
  websiteCost, websiteRoi, websiteConversion,
  marketingBudget, cac, clv, marketingRoi, leadGen,
  aiVisibility, geoReadiness, aiSearchVisibility,
]

export const CATEGORY_ORDER: CalculatorCategory[] = ['SEO', 'PPC', 'Website', 'Marketing', 'GEO']

export const CATEGORY_BLURBS: Record<CalculatorCategory, string> = {
  SEO: 'Size the opportunity, the budget and the return before committing to organic search.',
  PPC: 'Work out what paid media should cost and what it has to return to be worth running.',
  Website: 'Cost a build, justify it, and find the revenue hiding in your current traffic.',
  Marketing: 'The unit economics: what a customer costs, what they are worth, and what to spend.',
  GEO: 'Structured self-assessments for visibility in AI answer engines.',
}

export const getCalculator = (slug: string): Calculator | undefined =>
  CALCULATORS.find((c) => c.slug === slug)

export const calculatorsByCategory = (category: CalculatorCategory): Calculator[] =>
  CALCULATORS.filter((c) => c.category === category)
