import { cn } from '@/lib/utils'

/**
 * The Digital Growth Engine.
 *
 * Drawn entirely in SVG so it stays crisp at any size, ships inside the
 * initial HTML payload, causes no layout shift, and needs no animation
 * runtime. Text nodes are real <text> elements, so the diagram is readable by
 * screen readers rather than being an inaccessible image.
 */

type Variant = 'spine' | 'satellite' | 'primary' | 'revenue'

interface Node {
  id: string
  label: string
  sub?: string
  x: number
  y: number
  w: number
  h: number
  variant: Variant
  delay: number
}

const H = 34
const CX = 210

const NODES: Node[] = [
  { id: 'brand', label: 'BRAND', x: CX - 56, y: 14, w: 112, h: H, variant: 'spine', delay: 0 },
  {
    id: 'website',
    label: 'WEBSITE',
    sub: 'Digital home',
    x: CX - 74,
    y: 70,
    w: 148,
    h: 42,
    variant: 'primary',
    delay: 0.3,
  },
  { id: 'seo', label: 'SEO', sub: 'Organic', x: 6, y: 132, w: 96, h: H, variant: 'satellite', delay: 0.55 },
  { id: 'ads', label: 'ADS', sub: 'Paid', x: 6, y: 176, w: 96, h: H, variant: 'satellite', delay: 0.7 },
  {
    id: 'content',
    label: 'CONTENT',
    sub: 'Authority',
    x: 318,
    y: 132,
    w: 96,
    h: H,
    variant: 'satellite',
    delay: 0.6,
  },
  {
    id: 'social',
    label: 'SOCIAL',
    sub: 'Reach',
    x: 318,
    y: 176,
    w: 96,
    h: H,
    variant: 'satellite',
    delay: 0.75,
  },
  { id: 'traffic', label: 'TRAFFIC', x: CX - 56, y: 154, w: 112, h: H, variant: 'spine', delay: 0.9 },
  { id: 'leads', label: 'LEADS', x: CX - 56, y: 214, w: 112, h: H, variant: 'spine', delay: 1.1 },
  { id: 'crm', label: 'CRM', x: CX - 56, y: 266, w: 112, h: H, variant: 'spine', delay: 1.3 },
  {
    id: 'automation',
    label: 'AI + AUTOMATION',
    x: CX - 82,
    y: 318,
    w: 164,
    h: 38,
    variant: 'primary',
    delay: 1.5,
  },
  { id: 'revenue', label: 'REVENUE', x: CX - 58, y: 380, w: 116, h: 36, variant: 'revenue', delay: 1.7 },
]

/** Straight spine segments, drawn as [x, y1, y2]. */
const SPINE: { from: number; to: number; delay: number }[] = [
  { from: 48, to: 70, delay: 0 },
  { from: 112, to: 154, delay: 0.3 },
  { from: 188, to: 214, delay: 0.9 },
  { from: 248, to: 266, delay: 1.1 },
  { from: 300, to: 318, delay: 1.3 },
  { from: 356, to: 380, delay: 1.5 },
]

/** Elbow feeds from the satellite channels into TRAFFIC. */
const FEEDS = [
  { d: 'M102 149 H128 V171 H154', delay: 0.55 },
  { d: 'M102 193 H128 V171 H154', delay: 0.7 },
  { d: 'M318 149 H292 V171 H266', delay: 0.6 },
  { d: 'M318 193 H292 V171 H266', delay: 0.75 },
]

const FILL: Record<Variant, string> = {
  spine: 'fill-ink-900',
  satellite: 'fill-ink-900',
  primary: 'fill-brand-600/12',
  revenue: 'fill-emerald-500/10',
}

const STROKE: Record<Variant, string> = {
  spine: 'stroke-ink-100/12',
  satellite: 'stroke-ink-100/10',
  primary: 'stroke-brand-500/45',
  revenue: 'stroke-emerald-500/40',
}

const TEXT: Record<Variant, string> = {
  spine: 'fill-ink-200',
  satellite: 'fill-ink-300',
  primary: 'fill-brand-200',
  revenue: 'fill-emerald-300',
}

export function GrowthEngine({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full', className)}>
      <svg
        viewBox="0 0 420 428"
        className="h-auto w-full overflow-visible font-sans"
        role="img"
        aria-labelledby="engine-title engine-desc"
      >
        <title id="engine-title">The Digital Growth Engine</title>
        <desc id="engine-desc">
          A connected system: brand informs the website; SEO, ads, content and social feed traffic
          into it; traffic becomes leads; leads are managed in a CRM; AI and automation qualify and
          follow up; the result is revenue.
        </desc>

        <defs>
          <linearGradient id="dk-spine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal-400)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--color-brand-400)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-violet-400)" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="dk-halo">
            <stop offset="0%" stopColor="var(--color-brand-400)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0" />
          </radialGradient>
          <filter id="dk-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* Static rails */}
        {SPINE.map((seg) => (
          <line
            key={`rail-${seg.from}`}
            x1={CX}
            y1={seg.from}
            x2={CX}
            y2={seg.to}
            className="stroke-ink-100/12"
            strokeWidth="1"
          />
        ))}
        {FEEDS.map((feed) => (
          <path
            key={`rail-${feed.d}`}
            d={feed.d}
            className="fill-none stroke-ink-100/10"
            strokeWidth="1"
          />
        ))}

        {/* Animated flow */}
        {SPINE.map((seg) => (
          <line
            key={`flow-${seg.from}`}
            x1={CX}
            y1={seg.from}
            x2={CX}
            y2={seg.to}
            stroke="url(#dk-spine)"
            strokeWidth="1.6"
            strokeDasharray="3 15"
            strokeLinecap="round"
            className="animate-dash motion-reduce:animate-none"
            style={{ animationDelay: `${seg.delay}s` }}
          />
        ))}
        {FEEDS.map((feed) => (
          <path
            key={`flow-${feed.d}`}
            d={feed.d}
            className="animate-dash fill-none stroke-brand-500/60 motion-reduce:animate-none"
            strokeWidth="1.4"
            strokeDasharray="3 15"
            strokeLinecap="round"
            style={{ animationDelay: `${feed.delay}s` }}
          />
        ))}

        {/* Nodes */}
        {NODES.map((node) => {
          const cx = node.x + node.w / 2
          const cy = node.y + node.h / 2
          const highlighted = node.variant === 'primary' || node.variant === 'revenue'
          return (
            <g key={node.id}>
              {highlighted ? (
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={node.w * 0.62}
                  ry={node.h * 0.9}
                  fill="url(#dk-halo)"
                  filter="url(#dk-blur)"
                />
              ) : null}
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx={node.h / 2}
                className={cn(FILL[node.variant], STROKE[node.variant])}
                strokeWidth="1"
              />
              <text
                x={cx}
                y={node.sub ? cy - 2 : cy + 3.6}
                textAnchor="middle"
                className={cn(TEXT[node.variant], 'text-[9.5px] font-semibold tracking-[0.1em]')}
              >
                {node.label}
              </text>
              {node.sub ? (
                <text
                  x={cx}
                  y={cy + 10}
                  textAnchor="middle"
                  className="fill-ink-500 text-[7px] tracking-[0.08em]"
                >
                  {node.sub.toUpperCase()}
                </text>
              ) : null}
              <circle
                cx={node.x + 9}
                cy={cy}
                r="2.4"
                className={cn(
                  'animate-pulse-node motion-reduce:animate-none',
                  node.variant === 'revenue' ? 'fill-emerald-400' : 'fill-brand-400',
                )}
                style={{ animationDelay: `${node.delay}s` }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
