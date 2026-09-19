import Link from 'next/link'
import type { Metadata } from 'next'
import { EnquiryReference } from '@/components/forms/EnquiryReference'
import { PageHero } from '@/components/sections/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { buildMetadata } from '@/lib/seo'

/**
 * Enquiry confirmation.
 *
 * Deliberately noindex and absent from the sitemap. A thank-you page in search
 * results is reached without submitting anything, which inflates conversion
 * counts and shows a stranger a page that only makes sense after a form. That
 * is the SEO best practice here, and it does not conflict with the rest of the
 * site being fully indexed.
 *
 * Static, so it stays fast and the reference is read on the client from the
 * query string rather than forcing this route to render per request.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Thank you — your enquiry is with us',
  description: 'We have received your enquiry and will reply within one business day.',
  path: '/thank-you',
  noIndex: true,
})

const NEXT_STEPS = [
  {
    title: 'Read while you wait',
    body: 'Long-form guides on SEO, paid media, websites and AI search.',
    href: '/growth-hub',
    cta: 'Browse the guides',
  },
  {
    title: 'Run your numbers',
    body: 'Twenty calculators for budgets, ROI, cost per lead and AI visibility. Every one shows its formula.',
    href: '/tools',
    cta: 'Open the tools',
  },
  {
    title: 'See how we work',
    body: 'Discovery through to continuous growth, and what we hold ourselves to.',
    href: '/process',
    cta: 'Our process',
  },
]

export default function ThankYouPage() {
  return (
    <>
      <PageHero
        eyebrow="Enquiry received"
        title="Thank you — your enquiry is with us"
        description="We read every enquiry ourselves. You will hear back within one business day, usually sooner."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
          { name: 'Thank you', path: '/thank-you' },
        ]}
      />

      <Section>
        <div className="container-prose flex flex-col gap-8">
          <div className="rounded-xl border border-brand-500/20 bg-brand-500/[0.04] p-6">
            <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-400">
              Your reference
            </p>
            {/* Rendered from the query string by a tiny client component so this
                page stays static. Falls back to plain guidance if absent. */}
            <EnquiryReference />
          </div>

          <div className="flex flex-col gap-3 text-[1.0625rem] leading-relaxed text-ink-300">
            <h2 className="text-lg font-medium text-ink-100">What happens next</h2>
            <p>
              A real person reads your enquiry and replies from{' '}
              <span className="text-ink-100">solutions@digitalkingz.com</span>. If the work is a fit,
              that reply proposes a short call. If it is not, we say so and point you somewhere more
              useful.
            </p>
            <p>
              Quote your reference in any follow-up and we can find the enquiry immediately. Check
              your spam folder if nothing arrives within a business day.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading eyebrow="Meanwhile" title="Worth a look while you wait" />
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-3">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.href}>
                <Reveal delay={i * 60}>
                  <Link href={step.href} className="surface-card surface-card-hover flex h-full flex-col gap-2 p-6">
                    <span className="text-[0.9375rem] font-medium text-ink-50">{step.title}</span>
                    <span className="text-sm leading-relaxed text-ink-400">{step.body}</span>
                    <span className="mt-auto pt-3 text-sm text-brand-400">{step.cta} →</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  )
}
