import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

/** The chain, in the order revenue actually travels through it. */
const CHAIN = [
  { label: 'Strategy', icon: 'Compass', href: '/services/branding' },
  { label: 'Brand', icon: 'Sparkles', href: '/services/branding' },
  { label: 'Website', icon: 'Globe', href: '/services/web-development' },
  { label: 'SEO', icon: 'Search', href: '/services/seo' },
  { label: 'Traffic', icon: 'Users', href: '/services/google-ads' },
  { label: 'Conversion', icon: 'TrendingUp', href: '/services/conversion-optimization' },
  { label: 'Leads', icon: 'Target', href: '/services/conversion-optimization' },
  { label: 'CRM', icon: 'Database', href: '/services/crm-systems' },
  { label: 'AI + Automation', icon: 'Bot', href: '/services/ai-automation' },
  { label: 'Growth', icon: 'Rocket', href: '/process' },
]

const TOP = CHAIN.slice(0, 6)
const BOTTOM = CHAIN.slice(6)

function ChainNode({ item, delay }: { item: (typeof CHAIN)[number]; delay: number }) {
  return (
    <Reveal delay={delay} className="relative z-10 flex-1">
      <Link
        href={item.href}
        className="group flex flex-col items-center gap-3 rounded-xl px-2 py-3 text-center transition-colors"
      >
        <span className="relative flex size-11 items-center justify-center rounded-xl border border-ink-100/10 bg-ink-950 transition-all duration-300 group-hover:border-brand-500/45 group-hover:bg-brand-500/[0.08]">
          <Icon
            name={item.icon}
            className="size-[1.15rem] text-ink-400 transition-colors duration-300 group-hover:text-brand-300"
          />
        </span>
        <span className="text-xs font-medium leading-tight text-ink-300 transition-colors group-hover:text-ink-50">
          {item.label}
        </span>
      </Link>
    </Reveal>
  )
}

export function Ecosystem() {
  return (
    <Section id="ecosystem">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <Reveal>
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <SectionHeading
                title={
                  <>
                    Your Website Is Only
                    <br className="hidden sm:block" /> One Part of the{' '}
                    <span className="text-gradient-brand">Growth System.</span>
                  </>
                }
                titleClassName="text-display-lg"
                description={
                  <>
                    A beautiful website that nobody finds isn&rsquo;t a growth strategy. Traffic that
                    doesn&rsquo;t convert isn&rsquo;t a growth strategy. Leads that aren&rsquo;t
                    followed up aren&rsquo;t a growth strategy. We connect the pieces.
                  </>
                }
              />
              <Link
                href="/process"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-ink-100/12 px-5 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-brand-500/45 hover:text-white"
              >
                See How It Works
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          {/* Desktop: the snake. Mobile: a simple wrapped grid. */}
          <div className="hidden sm:flex sm:flex-col sm:gap-2">
            <div className="relative flex items-start">
              <span
                aria-hidden="true"
                className="absolute inset-x-6 top-[1.4rem] h-px bg-gradient-to-r from-signal-500/50 via-brand-500/60 to-violet-500/50"
              />
              {TOP.map((item, i) => (
                <ChainNode key={item.label} item={item} delay={i * 50} />
              ))}
            </div>

            <div aria-hidden="true" className="relative h-9">
              <span className="absolute right-[7%] top-0 h-full w-[6%] rounded-br-xl rounded-tr-xl border-b border-r border-violet-500/40" />
            </div>

            <div className="relative flex flex-row-reverse items-start">
              <span
                aria-hidden="true"
                className="absolute right-6 top-[1.4rem] h-px w-[calc(66.666%-3rem)] bg-gradient-to-l from-violet-500/50 via-brand-500/60 to-signal-500/40"
              />
              {BOTTOM.map((item, i) => (
                <ChainNode key={item.label} item={item} delay={i * 50} />
              ))}
              <span className="flex-1" aria-hidden="true" />
              <span className="flex-1" aria-hidden="true" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:hidden">
            {CHAIN.map((item, i) => (
              <ChainNode key={item.label} item={item} delay={i * 30} />
            ))}
          </div>

          <Reveal delay={120}>
            <p
              className={cn(
                'mt-10 rounded-2xl border border-ink-100/8 bg-ink-100/[0.02] p-6 text-sm leading-relaxed text-ink-400',
              )}
            >
              <span className="font-medium text-ink-100">
                Most agencies sell one link in this chain.
              </span>{' '}
              The revenue leaks in the gaps between them: the lead that takes four hours to get a
              reply, the landing page that doesn&rsquo;t match the ad that paid for it, the CRM
              nobody updates. One accountable team across the whole loop is the difference.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
