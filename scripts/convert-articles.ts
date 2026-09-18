/**
 * Article converter.
 *
 *   pnpm exec tsx scripts/convert-articles.ts --in ./articles --dry-run
 *   pnpm exec tsx scripts/convert-articles.ts --in ./articles
 *
 * Reads plain-text exports of the editorial batch and writes typed
 * `ArticleSeed` files into src/seed/content/articles/.
 *
 * It deliberately produces seed files rather than writing to the database. The
 * existing pipeline already converts blocks to Lexical and inserts internal
 * links (`blocksToLexical`, `autolink` in src/seed/run.ts), so going through
 * seed means these 23 articles get the same treatment as the original 8 —
 * including autolinking into service and industry pages — instead of a second,
 * divergent path.
 *
 * Heading detection from PDF text extraction is heuristic. Every file gets a
 * confidence score in the report; anything low needs an editor's eye before
 * publishing.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const inDir = resolve(process.cwd(), args[args.indexOf('--in') + 1] ?? './articles')
const outDir = resolve(process.cwd(), 'src/seed/content/articles')

/** Files to skip: duplicates and the versions not selected. */
const EXCLUDE = new Set([
  'complete-social-media-marketing-guide-1',
  'complete-website-strategy-development-guide-1',
  'the-complete-geo-guide', // the other GEO export has cleaner structure
  'website-lead-generation-machine', // 2,784-word version; the 8,048 one wins
  // Collides with the already-published business-website-cost article at the
  // same slug. Kept out rather than silently overwriting live copy — the new
  // export is far longer, so it may be worth swapping deliberately.
  'how-much-does-a-business-website-cost',
  // 1,400 words with only two question headings: below the FAQ floor and thin.
  'ecommerce-marketing-guide-seo-roadmap',
])

type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }

type Meta = {
  slug: string
  title: string
  category: string
  services: string[]
}

/**
 * Slug, title and taxonomy per source file. Explicit rather than derived:
 * filenames are inconsistent, and slugs are permanent URLs that should not be
 * decided by a regex.
 */
