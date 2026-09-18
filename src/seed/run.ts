/**
 * Seed runner.
 *
 * Idempotent: every document is matched on slug and updated in place, so this
 * can be re-run safely against an existing database without duplicating
 * content or clobbering unrelated records.
 *
 *   pnpm seed
 *
 * Requires DATABASE_URI and PAYLOAD_SECRET.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'

import { env } from '../lib/env'
import { articles, authors, categories, industries, services } from './content'
import { autolink, blocksToLexical } from '../lib/lexical'
import type { ServiceSeed } from './types'

const log = (msg: string) => console.log(`  ${msg}`)

/** Minimum length we enforce on the seeded admin account. */
const MIN_PASSWORD_LENGTH = 12

/** The placeholder published in .env.example, and therefore not a secret. */
const PUBLIC_EXAMPLE_PASSWORD = 'ChangeMe-DigitalKingz-2026'

/**
 * Aborts with a readable box rather than a stack trace. Never echoes a
 * credential value, only the name of the variable that holds it.
 */
function fail(title: string, body: string[]): never {
  console.error('')
  console.error(`\x1b[31m\x1b[1m  ${'-'.repeat(66)}\x1b[0m`)
  console.error(`\x1b[31m\x1b[1m  ${title}\x1b[0m`)
  console.error(`\x1b[31m\x1b[1m  ${'-'.repeat(66)}\x1b[0m`)
  console.error('')
  body.forEach((l) => console.error(`  ${l}`))
  console.error('')
  process.exit(1)
}

/** Upserts by slug and returns the resulting document id. */
async function upsert<T extends Record<string, unknown>>(
  payload: Payload,
  collection: 'services' | 'industries' | 'posts' | 'categories' | 'authors',
  slug: string,
  data: T,
): Promise<number | string> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    // Drafts are enabled on posts; look past the published filter.
    draft: true,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0]!.id
    await payload.update({
      collection,
      id,
      data: data as never,
      overrideAccess: true,
      draft: false,
    })
    return id
  }

  const created = await payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
    draft: false,
  })
  return created.id
}

const serviceCommon = (s: ServiceSeed) => ({
  slug: s.slug,
  title: s.title,
  navLabel: s.navLabel,
  tagline: s.tagline,
  icon: s.icon,
  category: s.category,
  hero: {
    eyebrow: s.heroEyebrow,
    heading: s.heroHeading,
    subheading: s.heroSubheading,
  },
  intro: s.intro.join('\n\n'),
  problemsHeading: s.problemsHeading,
  problems: s.problems,
  includedHeading: s.includedHeading,
  includedIntro: s.includedIntro,
  included: s.included,
  approachHeading: s.approachHeading,
  approach: s.approach,
  outcomesHeading: s.outcomesHeading,
  outcomesIntro: s.outcomesIntro,
  outcomes: s.outcomes,
  deepDive: s.deepDive.map((d) => ({
    heading: d.heading,
    paragraphs: d.paragraphs.join('\n\n'),
  })),
  faqs: s.faqs,
  cta: { heading: s.ctaHeading, body: s.ctaBody },
  seo: {
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription,
    noIndex: false,
  },
})

