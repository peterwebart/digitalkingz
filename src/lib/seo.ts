import type { Metadata } from 'next'
import { absoluteUrl, getServerUrl } from '@/lib/utils'
import type { SiteSetting } from '@/payload-types'

export const SITE_NAME = 'Digital Kingz'

interface SeoInput {
  title: string
  description: string
  path: string
  /** Overrides the default social card. */
  image?: string | null
  noIndex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
}

/**
 * Single source of truth for page metadata.
 *
 * Every route builds its metadata through this so canonicals, Open Graph and
 * Twitter cards can never drift apart.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  type = 'website',
  publishedTime,
  modifiedTime,
  authorName,
}: SeoInput): Metadata {
  const url = absoluteUrl(path)
  const ogImage = image || absoluteUrl(`/og?title=${encodeURIComponent(title)}`)

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_CA',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            authors: authorName ? [authorName] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

export const ORG_ID = () => `${getServerUrl()}/#organization`
export const SITE_ID = () => `${getServerUrl()}/#website`

type Json = Record<string, unknown>

export function organizationSchema(settings: SiteSetting): Json {
  const sameAs = (settings.socialLinks ?? []).map((s) => s.url).filter(Boolean)
  const address = settings.address

  const hasAddress =
    address && (address.streetAddress || address.locality || address.region || address.postalCode)

  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID(),
    name: settings.brandName ?? SITE_NAME,
    legalName: settings.legalName ?? undefined,
    url: getServerUrl(),
    description: settings.description ?? undefined,
    slogan: settings.tagline ?? undefined,
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    foundingDate: settings.foundingYear ? String(settings.foundingYear) : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    address: hasAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: address?.streetAddress ?? undefined,
          addressLocality: address?.locality ?? undefined,
          addressRegion: address?.region ?? undefined,
          postalCode: address?.postalCode ?? undefined,
          addressCountry: address?.country ?? undefined,
        }
      : undefined,
    areaServed: (settings.serviceAreas ?? []).map((a) => a.name).filter(Boolean),
    knowsAbout: [
      'Web Design',
      'Web Development',
      'E-commerce Development',
      'Search Engine Optimization',
      'Local SEO',
      'Generative Engine Optimization',
      'Google Ads',
      'Meta Ads',
      'Conversion Rate Optimization',
      'AI Automation',
      'CRM Implementation',
      'Marketing Automation',
      'Branding',
      'Digital Strategy',
    ],
  }
}

export function websiteSchema(settings: SiteSetting): Json {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID(),
    url: getServerUrl(),
    name: settings.brandName ?? SITE_NAME,
    description: settings.description ?? undefined,
    publisher: { '@id': ORG_ID() },
    inLanguage: 'en',
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqSchema(faqs: { question?: string | null; answer?: string | null }[]): Json | null {
  const valid = faqs.filter((f) => f.question && f.answer)
  if (valid.length === 0) return null
  return {
    '@type': 'FAQPage',
    mainEntity: valid.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function serviceSchema(input: {
  name: string
  description: string
  path: string
  category?: string | null
}): Json {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(input.path)}#service`,
    name: input.name,
    description: input.description,
    serviceType: input.name,
    category: input.category ?? undefined,
    url: absoluteUrl(input.path),
    provider: { '@id': ORG_ID() },
  }
}

export function articleSchema(input: {
  title: string
  description: string
  path: string
  publishedAt: string
  updatedAt: string
  authorName: string
  authorPath?: string
  image?: string | null
  section?: string | null
  wordCount?: number
}): Json {
  return {
    '@type': 'Article',
    '@id': `${absoluteUrl(input.path)}#article`,
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    articleSection: input.section ?? undefined,
    wordCount: input.wordCount,
    inLanguage: 'en',
    image: input.image ?? undefined,
    author: {
      '@type': 'Person',
      name: input.authorName,
      url: input.authorPath ? absoluteUrl(input.authorPath) : undefined,
    },
    publisher: { '@id': ORG_ID() },
    isPartOf: { '@id': SITE_ID() },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
  }
}

/** Wraps nodes into a single @graph document, which search engines prefer. */
export function jsonLdGraph(nodes: (Json | null)[]): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': nodes.filter(Boolean),
    },
    (_key, value) => (value === undefined ? undefined : value),
  )
}
