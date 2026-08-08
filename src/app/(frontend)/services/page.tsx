import type { Metadata } from 'next'
import { ChainStrip, GROWTH_CHAIN } from '@/components/EcosystemDiagram'
import { JsonLd } from '@/components/JsonLd'
import { Engagement } from '@/components/home/Differentiators'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQ'
import { PageHero } from '@/components/sections/PageHero'
import { ServiceCard } from '@/components/ui/Cards'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { SERVICE_CATEGORY_META } from '@/lib/nav-config'
import { getServices } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'

export const revalidate = 300

const TITLE = 'Digital Marketing & Development Services'
const DESCRIPTION =
  'Web design, development, e-commerce, SEO, local SEO, Google Ads, Meta Ads, conversion optimization, AI automation, CRM and branding, built as one connected growth system.'

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/services',
})

const HUB_FAQS = [
  {
    question: 'Do I have to buy every service?',
    answer:
      'No. Most engagements start with the single constraint holding the business back, then expand once that link is working. A company with strong demand and a website that does not convert should not be buying more traffic. We will tell you which link to fix first, even when that is a smaller scope than you came in asking for.',
  },
  {
    question: 'What does a typical engagement cost?',
    answer:
      'Pricing depends on scope, competitive density and what a customer is worth to you. A local service business with a four figure average job value and a national B2B company with a six figure contract value need different systems and different budgets. We quote after a discovery conversation, never from a template.',
  },
  {
    question: 'How is this different from hiring separate specialists?',
    answer:
      'Separate specialists optimize their own link in the chain and nobody owns the gaps between them. The SEO agency is not accountable for whether traffic converts, the designer is not accountable for whether the CRM receives the lead, and the media buyer is not accountable for close rate. One team across the whole chain means one number to be accountable for.',
  },
  {
    question: 'Who owns the accounts and the code?',
    answer:
      'You do. Domains, repositories, ad accounts, analytics properties, CRM instances and content all stay in your name from day one. If you replace us, the system keeps running. Any agency that structures access so you cannot leave is protecting itself, not you.',
  },
  {
    question: 'How quickly do results appear?',
    answer:
      'It depends entirely on the channel. Paid media can produce enquiries the week it launches, which is one reason it is often the right first investment: it validates demand and messaging before you commit to a longer build. SEO and content compound over months rather than weeks. Conversion work usually shows up fastest of all, because it improves traffic you already have.',
  },
  {
    question: 'Do you work with businesses outside your listed industries?',
    answer:
      'Yes. The listed industries are the verticals where we have built the deepest pattern library, so we start further along. The underlying system is the same for any business with a considered purchase, a measurable customer value and capacity to serve more demand. If your economics do not support the work, we will say so.',
  },
]

export default async function ServicesPage() {
  const services = await getServices()

  const groups = Object.entries(SERVICE_CATEGORY_META)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, meta]) => ({ key, meta, items: services.filter((s) => s.category === key) }))
    .filter((g) => g.items.length > 0)

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          faqSchema(HUB_FAQS),
          {
            '@type': 'CollectionPage',
            name: TITLE,
            description: DESCRIPTION,
            hasPart: services.map((s) => ({
              '@type': 'Service',
              name: s.title,
              description: s.tagline,
              url: `/services/${s.slug}`,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Services"
        title="Every link in the chain, built by one team."
        description="Twelve capabilities organised into four categories. Bought separately they are projects. Built together they are a system that compounds."
        breadcrumbs={crumbs}
      >
        <ChainStrip items={GROWTH_CHAIN} className="mt-2" />
      </PageHero>

      {groups.map((group, groupIndex) => (
        <Section
          key={group.key}
          id={group.key}
          className={groupIndex % 2 === 1 ? 'border-y border-ink-100/8 bg-ink-900/40' : undefined}
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="lg:sticky lg:top-28">
                  <SectionHeading
                    eyebrow={`0${group.meta.order} / ${group.meta.label}`}
                    title={group.meta.label}
                    titleClassName="text-display-lg text-gradient-brand w-fit"
                    description={group.meta.blurb}
                  />
                </div>
              </Reveal>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {group.items.map((service, i) => (
                <Reveal key={service.id} delay={i * 50}>
                  <ServiceCard
                    href={`/services/${service.slug}`}
                    title={service.title}
                    tagline={service.tagline}
                    icon={service.icon}
                    className="h-full"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ))}

      <Engagement />

      <FAQSection
        faqs={HUB_FAQS}
        eyebrow="Before you enquire"
        title="The questions we get asked first"
      />

      <CTASection />
    </>
  )
}
