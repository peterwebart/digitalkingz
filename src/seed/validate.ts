/**
 * Content integrity check.
 *
 * Run with `pnpm tsx src/seed/validate.ts`. Verifies every seed object is
 * structurally complete, that cross-references resolve, and that SEO field
 * limits hold. Exits non-zero on any failure so it can gate a build.
 */
import { articles, authors, categories, industries, services } from './content'
import type { ContentBlock } from './types'

const errors: string[] = []
const warnings: string[] = []

const fail = (m: string) => errors.push(m)
const warn = (m: string) => warnings.push(m)

const serviceSlugs = new Set(services.map((s) => s.slug))
const industrySlugs = new Set(industries.map((i) => i.slug))
const categorySlugs = new Set(categories.map((c) => c.slug))
const authorSlugs = new Set(authors.map((a) => a.slug))

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const checkText = (label: string, value: unknown, min = 1) => {
  if (typeof value !== 'string' || value.trim().length < min) {
    fail(`${label}: expected non-empty string, got ${JSON.stringify(value)}`)
  }
}

const checkArray = (label: string, value: unknown, min: number) => {
  if (!Array.isArray(value) || value.length < min) {
    fail(`${label}: expected array of at least ${min}, got ${Array.isArray(value) ? value.length : typeof value}`)
    return false
  }
  return true
}

const checkMeta = (label: string, metaTitle: string, metaDescription: string) => {
  if (metaTitle.length > 60) warn(`${label}: metaTitle is ${metaTitle.length} chars (target <= 60)`)
  if (metaDescription.length < 120 || metaDescription.length > 160) {
    warn(`${label}: metaDescription is ${metaDescription.length} chars (target 140-158)`)
  }
}

// --- Uniqueness -----------------------------------------------------------
const assertUnique = (label: string, slugs: string[]) => {
  const seen = new Set<string>()
  for (const s of slugs) {
    if (!SLUG_RE.test(s)) fail(`${label}: "${s}" is not a valid slug`)
    if (seen.has(s)) fail(`${label}: duplicate slug "${s}"`)
    seen.add(s)
  }
}

assertUnique('services', services.map((s) => s.slug))
assertUnique('industries', industries.map((i) => i.slug))
assertUnique('articles', articles.map((a) => a.slug))
assertUnique('categories', categories.map((c) => c.slug))
assertUnique('authors', authors.map((a) => a.slug))

// --- Services -------------------------------------------------------------
const VALID_CATEGORIES = new Set(['build', 'get-found', 'convert', 'automate'])

for (const s of services) {
  const L = `service:${s.slug}`
  if (!VALID_CATEGORIES.has(s.category)) fail(`${L}: invalid category "${s.category}"`)
  for (const f of ['title', 'navLabel', 'tagline', 'icon', 'heroEyebrow', 'heroHeading', 'heroSubheading', 'problemsHeading', 'includedHeading', 'includedIntro', 'approachHeading', 'outcomesHeading', 'outcomesIntro', 'ctaHeading', 'ctaBody'] as const) {
    checkText(`${L}.${f}`, s[f])
  }
  checkMeta(L, s.metaTitle, s.metaDescription)
  checkArray(`${L}.intro`, s.intro, 2)
  checkArray(`${L}.problems`, s.problems, 3)
  checkArray(`${L}.included`, s.included, 5)
  checkArray(`${L}.approach`, s.approach, 4)
  checkArray(`${L}.outcomes`, s.outcomes, 3)
  checkArray(`${L}.deepDive`, s.deepDive, 2)
  checkArray(`${L}.faqs`, s.faqs, 4)
  s.deepDive.forEach((d, i) => {
    checkText(`${L}.deepDive[${i}].heading`, d.heading)
    checkArray(`${L}.deepDive[${i}].paragraphs`, d.paragraphs, 1)
  })
  s.faqs.forEach((f, i) => {
    checkText(`${L}.faqs[${i}].question`, f.question)
    checkText(`${L}.faqs[${i}].answer`, f.answer, 40)
  })
  for (const r of s.relatedServices) {
    if (!serviceSlugs.has(r)) fail(`${L}: relatedServices references unknown "${r}"`)
    if (r === s.slug) fail(`${L}: relatedServices references itself`)
  }
  for (const r of s.relatedIndustries) {
    if (!industrySlugs.has(r)) fail(`${L}: relatedIndustries references unknown "${r}"`)
  }
}

// --- Industries -----------------------------------------------------------
for (const ind of industries) {
  const L = `industry:${ind.slug}`
  for (const f of ['title', 'navLabel', 'tagline', 'icon', 'heroEyebrow', 'heroHeading', 'heroSubheading', 'challengesHeading', 'challengesIntro', 'buyerBehaviourHeading', 'systemHeading', 'systemIntro', 'ctaHeading', 'ctaBody'] as const) {
    checkText(`${L}.${f}`, ind[f])
  }
  checkMeta(L, ind.metaTitle, ind.metaDescription)
  checkArray(`${L}.intro`, ind.intro, 2)
  checkArray(`${L}.challenges`, ind.challenges, 3)
  checkArray(`${L}.buyerBehaviour`, ind.buyerBehaviour, 2)
  checkArray(`${L}.system`, ind.system, 4)
  checkArray(`${L}.deepDive`, ind.deepDive, 1)
  checkArray(`${L}.faqs`, ind.faqs, 4)
  for (const r of ind.relatedServices) {
    if (!serviceSlugs.has(r)) fail(`${L}: relatedServices references unknown "${r}"`)
  }
}

