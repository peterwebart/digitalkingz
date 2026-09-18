import 'server-only'

import { cache } from 'react'
import type { Where } from 'payload'
import type { PaginatedDocs } from 'payload'
import { getPayloadClient, safeRead } from '@/lib/payload'
import { TAXONOMY_SEGMENTS, type TaxonomyType } from '@/collections/Taxonomies'
import type { Person, Taxonomy } from '@/payload-types'

/**
 * Data access for the people directory.
 *
 * Two rules are enforced here rather than in the pages, so no route can forget
 * them:
 *
 *   1. Only `published` profiles are readable. Everything imported from the CSV
 *      arrives as draft, and publishing stays an editorial decision.
 *   2. `INDEX_THRESHOLD` decides whether a published profile is substantial
 *      enough to be indexed. A page with a name and nothing else is a thin page
 *      whether or not somebody clicked publish.
 */

/**
 * Indexing threshold.
 *
 * Set to 0 on the client's instruction: every published profile is offered to
 * search, regardless of how little is known about it. The mechanism is kept
 * rather than deleted so a bar can be reinstated by changing this one number.
 */
export const INDEX_THRESHOLD = 0

const published: Where = { status: { equals: 'published' } }

const getPersonUnguarded = cache(async (slug: string): Promise<Person | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'people',
    where: { and: [published, { slug: { equals: slug } }] },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

const getPeopleUnguarded = cache(
  async (options: { limit?: number; page?: number } = {}) => {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'people',
      where: published,
      limit: options.limit ?? 48,
      page: options.page ?? 1,
      depth: 1,
      sort: '-completeness',
    })
  },
)

/** Slugs for prerendering. Empty when the database is unreachable at build. */
const peopleParamsUnguarded = cache(async (): Promise<{ slug: string }[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'people',
    where: published,
    limit: 1000,
    depth: 0,
    pagination: false,
    select: { slug: true },
  })
  return docs.map((d) => ({ slug: d.slug })).filter((d) => d.slug)
})

/** Terms worth a landing page: enough profiles to be useful, not a stub. */
const getTermsUnguarded = cache(
  async (type: TaxonomyType, minimum = 5): Promise<Taxonomy[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'taxonomies',
      where: { and: [{ type: { equals: type } }, { personCount: { greater_than_equal: minimum } }] },
      limit: 200,
      depth: 0,
      pagination: false,
      sort: '-personCount',
    })
    return docs
  },
)

// --- Presentation helpers --------------------------------------------------

const relatedTerms = (value: unknown): Taxonomy[] =>
  Array.isArray(value) ? value.filter((v): v is Taxonomy => typeof v === 'object' && v !== null) : []

/** All classification terms on a profile, grouped for display and linking. */
export function personTerms(person: Person) {
  return {
    countries: relatedTerms(person.countries),
    regions: relatedTerms(person.regions),
    industries: relatedTerms(person.industries),
    sports: relatedTerms(person.sports),
    platforms: relatedTerms(person.platforms),
    topics: relatedTerms(person.topics),
    genres: relatedTerms(person.genres),
    professions: relatedTerms(person.professions),
    languages: relatedTerms(person.languages),
  }
}

/** Landing-page URL for a term, e.g. /influencers/countries/canada. */
export function termHref(term: Taxonomy): string {
  const segment = TAXONOMY_SEGMENTS[term.type as TaxonomyType] ?? 'topics'
  return `/influencers/${segment}/${term.slug}`
}

export const PERSON_TYPE_LABELS: Record<string, string> = {
  influencer: 'Influencer',
  'public-figure': 'Public Figure',
}

/**
 * The first entry is treated as primary.
 *
 * The source data supplies both `Influencer;Public Figure` and
 * `Public Figure;Influencer`, and the importer preserves that order. If the
 * ordering turns out to be noise rather than intent, this is the single place
 * to change it.
 */
export function primaryType(person: Person): string {
  const first = person.personTypes?.[0]
  return first ? (PERSON_TYPE_LABELS[first] ?? first) : 'Person'
}