const CATALOGUE: Record<string, Meta> = {
  Complete_Digital_Marketing_Guide: { slug: 'complete-digital-marketing-guide', title: 'The Complete Digital Marketing Guide', category: 'growth', services: ['seo', 'google-ads', 'web-design'] },
  How_to_Build_a_Digital_Marketing_Strategy: { slug: 'how-to-build-a-digital-marketing-strategy', title: 'How to Build a Digital Marketing Strategy', category: 'growth', services: ['seo', 'conversion-optimization'] },
  The_Complete_SEO_Guide: { slug: 'complete-seo-guide', title: 'The Complete SEO Guide', category: 'seo', services: ['seo', 'local-seo'] },
  How_Much_Does_Digital_Marketing_Cost: { slug: 'how-much-does-digital-marketing-cost', title: 'How Much Does Digital Marketing Cost?', category: 'growth', services: ['seo', 'google-ads'] },
  google_ads_cost_complete_guide: { slug: 'how-much-does-google-ads-cost', title: 'How Much Does Google Ads Cost?', category: 'paid-media', services: ['google-ads'] },
  google_ads_vs_facebook_ads_vs_seo: { slug: 'google-ads-vs-facebook-ads-vs-seo', title: 'Google Ads vs Facebook Ads vs SEO', category: 'paid-media', services: ['google-ads', 'meta-ads', 'seo'] },
  'complete-social-media-marketing-guide': { slug: 'complete-social-media-marketing-guide', title: 'The Complete Social Media Marketing Guide', category: 'growth', services: ['meta-ads', 'branding'] },
  'complete-content-marketing-guide': { slug: 'complete-content-marketing-guide', title: 'The Complete Content Marketing Guide', category: 'seo', services: ['seo', 'branding'] },
  'complete-website-strategy-development-guide': { slug: 'complete-website-strategy-development-guide', title: 'The Complete Website Strategy & Development Guide', category: 'web-design', services: ['web-design', 'web-development'] },
  'how-much-does-a-business-website-cost': { slug: 'how-much-does-a-business-website-cost', title: 'How Much Does a Business Website Cost?', category: 'web-design', services: ['web-design', 'web-development'] },
  'website-lead-generation-machine-guide': { slug: 'website-lead-generation-machine', title: 'How to Turn Your Website Into a Lead Generation Machine', category: 'web-design', services: ['conversion-optimization', 'web-design'] },
  'complete-lead-generation-guide': { slug: 'complete-lead-generation-guide', title: 'The Complete Lead Generation Guide', category: 'growth', services: ['conversion-optimization', 'crm-systems'] },
  'the-complete-local-seo-guide': { slug: 'complete-local-seo-guide', title: 'The Complete Local SEO Guide', category: 'seo', services: ['local-seo', 'seo'] },
  'ecommerce-marketing-guide-seo-roadmap': { slug: 'complete-ecommerce-marketing-guide', title: 'The Complete Ecommerce Marketing Guide', category: 'growth', services: ['ecommerce', 'seo'] },
  The_Complete_GEO_Guide_Generative_Engine_Optimization: { slug: 'complete-geo-guide', title: 'The Complete GEO Guide: Generative Engine Optimization', category: 'ai-automation', services: ['seo', 'ai-automation'] },
  'SEO vs GEO vs AEO The Future of Search': { slug: 'seo-vs-geo-vs-aeo', title: 'SEO vs GEO vs AEO: The Future of Search', category: 'ai-automation', services: ['seo', 'ai-automation'] },
  'How to Optimize Your Business for AI Search': { slug: 'optimize-your-business-for-ai-search', title: 'How to Optimize Your Business for AI Search', category: 'ai-automation', services: ['seo', 'ai-automation'] },
  'The Complete AI Marketing Guide': { slug: 'complete-ai-marketing-guide', title: 'The Complete AI Marketing Guide', category: 'ai-automation', services: ['ai-automation', 'crm-systems'] },
  'The Complete Marketing Automation Guide Strategy,': { slug: 'complete-marketing-automation-guide', title: 'The Complete Marketing Automation Guide', category: 'ai-automation', services: ['crm-systems', 'ai-automation'] },
  'The Complete Conversion Rate Optimization Guide C': { slug: 'complete-conversion-rate-optimization-guide', title: 'The Complete Conversion Rate Optimization Guide', category: 'web-design', services: ['conversion-optimization'] },
  'complete-marketing-analytics-guide': { slug: 'complete-marketing-analytics-guide', title: 'The Complete Marketing Analytics Guide', category: 'growth', services: ['conversion-optimization', 'crm-systems'] },
  'The Complete B2B Marketing Guide': { slug: 'complete-b2b-marketing-guide', title: 'The Complete B2B Marketing Guide', category: 'growth', services: ['seo', 'crm-systems'] },
  'The Complete Marketing Guide for Small Businesses': { slug: 'complete-marketing-guide-small-business', title: 'The Complete Marketing Guide for Small Businesses', category: 'growth', services: ['seo', 'google-ads', 'web-design'] },
}

// --- parsing ---------------------------------------------------------------

const BULLET = /^[•▪●○·*]\s+|^[-–]\s+/
const PAGE_ARTIFACT = /^(page\s+)?\d+(\s*\/\s*\d+)?$/i

/**
 * A line that reads as a heading rather than prose.
 *
 * PDF text extraction hard-wraps prose, so "starts with a capital and has no
 * full stop" matches most of a document. What actually separates a heading is
 * position and length: it sits alone between blank lines, and it is markedly
 * shorter than the body's wrap width. Without the width test the converter
 * reported 652 headings in a single article.
 */
function isHeading(line: string, prevBlank: boolean, next: string, wrapWidth: number): boolean {
  const t = line.trim()
  if (t.length < 4 || t.length > 90) return false
  if (BULLET.test(t)) return false
  if (/[.,;:]$/.test(t)) return false
  if (!/^[A-Z0-9]/.test(t)) return false
  if (t.split(/\s+/).length > 14) return false
  // Prose that happens to lack a full stop usually continues on the next line.
  if (next && /^[a-z]/.test(next.trim())) return false
  // Must stand alone.
  if (!prevBlank) return false
  const nextBlank = next.trim().length === 0
  return nextBlank || t.length < wrapWidth * 0.6
}

