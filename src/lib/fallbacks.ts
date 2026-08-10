import 'server-only'

import { SERVICE_CATEGORY_META, type NavGroup, type NavItem, type SiteNav } from '@/lib/nav-config'
import type { SiteSetting } from '@/payload-types'

/**
 * Build-time fallbacks.
 *
 * A production image is compiled without a database — Coolify supplies
 * DATABASE_URI to the running container, not to the builder. Every content
 * route therefore has to prerender against *something*, and the choice is
 * between an empty shell and a faithful copy of what the seed writes.
 *
 * These values mirror `src/seed/run.ts` exactly. They are used only when a
 * query fails during `next build`; the moment a route revalidates against the
 * live database the CMS wins, permanently. Nothing here is rendered when the
 * database is reachable, and nothing here is rendered at runtime.
 *
 * Keep this file in sync with the seed when the seed changes. It holds
 * navigation labels and organisation facts only — no page content.
 */

/** Identical to the `site-settings` global written by `pnpm seed`. */
export const FALLBACK_SITE_SETTINGS: SiteSetting = {
  id: 1,
  legalName: 'Digital Kingz Development',
  brandName: 'Digital Kingz',
  tagline: 'We Build Digital Systems That Grow Businesses.',
  description:
    'Digital Kingz is a digital development and growth agency serving businesses across Montreal, Quebec and Canada. We build connected systems across web design, development, SEO, paid media, conversion optimization, CRM and AI automation, and operate the infrastructure that turns attention into qualified pipeline and pipeline into revenue.',
  email: 'solutions@digitalkingz.com',
  address: {
    locality: 'Montreal',
    region: 'Quebec',
    country: 'Canada',
  },
  serviceAreas: [{ name: 'Montreal' }, { name: 'Quebec' }, { name: 'Canada' }],
  // Left empty on purpose, exactly as the seed leaves them: the trust bar
  // falls back to verifiable engineering standards until real figures and
  // permissioned client names are entered in the admin panel.
  trustStats: [],
  clients: [],
  announcement: { enabled: false },
}

type FallbackService = NavItem & { category: string }

/** The 12 seeded services, in the order the mega-menu presents them. */
const FALLBACK_SERVICES: FallbackService[] = [
  {
    category: 'build',
    label: 'Web Design',
    href: '/services/web-design',
    description: 'Design as a conversion instrument: clarity, credibility and a clear path to enquiry.',
    icon: 'PenTool',
  },
  {
    category: 'build',
    label: 'Web Development',
    href: '/services/web-development',
    description: 'Fast, secure Next.js builds engineered for Core Web Vitals and a low cost of change.',
    icon: 'Code2',
  },
  {
    category: 'build',
    label: 'E-commerce',
    href: '/services/ecommerce',
    description:
      'Stores engineered around conversion rate, average order value and customer lifetime value.',
    icon: 'ShoppingBag',
  },
  {
    category: 'build',
    label: 'Branding & Strategy',
    href: '/services/branding',
    description: 'Brand is pricing power and acquisition leverage, not a logo refresh.',
    icon: 'Sparkles',
  },
  {
    category: 'build',
    label: 'Maintenance & Support',
    href: '/services/website-maintenance',
    description:
      'Monitoring, patching, backups and performance governance for an asset you already paid to build.',
    icon: 'ShieldCheck',
  },
  {
    category: 'get-found',
    label: 'SEO',
    href: '/services/seo',
    description: 'An acquisition channel that keeps producing after the invoice is settled.',
    icon: 'Search',
  },
  {
    category: 'get-found',
    label: 'Local SEO',
    href: '/services/local-seo',
    description:
      'Map pack visibility built on profile completeness, citations, reviews and local content.',
    icon: 'MapPin',
  },
  {
    category: 'convert',
    label: 'Conversion Optimization',
    href: '/services/conversion-optimization',
    description: 'The cheapest growth available is the traffic you are already paying for.',
    icon: 'TrendingUp',
  },
  {
    category: 'convert',
    label: 'Google Ads',
    href: '/services/google-ads',
    description:
      'Buy intent, not impressions. Search accounts built to optimize toward closed revenue.',
    icon: 'Target',
  },
  {
    category: 'convert',
    label: 'Meta Ads',
    href: '/services/meta-ads',
    description: 'Demand generation for businesses whose future customers are not searching yet.',
    icon: 'Megaphone',
  },
  {
    category: 'automate',
    label: 'AI & Automation',
    href: '/services/ai-automation',
    description: 'Practical AI that answers faster, qualifies better and lowers cost to serve.',
    icon: 'Bot',
  },
  {
    category: 'automate',
    label: 'CRM & Automation',
    href: '/services/crm-systems',
    description: 'Where leads become pipeline instead of quietly dying in an inbox.',
    icon: 'Workflow',
  },
]

/** The 8 seeded industries, in seeded order. */
const FALLBACK_INDUSTRIES: NavItem[] = [
  {
    label: 'Home Services',
    href: '/industries/home-services',
    description: 'Growth systems for trades that book emergency calls and win replacement jobs.',
    icon: 'Wrench',
  },
  {
    label: 'Law Firms',
    href: '/industries/law-firms',
    description:
      'Practice-area architecture, compliance-aware advertising and intake that converts signed matters.',
    icon: 'Scale',
  },
  {
    label: 'Medical',
    href: '/industries/medical',
    description:
      'Provider-level search, privacy-aware measurement and booking systems that fill clinical capacity.',
    icon: 'Stethoscope',
  },
  {
    label: 'Dental',
    href: '/industries/dental',
    description:
      'Separate funnels for hygiene recall and the high-value elective cases that carry production.',
    icon: 'Smile',
  },
  {
    label: 'E-commerce',
    href: '/industries/ecommerce-brands',
    description: 'Storefronts, feeds and lifecycle systems built around contribution margin.',
    icon: 'ShoppingBag',
  },
  {
    label: 'Real Estate',
    href: '/industries/real-estate',
    description:
      'Neighbourhood content that compounds, IDX handled properly, and nurture built for long cycles.',
    icon: 'Home',
  },
  {
    label: 'B2B',
    href: '/industries/b2b',
    description: 'Demand systems for long sales cycles, buying committees and real pipeline.',
    icon: 'Building2',
  },
  {
    label: 'Professional Services',
    href: '/industries/professional-services',
    description: 'Proof-led digital systems for firms that sell expertise, judgment and hours.',
    icon: 'Briefcase',
  },
]

/** Navigation as it would be built from a freshly seeded database. */
export const FALLBACK_NAV: SiteNav = {
  serviceGroups: Object.entries(SERVICE_CATEGORY_META)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, meta]): NavGroup => ({
      key,
      label: meta.label,
      blurb: meta.blurb,
      items: FALLBACK_SERVICES.filter((s) => s.category === key).map(
        ({ category: _category, ...item }) => item,
      ),
    }))
    .filter((group) => group.items.length > 0),
  industries: FALLBACK_INDUSTRIES,
}
