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
      // A real section heading never starts lowercase. "user's need?" is the
      // second half of "Does the business match the user's need?", split by
      // the export and promoted to an H2 only because it ended in "?". Demote
      // it so the paragraph merge below rejoins the halves.
      block = startsLower(text) ? { type: 'p', text } : { ...block, text }
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

  const merged = out.map((block) =>
    block.type === 'ul' || block.type === 'ol'
      ? { ...block, items: mergeWrappedItems(block.items) }
      : block,
  )
  return rebuildTables(splitGluedHeaderCells(restoreLists(merged)))
}

// --- Lists flattened into paragraphs ---------------------------------------
//
// Two shapes, both seen on live pages:
//
//   numbered: "1. Buying software before... 2. Tracking every click but..."
//             — sometimes continuing into the next paragraph ("9. ... 10. ...")
//   bulleted: "Anomaly detection for spend... changes Narrative summaries that
//             link... drivers Tagging and taxonomy..." — items joined with only
//             a space, each starting with a capital
//
// Numbered lists are recovered from their markers, which are unambiguous.
// Bulleted ones are recovered only from a paragraph with no sentence breaks at
// all, split where a lowercase word runs straight into a capitalised one. A
// paragraph that contains a full stop is prose and is never split — a proper
// noun mid-sentence ("for Google Ads") must not become a list item.

const NUMBERED = /(?:^|\s)(\d{1,2})\.\s+/g

function numberedItems(text: string): { first: number; items: string[] } | null {
  const marks = [...text.matchAll(NUMBERED)]
  if (marks.length < 2) return null
  const nums = marks.map((m) => Number(m[1]))
  // Must be consecutive: 1,2,3 or 9,10 — not stray numbers in a sentence.
  if (!nums.every((n, i) => i === 0 || n === nums[i - 1] + 1)) return null
  if (text.slice(0, marks[0].index).trim()) return null
  const items = marks.map((m, i) => {
    const start = (m.index ?? 0) + m[0].length
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length
    return text.slice(start, end).trim()
  })
  return items.every((it) => it.length > 2) ? { first: nums[0], items } : null
}