export const personTypeLabels = (person: Person): string[] =>
  (person.personTypes ?? []).map((t: string) => PERSON_TYPE_LABELS[t] ?? t)

/** Whether a profile is substantial enough to be indexed. */
export const isIndexable = (person: Person): boolean =>
  (person.completeness ?? 0) >= INDEX_THRESHOLD

// --- Taxonomy landing pages ------------------------------------------------

/** URL segment back to taxonomy type: 'countries' -> 'country'. */
export const SEGMENT_TO_TYPE: Record<string, TaxonomyType> = Object.fromEntries(
  Object.entries(TAXONOMY_SEGMENTS).map(([type, segment]) => [segment, type as TaxonomyType]),
) as Record<string, TaxonomyType>

/**
 * Which field on `people` holds this kind of term.
 *
 * `person-type` is a select rather than a relationship, so it is queried by
 * slug. `audience-type` has no structured field on people yet — the source data
 * only carries it as free text — so it gets no landing page rather than an
 * empty one.
 */
const TYPE_FIELD: Record<TaxonomyType, string | null> = {
  country: 'countries',
  region: 'regions',
  industry: 'industries',
  sport: 'sports',
  platform: 'platforms',
  topic: 'topics',
  genre: 'genres',
  profession: 'professions',
  language: 'languages',
  'person-type': 'personTypes',
  'audience-type': null,
}

const getTermUnguarded = cache(
  async (segment: string, slug: string): Promise<Taxonomy | null> => {
    const type = SEGMENT_TO_TYPE[segment]
    if (!type || TYPE_FIELD[type] === null) return null
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'taxonomies',
      where: { and: [{ type: { equals: type } }, { slug: { equals: slug } }] },
      limit: 1,
      depth: 0,
    })
    return docs[0] ?? null
  },
)

const getPeopleByTermUnguarded = cache(
  async (term: Taxonomy, options: { limit?: number; page?: number } = {}) => {
    const field = TYPE_FIELD[term.type as TaxonomyType]
    const payload = await getPayloadClient()
    const match: Where =
      field === 'personTypes' ? { personTypes: { in: [term.slug] } } : { [field as string]: { in: [term.id] } }

    return payload.find({
      collection: 'people',
      where: { and: [published, match] },
      limit: options.limit ?? 48,
      page: options.page ?? 1,
      depth: 1,
      sort: '-completeness',
    })
  },
)

/**
 * Params for prerendering. Only terms that actually hold profiles get a page —
 * a landing page listing nobody is the thin page the roadmap warns against.
 */
const termParamsUnguarded = cache(async (minimum = 3): Promise<{ segment: string; slug: string }[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'taxonomies',
    where: { personCount: { greater_than_equal: minimum } },
    limit: 1000,
    depth: 0,
    pagination: false,
    select: { slug: true, type: true },
  })
  return docs
    .map((d) => ({ segment: TAXONOMY_SEGMENTS[d.type as TaxonomyType], slug: d.slug }))
    .filter((d) => Boolean(d.segment) && Boolean(d.slug))
})

/** Every term holding at least one profile is indexable. */
export const isTermIndexable = (term: Taxonomy): boolean => (term.personCount ?? 0) >= 1

/** Human label for a term type, used in headings. */
export const TYPE_NOUNS: Record<TaxonomyType, string> = {
  country: 'country',
  region: 'region',
  industry: 'industry',
  sport: 'sport',
  platform: 'platform',
  topic: 'topic',
  genre: 'genre',
  profession: 'profession',
  language: 'language',
  'person-type': 'type',
  'audience-type': 'audience',
}

// --- Search ----------------------------------------------------------------

export type PeopleQuery = {
  q?: string
  country?: string
  industry?: string
  platform?: string
  sport?: string
  language?: string
  type?: string
  letter?: string
  page?: number
}

