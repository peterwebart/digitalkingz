import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'

export function CTASection({
  heading = 'Let us find the revenue your current setup is leaking.',
  body = 'Tell us what you sell, what a customer is worth and where the pipeline stalls. We will map the system that fixes it and tell you what it takes to build.',
  primaryLabel = 'Start a project',
  primaryHref = '/contact',
  secondaryLabel = 'Book a strategy call',
  secondaryHref = '/contact#book',
  className,
}: {
  heading?: string | null
  body?: string | null
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  className?: string
}) {
  return (
    <section className={cn('relative py-20 md:py-28', className)}>
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-ink-100/10 bg-ink-900 px-6 py-14 md:px-14 md:py-20">
            <div
              aria-hidden="true"
              className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-60"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-32 size-[26rem] rounded-full bg-brand-600/12 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 -left-20 size-[24rem] rounded-full bg-signal-600/8 blur-[100px]"
            />

            <div className="relative flex flex-col items-start gap-7 md:max-w-3xl">
              <h2 className="text-display-lg text-balance">{heading}</h2>
              <p className="text-lead max-w-2xl text-ink-400">{body}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={primaryHref} size="lg" withArrow>
                  {primaryLabel}
                </ButtonLink>
                <ButtonLink href={secondaryHref} variant="secondary" size="lg">
                  {secondaryLabel}
                </ButtonLink>
              </div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-600">
                No obligation &middot; We will tell you if we are not the right fit
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