function parse(raw: string): { blocks: Block[]; headings: number } {
  const lines = raw
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\u00a0/g, ' ').trimEnd())
    .filter((l) => !PAGE_ARTIFACT.test(l.trim()))

  // Median non-blank line length approximates the body wrap width.
  // Bullet lines are short and numerous, so a plain median of all lines
  // understates the prose wrap width badly — one article measured 25 rather
  // than ~120, which made almost nothing qualify as a heading. Measure prose
  // only, at the 75th percentile.
  const prose = lines
    .filter((l) => l.trim().length > 0 && !BULLET.test(l.trim()))
    .map((l) => l.trim().length)
    .sort((a, b) => a - b)
  const wrapWidth = prose.length > 0 ? prose[Math.floor(prose.length * 0.75)] : 80

  // Two source shapes arrive in the batch. PDF exports hard-wrap prose and
  // separate blocks with blank lines. Hand-written .txt files put one whole
  // paragraph per line and use no blank lines at all — on those, the
  // "stands alone between blank lines" test never fires, which is why two
  // articles came back with 2 and 5 headings instead of dozens.
  const blanks = lines.filter((l) => l.trim().length === 0).length
  const lineMode = blanks / Math.max(1, lines.length) < 0.1

  const blocks: Block[] = []
  let para: string[] = []
  let bullets: string[] = []
  let lastWasHeading = false
  let headings = 0

  const flushPara = () => {
    if (para.length === 0) return
    const text = para.join(' ').replace(/\s+/g, ' ').trim()
    if (text.length > 0) blocks.push({ type: 'p', text })
    para = []
  }
  const flushBullets = () => {
    if (bullets.length === 0) return
    blocks.push({ type: 'ul', items: bullets })
    bullets = []
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const t = line.trim()

    if (t.length === 0) {
      flushPara()
      flushBullets()
      continue
    }

    // Markdown headings are explicit, so trust them over the heuristics below.
    const md = t.match(/^(#{1,6})\s+(.+)$/)
    if (md) {
      flushPara()
      flushBullets()
      blocks.push({ type: md[1].length <= 2 ? 'h2' : 'h3', text: md[2].trim() })
      lastWasHeading = true
      headings += 1
      continue
    }

    if (BULLET.test(t)) {
      flushPara()
      bullets.push(t.replace(BULLET, '').trim())
      lastWasHeading = false
      continue
    }

    const prevBlank = lineMode || i === 0 || (lines[i - 1] ?? '').trim().length === 0
    if (isHeading(t, prevBlank, lines[i + 1] ?? '', wrapWidth)) {
      flushPara()
      flushBullets()
      // A heading immediately after another heading is a subheading.
      blocks.push({ type: lastWasHeading ? 'h3' : 'h2', text: t })
      lastWasHeading = true
      headings += 1
      continue
    }

    flushBullets()
    para.push(t)
    if (lineMode) flushPara()
    lastWasHeading = false
  }
  flushPara()
  flushBullets()

  return { blocks, headings }
}

/** Pulls Q/A pairs where the source marks them; otherwise returns nothing. */
function extractFaqs(blocks: Block[]): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  for (let i = 0; i < blocks.length - 1; i += 1) {
    const b = blocks[i]
    const next = blocks[i + 1]
    if ((b.type === 'h2' || b.type === 'h3') && next.type === 'p' && b.text.trim().endsWith('?')) {
      faqs.push({ question: b.text.trim(), answer: next.text.slice(0, 600) })
    }
  }
  return faqs.slice(0, 6)
}

