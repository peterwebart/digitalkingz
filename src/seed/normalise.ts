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

// A line cannot end on an article or conjunction; the PDF wrapped it.
const ENDS_CONNECTOR = /\b(the|a|an|and|or|of|to|for|with|in|on|by|your|our)$/i

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
      // Hand-written articles never reach this pass (see AUTHORED_ARTICLES in
      // the seed), so brief labels can be removed from every heading here.
      const clean = stripHeadingLabel(text)
      block = startsLower(clean) ? { type: 'p', text: clean } : { ...block, text: clean }
    }
    if (block.type === 'ul' || block.type === 'ol') {
      const items = block.items.map((it) => stripRunningHeader(it, title)).filter(Boolean)
      if (items.length === 0) continue
      block = { ...block, items }
    }

    const prev = out[out.length - 1]

    // A paragraph that continues the previous one mid-sentence.
    if (block.type === 'p' && prev?.type === 'p' && !endsClause(prev.text) &&
        (startsLower(block.text) || ENDS_CONNECTOR.test(prev.text))) {
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
  const structured = merged
    .filter((b) => !(b.type === 'p' && SCAFFOLD_BLOCK.test(b.text.trim())))
    .flatMap(splitGluedHeadings)
    .flatMap(colonLists)
  return mergeQuestionRuns(
    absorbFusedFirstRow(rebuildTables(splitGluedHeaderCells(trimListTails(restoreLists(structured))))),
  )
}

// --- Runs of questions ------------------------------------------------------
//
// A procurement checklist came out as two lists, two stray paragraphs and one
// question promoted to an H2, with two questions split mid-line ("…backfills,
// and data" / "freshness?"). Three repairs, each confined to a run of
// questions so ordinary prose and real question headings are untouched:
//   - a paragraph with no sentence ending, followed by a list whose first item
//     starts lowercase, is that item's first half
//   - a single-question paragraph beside a list of questions joins the list
//   - a question heading between two lists of questions is one of them; a
//     real question heading is followed by an answer, not more questions

