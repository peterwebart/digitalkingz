import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import { BeforeAfterSlider } from '@/components/home/BeforeAfter'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getCaseStudies } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata: Metadata = buildMetadata({
  title: 'Our Work: How We Build Digital Growth Systems',
  description:
    'What we build and how it is engineered: architecture, performance budgets, SEO foundations, conversion structure and the automation layer behind every Digital Kingz project.',
  path: '/work',
})

const BUILD_ANATOMY = [
  {
    layer: 'Architecture',
    body: 'Server-rendered Next.js with a typed content model. A page template per intent, so adding a service, industry or location is a content task rather than a development project.',
    proof: [
      'Route-level static generation with incremental revalidation',
      'A design system, not a set of one-off pages',
      'Content model that mirrors how the business actually sells',
    ],
  },
  {
    layer: 'Performance',
    body: 'Measured against field data, not a lab score screenshot. Minimal client JavaScript, modern image formats, disciplined third-party scripts, fonts self-hosted so nothing blocks first paint.',
    proof: [
      'Core Web Vitals treated as a build requirement',
      'No animation runtime shipped for effects CSS can do',
      'Third-party scripts audited for their revenue contribution',
    ],
  },
  {
    layer: 'Search foundation',
    body: 'Structured data on every template, a canonical strategy that prevents duplication, internal linking that describes relationships, and content architecture built for topical depth.',
    proof: [
      'Organization, Service, Article, FAQ and Breadcrumb schema',
      'Programmatic sitemap generated from live content',
      'Entity consistency so AI answer engines can resolve the business',
    ],
  },
  {
    layer: 'Conversion',
    body: 'One obvious next action per page. Forms that qualify rather than merely collect. Message match between the ad, the landing page and the offer.',
    proof: [
      'Qualifying fields that a salesperson would actually ask',
      'Deterministic lead scoring on submission',
      'Attribution captured and carried into the CRM record',
    ],
  },
  {
    layer: 'Automation',
    body: 'The part most sites never get. Every enquiry is persisted, scored, notified and forwarded to the CRM or automation platform, with delivery outcomes recorded so a silent failure is visible.',
    proof: [
      'Lead stored first, notified second, so nothing is lost',
      'Generic webhook that fits any CRM or workflow tool',
      'Delivery status written back against each record',
    ],
  },
  {
    layer: 'Ownership',
    body: 'Every account, repository and property stays in the client name. Handover documentation is written during the build rather than reconstructed at the end.',
    proof: [
      'Client owns domain, code, analytics and ad accounts',
      'CMS built for non-technical editing of every page',
      'No proprietary lock-in and no hostage architecture',
    ],
  },
]

export default async function WorkPage() {
  const caseStudies = await getCaseStudies()

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
  ]

  return (
    <>
      <JsonLd nodes={[breadcrumbSchema(crumbs)]} />

      <PageHero
        eyebrow="Work"
        title="We don't just redesign websites. We transform digital experiences."
        description="This page is deliberately about how the work is engineered rather than a wall of logos. Published results here are verified against analytics exports and client sign-off, which means this section grows slowly and on purpose."
        breadcrumbs={crumbs}
      />

      {caseStudies.length > 0 ? (
        <Section>
          <div className="flex flex-col gap-12">
            <Reveal>
              <SectionHeading
                eyebrow="Case studies"
                title="Systems we have built."
                titleClassName="text-display-lg"
              />
            </Reveal>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study, i) => (
                <Reveal key={study.id} delay={i * 60}>
                  <Link
                    href={`/work/${study.slug}`}
                    className="surface-card surface-card-hover flex h-full flex-col gap-4 p-7"
                  >
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-500">
                      {study.client}
                    </span>
                    <h3 className="text-display-sm">{study.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-400">{study.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-brand-400">
                      Read the case study
                      <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section className={caseStudies.length > 0 ? 'border-t border-ink-100/8' : undefined}>
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="Transformation"
              title="What changes between a website and a system."
              titleClassName="text-display-lg"
              description="Drag the handle. The left is the pattern we most often replace. The right is what a site has to be when the buyer compares four options on a phone before they call anyone."
            />
          </Reveal>
          <Reveal delay={80}>
            <BeforeAfterSlider />
          </Reveal>
        </div>
      </Section>

      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="Build anatomy"
              title="Six layers in every project."
              titleClassName="text-display-lg"
              description="This site is built to the same specification. Everything claimed here is verifiable on this page: run it through PageSpeed Insights, read the structured data in the source, or submit the contact form and watch it qualify you."
            />
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            {BUILD_ANATOMY.map((item, i) => (
              <Reveal key={item.layer} delay={i * 50}>
                <div className="surface-card flex h-full flex-col gap-5 p-7">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-display-sm">{item.layer}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-400">{item.body}</p>
                  <ul className="flex flex-col gap-2.5 border-t border-ink-100/8 pt-5">
                    {item.proof.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-ink-300">
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-brand-500"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {caseStudies.length === 0 ? (
        <Section>
          <Reveal>
            <div className="flex flex-col items-start gap-5 rounded-2xl border border-brand-500/20 bg-brand-500/[0.03] p-8 md:p-10">
              <h2 className="text-display-sm">On published results</h2>
              <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-300">
                Detailed client case studies are published here as engagements reach a measurement
                window we can evidence and clients approve being named. We would rather show you
                nothing than show you a number we cannot trace back to an analytics export.
              </p>
              <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-300">
                If you want proof before that, ask on the discovery call. We will walk you through
                live builds, the reporting we produce, and the specific accounts where the work
                shows up. That is a more useful conversation than a percentage on a card.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
              >
                Ask us directly
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
        </Section>
      ) : null}

      <CTASection />
    </>
  )
}
