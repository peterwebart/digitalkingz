import type { ContentBlock } from '@/seed/types'

/**
 * Portable blocks to Lexical.
 *
 * Seed content is authored in a plain, reviewable format. This converts it
 * into the Lexical tree Payload stores, so everything published by the seed
 * remains fully editable in the admin rich-text editor afterwards.
 *
 * Inline syntax supported inside any text:
 *   **bold**
 *   [label](/path)
 */

type LexNode = Record<string, unknown>

const FORMAT_BOLD = 1

let idCounter = 0
const nextId = () => {
  idCounter += 1
  return `seed-${idCounter.toString(36).padStart(6, '0')}`
}

const textNode = (text: string, format = 0): LexNode => ({
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
})

const linkNode = (url: string, children: LexNode[]): LexNode => ({
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'link',
  version: 3,
  fields: {
    linkType: 'custom',
    newTab: !url.startsWith('/'),
    url,
  },
})

const INLINE_RE = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))/g

/** Parses bold and link markers into Lexical inline nodes. */
export function parseInline(input: string): LexNode[] {
  const nodes: LexNode[] = []
  let lastIndex = 0

  for (const match of input.matchAll(INLINE_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) nodes.push(textNode(input.slice(lastIndex, index)))

    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(textNode(token.slice(2, -2), FORMAT_BOLD))
    } else {
      const close = token.indexOf('](')
      const label = token.slice(1, close)
      const url = token.slice(close + 2, -1)
      nodes.push(linkNode(url, [textNode(label)]))
    }
    lastIndex = index + token.length
  }

  if (lastIndex < input.length) nodes.push(textNode(input.slice(lastIndex)))
  if (nodes.length === 0) nodes.push(textNode(input))
  return nodes
}

const paragraph = (text: string): LexNode => ({
  children: parseInline(text),
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  type: 'paragraph',
  version: 1,
})

const heading = (text: string, tag: 'h2' | 'h3' | 'h4'): LexNode => ({
  children: parseInline(text),
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  type: 'heading',
  version: 1,
})

const list = (items: string[], ordered: boolean): LexNode => ({
  children: items.map((item, i) => ({
    children: parseInline(item),
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'listitem',
    value: i + 1,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: ordered ? 'number' : 'bullet',
  start: 1,
  tag: ordered ? 'ol' : 'ul',
  type: 'list',
  version: 1,
})

const quote = (text: string): LexNode => ({
  children: parseInline(text),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'quote',
  version: 1,
})

const blockNode = (blockType: string, fields: Record<string, unknown>): LexNode => ({
  format: '',
  type: 'block',
  version: 2,
  fields: {
    id: nextId(),
    blockName: '',
    blockType,
    ...fields,
  },
})

export interface LexicalRoot {
  root: {
    type: 'root'
    children: LexNode[]
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
  }
}

export function blocksToLexical(blocks: ContentBlock[]): LexicalRoot {
  const children: LexNode[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'p':
        children.push(paragraph(block.text))
        break
      case 'h2':
        children.push(heading(block.text, 'h2'))
        break
      case 'h3':
        children.push(heading(block.text, 'h3'))
        break
      case 'ul':
        children.push(list(block.items, false))
        break
      case 'ol':
        children.push(list(block.items, true))
        break
      case 'quote':
        children.push(quote(block.text))
        break
      case 'callout':
        children.push(blockNode('callout', { title: block.title, text: block.text }))
        break
      case 'table':
        children.push(
          blockNode('dataTable', {
            caption: '',
            content: [block.headers, ...block.rows].map((row) => row.join(' | ')).join('\n'),
          }),
        )
        break
    }
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

/**
 * Adds internal links to the first mention of each target phrase.
 *
 * Internal linking is one of the highest-leverage on-page SEO levers and the
 * least likely to be maintained by hand. Doing it at seed time keeps the
 * anchor text natural, because it links words the writer already chose.
 */
export function autolink(
  blocks: ContentBlock[],
  targets: { phrase: string; href: string }[],
  maxLinks = 6,
): ContentBlock[] {
  const used = new Set<string>()
  let linkCount = 0

  const applyTo = (text: string): string => {
    if (linkCount >= maxLinks) return text
    let output = text
    for (const target of targets) {
      if (linkCount >= maxLinks) break
      if (used.has(target.href)) continue
      // Whole-word, case-sensitive, and never inside an existing markdown link.
      const escaped = target.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(`(?<![\\w[])${escaped}(?![\\w\\]])`)
      if (!re.test(output)) continue
      output = output.replace(re, `[${target.phrase}](${target.href})`)
      used.add(target.href)
      linkCount += 1
    }
    return output
  }

  return blocks.map((block) => {
    // Headings, callouts and tables are left alone: links in headings hurt
    // scannability and dilute the heading as a ranking signal.
    if (block.type !== 'p') return block
    return { ...block, text: applyTo(block.text) }
  })
}
