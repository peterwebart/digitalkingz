import { cn } from '@/lib/utils'

const NODES = [
  { id: 'business', label: 'Business', x: 90, y: 60, delay: 0 },
  { id: 'website', label: 'Website', x: 250, y: 60, delay: 0.35 },
  { id: 'traffic', label: 'Traffic', x: 410, y: 60, delay: 0.7 },
  { id: 'leads', label: 'Leads', x: 410, y: 200, delay: 1.05 },
  { id: 'crm', label: 'CRM', x: 250, y: 200, delay: 1.4 },
  { id: 'revenue', label: 'Revenue', x: 90, y: 200, delay: 1.75 },
] as const

const EDGES = [
  { from: 'business', to: 'website', delay: 0 },
  { from: 'website', to: 'traffic', delay: 0.35 },
  { from: 'traffic', to: 'leads', delay: 0.7 },
  { from: 'leads', to: 'crm', delay: 1.05 },
  { from: 'crm', to: 'revenue', delay: 1.4 },
  { from: 'revenue', to: 'business', delay: 1.75 },
] as const

const byId = (id: string) => NODES.find((n) => n.id === id)!

/**
 * The signature Digital Kingz visual: a closed loop showing that revenue feeds
 * back into the business rather than terminating at a form fill.
 *
 * Pure SVG with CSS animation. No animation runtime, no layout shift, and it
 * renders identically in the initial HTML payload.
 */
export function EcosystemDiagram({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full', className)}>
      <svg
        viewBox="0 0 500 260"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-labelledby="ecosystem-title ecosystem-desc"
      >
        <title id="ecosystem-title">The Digital Kingz growth loop</title>
        <desc id="ecosystem-desc">
          A connected system where the business informs the website, the website earns traffic,
          traffic becomes leads, leads are managed in a CRM, the CRM produces revenue, and revenue
          reinvests back into the business.
        </desc>

        <defs>
          <linearGradient id="dk-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-brand-700)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="var(--color-brand-400)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-brand-700)" stopOpacity="0.25" />
          </linearGradient>
          <radialGradient id="dk-node-glow">
            <stop offset="0%" stopColor="var(--color-brand-400)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0" />
          </radialGradient>
          <filter id="dk-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Static rails */}
        {EDGES.map((edge) => {
          const a = byId(edge.from)
          const b = byId(edge.to)
          return (
            <line
              key={`rail-${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              className="text-ink-100/10"
              strokeWidth="1"
            />
          )
        })}

        {/* Animated flow */}
        {EDGES.map((edge) => {
          const a = byId(edge.from)
          const b = byId(edge.to)
          return (
            <line
              key={`flow-${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="url(#dk-edge)"
              strokeWidth="1.5"
              strokeDasharray="4 22"
              strokeLinecap="round"
              className="animate-dash motion-reduce:animate-none"
              style={{ animationDelay: `${edge.delay}s` }}
            />
          )
        })}

        {NODES.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="26" fill="url(#dk-node-glow)" filter="url(#dk-soft)" />
            <circle
              cx={node.x}
              cy={node.y}
              r="13"
              className="fill-ink-900 stroke-ink-100/12"
              strokeWidth="1"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="4"
              className="animate-pulse-node fill-brand-400 motion-reduce:animate-none"
              style={{ animationDelay: `${node.delay}s` }}
            />
            <text
              x={node.x}
              y={node.y + 33}
              textAnchor="middle"
              className="fill-ink-300 font-mono text-[9px] uppercase tracking-[0.14em]"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/**
 * Compact horizontal version of the chain, used inline in body copy and on
 * service pages where the full loop would be too heavy.
 */
export function ChainStrip({
  items,
  className,
}: {
  items: readonly string[]
  className?: string
}) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-x-2 gap-y-2', className)}>
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-2">
          <span className="rounded-full border border-ink-100/10 bg-ink-100/[0.03] px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-300">
            {item}
          </span>
          {i < items.length - 1 ? (
            <span aria-hidden="true" className="text-ink-600">
              &rarr;
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export const GROWTH_CHAIN = [
  'Brand',
  'Website',
  'SEO',
  'Traffic',
  'Conversion',
  'Leads',
  'CRM',
  'AI',
  'Automation',
  'Revenue',
] as const
