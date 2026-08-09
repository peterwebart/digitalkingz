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

import { articles, authors, categories, industries, services } from './content'
import { autolink, blocksToLexical } from '../lib/lexical'
import type { ServiceSeed } from './types'

const log = (msg: string) => console.log(`  ${msg}`)

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
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'solutions@digitalkingz.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe-DigitalKingz-2026'
  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
  })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { name: 'Digital Kingz Admin', email: adminEmail, password: adminPassword },
      overrideAccess: true,
    })
    log(`admin user created: ${adminEmail}`)
    log('  change this password immediately after first login')
  } else {
    log('admin user already exists, skipped')
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

  // --- Articles -----------------------------------------------------------
  // Longest phrases first so "Local SEO" wins over "SEO".
  const linkTargets = [...services]
    .sort((a, b) => b.title.length - a.title.length)
    .map((s) => ({ phrase: s.title, href: `/services/${s.slug}` }))

  for (const [i, a] of articles.entries()) {
    const linked = autolink(a.body, linkTargets, 5)
    await upsert(payload, 'posts', a.slug, {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      publishedAt: new Date(`${a.publishedAt}T09:00:00.000Z`).toISOString(),
      category: categoryIds.get(a.category)!,
      author: authorIds.get(a.author)!,
      featured: i < 3,
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
