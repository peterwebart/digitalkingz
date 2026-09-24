import type { ContentBlock } from '@/seed/types'

/**
 * Repairs damage the PDF text export did to article structure.
 *
 * Runs on every article in the seed, immediately before Lexical conversion.
 * It operates on blocks rather than regenerating source files, so hand-written
 * articles pass through unchanged — they have none of these patterns — and no
 * converter output is overwritten.
 *
 * Three repairs, each deliberately narrow:
 *
 * 1. Running page headers. Each PDF page repeated the article title, and at
 *    every page break it landed in the text: "physical or virtual The Complete
 *    Local SEO Guide locations to target cities." Only a title at the very
 *    start or end of a block is removed. A mention of the title inside a
 *    sentence is left alone, because that may be genuine.
 *
 * 2. Sentences wrapped across blocks. The export broke long lines into
 *    separate paragraphs and list items. A block is joined to the previous one
 *    only when BOTH hold: the previous one does not end a clause, and this one
 *    begins in lowercase. Lowercase alone is not enough — a list completing a
 *    sentence ("A team should understand: / who the buyer is; / what they
 *    need;") is correctly lowercase, and there are roughly 350 of those.
 *
 * 3. Lists split in two. Adjacent lists of the same kind are merged.
 */

const ENDS_CLAUSE = /[.;:,!?)"'”’]$/

const endsClause = (text: string) => ENDS_CLAUSE.test(text.trim())
const startsLower = (text: string) => /^[a-z]/.test(text.trim())

function stripRunningHeader(text: string, title: string): string {
  let out = text.trim()
  if (!title) return out
  // Repeat, because a header can sit at both ends of one block.
  for (let i = 0; i < 2; i += 1) {
    if (out.startsWith(title)) out = out.slice(title.length).trim()
    if (out.endsWith(title)) out = out.slice(0, -title.length).trim()
  }
  return out.replace(/\s{2,}/g, ' ')
}

/** Joins list items that the export wrapped mid-sentence. */
function mergeWrappedItems(items: string[]): string[] {
  const out: string[] = []
  for (const item of items) {
    const prev = out[out.length - 1]
    if (prev !== undefined && !endsClause(prev) && startsLower(item)) {
      out[out.length - 1] = `${prev} ${item}`.replace(/\s{2,}/g, ' ')
    } else {
      out.push(item)
    }
  }
  return out
}

export function normaliseBlocks(blocks: ContentBlock[], title: string): ContentBlock[] {
  const out: ContentBlock[] = []

  for (const original of blocks) {
    let block: ContentBlock = original

    if (block.type === 'p') {
      const text = stripRunningHeader(block.text, title)
      if (!text) continue
      block = { ...block, text }
    }
    // The converter sometimes captured a running header as a heading of its
    // own. A heading that is nothing but the article title is a page header,
    // not a section — the article already has its title as the H1.
    if (block.type === 'h2' || block.type === 'h3') {
      const text = stripRunningHeader(block.text, title)
      if (!text) continue
      block = { ...block, text }
    }
    if (block.type === 'ul' || block.type === 'ol') {
      const items = block.items.map((it) => stripRunningHeader(it, title)).filter(Boolean)
      if (items.length === 0) continue
      block = { ...block, items }
    }

    const prev = out[out.length - 1]

    // A paragraph that continues the previous one mid-sentence.
    if (block.type === 'p' && prev?.type === 'p' && !endsClause(prev.text) && startsLower(block.text)) {
      out[out.length - 1] = { ...prev, text: `${prev.text} ${block.text}`.replace(/\s{2,}/g, ' ') }
      continue
    }

    // Two halves of one list.
    if ((block.type === 'ul' || block.type === 'ol') && prev?.type === block.type) {
      out[out.length - 1] = { ...prev, items: [...prev.items, ...block.items] }
      continue
    }

    out.push(block)
  }

  return out.map((block) =>
    block.type === 'ul' || block.type === 'ol'
      ? { ...block, items: mergeWrappedItems(block.items) }
      : block,
  )
}