function bulletItems(text: string): string[] | null {
  if (/[.!?]\s/.test(text)) return null // contains a sentence break: prose
  // Formulas, arrows and quotations are prose, and a review found each one
  // split wrongly: "ROI = (Revenue - Marketing Cost) / Marketing Cost x 100"
  // broken at "Cost", a sentence with arrows broken at "Ads", quoted headings
  // broken mid-quote.
  if (/[÷×→=()"“”‘’#]/.test(text)) return null
  // A comma leading into a clause ("…component, it is less…") marks a sentence
  // that lost its full stop, not a list of noun phrases.
  if (/,\s(it|they|this|these|which|we|you|he|she)\s/i.test(text)) return null
  const parts = text.split(/(?<=[a-z0-9)])\s+(?=[A-Z][a-z])/)
  if (parts.length < 3) return null
  return parts.every((p) => p.split(/\s+/).length >= 3) ? parts.map((p) => p.trim()) : null
}

function restoreLists(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = []
  for (const b of blocks) {
    if (b.type !== 'p') { out.push(b); continue }
    const num = numberedItems(b.text)
    if (num) {
      const prev = out[out.length - 1]
      // "9. ... 10. ..." continuing a list that stopped at 8.
      if (prev?.type === 'ol' && num.first === prev.items.length + 1) {
        out[out.length - 1] = { ...prev, items: [...prev.items, ...num.items] }
      } else {
        out.push({ type: 'ol', items: num.items })
      }
      continue
    }
    const bullets = bulletItems(b.text)
    if (bullets) { out.push({ type: 'ul', items: bullets }); continue }
    out.push(b)
  }
  return out
}

// --- Flattened tables -------------------------------------------------------
//
// The export read tables column by column into one-cell-per-line prose:
//
//   Signal / What it means / Practical work / Relevance / Does the business
//   match the user's need? / Accurate categories... / Distance / ...
//
// Once wrapped fragments are rejoined, a table shows up as a run of short
// cells that are not sentences. The column count is recovered as the one that
// makes the first column consistently short labels (Relevance, Distance,
// Prominence). When no column count fits cleanly the run is left as prose —
// a missed table reads as plain text; a wrongly built one scrambles the facts.

/** A short block that reads as a table cell rather than a sentence. */
const isCell = (b: ContentBlock) =>
  b.type === 'p' && b.text.length <= 140 && !/[.]$/.test(b.text.trim())

/** Short label, as the first column of a table typically is. */
const isLabel = (t: string) => t.length <= 48 && !/[.;:,]$/.test(t.trim())

/**
 * The export often glued a table's first header cell onto the end of the
 * paragraph before it: "...cannot reliably manipulate proximity. Signal".
 * Split a short trailing tail off a sentence when a table follows.
 */
function splitGluedHeaderCells(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = []
  blocks.forEach((b, i) => {
    const next = blocks[i + 1]
    if (b.type === 'p' && next && isCell(next)) {
      const m = b.text.match(/^(.*[.!?])\s+([A-Z][^.!?]{0,40})$/)
      if (m && m[2].split(/\s+/).length <= 4) {
        out.push({ ...b, text: m[1] })
        out.push({ type: 'p', text: m[2] })
        return
      }
    }
    out.push(b)
  })
  return out
}

function chooseColumns(cells: string[]): number | null {
  for (const k of [3, 2, 4, 5]) {
    if (cells.length % k !== 0 || cells.length / k < 2) continue
    const firstColumn = cells.filter((_, i) => i % k === 0)
    const others = cells.filter((_, i) => i % k !== 0)
    const labelled = firstColumn.every(isLabel)
    // The first column should be noticeably terser than the rest.
    const avg = (xs: string[]) => xs.reduce((n, x) => n + x.length, 0) / xs.length
    if (labelled && avg(firstColumn) < avg(others)) return k
  }
  return null
}

const DIMENSION =
  /^(factor|area|signal|dimension|criterion|criteria|aspect|attribute|feature|metric|category|type|element|component|stage|step|phase|channel|model|approach|method|question|topic|role|priority|use case|goal|objective|risk|option|tool|platform|asset|layer)s?$/i

function rebuildTables(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = []
  let i = 0
  while (i < blocks.length) {
    let j = i
    while (j < blocks.length && isCell(blocks[j])) j += 1
    const run = blocks.slice(i, j) as { type: 'p'; text: string }[]
    const k = run.length >= 6 ? chooseColumns(run.map((c) => c.text)) : null
    // Only build when the first header cell names a dimension ("Factor",
    // "Area", "Signal"). That is the reliable tell of a comparison table read
    // column by column. When it names a subject instead — "Traditional SEO" —
    // the column count cannot be recovered reliably, and a sample showed those
    // coming out scrambled, pairing facts with the wrong column. A table that
    // is left flat reads as plain text; one that is built wrong misinforms.
    const cells = run.map((c) => c.text.trim())
    const headers = k ? cells.slice(0, k) : []
    const rows: string[][] = []
    if (k) for (let r = k; r < cells.length; r += k) rows.push(cells.slice(r, r + k))
    // Reject two failure modes seen in review, rather than build them wrong:
    //   - a split header: the first "row" is more column titles ("Strength |
    //     Risk" under "Model | Best when") because the real table is wider
    //   - a header cell repeated inside the data, meaning the grid is misread
    const splitHeader = rows[0]?.every((c) => c.length <= 24 && !/[?]$/.test(c))
    const headerRepeated = rows.some((r) => r.some((c) => headers.includes(c)))
    if (k && DIMENSION.test(cells[0]) && !splitHeader && !headerRepeated) {
      out.push({ type: 'table', headers, rows })
      i = j
    } else {
      out.push(blocks[i])
      i += 1
    }
  }
  return out
}
