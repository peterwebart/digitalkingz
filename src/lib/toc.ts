import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * Headings extracted from Lexical content, for anchors and a table of contents.
 *
 * The same `slugify` runs here and in the heading converter, and both walk the
 * document in order using the same duplicate counter, so a TOC link and its
 * heading always agree. Deriving ids in two places with two rules is how anchor
 * links quietly stop working.
 */

export type Heading = { id: string; text: string; level: 2 | 3 }

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'section'
  )
}

/** Stateful id generator: the second "Overview" becomes `overview-2`. */
export function createHeadingIds() {
  const seen = new Map<string, number>()
  return (text: string): string => {
    const base = slugifyHeading(text)
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    return n === 1 ? base : `${base}-${n}`
  }
}

type Node = { type?: string; tag?: string; text?: string; children?: Node[] }

const textOf = (node: Node): string =>
  node.text ?? (node.children ?? []).map(textOf).join('')

/** Walks the document in the same order the renderer will. */
export function extractHeadings(data: SerializedEditorState | null | undefined): Heading[] {
  const root = (data as unknown as { root?: Node })?.root
  if (!root?.children) return []

  const nextId = createHeadingIds()
  const headings: Heading[] = []

  // Depth-first, because the renderer's converter fires on every heading
  // wherever it sits in the tree. Walking only the top level advanced the two
  // duplicate counters differently and left one anchor pointing nowhere.
  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.type === 'heading') {
        const text = textOf(node).trim()
        // The id is claimed for every heading the renderer will see, including
        // h1 and h4, so the counters stay in step. Only h2/h3 reach the list.
        const level = node.tag === 'h2' ? 2 : node.tag === 'h3' ? 3 : null
        // Claim an id under exactly the same condition as the renderer: h2 and
        // h3 only. Claiming for h1/h4 here would desynchronise the counters in
        // the other direction.
        if (text && level) headings.push({ id: nextId(text), text, level })
        continue
      }
      if (node.children?.length) walk(node.children)
    }
  }

  walk(root.children)
  return headings
}
