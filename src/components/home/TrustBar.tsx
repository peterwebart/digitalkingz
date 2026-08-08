import Image from 'next/image'
import { Gauge, Lock, Search, Smartphone } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import type { Media, SiteSetting } from '@/payload-types'

/**
 * Trust bar.
 *
 * Renders the client's own statistics and logo cloud when they have been
 * entered in Site Settings. Until then it falls back to engineering standards
 * a prospect can verify in about ninety seconds with PageSpeed Insights and
 * view-source, rather than to invented numbers.
 */
const STANDARDS = [
  {
    icon: Gauge,
    label: 'Core Web Vitals',
    value: 'Green by default',
    detail: "Built to Google's published thresholds: LCP under 2.5s, INP under 200ms, CLS under 0.1.",
  },
  {
    icon: Search,
    label: 'Search architecture',
    value: 'Schema on every page',
    detail:
      'Organization, Service, Article, FAQ and Breadcrumb structured data, so search engines and AI models can parse the site.',
  },
  {
    icon: Smartphone,
    label: 'Mobile first',
    value: 'Designed small, up',
    detail:
      'Most local and service-business traffic arrives on a phone. That is the primary canvas, not an afterthought.',
  },
  {
    icon: Lock,
    label: 'Ownership',
    value: 'Your accounts, your code',
    detail:
      'Every ad account, analytics property, domain and repository stays in your name. No hostage architecture.',
  },
]

export function TrustBar({ settings }: { settings: SiteSetting }) {
  const stats = settings.trustStats ?? []
  const clients = settings.clients ?? []
  const hasStats = stats.length > 0
  const hasClients = clients.length > 0

  if (!hasStats) {
    return (
      <section className="relative border-y border-ink-100/8 bg-ink-950">
        <div className="container-page">
          <div className="grid gap-px md:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map((item, i) => (
              <Reveal key={item.label} delay={i * 60}>
                <div className="group relative flex h-full flex-col gap-4 py-9 md:py-12 lg:px-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-px hidden w-px bg-ink-100/8 lg:block"
                  />
                  <item.icon
                    className="size-5 text-brand-400 transition-colors duration-300 group-hover:text-brand-300"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                      {item.label}
                    </span>
                    <span className="text-lg font-medium tracking-tight text-ink-50">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-400">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative border-y border-ink-100/8 bg-ink-950">
      <div className="container-page">
        <div className="flex flex-col items-center gap-10 py-10 lg:flex-row lg:justify-between lg:gap-14 lg:py-8">
          <ul className="grid w-full grid-cols-2 gap-8 sm:grid-cols-4 lg:w-auto lg:shrink-0">
            {stats.map((stat, i) => (
              <Reveal key={stat.id ?? i} delay={i * 50} as="li">
                <div className="flex items-center gap-3">
                  <Icon name={stat.icon} className="size-5 shrink-0 text-brand-400" />
                  <span className="flex flex-col">
                    <span className="text-xl font-semibold tracking-tight text-ink-50">
                      {stat.value}
                    </span>
                    <span className="text-[0.6875rem] leading-tight text-ink-500">
                      {stat.label}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

          {hasClients ? (
            <>
              <span
                aria-hidden="true"
                className="hidden h-12 w-px shrink-0 bg-ink-100/8 lg:block"
              />
              <ul className="mask-fade-x flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:justify-end">
                {clients.map((client, i) => {
                  const logo = typeof client.logo === 'object' ? (client.logo as Media) : null
                  return (
                    <Reveal key={client.id ?? i} delay={i * 50} as="li">
                      {logo?.url ? (
                        <Image
                          src={logo.url}
                          alt={logo.alt || client.name}
                          width={logo.width ?? 140}
                          height={logo.height ?? 32}
                          className="h-7 w-auto opacity-45 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0"
                        />
                      ) : (
                        <span className="flex flex-col items-center gap-0.5 opacity-50 transition-opacity duration-300 hover:opacity-90">
                          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-200">
                            {client.name}
                          </span>
                          {client.descriptor ? (
                            <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-ink-600">
                              {client.descriptor}
                            </span>
                          ) : null}
                        </span>
                      )}
                    </Reveal>
                  )
                })}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
