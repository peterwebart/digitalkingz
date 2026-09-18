/**
 * People directory importer.
 *
 *   pnpm import:people -- --dry-run     inspect and report, write nothing
 *   pnpm import:people                  upsert into the database
 *
 * Idempotent: matches on externalId first, then slug, so re-running updates
 * rather than duplicating. Safe to run against production once the migration
 * has been applied.
 *
 * The supplied data is inconsistent in ways that matter, so normalisation
 * happens here rather than being pushed onto editors:
 *   - person_type arrives in eight spellings for two concepts
 *   - taxonomy rows carry slugs but no display titles
 *   - professions and languages exist only as delimited columns on people.csv
 */
import 'dotenv/config'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TAXONOMY_TYPES, type TaxonomyType } from '@/collections/Taxonomies'

const DRY_RUN = process.argv.includes('--dry-run')
/**
 * --publish-above=60 publishes profiles at or over that completeness score.
 * Off by default: publishing is an editorial decision, and importing 721 thin
 * profiles straight to the index is exactly the failure the roadmap warns about.
 */
const PUBLISH_ABOVE = (() => {
  const arg = process.argv.find((a) => a.startsWith('--publish-above='))
  const n = arg ? Number(arg.split('=')[1]) : NaN
  return Number.isFinite(n) ? n : null
})()
const DATA_DIR = resolve(process.cwd(), 'data/people')

// --- CSV -------------------------------------------------------------------

/** Minimal RFC4180 reader: handles quoted fields, embedded commas and CRLF. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1 } else quoted = false
      } else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }

  const header = (rows.shift() ?? []).map((h) => h.replace(/^\uFEFF/, '').trim())
  return rows
    .filter((r) => r.some((v) => v.trim().length > 0))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])))
}

const slugify = (v: string) =>
  v.toLowerCase().trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Splits the semicolon/comma delimited multi-value columns. */
const multi = (v?: string): string[] =>
  (v ?? '').split(/[;,|]/).map((s) => s.trim()).filter(Boolean)

