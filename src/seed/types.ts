/**
 * Seed content contract.
 *
 * These types describe the version-controlled source of truth for launch
 * content. `src/seed/run.ts` reads these objects and writes them into the
 * Payload collections, so the CMS ships populated and every field remains
 * editable in the admin panel afterwards.
 *
 * The shapes here mirror the Payload field definitions in `src/collections`
 * one-to-one. If you change one, change the other.
 */

export type ServiceCategory = 'build' | 'get-found' | 'convert' | 'automate'

export interface Faq {
  question: string
  answer: string
}

export interface TitledBody {
  title: string
  body: string
}

export interface ApproachStep {
  step: string
  title: string
  body: string
}

export interface DeepDiveSection {
  heading: string
  paragraphs: string[]
}

/** Portable block format. Converted to Lexical rich text by the seed script. */
export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

export interface ServiceSeed {
  slug: string
  category: ServiceCategory
  /** Full service name, e.g. "Local SEO". Used in H1s and breadcrumbs. */
  title: string
  /** Short label for navigation and cards, e.g. "Local SEO". */
  navLabel: string
  /** One sentence, max ~15 words. Used on service cards and the mega menu. */
  tagline: string
  /** lucide-react icon name in PascalCase, e.g. "MapPin". */
  icon: string
  /** Max 60 characters. */
  metaTitle: string
  /** 140-158 characters. */
  metaDescription: string
  heroEyebrow: string
  heroHeading: string
  heroSubheading: string
  /** 2-3 paragraphs framing the commercial problem. */
  intro: string[]
  problemsHeading: string
  problems: TitledBody[]
  includedHeading: string
  includedIntro: string
  /** 6-8 concrete deliverables. */
  included: TitledBody[]
  approachHeading: string
  approach: ApproachStep[]
  outcomesHeading: string
  outcomesIntro: string
  /** Qualitative business outcomes. Never numeric claims. */
  outcomes: TitledBody[]
  /** Long-form body copy carrying the page's semantic SEO weight. */
  deepDive: DeepDiveSection[]
  faqs: Faq[]
  /** Slugs of other services. */
  relatedServices: string[]
  /** Slugs of industries. */
  relatedIndustries: string[]
  ctaHeading: string
  ctaBody: string
}

export interface IndustrySeed {
  slug: string
  title: string
  navLabel: string
  tagline: string
  icon: string
  metaTitle: string
  metaDescription: string
  heroEyebrow: string
  heroHeading: string
  heroSubheading: string
  intro: string[]
  challengesHeading: string
  challengesIntro: string
  challenges: TitledBody[]
  /** How buyers in this vertical actually search and choose. */
  buyerBehaviourHeading: string
  buyerBehaviour: string[]
  systemHeading: string
  systemIntro: string
  /** What a complete growth system looks like for this industry. */
  system: TitledBody[]
  deepDive: DeepDiveSection[]
  faqs: Faq[]
  relatedServices: string[]
  ctaHeading: string
  ctaBody: string
}

export interface ArticleSeed {
  slug: string
  title: string
  /** Max 60 characters. */
  metaTitle: string
  /** 140-158 characters. */
  metaDescription: string
  /** 1-2 sentences. Shown on cards and in the article header. */
  excerpt: string
  /** Category slug: 'seo' | 'ai-automation' | 'web-design' | 'paid-media' | 'growth' */
  category: string
  /** ISO date string, e.g. "2026-06-18". */
  publishedAt: string
  /** Author slug. */
  author: string
  body: ContentBlock[]
  faqs: Faq[]
  /** Slugs of services this article should funnel into. */
  relatedServices: string[]
}

export interface CategorySeed {
  slug: string
  title: string
  description: string
}

export interface AuthorSeed {
  slug: string
  name: string
  role: string
  bio: string
}