const isQuestion2 = (t: string) => /\?["”’]?$/.test(t.trim())
const isQuestionList = (b: ContentBlock | undefined) =>
  !!b && (b.type === 'ul' || b.type === 'ol') && b.items.length > 0 && b.items.every(isQuestion2)

function mergeQuestionRuns(blocks: ContentBlock[]): ContentBlock[] {
  const joined: ContentBlock[] = []
  for (let i = 0; i < blocks.length; i += 1) {
    const b = blocks[i]
    const next = blocks[i + 1]
    if (b.type === 'p' && !/[.;:!?]["”’]?$/.test(b.text.trim()) && next &&
        (next.type === 'ul' || next.type === 'ol') && startsLower(next.items[0])) {
      blocks[i + 1] = { ...next, items: [`${b.text.trim()} ${next.items[0]}`, ...next.items.slice(1)] }
      continue
    }
    joined.push(b)
  }
  const out: ContentBlock[] = []
  for (let i = 0; i < joined.length; i += 1) {
    const b = joined[i]
    const prev = out[out.length - 1]
    const next = joined[i + 1]
    if (isQuestionList(prev) && (prev.type === 'ul' || prev.type === 'ol')) {
      const singleQuestion = b.type === 'p' && isQuestion2(b.text) && !/[.!]\s/.test(b.text) && b.text.length <= 220
      const strayHeading = (b.type === 'h2' || b.type === 'h3') && isQuestion2(b.text) &&
        (isQuestionList(next) || (next?.type === 'p' && isQuestion2(next.text)))
      if (singleQuestion || strayHeading) {
        out[out.length - 1] = { ...prev, items: [...prev.items, (b as { text: string }).text] }
        continue
      }
      if ((b.type === 'ul' || b.type === 'ol') && isQuestionList(b)) {
        out[out.length - 1] = { ...prev, items: [...prev.items, ...b.items] }
        continue
      }
    }
    out.push(b)
  }
  return out
}

/**
 * The export ran a list's closing paragraph into its last item: "7. Evaluate
 * … total cost of ownership. A reliable marketing measurement program does not
 * promise…". When the last item has at least two more sentences than a typical
 * item in its own list, the extra sentences are prose and move out beneath it.
 * Lists whose items are all several sentences long are left alone.
 */
function trimListTails(blocks: ContentBlock[]): ContentBlock[] {
  const sentences = (t: string) => t.split(/(?<=[.!?])\s+(?=[A-Z])/)
  const out: ContentBlock[] = []
  for (const b of blocks) {
    if ((b.type !== 'ol' && b.type !== 'ul') || b.items.length < 3) { out.push(b); continue }
    const counts = b.items.slice(0, -1).map((t) => sentences(t).length).sort((x, y) => x - y)
    const keep = Math.max(1, counts[Math.floor(counts.length / 2)])
    const last = sentences(b.items[b.items.length - 1])
    if (last.length < keep + 2) { out.push(b); continue }
    out.push({ ...b, items: [...b.items.slice(0, -1), last.slice(0, keep).join(' ')] })
    out.push({ type: 'p', text: last.slice(keep).join(' ') })
  }
  return out
}

// --- The article's own FAQ section -------------------------------------------
//
// Articles carry an FAQ section in the body ("FAQ", then question headings with
// answers). The page also renders the faqs field as an accordion with FAQPage
// schema, and the converter filled that field with the first question headings
// it found anywhere — including "Introduction: What business decisions…". The
// result was the same answers twice and an intro posing as an FAQ. The body's
// FAQ section becomes the faqs field and leaves the body, so each answer
// appears once, in the component built for it.

const FAQ_MARKER = /^(faqs?|frequently asked questions)$/i

export function extractFaqSection(blocks: ContentBlock[]): {
  body: ContentBlock[]
  faqs: { question: string; answer: string }[]
} {
  const start = blocks.findIndex((b) => (b.type === 'p' || b.type === 'h2' || b.type === 'h3') && FAQ_MARKER.test(b.text.trim()))
  if (start === -1) return { body: blocks, faqs: [] }
  const faqs: { question: string; answer: string }[] = []
  let i = start + 1
  while (i < blocks.length) {
    const q = blocks[i]
    if ((q.type !== 'h2' && q.type !== 'h3') || !isQuestion2(q.text)) break
    const answer: string[] = []
    let j = i + 1
    while (j < blocks.length && blocks[j].type === 'p') { answer.push((blocks[j] as { text: string }).text); j += 1 }
    if (answer.length === 0) break
    faqs.push({ question: q.text, answer: answer.join(' ') })
    i = j
  }
  if (faqs.length < 3) return { body: blocks, faqs: [] }
  return { body: [...blocks.slice(0, start), ...blocks.slice(i)], faqs }
}

/** Removes labels the brief put in front of headings ("Introduction: …"). */
export const stripHeadingLabel = (t: string) =>
  t.replace(/^(introduction|summary|conclusion|question|overview)\s*:\s+(?=\S)/i, '')

/**
 * "Maturity stage Reactive reporting / Typical behavior Manual exports… /
 * Next priority Define core KPIs…" directly above a table headed "Maturity
 * stage | Typical behavior | Next priority" is that table's first row, each
 * cell fused onto its header. Lift it back in — only when every prefix matches
 * the table's headers exactly and in order, so nothing is inferred.
 */
function absorbFusedFirstRow(blocks: ContentBlock[]): ContentBlock[] {
  const out = [...blocks]
  for (let t = out.length - 1; t >= 0; t -= 1) {
    const table = out[t]
    if (table.type !== 'table') continue
    const k = table.headers.length
    const above = out.slice(t - k, t)
    if (above.length !== k) continue
    const fused = above.every((b, i) => b.type === 'p' && b.text.startsWith(`${table.headers[i]} `))
    if (!fused) continue
    const row = above.map((b, i) => (b as { text: string }).text.slice(table.headers[i].length + 1).trim())
    out.splice(t - k, k + 1, { ...table, rows: [row, ...table.rows] })
    t -= k
  }
  return out
}

// --- Editorial brief left in the body --------------------------------------
// "Call to Action Build a search visibility strategy…", "Suggested CTA button:",
// "Supporting CTA: Download…" are instructions from the brief, not article
// copy. The page renders its own call to action.
const SCAFFOLD_BLOCK = /^(call to action\b|suggested cta\b|supporting cta\b|cta\s*:)/i

// --- Headings glued to their body ------------------------------------------
//
// "Step 6: Add proof and context Technical buyers require more than…" and
// "Phase 3: Produce citation-worthy evidence Step 7: Create original…" lost the
// line break between heading and text. Two anchors make the split safe:
//   - a label (Step N:, Phase N:, Mistake:) followed by a capital, and
//   - a fixed vocabulary of section titles (Summary, Expert recommendations…)
// Nothing is split on shape alone, so a proper noun mid-sentence ("uses
// Google Analytics") is never mistaken for a heading boundary.

const LABEL_START = /^((?:Step|Phase|Stage|Part)\s+\d+\s*:|Mistake\s*:|Tip\s*:)\s+(?=[A-Z])/
const LABEL_SPLIT = /\s+(?=(?:(?:Step|Phase|Stage|Part)\s+\d+\s*:|Mistake\s*:|Tip\s*:)\s+[A-Z])/
const SECTION_TITLES = [
  'Common mistakes to avoid', 'Expert recommendations', 'Key takeaways',
  'Final thoughts', 'Conclusion', 'Summary',
]

const CONNECTOR = new Set([
  'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on',
  'or', 'the', 'to', 'vs', 'via', 'with', 'your', 'our', 'their', 'its',
])
const BODY_IMPERATIVES = new Set([
  'Use', 'Start', 'Run', 'Launch', 'Add', 'Ask', 'Consider', 'Avoid', 'Keep',
  'Make', 'Try', 'Include', 'Combine', 'Pair', 'Deploy',
])
const FUNCTION_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on',
  'or', 'the', 'to', 'vs', 'via', 'with',
])
const isCap = (w: string) => /^[“"]?[A-Z]([a-z]|$)/.test(w)
const isAcronym = (w: string) => /^[A-Z0-9][A-Z0-9&/+-]*[,.;:?!)]*$/.test(w) && /[A-Z]{2,}|\d/.test(w)
const isLowerContent = (w: string) => /^[a-z]/.test(w) && !CONNECTOR.has(w.replace(/[^a-z]/g, ''))