const titleCase = (slug: string) =>
  slug.split('-').map((w) => (w.length <= 2 && w !== 'ai' ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(' ')

/** Eight spellings, two concepts. Order is preserved: the first is primary. */
function normalisePersonTypes(raw: string): ('influencer' | 'public-figure')[] {
  const seen = new Set<string>()
  const out: ('influencer' | 'public-figure')[] = []
  for (const part of multi(raw)) {
    const s = slugify(part)
    const v = s === 'influencer' ? 'influencer' : s === 'public-figure' ? 'public-figure' : null
    if (v && !seen.has(v)) { seen.add(v); out.push(v) }
  }
  return out
}

const truthy = (v?: string) => ['1', 'true', 'yes', 'y'].includes((v ?? '').toLowerCase())

/** 0-100. Drives the indexing threshold; nothing thin gets published by accident. */
function scoreCompleteness(p: Record<string, string>): number {
  let s = 0
  if (p.bio_short) s += 20
  if (p.bio_long) s += 15
  if (p.profile_image_url) s += 20
  if (p.wikipedia_url || p.official_source_url || p.website_url) s += 20
  if (p.country) s += 10
  if (p.industry_primary || p.industries) s += 10
  if (p.date_of_birth) s += 5
  return Math.min(100, s)
}

// --- Load ------------------------------------------------------------------

for (const f of ['people.csv', 'people_taxonomies.csv']) {
  if (!existsSync(resolve(DATA_DIR, f))) {
    console.error(`\n  Missing ${f}. Expected both CSVs in data/people/.\n`)
    process.exit(1)
  }
}

const people = parseCsv(readFileSync(resolve(DATA_DIR, 'people.csv'), 'utf8'))
const taxonomyRows = parseCsv(readFileSync(resolve(DATA_DIR, 'people_taxonomies.csv'), 'utf8'))

// --- Build the taxonomy set ------------------------------------------------

type TermKey = `${TaxonomyType}:${string}`
const terms = new Map<TermKey, { type: TaxonomyType; slug: string; title: string; countryCode?: string }>()
const issues: string[] = []

function addTerm(type: string, slug: string, title?: string, countryCode?: string) {
  // The CSV uses snake_case for taxonomy_type ("person_type"); the schema uses
  // kebab-case, as URLs do.
  const t = type.replace(/_/g, '-') as TaxonomyType
  if (!TAXONOMY_TYPES.includes(t)) { issues.push(`Unknown taxonomy type "${type}" (skipped)`); return null }
  if (!slug) return null
  const key: TermKey = `${t}:${slug}`
  const existing = terms.get(key)
  if (existing) {
    if (title && existing.title === titleCase(slug)) existing.title = title
    if (countryCode && !existing.countryCode) existing.countryCode = countryCode
    return key
  }
  terms.set(key, { type: t, slug, title: title || titleCase(slug), countryCode })
  return key
}

// From the taxonomy file (slugs only, no titles).
const byPerson = new Map<string, TermKey[]>()
for (const row of taxonomyRows) {
  const key = addTerm(row.taxonomy_type, row.taxonomy_slug)
  if (!key) continue
  const list = byPerson.get(row.person_id) ?? []
  list.push(key)
  byPerson.set(row.person_id, list)
}

// From people.csv: real display names for countries, plus the professions and
// languages that the taxonomy file omits entirely.
for (const p of people) {
  if (p.country) addTerm('country', slugify(p.country), p.country, p.country_code || undefined)
  if (p.region) addTerm('region', slugify(p.region), p.region)
  for (const v of multi(p.professions || p.profession)) addTerm('profession', slugify(v), v)
  for (const v of multi(p.languages)) addTerm('language', slugify(v), v)
  for (const v of multi(p.topics)) addTerm('topic', slugify(v), v)
  for (const v of multi(p.sports)) addTerm('sport', slugify(v), v)
  for (const v of multi(p.industries || p.industry_primary)) addTerm('industry', slugify(v), v)
  for (const v of multi(p.genre)) addTerm('genre', slugify(v), v)
}

// --- Data quality ----------------------------------------------------------

const rawTypeSpellings = new Set(people.map((p) => p.person_type).filter(Boolean))
const emptyCols = Object.keys(people[0] ?? {}).filter(
  (k) => people.every((p) => !(p[k] ?? '').trim()),
)
const noType = people.filter((p) => normalisePersonTypes(p.person_type).length === 0)
const dupSlugs = Object.entries(
  people.reduce<Record<string, number>>((a, p) => ((a[p.slug] = (a[p.slug] ?? 0) + 1), a), {}),
).filter(([, n]) => n > 1)

console.log(`\n  Digital Kingz — People import${DRY_RUN ? '  (dry run)' : ''}`)
console.log('  ' + '-'.repeat(58))
console.log(`  people.csv rows        ${people.length}`)
console.log(`  taxonomy rows          ${taxonomyRows.length}`)
console.log(`  distinct terms         ${terms.size}`)
console.log(`  person_type spellings  ${rawTypeSpellings.size} -> 2 normalised values`)
if (emptyCols.length) console.log(`  columns entirely empty ${emptyCols.length}: ${emptyCols.join(', ')}`)
if (noType.length) issues.push(`${noType.length} rows have an unrecognised person_type`)
if (dupSlugs.length) issues.push(`${dupSlugs.length} duplicate slugs`)

const withImage = people.filter((p) => p.profile_image_url).length
const withSource = people.filter((p) => p.wikipedia_url || p.official_source_url || p.website_url).length
console.log(`  with profile image     ${withImage}/${people.length}`)
console.log(`  with any source URL    ${withSource}/${people.length}`)

if (DRY_RUN) {
  console.log('\n  Issues:')
  for (const i of [...new Set(issues)]) console.log(`    - ${i}`)
  const scores = people.map(scoreCompleteness)
  const publishable = scores.filter((s) => s >= 60).length
  console.log(`\n  Completeness >= 60 (publishable): ${publishable}/${people.length}`)
  console.log(`  Median completeness: ${scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]}`)
  console.log('\n  Dry run: nothing written.\n')
  process.exit(0)
}

// --- Write -----------------------------------------------------------------

const payload = await getPayload({ config })
// Postgres IDs are numeric in this project.
const termIds = new Map<TermKey, number>()
let termsCreated = 0
let termsUpdated = 0

for (const [key, term] of terms) {
  const existing = await payload.find({
    collection: 'taxonomies',
    where: { and: [{ type: { equals: term.type } }, { slug: { equals: term.slug } }] },
    limit: 1,
    depth: 0,
  })
  const data = { type: term.type, slug: term.slug, title: term.title, countryCode: term.countryCode }
  if (existing.docs[0]) {
    const doc = await payload.update({
      collection: 'taxonomies', id: existing.docs[0].id, data, overrideAccess: true,
    })
    termIds.set(key, doc.id as number); termsUpdated += 1
  } else {
    const doc = await payload.create({ collection: 'taxonomies', data, overrideAccess: true })
    termIds.set(key, doc.id as number); termsCreated += 1
  }
}

let created = 0
let updated = 0
let skipped = 0
let review = 0
const counts = new Map<TermKey, number>()

for (const p of people) {
  const personTypes = normalisePersonTypes(p.person_type)
  if (!p.slug || !p.name || personTypes.length === 0) { skipped += 1; continue }

  const keys = new Set<TermKey>(byPerson.get(p.person_id) ?? [])
  if (p.country) keys.add(`country:${slugify(p.country)}`)
  if (p.region) keys.add(`region:${slugify(p.region)}`)
  for (const v of multi(p.professions || p.profession)) keys.add(`profession:${slugify(v)}`)
  for (const v of multi(p.languages)) keys.add(`language:${slugify(v)}`)
  for (const v of multi(p.topics)) keys.add(`topic:${slugify(v)}`)
  for (const v of multi(p.sports)) keys.add(`sport:${slugify(v)}`)
  for (const v of multi(p.industries || p.industry_primary)) keys.add(`industry:${slugify(v)}`)
  for (const v of multi(p.genre)) keys.add(`genre:${slugify(v)}`)

  const idsOf = (type: TaxonomyType) =>
    [...keys].filter((k) => k.startsWith(`${type}:`)).map((k) => termIds.get(k)).filter((v): v is number => typeof v === 'number')

  for (const k of keys) if (termIds.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1)

  const completeness = scoreCompleteness(p)
  if (completeness < 60) review += 1

  const primaryIndustryKey: TermKey | undefined = p.industry_primary
    ? (`industry:${slugify(p.industry_primary)}` as TermKey)
    : undefined

  const data = {
    externalId: p.person_id || undefined,
    slug: p.slug,
    name: p.name,
    status: (PUBLISH_ABOVE !== null && completeness >= PUBLISH_ABOVE
      ? 'published'
      : 'draft') as 'draft' | 'published',
    completeness,
    personTypes,
    alternateNames: p.alternate_names || undefined,
    usernamePrimary: p.username_primary || undefined,
    gender: p.gender || undefined,
    generation: p.generation || undefined,
    dateOfBirth: p.date_of_birth || undefined,
    nationality: p.nationality || undefined,
    city: p.city || undefined,
    countryCode: p.country_code || undefined,
    countries: idsOf('country'),
    regions: idsOf('region'),
    industries: idsOf('industry'),
    sports: idsOf('sport'),
    platforms: idsOf('platform'),
    topics: idsOf('topic'),
    genres: idsOf('genre'),
    professions: idsOf('profession'),
    languages: idsOf('language'),
    primaryIndustry: primaryIndustryKey ? termIds.get(primaryIndustryKey) : undefined,
    sportRole: p.sport_role || undefined,
    niches: p.niches || undefined,
    audienceType: p.audience_type || undefined,
    audienceScope: p.audience_scope || undefined,
    bioShort: p.bio_short || undefined,
    bioLong: p.bio_long || undefined,
    knownFor: p.known_for || undefined,
    notableWork: p.notable_work || undefined,
    awards: p.awards || undefined,
    organizations: p.organizations || undefined,
    brands: p.brands || undefined,
    websiteUrl: p.website_url || undefined,
    wikipediaUrl: p.wikipedia_url || undefined,
    officialSourceUrl: p.official_source_url || undefined,
    verified: truthy(p.verified),
    verificationDate: p.verification_date || undefined,
    claimed: truthy(p.claimed),
    editorialNotes: p.editorial_notes || undefined,
    seo: {
      metaTitle: `${p.name}`.slice(0, 70),
      metaDescription: (p.bio_short || `${p.name} profile on the Digital Kingz people directory.`).slice(0, 160),
    },
  }

  const existing = await payload.find({
    collection: 'people',
    where: p.person_id
      ? { or: [{ externalId: { equals: p.person_id } }, { slug: { equals: p.slug } }] }
      : { slug: { equals: p.slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({ collection: 'people', id: existing.docs[0].id, data, overrideAccess: true })
    updated += 1
  } else {
    await payload.create({ collection: 'people', data, overrideAccess: true })
    created += 1
  }
}

// Term counts decide which landing pages are worth existing at all.
for (const [key, id] of termIds) {
  await payload.update({
    collection: 'taxonomies', id, data: { personCount: counts.get(key) ?? 0 }, overrideAccess: true,
  })
}

console.log('  ' + '-'.repeat(58))
console.log(`  taxonomies   ${termsCreated} created, ${termsUpdated} updated`)
console.log(`  people       ${created} created, ${updated} updated, ${skipped} skipped`)
console.log(`  needs review ${review} (completeness below 60)`)
console.log('\n  Issues:')
for (const i of [...new Set(issues)]) console.log(`    - ${i}`)
console.log(
  PUBLISH_ABOVE !== null
    ? `\n  Import complete. Published profiles scoring >= ${PUBLISH_ABOVE}; the rest stay draft.\n`
    : '\n  Import complete. All profiles imported as draft.\n',
)
process.exit(0)
