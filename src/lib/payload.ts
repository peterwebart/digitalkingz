import 'server-only'

import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload, type Payload, type Where } from 'payload'
import type {
  Author,
  Category,
  CaseStudy,
  Industry,
  Post,
  Service,
  SiteSetting,
  Testimonial,
} from '@/payload-types'

export const getPayloadClient = cache(async (): Promise<Payload> => {
  return getPayload({ config: configPromise })
})

/**
 * Static params helper.
 *
 * A production build should prerender every content route, but it must not
 * hard-fail when the database is unreachable at build time (for example the
 * very first deploy, before the Postgres service is attached). Returning an
 * empty list lets Next fall back to on-demand rendering, which then caches
 * under the route's `revalidate` window.
 */
async function safeSlugs(
  collection: 'services' | 'industries' | 'posts' | 'case-studies',
): Promise<{ slug: string }[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection,
      limit: 500,
      depth: 0,
      pagination: false,
      select: { slug: true },
    })
    return result.docs
      .map((doc) => ({ slug: (doc as { slug?: string }).slug ?? '' }))
      .filter((d) => d.slug.length > 0)
  } catch (error) {
    console.warn(
      `[build] Could not read "${collection}" for static params. Falling back to on-demand rendering.`,
      error instanceof Error ? error.message : error,
    )
    return []
  }
}

export const serviceParams = () => safeSlugs('services')
export const industryParams = () => safeSlugs('industries')
export const postParams = () => safeSlugs('posts')
export const caseStudyParams = () => safeSlugs('case-studies')

// --- Services -------------------------------------------------------------

export const getServices = cache(async (): Promise<Service[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    limit: 100,
    depth: 0,
    pagination: false,
    sort: 'order',
  })
  return docs
})

export const getService = cache(async (slug: string): Promise<Service | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

// --- Industries -----------------------------------------------------------

export const getIndustries = cache(async (): Promise<Industry[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'industries',
    limit: 100,
    depth: 0,
    pagination: false,
    sort: 'order',
  })
  return docs
})

export const getIndustry = cache(async (slug: string): Promise<Industry | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'industries',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

// --- Posts ----------------------------------------------------------------

export const getPosts = cache(
  async (options: { limit?: number; category?: string; featured?: boolean } = {}) => {
    const payload = await getPayloadClient()
    const where: Where = {}
    if (options.category) where['category.slug'] = { equals: options.category }
    if (options.featured) where.featured = { equals: true }

    const { docs } = await payload.find({
      collection: 'posts',
      where,
      limit: options.limit ?? 50,
      depth: 1,
      pagination: false,
      sort: '-publishedAt',
    })
    return docs as Post[]
  },
)

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export const getCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 50,
    depth: 0,
    pagination: false,
    sort: 'title',
  })
  return docs
})

export const getAuthors = cache(async (): Promise<Author[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'authors',
    limit: 50,
    depth: 1,
    pagination: false,
  })
  return docs
})

// --- Case studies & testimonials ------------------------------------------

export const getCaseStudies = cache(
  async (options: { limit?: number; featured?: boolean } = {}): Promise<CaseStudy[]> => {
    const payload = await getPayloadClient()
    const where: Where = {}
    if (options.featured) where.featured = { equals: true }

    const { docs } = await payload.find({
      collection: 'case-studies',
      where,
      limit: options.limit ?? 50,
      depth: 2,
      pagination: false,
      sort: 'order',
    })
    return docs
  },
)

export const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})

export const getTestimonials = cache(
  async (options: { featured?: boolean } = {}): Promise<Testimonial[]> => {
    const payload = await getPayloadClient()
    const where: Where = {}
    if (options.featured) where.featured = { equals: true }

    const { docs } = await payload.find({
      collection: 'testimonials',
      where,
      limit: 20,
      depth: 1,
      pagination: false,
    })
    return docs
  },
)

// --- Globals --------------------------------------------------------------

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})
