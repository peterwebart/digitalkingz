import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { IndustryCard } from '@/components/ui/Cards'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getIndustries } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata: Metadata = buildMetadata({
  title: 'Industries We Build Growth Systems For',
  description:
    'Digital growth systems built around the economics of your market: law firms, medical and dental practices, real estate, home services, professional services, B2B and e-commerce.',
  path: '/industries',
})

const VARIABLES = [
  {
    title: 'Customer value',
    body: 'A single legal matter can justify a quarter of marketing budget. A hygiene appointment cannot. Value per customer sets the ceiling on what you can afford to pay for one.',
  },
  {
    title: 'Buying cycle',
    body: 'Emergency plumbing is decided in ninety seconds. A B2B platform decision takes seven months and four stakeholders. The same funnel cannot serve both.',
  },
  {
    title: 'Capacity',
    body: 'Generating demand you cannot service destroys reviews and margin at the same time. In several verticals the correct answer is better leads, not more.',
  },
  {
    title: 'Regulation',
    body: 'Advertising rules, privacy legislation and consent requirements materially change what tracking, remarketing and claims are permitted. This is a design constraint, not a footnote.',
  },
]

export default async function IndustriesPage() {
  const industries = await getIndustries()

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries' },
  ]

  return (
    <>
      <JsonLd nodes={[breadcrumbSchema(crumbs)]} />

      <PageHero
        eyebrow="Industries"
        title="The same channels. Completely different economics."
        description="Every business needs traffic, conversion and follow-up. What changes by market is what a customer is worth, how long they take to decide, what you are legally allowed to say, and how much demand you can actually service."
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <Reveal key={industry.id} delay={i * 40}>
              <IndustryCard
                href={`/industries/${industry.slug}`}
                title={industry.title}
                tagline={industry.tagline}
                icon={industry.icon}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="What actually changes"
              title="Four variables decide the whole system."
              titleClassName="text-display-lg"
              description="When an agency runs the same playbook across every vertical, these are the four things it is ignoring. They are also the four things that determine whether the budget returns anything."
            />
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-100/8 md:grid-cols-2">
            {VARIABLES.map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <div className="flex h-full flex-col gap-3 bg-ink-950 p-7">
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium text-ink-50">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-400">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CTASection
        heading="Not on the list?"
        body="These are the verticals where we have built the deepest pattern library, so we start further along. The underlying system works for any business with a considered purchase and measurable customer value. Tell us your numbers and we will tell you whether it fits."
      />
    </>
  )
}