const sentence = (text: string, max: number) => {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '))
  return (stop > max * 0.5 ? cut.slice(0, stop + 1) : `${cut.trimEnd()}…`).trim()
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")

const serialise = (b: Block): string => {
  if (b.type === 'ul') return `    { type: 'ul', items: [${b.items.map((i) => `'${esc(i)}'`).join(', ')}] },`
  return `    { type: '${b.type}', text: '${esc(b.text)}' },`
}

// --- run -------------------------------------------------------------------

if (!existsSync(inDir)) {
  console.error(`\n  Input directory not found: ${inDir}\n`)
  process.exit(1)
}

const files = readdirSync(inDir).filter((f) => ['.txt', '.md'].includes(extname(f).toLowerCase()))
if (!DRY_RUN) mkdirSync(outDir, { recursive: true })

// Stagger publish dates backwards from a fixed point so ordering is stable.
const start = new Date('2026-09-15T00:00:00Z')

const report: string[] = []
let written = 0
let skipped = 0

files.forEach((file, index) => {
  const key = basename(file, extname(file))
  if (EXCLUDE.has(key)) {
    skipped += 1
    report.push(`  skipped   ${key}  (duplicate or superseded version)`)
    return
  }

  const meta = CATALOGUE[key]
  if (!meta) {
    skipped += 1
    report.push(`  NO ENTRY  ${key}  (add it to CATALOGUE before converting)`)
    return
  }

  const raw = readFileSync(join(inDir, file), 'utf8')
  const { blocks, headings } = parse(raw)
  // Editorial briefs are appended to the end of most exports: "Meta Title:",
  // "Meta Description:", "Suggested Schema Markup:", "Suggested Internal
  // Links:". That is scaffolding, not article copy, and 20 of 23 files carried
  // it straight into the body on the first pass.
  //
  // The meta values inside it are hand-written, so they are lifted out and used
  // instead of the truncated ones derived from the lead paragraph.
  const SCAFFOLD = /^(Meta Title|Meta Description|Suggested Schema|Suggested Internal|Primary Keyword|Secondary Keyword|Target Keyword|Word Count|Deliverables?:)/i

  const all = blocks.filter((b) => !(b.type === 'h2' && b.text === meta.title))
  // "Call to Action", "Primary Call to Action", "Internal Linking" and friends
  // are also brief labels, but unlike the meta block they can appear as
  // legitimate headings mid-article — a CRO guide discusses CTAs. So they only
  // count as scaffolding in the last fifth of the document, where the brief
  // always sits.
  const TAIL_SCAFFOLD =
    /^((Primary |Secondary |Suggested )?Call[- ]to[- ]Action|CTA|Internal Link(ing|s)|Schema Markup|FAQ Schema|Suggested FAQ|Keyword|Tone|Audience|Notes?|Summary,? (and )?FAQ.*)$/i
  const tailStart = Math.floor(all.length * 0.7)

  const cutAt = all.findIndex(
    (b, i) =>
      b.type !== 'ul' &&
      (SCAFFOLD.test(b.text.trim()) || (i >= tailStart && TAIL_SCAFFOLD.test(b.text.trim()))),
  )
  const tail = cutAt === -1 ? '' : all.slice(cutAt).map((b) => (b.type === 'ul' ? b.items.join(' ') : b.text)).join(' ')
  const body = cutAt === -1 ? all : all.slice(0, cutAt)

  const pick = (label: string) => {
    const m = tail.match(new RegExp(`${label}:\\s*(.+?)(?=\\s*(?:Meta Title|Meta Description|Suggested|Primary Keyword|Secondary Keyword|Target Keyword|Word Count)\\s*:|$)`, 'i'))
    return m ? m[1].trim().replace(/\s+/g, ' ') : ''
  }
  const briefTitle = pick('Meta Title')
  const briefDescription = pick('Meta Description')
  const paragraphs = body.filter((b) => b.type === 'p') as { type: 'p'; text: string }[]
  const words = paragraphs.reduce((n, b) => n + b.text.split(/\s+/).length, 0)

  let lead = paragraphs[0]?.text ?? meta.title
  for (let i = 1; i < paragraphs.length && lead.length < 150; i += 1) {
    lead = `${lead} ${paragraphs[i].text}`
  }
  const faqs = extractFaqs(body)
  const date = new Date(start.getTime() - index * 86_400_000).toISOString().slice(0, 10)

  const file_ts = `import type { ArticleSeed } from '@/seed/types'

// Converted from the editorial batch by scripts/convert-articles.ts.
// Headings were detected heuristically from a PDF text export; review the
// structure in /admin before publishing.
const article: ArticleSeed = {
  slug: '${meta.slug}',
  title: '${esc(meta.title)}',
  metaTitle: '${esc(sentence(briefTitle || meta.title, 60))}',
  metaDescription: '${esc(sentence(briefDescription || lead, 158))}',
  excerpt: '${esc(sentence(lead, 220))}',
  category: '${meta.category}',
  publishedAt: '${date}',
  author: 'digital-kingz',
  body: [
${body.map(serialise).join('\n')}
  ],
  faqs: [
${faqs.map((f) => `    { question: '${esc(f.question)}', answer: '${esc(f.answer)}' },`).join('\n')}
  ],
  relatedServices: [${meta.services.map((s) => `'${s}'`).join(', ')}],
}

export default article
`

  if (!DRY_RUN) writeFileSync(join(outDir, `${meta.slug}.ts`), file_ts)
  written += 1

  const confidence = headings >= 8 && words > 1200 ? 'ok' : headings < 4 ? 'LOW' : 'check'
  report.push(
    `  ${confidence === 'ok' ? 'ok      ' : confidence === 'LOW' ? 'LOW     ' : 'check   '} ${meta.slug}  ${words} words, ${headings} headings, ${faqs.length} faqs`,
  )
})

console.log(`\n  Article conversion${DRY_RUN ? '  (dry run)' : ''}`)
console.log('  ' + '-'.repeat(66))
report.sort().forEach((l) => console.log(l))
console.log('  ' + '-'.repeat(66))
console.log(`  ${written} converted, ${skipped} skipped`)
console.log(DRY_RUN ? '\n  Dry run: nothing written.\n' : `\n  Written to ${outDir}\n`)
