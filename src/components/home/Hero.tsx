import { MapPin } from 'lucide-react'
import { GrowthEngine } from '@/components/GrowthEngine'
import { ButtonLink } from '@/components/ui/Button'
import type { SiteSetting } from '@/payload-types'

export function Hero({ settings }: { settings: SiteSetting }) {
  const areas = (settings.serviceAreas ?? []).map((a) => a.name).filter(Boolean)
  const areaLine = areas.length > 0 ? areas.join(', ') : null

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-52 left-[8%] size-[42rem] rounded-full bg-brand-600/12 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-24 size-[34rem] rounded-full bg-violet-600/8 blur-[130px]"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-14 py-16 md:py-24 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <div className="flex flex-col items-start gap-7 lg:col-span-6">
            <p className="animate-fade inline-flex items-center gap-2 rounded-full border border-ink-100/10 bg-ink-100/[0.03] px-3.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-400 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-brand-400" aria-hidden="true" />
              Digital Strategy &middot; Web &middot; SEO &middot; AI Automation
            </p>

            <h1 className="text-display-2xl animate-rise text-balance">
              We Build Digital Systems That{' '}
              <span className="text-gradient-brand">Grow Businesses.</span>
            </h1>

            <p
              className="text-lead animate-rise max-w-xl text-ink-400"
              style={{ animationDelay: '90ms' }}
            >
              Digital strategy, high-performance websites, SEO, AI and automation, engineered to
              help businesses get found, convert more customers and scale.
            </p>

            <div
              className="animate-rise flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '150ms' }}
            >
              <ButtonLink href="/contact" size="lg" withArrow>
                Start a Project
              </ButtonLink>
              <ButtonLink href="/work" variant="secondary" size="lg">
                Explore Our Work
              </ButtonLink>
            </div>

            {areaLine ? (
              <p
                className="animate-fade inline-flex items-center gap-2 text-sm text-ink-500"
                style={{ animationDelay: '240ms' }}
              >
                <MapPin className="size-4 text-brand-500" strokeWidth={1.75} aria-hidden="true" />
                Serving businesses across{' '}
                <span className="text-brand-300">{areaLine}</span>
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-6">
            <div
              className="animate-rise relative rounded-3xl border border-ink-100/10 bg-ink-900/50 p-6 backdrop-blur-sm md:p-8"
              style={{ animationDelay: '200ms' }}
            >
              <p className="mb-5 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-400">
                &mdash; The Digital Growth Engine &mdash;
              </p>
              <GrowthEngine />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
