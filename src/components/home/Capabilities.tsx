import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'

const SEARCH_SURFACES = [
  'Google Search',
  'Google Maps',
  'Social Media',
  'Local Search',
  'ChatGPT',
  'Claude',
  'Gemini',
  'Perplexity',
]

const AI_CAPABILITIES = [
  'AI Lead Qualification',
  'Automated Follow-up',
  'AI Chatbots & Assistants',
  'Appointment Booking',
  'CRM Integration',
  'Workflow Automation',
]

const FUNNEL = [
  { label: 'Visitor', tone: 'muted' },
  { label: 'AI Assistant', tone: 'brand' },
  { label: 'Qualification', tone: 'brand' },
  { label: 'CRM', tone: 'brand' },
  { label: 'Automated Follow-up', tone: 'violet' },
  { label: 'Appointment / Sale', tone: 'emerald' },
] as const

const TONE: Record<string, string> = {
  muted: 'border-ink-100/10 bg-ink-900 text-ink-300',
  brand: 'border-brand-500/30 bg-brand-500/[0.07] text-brand-100',
  violet: 'border-violet-500/30 bg-violet-500/[0.07] text-violet-200',
  emerald: 'border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-200',
}

/** Orbiting platform nodes around the business entity. */
const ORBIT = [
  { label: 'G', title: 'Google', angle: -90, color: 'var(--color-brand-400)' },
  { label: 'AI', title: 'ChatGPT', angle: -30, color: 'var(--color-signal-400)' },
  { label: 'C', title: 'Claude', angle: 30, color: 'var(--color-track-automate)' },
  { label: 'G', title: 'Gemini', angle: 90, color: 'var(--color-violet-400)' },
  { label: 'P', title: 'Perplexity', angle: 150, color: 'var(--color-track-found)' },
  { label: 'M', title: 'Maps', angle: 210, color: 'var(--color-brand-300)' },
]

function SearchOrbit() {
  const R = 74
  const CX = 130
  const CY = 130

  return (
    <svg
      viewBox="0 0 260 260"
      className="h-auto w-full max-w-[16rem]"
      role="img"
      aria-labelledby="orbit-title"
    >
      <title id="orbit-title">
        Your business at the centre of Google, Maps, ChatGPT, Claude, Gemini and Perplexity
      </title>
      <defs>
        <radialGradient id="dk-core">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={CX} cy={CY} r={R} className="fill-none stroke-ink-100/8" strokeWidth="1" />
      <circle
        cx={CX}
        cy={CY}
        r={R}
        className="animate-dash fill-none stroke-brand-500/40 motion-reduce:animate-none"
        strokeWidth="1"
        strokeDasharray="3 13"
      />

      {ORBIT.map((node) => {
        const rad = (node.angle * Math.PI) / 180
        const x = CX + R * Math.cos(rad)
        const y = CY + R * Math.sin(rad)
        return (
          <g key={node.title}>
            <line
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              className="stroke-ink-100/8"
              strokeWidth="0.75"
            />
            <circle cx={x} cy={y} r="17" className="fill-ink-900 stroke-ink-100/12" strokeWidth="1" />
            <circle cx={x} cy={y} r="17" fill={node.color} fillOpacity="0.10" />
            <text
              x={x}
              y={y + 3.5}
              textAnchor="middle"
              className="text-[10px] font-semibold"
              fill={node.color}
            >
              {node.label}
            </text>
            <text
              x={x}
              y={y + 30}
              textAnchor="middle"
              className="fill-ink-500 text-[7.5px] uppercase tracking-[0.1em]"
            >
              {node.title}
            </text>
          </g>
        )
      })}

      <circle cx={CX} cy={CY} r="52" fill="url(#dk-core)" />
      <circle cx={CX} cy={CY} r="34" className="fill-ink-900 stroke-brand-500/35" strokeWidth="1" />
      <text
        x={CX}
        y={CY - 2}
        textAnchor="middle"
        className="fill-ink-100 text-[8px] font-semibold tracking-[0.1em]"
      >
        YOUR
      </text>
      <text
        x={CX}
        y={CY + 8}
        textAnchor="middle"
        className="fill-ink-100 text-[8px] font-semibold tracking-[0.1em]"
      >
        BUSINESS
      </text>
    </svg>
  )
}

export function SearchAndAutomation() {
  return (
    <Section className="border-y border-ink-100/8 bg-ink-900/30">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* --- Panel 1: search visibility --------------------------------- */}
        <Reveal>
          <div className="surface-card flex h-full flex-col gap-7 p-7 md:p-9">
            <div className="flex flex-col gap-3">
              <h2 className="text-display-md">
                Be Found Where Your <span className="text-gradient-brand">Customers Search.</span>
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-ink-400">
                We optimize for traditional search and for AI-powered answer engines, so your
                business shows up wherever the question gets asked.
              </p>
            </div>

            <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-8">
              <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2.5 sm:w-auto sm:flex-1">
                {SEARCH_SURFACES.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-300">
                    <Check
                      className="size-3.5 shrink-0 text-brand-400"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex shrink-0 justify-center sm:w-[15rem]">
                <SearchOrbit />
              </div>
            </div>

            <Link
              href="/services/seo"
              className="group mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/[0.06] px-5 py-2.5 text-sm font-medium text-brand-200 transition-colors hover:border-brand-500/55 hover:bg-brand-500/[0.12]"
            >
              Explore SEO &amp; GEO
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>

        {/* --- Panel 2: AI + automation ----------------------------------- */}
        <Reveal delay={80}>
          <div className="surface-card flex h-full flex-col gap-7 p-7 md:p-9">
            <div className="flex flex-col gap-3">
              <h2 className="text-display-md">
                Turn Your Website Into{' '}
                <span className="text-gradient-brand">a Growth Engine.</span>
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-ink-400">
                Integrate AI, CRM and automation to capture, qualify, route and convert more leads
                without adding headcount.
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
              <ul className="flex flex-col gap-2.5">
                {AI_CAPABILITIES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-300">
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-brand-400"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <ol className="flex flex-col gap-1.5">
                {FUNNEL.map((step, i) => (
                  <li key={step.label} className="flex flex-col items-stretch">
                    <span
                      className={`rounded-lg border px-3.5 py-2 text-center text-xs font-medium ${TONE[step.tone]}`}
                    >
                      {step.label}
                    </span>
                    {i < FUNNEL.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mx-auto h-3 w-px bg-gradient-to-b from-ink-100/20 to-ink-100/5"
                      />
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>

            <Link
              href="/services/ai-automation"
              className="group mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/[0.06] px-5 py-2.5 text-sm font-medium text-violet-200 transition-colors hover:border-violet-500/55 hover:bg-violet-500/[0.12]"
            >
              Explore AI &amp; Automation
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
