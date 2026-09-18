import {
  RichText as PayloadRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createHeadingIds } from '@/lib/toc'

type TextNode = { text?: string; children?: unknown[] }
const extractText = (node: TextNode): string =>
  node.text ?? ((node.children ?? []) as TextNode[]).map(extractText).join('')

type CalloutFields = { blockType: 'callout'; title?: string; text?: string }
type DataTableFields = { blockType: 'dataTable'; caption?: string; content?: string }

function Callout({ title, text }: { title?: string; text?: string }) {
  return (
    <aside className="my-9 flex gap-4 rounded-2xl border border-brand-500/20 bg-brand-500/[0.04] p-6">
      <Lightbulb
        className="mt-0.5 size-5 shrink-0 text-brand-400"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1.5">
        {title ? <p className="font-medium text-ink-50">{title}</p> : null}
        {text ? <p className="text-[0.9375rem] leading-relaxed text-ink-300">{text}</p> : null}
      </div>
    </aside>
  )
}

function DataTable({ caption, content }: { caption?: string; content?: string }) {
  if (!content) return null
  const rows = content
    .split('\n')
    .map((line) => line.split('|').map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean))

  const [headers, ...body] = rows
  if (!headers) return null

  return (
    <figure className="my-9 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <table className="w-full min-w-[36rem]">
        {caption ? (
          <caption className="mb-3 text-left text-sm text-ink-500">{caption}</caption>
        ) : null}
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((cells, i) => (
            <tr key={i}>
              {cells.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

type BlockNodeArg<T> = { node: { fields: T } }

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({

  ...defaultConverters,
  // Ids must match src/lib/toc.ts exactly, so both use the same generator and
  // walk the document in the same order.
  heading: (() => {
    const nextId = createHeadingIds()
    // Payload types the converter tightly; the node shape we need (tag plus
    // children) is a subset, so it is narrowed rather than re-declared.
    const HeadingNode = ({
      node,
      nodesToJSX,
    }: {
      node: { tag: string; children?: unknown[] }
      nodesToJSX: (a: { nodes: never[] }) => React.ReactNode
    }) => {
      const children = nodesToJSX({ nodes: (node.children ?? []) as never[] })
      const text = extractText(node as TextNode)
      const Tag = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4'
      const id = Tag === 'h2' || Tag === 'h3' ? nextId(text) : undefined
      return (
        <Tag id={id} className={id ? 'scroll-mt-28' : undefined}>
          {children}
        </Tag>
      )
    }
    HeadingNode.displayName = 'HeadingNode'
    return HeadingNode
  })(),
  blocks: {
    callout: ({ node }: BlockNodeArg<CalloutFields>) => (
      <Callout title={node.fields.title} text={node.fields.text} />
    ),
    dataTable: ({ node }: BlockNodeArg<DataTableFields>) => (
      <DataTable caption={node.fields.caption} content={node.fields.content} />
    ),
  },
})

export function RichText({
  data,
  className,
}: {
  data: SerializedEditorState
  className?: string
}) {
  return (
    <PayloadRichText
      data={data}
      converters={converters}
      className={cn('prose-dk', className)}
      disableContainer
    />
  )
}