/** Filter keys that map to a taxonomy relationship, in display order. */
export const FILTERS: { key: keyof PeopleQuery; type: TaxonomyType; field: string; label: string }[] = [
  { key: 'country', type: 'country', field: 'countries', label: 'Country' },
  { key: 'industry', type: 'industry', field: 'industries', label: 'Industry' },
  { key: 'platform', type: 'platform', field: 'platforms', label: 'Platform' },
  { key: 'sport', type: 'sport', field: 'sports', label: 'Sport' },
  { key: 'language', type: 'language', field: 'languages', label: 'Language' },
]

/**
 * Directory search.
 *
 * Filters resolve slug -> id in one batched lookup rather than one query per
 * filter, and an unknown slug returns nothing rather than being ignored: a URL
 * that says `?country=atlantis` should not quietly return the whole directory.
 */
const searchPeopleUnguarded = cache(async (query: PeopleQuery) => {
  const payload = await getPayloadClient()
  const conditions: Where[] = [published]

  const term = query.q?.trim()

  // Ranked candidates come from a trigram query, because Payload's builder can
  // sort but cannot rank. The ids are then fed back through the normal query so
  // every other filter, and access control, still apply.
  let ranked: number[] | null = null
  if (term) {
    ranked = await rankedCandidates(payload, term)
    if (ranked.length === 0) return emptyPage<Person>()
    conditions.push({ id: { in: ranked } })
  }

  if (query.letter) {
    // Not `name: { like: 'A%' }` — Payload rewrites that to ILIKE '%A%%',
    // which returns every name containing an A. The denormalised initial gives
    // a real prefix match that also paginates correctly.
    conditions.push({ nameInitial: { equals: query.letter } })
  }

  if (query.type) {
    conditions.push({ personTypes: { in: [query.type] } })
  }

  const active = FILTERS.filter((f) => query[f.key])
  if (active.length > 0) {
    const { docs } = await payload.find({
      collection: 'taxonomies',
      where: {
        or: active.map(
          (f): Where => ({
            and: [{ type: { equals: f.type } }, { slug: { equals: String(query[f.key]) } }],
          }),
        ),
      },
      limit: active.length,
      depth: 0,
    })

    for (const filter of active) {
      const match = docs.find((d) => d.type === filter.type && d.slug === query[filter.key])
      // No match means the slug does not exist. Force an empty result rather
      // than dropping the filter and showing everything.
      conditions.push(match ? { [filter.field]: { in: [match.id] } } : { id: { equals: -1 } })
    }
  }

  const page = query.page && query.page > 0 ? query.page : 1

  if (!ranked) {
    return payload.find({
      collection: 'people',
      where: { and: conditions },
      limit: 24,
      page,
      depth: 1,
      sort: query.letter ? 'name' : '-completeness',
    })
  }

  // With a search term, ordering is by relevance, which the database cannot do
  // for us here. The directory is small enough (721 profiles, candidates capped
  // at 500) that sorting the filtered set in memory is honest and fast.
  const all = await payload.find({
    collection: 'people',
    where: { and: conditions },
    limit: 500,
    depth: 1,
    pagination: false,
  })

  const order = new Map(ranked.map((id, i) => [id, i]))
  const sorted = [...all.docs].sort(
    (a, b) => (order.get(a.id as number) ?? 1e9) - (order.get(b.id as number) ?? 1e9),
  )

  const limit = 24
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit))
  return {
    ...emptyPage<Person>(),
    docs: sorted.slice((page - 1) * limit, page * limit),
    totalDocs: sorted.length,
    limit,
    totalPages,
    page,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  }
})

/**
 * Trigram-ranked ids for a search term, best match first.
 *
 * Catches near-misses an ILIKE cannot: "cristano" still finds "Cristiano
 * Ronaldo". Falls back to substring matching if pg_trgm is unavailable, so a
 * database without the migration applied degrades rather than breaking.
 */
