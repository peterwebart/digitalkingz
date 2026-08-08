/**
 * Client-safe navigation constants and types.
 *
 * Kept separate from `nav.ts` on purpose: `nav.ts` imports the Payload client,
 * which pulls Node built-ins such as `net` and `dns`. Any client component
 * importing a value from that module would drag the database driver into the
 * browser bundle and fail the build. This file has no server dependencies.
 */

export interface NavItem {
  label: string
  href: string
  description?: string
  icon?: string
}

export interface NavGroup {
  key: string
  label: string
  blurb: string
  items: NavItem[]
}

export interface SiteNav {
  serviceGroups: NavGroup[]
  industries: NavItem[]
}

export type TrackKey = 'build' | 'get-found' | 'convert' | 'automate'

export const SERVICE_CATEGORY_META: Record<
  string,
  { label: string; blurb: string; order: number; token: string; icon: string }
> = {
  build: {
    label: 'Build',
    blurb: 'High-performance digital experiences that convert.',
    order: 1,
    token: 'var(--color-track-build)',
    icon: 'Code2',
  },
  'get-found': {
    label: 'Get Found',
    blurb: 'Increase visibility and attract qualified traffic.',
    order: 2,
    token: 'var(--color-track-found)',
    icon: 'Search',
  },
  convert: {
    label: 'Convert',
    blurb: 'Turn traffic into leads and loyal customers.',
    order: 3,
    token: 'var(--color-track-convert)',
    icon: 'TrendingUp',
  },
  automate: {
    label: 'Automate',
    blurb: 'Automate your systems and accelerate growth.',
    order: 4,
    token: 'var(--color-track-automate)',
    icon: 'Sparkles',
  },
}

/**
 * The four capability tracks as shown on the homepage.
 *
 * Bullets with a `slug` resolve to a full service page. The rest are named
 * capabilities delivered inside those engagements, listed because prospects
 * search for them by name even when they are not sold separately.
 */
export const TRACKS: {
  key: TrackKey
  number: string
  label: string
  blurb: string
  icon: string
  token: string
  bullets: { label: string; slug?: string }[]
}[] = [
  {
    key: 'build',
    number: '01',
    label: 'Build',
    blurb: 'High-performance digital experiences that convert.',
    icon: 'Code2',
    token: 'var(--color-track-build)',
    bullets: [
      { label: 'Web Design', slug: 'web-design' },
      { label: 'Web Development', slug: 'web-development' },
      { label: 'E-commerce', slug: 'ecommerce' },
      { label: 'Branding & Strategy', slug: 'branding' },
      { label: 'Website Maintenance', slug: 'website-maintenance' },
      { label: 'UX/UI & Landing Pages' },
    ],
  },
  {
    key: 'get-found',
    number: '02',
    label: 'Get Found',
    blurb: 'Increase visibility and attract qualified traffic.',
    icon: 'Search',
    token: 'var(--color-track-found)',
    bullets: [
      { label: 'SEO', slug: 'seo' },
      { label: 'Local SEO', slug: 'local-seo' },
      { label: 'GEO / AI Search' },
      { label: 'Content Strategy' },
      { label: 'Google Business Profile' },
      { label: 'Technical SEO' },
    ],
  },
  {
    key: 'convert',
    number: '03',
    label: 'Convert',
    blurb: 'Turn traffic into leads and loyal customers.',
    icon: 'TrendingUp',
    token: 'var(--color-track-convert)',
    bullets: [
      { label: 'Conversion Optimization', slug: 'conversion-optimization' },
      { label: 'Google Ads', slug: 'google-ads' },
      { label: 'Meta Ads', slug: 'meta-ads' },
      { label: 'Lead Generation' },
      { label: 'Landing Pages' },
      { label: 'Analytics & Tracking' },
    ],
  },
  {
    key: 'automate',
    number: '04',
    label: 'Automate',
    blurb: 'Automate your systems and accelerate growth.',
    icon: 'Bot',
    token: 'var(--color-track-automate)',
    bullets: [
      { label: 'AI Integration', slug: 'ai-automation' },
      { label: 'CRM Systems', slug: 'crm-systems' },
      { label: 'AI Agents & Chatbots' },
      { label: 'Marketing Automation' },
      { label: 'Lead Follow-up' },
      { label: 'Workflow Automation' },
    ],
  },
]

export const COMPANY_LINKS: NavItem[] = [
  { label: 'About Us', href: '/about', description: 'How we work and what we hold ourselves to' },
  { label: 'Our Process', href: '/process', description: 'Discovery through to continuous growth' },
  { label: 'Case Studies', href: '/work', description: 'What we build and how it is engineered' },
  { label: 'Contact', href: '/contact', description: 'Start a project or book a strategy call' },
]

export const RESOURCE_LINKS: NavItem[] = [
  {
    label: 'Growth Hub',
    href: '/growth-hub',
    description: 'Long-form analysis on growth systems',
  },
  { label: 'Guides', href: '/growth-hub', description: 'Deep dives on SEO, AI and conversion' },
  { label: 'Case Studies', href: '/work', description: 'How the work is engineered' },
  { label: 'FAQs', href: '/services#faq', description: 'The questions we get asked first' },
]
