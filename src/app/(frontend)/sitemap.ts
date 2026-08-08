import type { MetadataRoute } from 'next'
import { getCaseStudies, getIndustries, getPosts, getServices } from '@/lib/payload'
import { absoluteUrl } from '@/lib/utils'

export const revalidate = 3600

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/industries', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/work', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/growth-hub', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/process', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/accessibility', priority: 0.2, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  let services: Awaited<ReturnType<typeof getServices>> = []
  let industries: Awaited<ReturnType<typeof getIndustries>> = []
  let posts: Awaited<ReturnType<typeof getPosts>> = []
  let caseStudies: Awaited<ReturnType<typeof getCaseStudies>> = []

  try {
    ;[services, industries, posts, caseStudies] = await Promise.all([
      getServices(),
      getIndustries(),
      getPosts({ limit: 500 }),
      getCaseStudies({ limit: 500 }),
    ])
  } catch (error) {
    // A sitemap containing only static routes beats a 500 that leaves search
    // engines with nothing at all.
    console.warn('[sitemap] Content unavailable, emitting static routes only.', error)
  }

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  for (const service of services) {
    if (service.seo?.noIndex) continue
    entries.push({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: new Date(service.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  for (const industry of industries) {
    if (industry.seo?.noIndex) continue
    entries.push({
      url: absoluteUrl(`/industries/${industry.slug}`),
      lastModified: new Date(industry.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  for (const post of posts) {
    if (post.seo?.noIndex) continue
    entries.push({
      url: absoluteUrl(`/growth-hub/${post.slug}`),
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const study of caseStudies) {
    if (study.seo?.noIndex) continue
    entries.push({
      url: absoluteUrl(`/work/${study.slug}`),
      lastModified: new Date(study.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return entries
}
