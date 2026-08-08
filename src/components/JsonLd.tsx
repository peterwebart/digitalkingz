import { jsonLdGraph } from '@/lib/seo'

type Json = Record<string, unknown>

/**
 * Renders a schema.org @graph.
 *
 * Kept server-rendered and inline so the markup is present in the initial HTML
 * payload that crawlers and AI answer engines read.
 */
export function JsonLd({ nodes }: { nodes: (Json | null)[] }) {
  const json = jsonLdGraph(nodes)
  return (
    <script
      type="application/ld+json"
      // The payload is generated from our own CMS data via JSON.stringify.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  )
}
