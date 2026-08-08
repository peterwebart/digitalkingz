import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { ChainStrip, EcosystemDiagram, GROWTH_CHAIN } from '@/components/EcosystemDiagram'
import { WhyDigitalKingz } from '@/components/home/Differentiators'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQ'
import { PageHero } from '@/components/sections/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getSiteSettings } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'About Digital Kingz | Digital Growth Systems',
  description:
    'Digital Kingz builds and operates connected digital growth systems. How we work, what we hold ourselves to, and the principles behind every engagement.',
  path: '/about',
})

const PRINCIPLES = [
  {
    title: 'Arithmetic before opinion',
    body: 'Lifetime value, close rate, cost per qualified lead and capacity. Recommendations that are not grounded in those four numbers are guesses with good design attached.',
  },
  {
    title: 'The system, not the deliverable',
    body: 'A beautiful website that does not convert is a cost. Traffic that sales cannot use is a cost. We are accountable for the chain, which means we care about the links we did not build.',
  },
  {
    title: 'No invented numbers',
    body: 'We do not publish performance claims we cannot trace to an analytics export, and we do not fabricate testimonials or client counts. It is a low bar. Most of this industry does not clear it.',
  },
  {
    title: 'Say no when no is correct',
    body: 'Some channels do not suit some businesses. Some projects should wait. Selling the wrong scope is the fastest way to lose a client and the slowest way to lose a reputation.',
  },
  {
    title: 'Ownership stays with you',
    body: 'Domains, code, ad accounts, analytics, CRM. If our work only survives while you keep paying us, it was never an asset. Everything we build is yours from day one.',
  },
  {
    title: 'Build it so it can be handed over',
    body: 'Non-technical editing for every page, documentation written during the build, no proprietary lock-in. Retainers should be earned monthly, not enforced architecturally.',
  },
]

const ABOUT_FAQS = [
  {
    question: 'What does Digital Kingz actually do?',
    answer:
      'Digital Kingz builds and operates connected digital growth systems: brand and positioning, website and e-commerce platforms, SEO and local search, paid media, conversion optimization, CRM implementation and AI automation. The distinguishing feature is that these are built as one system with one accountable party rather than as separate projects from separate vendors.',
  },
  {
    question: 'What size of business do you work with?',
    answer:
      'Businesses with a considered purchase, a measurable customer value and capacity to service more demand. That covers established local service businesses, professional practices, B2B companies and e-commerce brands. If a five page brochure site with no growth requirement is what you need, there are faster and cheaper options and we will point you at them.',
  },
  {
    question: 'Do you work as a retainer or on projects?',
    answer:
      'Both, and often in sequence. A project builds the platform; a growth partnership operates and improves it. Some clients also engage us purely for advisory work when they have in-house capability and need architecture or a second opinion before committing budget.',
  },
  {
    question: 'Why is there no client logo wall on this site?',
    answer:
      'Because client work is published here only once results are measurable, evidenced and approved for publication by the client. That makes the work section grow slowly. We consider that a better trade than filling a page with logos and percentages that cannot be traced back to a source.',
  },
  {
    question: 'What technology do you build on?',
    answer:
      'Primarily Next.js and TypeScript with a headless CMS and PostgreSQL, deployed on infrastructure the client owns. The stack matters less than the discipline: server rendering by default, minimal client JavaScript, structured data on every template, and no dependency added without a clear reason.',
  },
  {
    question: 'How do you measure whether the work is succeeding?',
    answer:
      'Against pipeline and revenue, not form fills. That means conversion tracking verified end to end, source attribution that survives into the CRM, and reporting that connects spend to closed deals. Where the platform supports it we feed closed revenue back into the ad account so the algorithm optimizes toward customers rather than leads.',
  },
]

export default async function AboutPage() {
  const settings = await getSiteSettings()

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          faqSchema(ABOUT_FAQS),
          {
            '@type': 'AboutPage',
            name: 'About Digital Kingz',
            description: settings.description ?? undefined,
          },
        ]}
      />

      <PageHero
        eyebrow="About"
        title="One team accountable for the whole chain."
        description="Digital Kingz exists because the standard way of buying digital growth is broken. Four vendors, four scopes, four sets of reporting, and nobody accountable for the number the owner actually cares about."
        breadcrumbs={crumbs}
        aside={
          <div className="surface-card p-7">
            <span className="mb-5 block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-500">
              What we operate
            </span>
            <EcosystemDiagram />
          </div>
        }
      />

      <Section>
        <div className="container-prose flex flex-col gap-6 text-[1.0625rem] leading-relaxed text-ink-300">
          <p className="text-lead text-ink-200">
            Most businesses do not have a marketing problem. They have a systems problem that
            presents as a marketing problem.
          </p>
          <p>
            The website was built by one supplier, the ads are run by another, the SEO is with a
            third, and the enquiries arrive in a shared inbox that somebody checks between jobs.
            Each supplier optimizes the part they were hired for. The website designer is not
            accountable for whether the form converts. The media buyer is not accountable for
            whether the lead was any good. The SEO agency is not accountable for what happens after
            the click. Every one of them can report success while the business grows slower than the
            invoices.
          </p>
          <p>
            The revenue leaks in the gaps. A lead that takes four hours to get a response. A landing
            page that does not match the ad that paid for it. A CRM nobody updates. Ad spend
            optimizing toward form fills instead of closed deals. Individually these look like small
            operational annoyances. Collectively they are usually the largest single line of wasted
            spend in the business.
          </p>
          <p>
            Digital Kingz is built around the opposite arrangement. One team designs the brand,
            builds the platform, earns the traffic, engineers the conversion path, wires the CRM and
            automates the follow-up. When something underperforms there is no vendor to blame,
            because there is no other vendor.
          </p>
        </div>
      </Section>

      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="What we hold ourselves to"
              title="Six principles, applied even when they cost us the sale."
              titleClassName="text-display-lg"
            />
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-100/8 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 50}>
                <div className="flex h-full flex-col gap-3 bg-ink-950 p-7">
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium leading-snug text-ink-50">
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-400">{principle.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-8">
          <Reveal>
            <SectionHeading
              eyebrow="The chain"
              title="Ten links. One accountable party."
              titleClassName="text-display-lg"
              description="Every engagement starts by finding which link is the constraint. Fixing the wrong one is how businesses spend a year getting busier without getting bigger."
            />
          </Reveal>
          <Reveal delay={60}>
            <ChainStrip items={GROWTH_CHAIN} />
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/services"
              className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300"
            >
              See every capability
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </Section>

      <WhyDigitalKingz />

      <FAQSection faqs={ABOUT_FAQS} eyebrow="About us" title="Questions people ask" />

      <CTASection />
    </>
  )
}