// --- Articles -------------------------------------------------------------
const VALID_BLOCKS = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'quote', 'callout', 'table'])

const checkBlock = (L: string, b: ContentBlock, i: number) => {
  if (!VALID_BLOCKS.has(b.type)) {
    fail(`${L}.body[${i}]: unknown block type "${(b as { type: string }).type}"`)
    return
  }
  switch (b.type) {
    case 'p':
    case 'h2':
    case 'h3':
    case 'quote':
      checkText(`${L}.body[${i}].text`, b.text)
      break
    case 'ul':
    case 'ol':
      if (checkArray(`${L}.body[${i}].items`, b.items, 1)) {
        b.items.forEach((it, j) => checkText(`${L}.body[${i}].items[${j}]`, it))
      }
      break
    case 'callout':
      checkText(`${L}.body[${i}].title`, b.title)
      checkText(`${L}.body[${i}].text`, b.text)
      break
    case 'table': {
      if (!checkArray(`${L}.body[${i}].headers`, b.headers, 2)) break
      if (!checkArray(`${L}.body[${i}].rows`, b.rows, 1)) break
      b.rows.forEach((row, j) => {
        if (row.length !== b.headers.length) {
          fail(`${L}.body[${i}].rows[${j}]: ${row.length} cells, expected ${b.headers.length}`)
        }
      })
      break
    }
  }
}

for (const a of articles) {
  const L = `article:${a.slug}`
  checkText(`${L}.title`, a.title)
  checkText(`${L}.excerpt`, a.excerpt, 40)
  checkMeta(L, a.metaTitle, a.metaDescription)
  if (!categorySlugs.has(a.category)) fail(`${L}: unknown category "${a.category}"`)
  if (!authorSlugs.has(a.author)) fail(`${L}: unknown author "${a.author}"`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.publishedAt)) fail(`${L}: publishedAt "${a.publishedAt}" is not YYYY-MM-DD`)
  if (checkArray(`${L}.body`, a.body, 10)) {
    a.body.forEach((b, i) => checkBlock(L, b, i))
    const h2Count = a.body.filter((b) => b.type === 'h2').length
    if (h2Count < 4) warn(`${L}: only ${h2Count} h2 sections`)
  }
  checkArray(`${L}.faqs`, a.faqs, 3)
  for (const r of a.relatedServices) {
    if (!serviceSlugs.has(r)) fail(`${L}: relatedServices references unknown "${r}"`)
  }
}

// --- Reporting ------------------------------------------------------------
const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

const serviceWords = services.map((s) =>
  wordCount(
    [
      ...s.intro,
      ...s.problems.map((p) => p.body),
      ...s.included.map((p) => p.body),
      ...s.approach.map((p) => p.body),
      ...s.outcomes.map((p) => p.body),
      ...s.deepDive.flatMap((d) => d.paragraphs),
      ...s.faqs.map((f) => f.answer),
    ].join(' '),
  ),
)

const articleWords = articles.map((a) =>
  wordCount(
    a.body
      .map((b) => {
        switch (b.type) {
          case 'p':
          case 'h2':
          case 'h3':
          case 'quote':
            return b.text
          case 'ul':
          case 'ol':
            return b.items.join(' ')
          case 'callout':
            return `${b.title} ${b.text}`
          case 'table':
            return [...b.headers, ...b.rows.flat()].join(' ')
        }
      })
      .join(' '),
  ),
)

const sum = (n: number[]) => n.reduce((a, b) => a + b, 0)

console.log('')
console.log('  Digital Kingz content integrity check')
console.log('  ' + '-'.repeat(52))
console.log(`  services      ${String(services.length).padStart(3)}   ${sum(serviceWords).toLocaleString()} words  (avg ${Math.round(sum(serviceWords) / services.length)})`)
console.log(`  industries    ${String(industries.length).padStart(3)}`)
console.log(`  articles      ${String(articles.length).padStart(3)}   ${sum(articleWords).toLocaleString()} words  (avg ${Math.round(sum(articleWords) / articles.length)})`)
console.log(`  categories    ${String(categories.length).padStart(3)}`)
console.log(`  authors       ${String(authors.length).padStart(3)}`)
console.log('  ' + '-'.repeat(52))

if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s):`)
  for (const w of warnings) console.log(`    ! ${w}`)
}

if (errors.length) {
  console.error(`\n  ${errors.length} ERROR(S):`)
  for (const e of errors) console.error(`    x ${e}`)
  process.exit(1)
}

console.log('\n  All content valid.\n')
