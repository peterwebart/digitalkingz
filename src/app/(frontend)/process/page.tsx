import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQ'
import { PageHero } from '@/components/sections/PageHero'
import { PROCESS_STEPS, ProcessTimeline } from '@/components/sections/ProcessTimeline'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Our Process: From Idea to Digital Growth Engine',
  description:
    'Six stages from discovery to continuous growth. How Digital Kingz scopes, designs, builds, launches and operates digital growth systems.',
  path: '/process',
})

const PROCESS_FAQS = [
  {
    question: 'How long does a typical build take?',
    answer:
      'It depends almost entirely on scope and on how quickly content and approvals move on the client side. A focused platform build moves faster than a full rebrand with e-commerce and CRM integration. We give a stage-by-stage timeline after discovery, once the scope is real rather than assumed, and we would rather quote a date we can hold than one that sounds good in a pitch.',
  },
  {
    question: 'Why do you insist on discovery before quoting?',
    answer:
      'Because a quote given before discovery is a guess, and guesses are corrected later through change orders. Discovery establishes what a customer is worth, where the constraint actually is, and what the business can service. Occasionally it establishes that the project should be smaller than what was originally asked for, which is exactly why it happens first.',
  },
  {
    question: 'What do you need from us during the project?',
    answer:
      'Access to the numbers, decisions made within a reasonable window, and one empowered point of contact. The most common cause of a delayed build is not development time, it is content and approvals waiting on a committee. We plan around that and flag it early rather than absorbing it silently.',
  },
  {
    question: 'What happens at launch if we already rank well?',
    answer:
      'Existing rankings are treated as an asset to protect. That means a full crawl and URL inventory before launch, one-to-one redirect mapping, preserved content depth on pages that already earn traffic, and monitoring in the weeks afterwards. A redesign that loses rankings is a common and entirely avoidable failure.',
  },
  {
    question: 'Does the relationship end at launch?',
    answer:
      'It can, and the site is built so that it works if it does. In practice launch is the point where the system starts producing data worth acting on, so most clients continue into a growth partnership covering SEO, media, conversion testing and automation. That is a monthly decision on your side, not a contractual trap.',
  },
  {
    question: 'How do you report on progress?',
    answer:
      'Against commercial outcomes, in plain language. Qualified leads, cost per qualified lead, booked calls, pipeline and where revenue is attributable. Channel metrics like rankings and impressions are included as diagnostics, not as the headline. If a report cannot be read in five minutes by the owner, it is the wrong report.',
  },
]

export default function ProcessPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Process', path: '/process' },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          faqSchema(PROCESS_FAQS),
          {
            '@type': 'HowTo',
            name: 'How Digital Kingz builds a digital growth system',
            description:
              'A six stage process from discovery through to continuous growth optimization.',
            step: PROCESS_STEPS.map((step, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: step.title,
              text: step.detail,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Process"
        title="From idea to digital growth engine."
        description="Six stages. The first two decide whether the other four are worth funding, which is why we will not skip them even when a client wants to start building on day one."
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex flex-col gap-6 lg:sticky lg:top-28">
                <SectionHeading eyebrow="The stages" title="What actually happens" />
                <div className="flex flex-col gap-4 rounded-2xl border border-ink-100/8 bg-ink-100/[0.02] p-6">
                  <p className="text-sm leading-relaxed text-ink-400">
                    <span className="font-medium text-ink-100">Discovery is not a formality.</span>{' '}
                    It is where we find out whether the constraint is traffic, conversion, follow-up
                    or capacity. Businesses routinely arrive asking for more of the thing that is
                    already working.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <ProcessTimeline />
          </div>
        </div>
      </Section>

      <FAQSection
        faqs={PROCESS_FAQS}
        eyebrow="Working together"
        title="How the engagement runs"
      />

      <CTASection
        heading="Start with discovery."
        body="Thirty minutes, no cost, no obligation. We map your current system, identify the constraint and tell you what fixing it would involve. You keep the diagnosis either way."
      />
    </>
  )
}