async function rankedCandidates(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  term: string,
): Promise<number[]> {
  const like = `%${term}%`
  try {
    const { rows } = await (payload.db as unknown as {
      pool: { query: (t: string, v: unknown[]) => Promise<{ rows: { id: number }[] }> }
    }).pool.query(
      // word_similarity, not similarity: plain trigram similarity divides by the
      // length of the whole string, so searching "ronaldo" ranked "Ronaldinho"
      // above "Cristiano Ronaldo". word_similarity scores the best matching
      // extent instead, which is what a name search actually wants.
      `SELECT id,
              GREATEST(
                word_similarity($1, name),
                COALESCE(word_similarity($1, alternate_names), 0),
                COALESCE(word_similarity($1, username_primary), 0)
              ) AS rank
         FROM people
        WHERE status = 'published'
          AND (
                name ILIKE $2
             OR alternate_names ILIKE $2
             OR username_primary ILIKE $2
             OR bio_short ILIKE $2
             OR word_similarity($1, name) > 0.5
          )
        ORDER BY rank DESC, completeness DESC NULLS LAST
        LIMIT 500`,
      [term, like],
    )
    return rows.map((r) => r.id)
  } catch (error) {
    console.warn('[search] trigram ranking unavailable, falling back to substring match.', error)
    const fallback = await payload.find({
      collection: 'people',
      where: {
        and: [
          published,
          {
            or: [
              { name: { like: term } },
              { alternateNames: { like: term } },
              { usernamePrimary: { like: term } },
              { bioShort: { like: term } },
            ],
          },
        ],
      },
      limit: 500,
      depth: 0,
      pagination: false,
    })
    return fallback.docs.map((d) => d.id as number)
  }
}

/** Options for the filter dropdowns, only terms that would return results. */
export const filterOptions = cache(async () => {
  // Every term with at least one published profile, so the dropdowns are complete.
  const groups = await Promise.all(FILTERS.map((f) => getTerms(f.type, 1)))
  return FILTERS.map((filter, i) => ({ ...filter, options: groups[i] }))
})

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// --- Build-phase tolerance -------------------------------------------------
//
// These queries previously bypassed the `safeRead` wrapper that the marketing
// routes use. The asymmetry showed up badly in a real build: marketing pages
// degraded to offline fallbacks while /people and /influencers/countries/israel
// threw and killed the whole deploy.
//
// Now every directory query behaves the same way. During `next build` a failed
// query costs one page; at runtime it still throws, so Next keeps serving the
// last good cached page rather than caching an empty one.

const emptyPage = <T>(): PaginatedDocs<T> => ({
  docs: [],
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  page: 1,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
})

export const getPerson = (slug: string) =>
  safeRead('people', () => getPersonUnguarded(slug), null)

export const getPeople = (options: { limit?: number; page?: number } = {}) =>
  safeRead('people', () => getPeopleUnguarded(options), emptyPage<Person>())

export const peopleParams = () =>
  safeRead('people (static params)', () => peopleParamsUnguarded(), [] as { slug: string }[])

/**
 * Default minimum is 1 so every country, industry and language that holds a
 * profile appears in the filters and gets a page. The sitemap still asks for 5
 * explicitly, and `isTermIndexable` keeps thin terms out of the index — so the
 * pages exist and are browsable without offering one-person pages to crawlers.
 */
export const getTerms = (type: TaxonomyType, minimum = 1) =>
  safeRead('taxonomies', () => getTermsUnguarded(type, minimum), [] as Taxonomy[])

export const getTerm = (segment: string, slug: string) =>
  safeRead('taxonomies', () => getTermUnguarded(segment, slug), null)

export const getPeopleByTerm = (term: Taxonomy, options: { limit?: number; page?: number } = {}) =>
  safeRead('people', () => getPeopleByTermUnguarded(term, options), emptyPage<Person>())

export const termParams = (minimum = 1) =>
  safeRead('taxonomies (static params)', () => termParamsUnguarded(minimum), [] as { segment: string; slug: string }[])

export const searchPeople = (query: PeopleQuery) =>
  safeRead('people (search)', () => searchPeopleUnguarded(query), emptyPage<Person>())
