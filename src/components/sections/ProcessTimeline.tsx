import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'

export const PROCESS_STEPS = [
  {
    id: '01',
    icon: 'Compass',
    title: 'Discover',
    summary: 'Understand the business, audience and objectives.',
    detail:
      'What you sell, what a customer is worth over their lifetime, where deals actually come from today, and what the current system costs you in wasted spend and lost enquiries. Numbers first, opinions second.',
  },
  {
    id: '02',
    icon: 'Layers',
    title: 'Strategize',
    summary: 'Define positioning, opportunities and growth strategy.',
    detail:
      'Positioning, the offer architecture, the channels worth funding in what order, and the site architecture that supports them. This is where we say no to the things that will not pay for themselves.',
  },
  {
    id: '03',
    icon: 'PenTool',
    title: 'Design',
    summary: 'Create the user experience and visual system.',
    detail:
      'Message hierarchy before pixels. A design system rather than a set of pages, so the site can grow into new services, industries and locations without a redesign every time.',
  },
  {
    id: '04',
    icon: 'Code2',
    title: 'Develop',
    summary: 'Build the digital platform.',
    detail:
      'Typed, server-rendered, accessible, and fast on the phone in a parking lot. Structured data, analytics and CRM wiring are part of the build, not a phase two that never arrives.',
  },
  {
    id: '05',
    icon: 'Rocket',
    title: 'Launch',
    summary: 'Test, optimize and deploy.',
    detail:
      'Redirect mapping, conversion tracking verified end to end, performance measured against real field data, and a rollback plan. A launch that loses rankings is not a launch.',
  },
  {
    id: '06',
    icon: 'TrendingUp',
    title: 'Grow',
    summary: 'SEO, advertising, AI, automation and continuous optimization.',
    detail:
      'The compounding phase. Content and authority, media efficiency, conversion testing, automation coverage, and reporting that ties spend to closed revenue rather than form fills.',
  },
] as const

export function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="relative flex flex-col">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-[1.375rem] w-px bg-gradient-to-b from-transparent via-ink-100/10 to-transparent md:left-[1.625rem]"
      />
      {PROCESS_STEPS.map((step, i) => (
        <Reveal key={step.id} delay={i * 50} as="li" className="relative">
          <div className="flex gap-6 py-6 md:gap-8 md:py-8">
            <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-ink-100/12 bg-ink-950 font-mono text-xs text-brand-500 md:size-[3.25rem] md:text-sm">
              {step.id}
            </span>
            <div className="flex flex-col gap-2 pt-1.5 md:gap-3">
              <h3 className="text-display-sm">{step.title}</h3>
              <p className="text-[0.9375rem] font-medium text-ink-200 md:text-base">
                {step.summary}
              </p>
              {!compact ? (
                <p className="max-w-2xl text-sm leading-relaxed text-ink-400 md:text-[0.9375rem]">
                  {step.detail}
                </p>
              ) : null}
            </div>
          </div>
          {i < PROCESS_STEPS.length - 1 ? (
            <span aria-hidden="true" className="ml-[4.25rem] block h-px bg-ink-100/6 md:ml-[5.25rem]" />
          ) : null}
        </Reveal>
      ))}
    </ol>
  )
}

/** Compact horizontal variant used on the homepage. */
export function ProcessRow() {
  return (
    <ol className="relative grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-signal-500/30 via-brand-500/45 to-violet-500/30 lg:block"
      />
      {PROCESS_STEPS.map((step, i) => (
        <Reveal key={step.id} delay={i * 60} as="li" className="relative">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="relative z-10 flex size-12 items-center justify-center rounded-xl border border-ink-100/12 bg-ink-950 transition-colors duration-300 hover:border-brand-500/45">
              <Icon name={step.icon} className="size-5 text-brand-400" />
            </span>
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-ink-600">
              {step.id}
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-50">
              {step.title}
            </span>
            <p className="text-xs leading-relaxed text-ink-500">{step.summary}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}