/**
 * Where a glued heading ends and its body begins.
 *
 * Headings arrive in two styles, and one rule cannot split both:
 *   sentence case  "Add proof and context Technical buyers require…"
 *                  -> the body starts at the next capitalised word
 *   Title Case     "Define Business And Marketing Goals Every strategy…"
 *                  -> every heading word is capitalised, so the body starts at
 *                     the capitalised word just before the first ordinary
 *                     lowercase word ("Every" before "strategy")
 * Acronyms (SEO, AEO, B2B) and connector words are ignored when deciding the
 * style, since they read the same either way. An early "?" or full stop also
 * ends a heading ("Specify the required evidence. Define outcome…").
 *
 * Returns null when no boundary is found in a long segment — better to leave
 * the text whole than to cut a heading off mid-phrase.
 */
function titleAndBody(seg: string): [string, string] | null {
  const label = seg.match(LABEL_START)?.[1] ?? ''
  const words = seg.slice(label.length).trim().split(/\s+/)
  const join = (a: number, b?: number) => words.slice(a, b).join(' ')
  const isNum = (w: string) => /^[$€£\d]/.test(w)

  // One rule for both heading styles: the body starts at the first capitalised
  // word that is immediately followed by an ordinary lowercase word, a number,
  // or ends in a colon — or at a capital/number right after a lowercase word.
  //   "Research Keywords Use keyword…"      -> "Use"   (then "keyword")
  //   "Define Business and Revenue Goals Every strategy…" -> "Every"
  //   "Add proof and context Technical buyers…"           -> "Technical"
  //   "Calculate Required Clicks Formula: …"               -> "Formula:"
  //   "Estimate clicks $6,000 ÷ $6…"                       -> "$6,000"
  let boundary = -1
  for (let j = 1; j < words.length; j += 1) {
    const w = words[j]
    const next = words[j + 1] ?? ''
    const afterNext = words[j + 2] ?? ''
    // Function words only. Possessives (Your, Our) are excluded because they
    // start a body sentence: in "…Campaign Plan Your plan should…" the break
    // is before "Your", not before "Plan".
    // Case-sensitive: a capitalised "As"/"The" starts the body sentence
    // ("…Search Demand As awareness grows…"), a lowercase one does not.
    const fn = FUNCTION_WORDS.has(next)
    const startsBody =
      (isCap(w) && (isLowerContent(next) || isNum(next) || /:$/.test(w))) ||
      (isCap(w) && fn && (isNum(afterNext) || isLowerContent(afterNext))) ||
      ((isCap(w) || isNum(w)) && isLowerContent(words[j - 1])) ||
      // A number after an acronym: "…advertising CAC $6,000 ÷ 4"
      (isNum(w) && isAcronym(words[j - 1])) ||
      // A body can open on an acronym: "…Right Channels SEO and content…"
      (isAcronym(w) && j >= 2 && isCap(words[j - 1]) &&
        (isLowerContent(next) || (fn && isLowerContent(afterNext))))
    if (startsBody) { boundary = j; break }
  }

  // An early "?" or full stop also ends a heading ("Specify the required
  // evidence. Define outcome…"), but only within the first ten words.
  let terminator = -1
  for (let t = 1; t < Math.min(words.length, 10); t += 1) {
    if (/[?]["”’]?$/.test(words[t]) || (/[a-z]\.$/.test(words[t]) && !/^(e\.g|i\.e)\.$/.test(words[t]))) {
      terminator = t + 1
      break
    }
  }

  // "Create Awareness Use Meta ads…" — the boundary landed on the proper noun
  // "Meta" because it is followed by lowercase. When the word before it is an
  // imperative that opens a sentence, the body starts there instead.
  // Scan back across capitalised words (the proper noun) for that verb.
  for (let m = boundary - 1; boundary >= 2 && m >= 1; m -= 1) {
    if (BODY_IMPERATIVES.has(words[m])) { boundary = m; break }
    if (!isCap(words[m])) break
  }

  const cuts = [boundary, terminator].filter((c) => c >= 1)
  if (cuts.length === 0) return words.length <= 12 ? [`${label} ${join(0)}`.trim(), ''] : null
  const cut = Math.min(...cuts)
  if (cut > 14) return null
  return [`${label} ${join(0, cut).replace(/\.$/, '')}`.trim(), join(cut)]
}

function splitGluedHeadings(b: ContentBlock): ContentBlock[] {
  if (b.type !== 'p') return [b]
  const text = b.text.trim()
  for (const t of SECTION_TITLES) {
    if (text.startsWith(`${t} `) && /^[A-Z0-9]/.test(text.slice(t.length + 1))) {
      return [{ type: 'h2', text: t }, ...splitGluedHeadings({ type: 'p', text: text.slice(t.length + 1) })]
    }
  }
  const segs = text.split(LABEL_SPLIT)
  if (!segs.some((x) => LABEL_START.test(x))) return splitVerbHeading(b)
  const out: ContentBlock[] = []
  for (const seg of segs) {
    if (!LABEL_START.test(seg)) {
      // A short untitled lead ("Common mistakes to avoid") is a section title.
      out.push(seg.split(/\s+/).length <= 6 && !/[.!?:,]$/.test(seg)
        ? { type: 'h2', text: seg } : { type: 'p', text: seg })
      continue
    }
    const split = titleAndBody(seg)
    if (!split) { out.push({ type: 'p', text: seg }); continue }
    const [title, body] = split
    out.push({ type: 'h3', text: title })
    if (body) out.push({ type: 'p', text: body })
  }
  return out
}

// --- Unlabelled subheadings -------------------------------------------------
//
// "Refresh critical content Review content more frequently…" and "Build
// internal links around decisions Link pages based on…" are a heading and its
// first sentence with the line break lost. Split only when both halves open on
// a verb, and nothing between them is capitalised: a verb capitalised in the
// middle of a line only occurs where a sentence boundary was lost, so a name
// inside a sentence ("Use Google Analytics to track…") cannot trigger it.

const SECTION_VERBS = new Set([
  'Build', 'Refresh', 'Review', 'Link', 'Create', 'Update', 'Publish', 'Write',
  'Add', 'Use', 'Track', 'Measure', 'Map', 'Audit', 'Define', 'Document',
  'Structure', 'Prioritize', 'Align', 'Assign', 'Maintain', 'Connect', 'Keep',
  'Avoid', 'Focus', 'Start', 'Answer', 'Explain', 'Show', 'Include', 'Remove',
  'Improve', 'Optimize', 'Monitor', 'Compare', 'Identify', 'Consolidate',
  'Separate', 'Match', 'Support', 'Invest', 'Prioritise',
])

function splitVerbHeading(b: ContentBlock): ContentBlock[] {
  if (b.type !== 'p') return [b]
  const words = b.text.trim().split(/\s+/)
  if (!SECTION_VERBS.has(words[0]) || words.length < 14) return [b]
  for (let j = 2; j <= 7 && j < words.length - 1; j += 1) {
    const between = words.slice(1, j)
    if (between.some((w) => /^[A-Z]/.test(w) || /[.,;:!?]$/.test(w))) return [b]
    if (SECTION_VERBS.has(words[j]) && /^[a-z]/.test(words[j + 1])) {
      return [{ type: 'h3', text: words.slice(0, j).join(' ') }, { type: 'p', text: words.slice(j).join(' ') }]
    }
  }
  return [b]
}

// --- Lists written as sentences --------------------------------------------
//
// "Add: Architecture diagrams. Documentation links. Configuration
// requirements." — after a colon, a run of short full-stopped noun phrases is
// a list. At least three items, each ten words or fewer, and not a run of
// sentences starting "It / This / They…", which is prose.

const PROSE_START = /^(It|This|These|They|We|You|He|She|There|That|If|When)\b/

function colonLists(b: ContentBlock): ContentBlock[] {
  if (b.type !== 'p' || !b.text.includes(': ')) return [b]
  const segs = b.text.split(/(?<=[.:][”"’]?)\s+(?=[A-Z])/)
  if (segs.length < 4) return [b]
  const out: ContentBlock[] = []
  let prose: string[] = []
  let items: string[] | null = null
  const flush = () => {
    if (items && items.length >= 3 && items.filter((x) => PROSE_START.test(x)).length * 2 < items.length) {
      if (prose.length) out.push({ type: 'p', text: prose.join(' ') })
      prose = []
      out.push({ type: 'ul', items: items.map((x) => x.replace(/\.$/, '')) })
    } else if (items) prose.push(...items)
    items = null
  }
  for (const seg of segs) {
    if (items && seg.endsWith('.') && seg.split(/\s+/).length <= 10) { items.push(seg); continue }
    if (items) flush()
    prose.push(seg)
    if (seg.endsWith(':')) items = []
  }
  flush()
  if (prose.length) out.push({ type: 'p', text: prose.join(' ') })
  return out.some((x) => x.type === 'ul') ? out : [b]
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

function numberedItems(text: string): { lead: string; first: number; items: string[] } | null {
  const marks = [...text.matchAll(NUMBERED)]
  if (marks.length < 2) return null
  const nums = marks.map((m) => Number(m[1]))
  // Must be consecutive: 1,2,3 or 9,10 — not stray numbers in a sentence.
  if (!nums.every((n, i) => i === 0 || n === nums[i - 1] + 1)) return null
  const lead = text.slice(0, marks[0].index).trim()
  if (lead && nums[0] !== 1) return null
  const items = marks.map((m, i) => {
    const start = (m.index ?? 0) + m[0].length
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length
    return text.slice(start, end).trim()
  })
  return items.every((it) => it.length > 2) ? { lead, first: nums[0], items } : null
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
    const prevOl = out[out.length - 1]
    if (b.type === 'ul' && prevOl?.type === 'ol' &&
        b.items.every((it) => /^\d{1,2}\.\s/.test(it) || startsLower(it))) {
      const items = [...prevOl.items]
      for (const it of b.items) {
        const m = it.match(/^\d{1,2}\.\s+(.*)$/)
        if (m) items.push(m[1])
        else items[items.length - 1] = `${items[items.length - 1]} ${it}`
      }
      out[out.length - 1] = { ...prevOl, items }
      continue
    }
    if (b.type !== 'p') { out.push(b); continue }
    const num = numberedItems(b.text)
    if (num?.lead) {
      out.push(num.lead.split(/\s+/).length <= 6 && !/[.!?:,]$/.test(num.lead)
        ? { type: 'h2', text: num.lead } : { type: 'p', text: num.lead })
    }
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
      const m = b.text.match(/^(.*[.!?:])\s+([A-Z][^.!?]{0,40})$/)
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


const DIMENSION =
  /^(?:[A-Za-z]+\s)?(factor|area|signal|dimension|criterion|criteria|aspect|attribute|feature|metric|category|type|element|component|stage|step|phase|channel|model|approach|method|question|topic|role|priority|use case|goal|objective|risk|option|tool|platform|asset|layer)s?$/i

/**
 * Tries each column count and returns the first grid that passes every check.
 * A width rejected by the guards falls through to the next: the attribution
 * table (Method | Best question answered | Strength | Limitation) failed at two
 * columns — "Strength | Limitation" read as a second header row — and was left
 * as sixteen loose lines, when four columns fits it exactly.
 */
const HEADER_TERM =
  /^(strengths?|weakness(es)?|risks?|limitations?|advantages?|disadvantages?|benefits?|drawbacks?|trade-?offs?|pros|cons|best (for|when|use)|use cases?|examples?|costs?|owners?|timelines?|outcomes?|metrics?|when to use)$/i

function gridFor(cells: string[]): { headers: string[]; rows: string[][] } | null {
  if (!DIMENSION.test(cells[0])) return null
  const avg = (xs: string[]) => xs.reduce((n, x) => n + x.length, 0) / xs.length
  for (const k of [3, 2, 4, 5]) {
    if (cells.length % k !== 0 || cells.length / k < 2) continue
    const firstColumn = cells.filter((_, i) => i % k === 0)
    const others = cells.filter((_, i) => i % k !== 0)
    if (!firstColumn.every(isLabel) || avg(firstColumn) >= avg(others)) continue
    const headers = cells.slice(0, k)
    const rows: string[][] = []
    for (let r = k; r < cells.length; r += k) rows.push(cells.slice(r, r + k))
    const splitHeader = rows[0].every((c) => c.length <= 24 && !/[?]$/.test(c))
    const headerRepeated = rows.some((row) => row.some((c) => headers.includes(c)))
    if (!splitHeader && !headerRepeated) return { headers, rows }
    // A split header only means "try wider" when those cells are column
    // titles. "Strength | Limitation" is; "Definitive guide | Topical
    // authority" is data, and reading it wider scrambled two tables.
    if (splitHeader && !rows[0].every((c) => HEADER_TERM.test(c))) return null
  }
  return null
}

function rebuildTables(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = []
  let i = 0
  while (i < blocks.length) {
    let j = i
    while (j < blocks.length && isCell(blocks[j])) j += 1
    const run = blocks.slice(i, j) as { type: 'p'; text: string }[]
    // Only build when the first header cell names a dimension ("Factor",
    // "Area", "Signal"). That is the reliable tell of a comparison table read
    // column by column. When it names a subject instead — "Traditional SEO" —
    // the column count cannot be recovered reliably, and a sample showed those
    // coming out scrambled, pairing facts with the wrong column. A table that
    // is left flat reads as plain text; one that is built wrong misinforms.
    const grid = run.length >= 6 ? gridFor(run.map((c) => c.text.trim())) : null
    if (grid) {
      const { headers, rows } = grid
      out.push({ type: 'table', headers, rows })
      i = j
    } else {
      out.push(blocks[i])
      i += 1
    }
  }
  return out
}
