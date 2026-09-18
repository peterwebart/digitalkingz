import 'server-only'

import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload, type Payload, type Where } from 'payload'
import { hasDatabaseConfig, isBuildPhase } from '@/lib/env'
import { FALLBACK_SITE_SETTINGS } from '@/lib/fallbacks'
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

// --- Database-free builds --------------------------------------------------
//
// A Docker/Nixpacks image is compiled without a database: Coolify injects
// DATABASE_URI into the running container, not into the builder. Without the
// guard below, every prerendered route throws "missing secret key" and the
// build dies — which is exactly what it did.
//
// The degradation is deliberately narrow. It applies only while `next build`
// is running. At runtime a failed query still throws, so Next keeps serving
// the last good cached page instead of quietly caching an empty one, and a
// real outage still surfaces as an error rather than as a silently blank site.

let fallbackUsed = false
const reported = new Set<string>()

/** True when any query fell back during this build. Read by `getSiteNav`. */
export function usedBuildFallback(): boolean {
  return fallbackUsed
}

function report(label: string, reason: string): void {
  fallbackUsed = true
  if (reported.has(label)) return
  reported.add(label)
  console.warn(`[build] "${label}" unavailable — using offline fallback. ${reason}`)
}

/**
 * Runs a query, or returns `fallback` when the database is unreachable during
 * a build. Rethrows everywhere else.
 */
export async function safeRead<T>(label: string, read: () => Promise<T>, fallback: T): Promise<T> {
  // Skip the connection attempt entirely when the build was never given
  // credentials. Payload would throw on init anyway, and a wrong or absent
  // host otherwise costs a pool timeout on every single query.
  if (isBuildPhase() && !hasDatabaseConfig()) {
    report(label, 'DATABASE_URI and PAYLOAD_SECRET are not set at build time.')
    return fallback
  }

  try {
    return await read()
  } catch (error) {
    if (!isBuildPhase()) throw error
    report(label, error instanceof Error ? error.message : String(error))
    return fallback
  }
}

/**
 * Static params helper.
 *
 * Prerenders every content route when the database is reachable at build time.
 * When it is not, an empty list leaves those routes to on-demand rendering,
 * which caches under the route's `revalidate` window on first request. Page
 * bodies live in the CMS, so there is nothing sensible to prerender them from
 * offline — unlike navigation, which has a static fallback.
 */
async function safeSlugs(
  collection: 'services' | 'industries' | 'posts' | 'case-studies',
): Promise<{ slug: string }[]> {
  return safeRead(
    `${collection} (static params)`,
    async () => {
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
    },
    [],
  )
}

export const serviceParams = () => safeSlugs('services')
export const industryParams = () => safeSlugs('industries')
export const postParams = () => safeSlugs('posts')
export const caseStudyParams = () => safeSlugs('case-studies')

// --- Services -------------------------------------------------------------

export const getServices = cache(
  async (): Promise<Service[]> =>
    safeRead(
      'services',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'services',
          limit: 100,
          depth: 0,
          pagination: false,
          sort: 'order',
        })
        return docs
      },
      [],
    ),
)

export const getService = cache(
  async (slug: string): Promise<Service | null> =>
    safeRead(
      'services',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'services',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
        })
        return docs[0] ?? null
      },
      null,
    ),
)

// --- Industries -----------------------------------------------------------

export const getIndustries = cache(
  async (): Promise<Industry[]> =>
    safeRead(
      'industries',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'industries',
          limit: 100,
          depth: 0,
          pagination: false,
          sort: 'order',
        })
        return docs
      },
      [],
    ),
)

export const getIndustry = cache(
  async (slug: string): Promise<Industry | null> =>
    safeRead(
      'industries',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'industries',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
        })
        return docs[0] ?? null
      },
      null,
    ),
)

// --- Posts ----------------------------------------------------------------

export const getPosts = cache(
  async (
    options: { limit?: number; category?: string; featured?: boolean } = {},
  ): Promise<Post[]> =>
    safeRead(
      'posts',
      async () => {
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
      [],
    ),
)

export const getPost = cache(
  async (slug: string): Promise<Post | null> =>
    safeRead(
      'posts',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'posts',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        })
        return docs[0] ?? null
      },
      null,
    ),
)

export const getCategories = cache(
  async (): Promise<Category[]> =>
    safeRead(
      'categories',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'categories',
          limit: 50,
          depth: 0,
          pagination: false,
          sort: 'title',
        })
        return docs
      },
      [],
    ),
)

export const getAuthors = cache(
  async (): Promise<Author[]> =>
    safeRead(
      'authors',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'authors',
          limit: 50,
          depth: 1,
          pagination: false,
        })
        return docs
      },
      [],
    ),
)

// --- Case studies & testimonials ------------------------------------------

export const getCaseStudies = cache(
  async (options: { limit?: number; featured?: boolean } = {}): Promise<CaseStudy[]> =>
    safeRead(
      'case-studies',
      async () => {
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
      [],
    ),
)

export const getCaseStudy = cache(
  async (slug: string): Promise<CaseStudy | null> =>
    safeRead(
      'case-studies',
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'case-studies',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        })
        return docs[0] ?? null
      },
      null,
    ),
)

export const getTestimonials = cache(
  async (options: { featured?: boolean } = {}): Promise<Testimonial[]> =>
    safeRead(
      'testimonials',
      async () => {
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
      [],
    ),
)

// --- Globals --------------------------------------------------------------

export const getSiteSettings = cache(
  async (): Promise<SiteSetting> =>
    safeRead(
      'site-settings',
      async () => {
        const payload = await getPayloadClient()
        return payload.findGlobal({ slug: 'site-settings', depth: 1 })
      },
      FALLBACK_SITE_SETTINGS,
    ),
)