async function seed() {
  const payload = await getPayload({ config })

  console.log('\n  Seeding digitalkingz.com\n' + '  ' + '-'.repeat(52))

  // --- Admin user ---------------------------------------------------------
  // Credentials come from the environment, never from source. `env()` treats a
  // blank value as absent, so `SEED_ADMIN_PASSWORD=` in a .env file is caught
  // here with a useful message instead of reaching Payload as an empty string.
  const adminEmail = env('SEED_ADMIN_EMAIL')
  const adminPassword = env('SEED_ADMIN_PASSWORD')

  if (!adminEmail || !adminPassword) {
    const missing = [
      !adminEmail ? 'SEED_ADMIN_EMAIL' : null,
      !adminPassword ? 'SEED_ADMIN_PASSWORD' : null,
    ].filter(Boolean)

    fail(`Cannot create the admin user: ${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not set`, [
      'Both must be present and non-empty in your .env file.',
      '',
      'Add or complete these lines:',
      '',
      '  SEED_ADMIN_EMAIL=solutions@digitalkingz.com',
      '  SEED_ADMIN_PASSWORD=<a password of 12 or more characters>',
      '',
      'A key with no value (SEED_ADMIN_PASSWORD=) counts as unset.',
      '',
      'Re-running `pnpm setup` will regenerate a complete .env for you.',
    ])
  }

  if (adminPassword.length < MIN_PASSWORD_LENGTH) {
    fail('Admin password is too short', [
      `SEED_ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      `The value currently set is ${adminPassword.length}.`,
    ])
  }

  // The value shipped in .env.example is public. It is fine for a throwaway
  // local database and unacceptable on a live one.
  if (process.env.NODE_ENV === 'production' && adminPassword === PUBLIC_EXAMPLE_PASSWORD) {
    fail('Refusing to seed a production database with the example password', [
      'SEED_ADMIN_PASSWORD still holds the value published in .env.example,',
      'which means it is public knowledge.',
      '',
      'Set a unique password in your production environment variables and',
      'run the seed again.',
    ])
  }

  // Idempotency is keyed on the email, so re-running never creates a duplicate
  // and never touches the password of an account that already exists.
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingAdmin.totalDocs > 0) {
    log(`admin user already exists: ${adminEmail}`)
    log('  password left unchanged')
  } else {
    await payload.create({
      collection: 'users',
      data: { name: 'Digital Kingz Admin', email: adminEmail, password: adminPassword },
      overrideAccess: true,
    })
    log(`admin user created: ${adminEmail}`)
    log('  password is the SEED_ADMIN_PASSWORD value in your .env file')
    log('  change it after your first login')
  }

  // --- Taxonomy -----------------------------------------------------------
  const categoryIds = new Map<string, number | string>()
  for (const c of categories) {
    const id = await upsert(payload, 'categories', c.slug, {
      slug: c.slug,
      title: c.title,
      description: c.description,
    })
    categoryIds.set(c.slug, id)
  }
  log(`categories  ${categories.length}`)

  const authorIds = new Map<string, number | string>()
  for (const a of authors) {
    const id = await upsert(payload, 'authors', a.slug, {
      slug: a.slug,
      name: a.name,
      role: a.role,
      bio: a.bio,
    })
    authorIds.set(a.slug, id)
  }
  log(`authors     ${authors.length}`)

  // --- Services and industries, pass 1 (no relationships) -----------------
  const serviceIds = new Map<string, number | string>()
  for (const [i, s] of services.entries()) {
    const id = await upsert(payload, 'services', s.slug, {
      ...serviceCommon(s),
      order: (i + 1) * 10,
      relatedServices: [],
      relatedIndustries: [],
    })
    serviceIds.set(s.slug, id)
  }
  log(`services    ${services.length}`)

  const industryIds = new Map<string, number | string>()
  for (const [i, ind] of industries.entries()) {
    const id = await upsert(payload, 'industries', ind.slug, {
      slug: ind.slug,
      title: ind.title,
      navLabel: ind.navLabel,
      tagline: ind.tagline,
      icon: ind.icon,
      order: (i + 1) * 10,
      hero: {
        eyebrow: ind.heroEyebrow,
        heading: ind.heroHeading,
        subheading: ind.heroSubheading,
      },
      intro: ind.intro.join('\n\n'),
      challengesHeading: ind.challengesHeading,
      challengesIntro: ind.challengesIntro,
      challenges: ind.challenges,
      buyerBehaviourHeading: ind.buyerBehaviourHeading,
      buyerBehaviour: ind.buyerBehaviour.join('\n\n'),
      systemHeading: ind.systemHeading,
      systemIntro: ind.systemIntro,
      system: ind.system,
      deepDive: ind.deepDive.map((d) => ({
        heading: d.heading,
        paragraphs: d.paragraphs.join('\n\n'),
      })),
      faqs: ind.faqs,
      cta: { heading: ind.ctaHeading, body: ind.ctaBody },
      seo: {
        metaTitle: ind.metaTitle,
        metaDescription: ind.metaDescription,
        noIndex: false,
      },
      relatedServices: [],
    })
    industryIds.set(ind.slug, id)
  }
  log(`industries  ${industries.length}`)

  // --- Pass 2: relationships ---------------------------------------------
  for (const s of services) {
    await payload.update({
      collection: 'services',
      id: serviceIds.get(s.slug)!,
      data: {
        relatedServices: s.relatedServices
          .map((slug) => serviceIds.get(slug))
          .filter((v): v is number | string => v !== undefined) as never,
        relatedIndustries: s.relatedIndustries
          .map((slug) => industryIds.get(slug))
          .filter((v): v is number | string => v !== undefined) as never,
      },
      overrideAccess: true,
    })
  }
  for (const ind of industries) {
    await payload.update({
      collection: 'industries',
      id: industryIds.get(ind.slug)!,
      data: {
        relatedServices: ind.relatedServices
          .map((slug) => serviceIds.get(slug))
          .filter((v): v is number | string => v !== undefined) as never,
      },
      overrideAccess: true,
    })
  }
  log('relationships linked')

  // --- Media --------------------------------------------------------------
  // Uploaded through Payload rather than copied into public/, so the files get
  // the collection's resize pipeline and a real media record. Matched on
  // filename so re-running the seed reuses the existing upload instead of
  // creating duplicates.
  const { join, resolve: resolvePath } = await import('node:path')
  const { existsSync } = await import('node:fs')
  const mediaDir = resolvePath(process.cwd(), 'src/seed/media')
  const mediaIds = new Map<string, number | string>()

  for (const a of articles) {
    if (!a.heroImage || mediaIds.has(a.heroImage)) continue
    const filePath = join(mediaDir, a.heroImage)
    if (!existsSync(filePath)) {
      console.warn(`  ! hero image missing, skipped: ${a.heroImage}`)
      continue
    }
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: a.heroImage } },
      limit: 1,
    })
    if (found.docs[0]) {
      mediaIds.set(a.heroImage, found.docs[0].id)
      continue
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt: a.heroImageAlt ?? a.title },
      filePath,
    })
    mediaIds.set(a.heroImage, created.id)
  }
  if (mediaIds.size > 0) console.log(`  media       ${mediaIds.size}`)

  // --- Articles -----------------------------------------------------------
  // Longest phrases first so "Local SEO" wins over "SEO".
  // Link targets cover services AND every other article, which is what turns 29
  // separate guides into a cluster: a mention of "The Complete SEO Guide" or
  // "Local SEO" inside any article becomes a link. Longest phrases first so
  // "The Complete Local SEO Guide" wins over "Local SEO", and "Local SEO" wins
  // over "SEO".
  const articleTargets = articles.map((a) => ({
    phrase: a.title,
    href: `/growth-hub/${a.slug}`,
    slug: a.slug,
  }))

  const serviceTargets = services.map((s) => ({
    phrase: s.title,
    href: `/services/${s.slug}`,
    slug: '',
  }))

  const linkTargets = [...serviceTargets, ...articleTargets].sort(
    (a, b) => b.phrase.length - a.phrase.length,
  )

  for (const [i, a] of articles.entries()) {
    // Never let an article link to itself.
    const targets = linkTargets.filter((t) => t.slug !== a.slug)
    const linked = autolink(a.body, targets, 8)
    await upsert(payload, 'posts', a.slug, {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      publishedAt: new Date(`${a.publishedAt}T09:00:00.000Z`).toISOString(),
      category: categoryIds.get(a.category)!,
      author: authorIds.get(a.author)!,
      featured: i < 3,
      heroImage: a.heroImage ? mediaIds.get(a.heroImage) : undefined,
      body: blocksToLexical(linked),
      faqs: a.faqs,
      relatedServices: a.relatedServices
        .map((slug) => serviceIds.get(slug))
        .filter((v): v is number | string => v !== undefined),
      seo: {
        metaTitle: a.metaTitle,
        metaDescription: a.metaDescription,
        noIndex: false,
      },
      _status: 'published',
    })
  }
  log(`articles    ${articles.length}`)

  // --- Site settings ------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
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
      // Trust statistics and client logos are left empty on purpose. The
      // homepage falls back to verifiable engineering standards until real,
      // evidenced figures and permissioned client names are entered in the
      // admin panel under Settings > Site Settings > Proof.
      trustStats: [],
      clients: [],
      announcement: { enabled: false },
    },
    overrideAccess: true,
  })
  log('site settings written')

  console.log('  ' + '-'.repeat(52))
  console.log('  Seed complete.\n')
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n  Seed failed:\n', error)
    process.exit(1)
  })
