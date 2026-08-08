import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import { ChainStrip, GROWTH_CHAIN } from '@/components/EcosystemDiagram'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQ'
import { PageHero } from '@/components/sections/PageHero'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getService, getServices, serviceParams } from '@/lib/payload'
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  serviceSchema,
} from '@/lib/seo'
import { splitParagraphs } from '@/lib/utils'
import type { Industry, Service } from '@/payload-types'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return serviceParams()
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}

  return buildMetadata({
    title: service.seo?.metaTitle ?? service.title,
    description: service.seo?.metaDescription ?? service.tagline ?? '',
    path: `/services/${service.slug}`,
    noIndex: service.seo?.noIndex ?? false,
  })
}

const rel = <T extends { id: number | string }>(value: unknown): T[] =>
  Array.isArray(value) ? (value.filter((v) => typeof v === 'object' && v !== null) as T[]) : []

export default async function ServicePage({ params }: Params) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const relatedServices = rel<Service>(service.relatedServices)
  const relatedIndustries = rel<Industry>(service.relatedIndustries)
  const allServices = await getServices()

  const path = `/services/${service.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.title, path },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          serviceSchema({
            name: service.title,
            description: service.seo?.metaDescription ?? service.tagline ?? '',
            path,
            category: service.category,
          }),
          breadcrumbSchema(crumbs),
          faqSchema(service.faqs ?? []),
        ]}
      />

      <PageHero
        eyebrow={service.hero?.eyebrow}
        title={service.hero?.heading ?? service.title}
        description={service.hero?.subheading}
        breadcrumbs={crumbs}
        aside={
          <div className="surface-card flex flex-col gap-5 p-7">
            <span className="flex size-11 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/[0.08]">
              <Icon name={service.icon} className="size-5 text-brand-400" />
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                Where this sits
              </span>
              <p className="text-sm leading-relaxed text-ink-300">
                {service.tagline}
              </p>
            </div>
            <div className="border-t border-ink-100/8 pt-5">
              <span className="mb-3 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                In the system
              </span>
              <ChainStrip items={GROWTH_CHAIN.slice(0, 6)} />
            </div>
            <Link
              href="/contact"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
            >
              Start a project
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        }
      />

      {/* --- Intro -------------------------------------------------------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-300">
                {splitParagraphs(service.intro).map((p, i) => (
                  <p key={i} className={i === 0 ? 'text-lead text-ink-200' : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={80}>
              <div className="flex flex-col gap-5 rounded-2xl border border-ink-100/8 bg-ink-100/[0.02] p-7">
                <h2 className="text-display-sm">{service.outcomesHeading}</h2>
                <p className="text-sm leading-relaxed text-ink-400">{service.outcomesIntro}</p>
                <ul className="flex flex-col gap-4 border-t border-ink-100/8 pt-5">
                  {(service.outcomes ?? []).map((outcome) => (
                    <li key={outcome.id} className="flex flex-col gap-1">
                      <span className="flex items-start gap-2.5 text-sm font-medium text-ink-100">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-brand-500"
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                        {outcome.title}
                      </span>
                      <span className="pl-[1.625rem] text-sm leading-relaxed text-ink-400">
                        {outcome.body}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* --- Problems ----------------------------------------------------- */}
      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading eyebrow="The problem" title={service.problemsHeading} />
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-100/8 md:grid-cols-2">
            {(service.problems ?? []).map((problem, i) => (
              <Reveal key={problem.id} delay={i * 50}>
                <div className="flex h-full flex-col gap-3 bg-ink-950 p-7">
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium leading-snug text-ink-50">
                    {problem.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-400">{problem.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --- What's included ---------------------------------------------- */}
      <Section>
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="Scope"
              title={service.includedHeading}
              description={service.includedIntro}
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(service.included ?? []).map((item, i) => (
              <Reveal key={item.id} delay={i * 40}>
                <div className="surface-card surface-card-hover flex h-full flex-col gap-2.5 p-6">
                  <h3 className="text-[0.9375rem] font-medium text-ink-50">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-400">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --- Approach ----------------------------------------------------- */}
      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading eyebrow="How we work" title={service.approachHeading} />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <ol className="flex flex-col divide-y divide-ink-100/8">
              {(service.approach ?? []).map((step, i) => (
                <Reveal key={step.id} delay={i * 50} as="li">
                  <div className="flex gap-6 py-7">
                    <span className="font-mono text-sm text-brand-600">{step.step}</span>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-display-sm">{step.title}</h3>
                      <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-400">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* --- Long form ---------------------------------------------------- */}
      <Section>
        <div className="container-prose flex flex-col gap-14">
          {(service.deepDive ?? []).map((block, i) => (
            <Reveal key={block.id} delay={i * 40}>
              <article className="flex flex-col gap-5">
                <h2 className="text-display-md">{block.heading}</h2>
                <div className="flex flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-300">
                  {splitParagraphs(block.paragraphs).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <FAQSection
        faqs={service.faqs ?? []}
        eyebrow="FAQ"
        title={`${service.title} questions, answered`}
        description="The questions we get asked before every engagement of this type."
      />

      {/* --- Internal linking --------------------------------------------- */}
      <Section className="border-t border-ink-100/8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {relatedServices.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-display-sm">Works well with</h2>
              <ul className="flex flex-col divide-y divide-ink-100/8 border-y border-ink-100/8">
                {relatedServices.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="group flex items-center justify-between gap-6 py-4"
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          name={item.icon}
                          className="size-4 text-ink-500 transition-colors group-hover:text-brand-400"
                        />
                        <span className="text-[0.9375rem] text-ink-200 transition-colors group-hover:text-ink-50">
                          {item.title}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 text-ink-700 transition-all group-hover:translate-x-0.5 group-hover:text-brand-400"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {relatedIndustries.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-display-sm">Built for</h2>
              <ul className="grid grid-cols-2 gap-2">
                {relatedIndustries.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/industries/${item.slug}`}
                      className="group flex items-center gap-2.5 rounded-xl border border-ink-100/8 px-4 py-3 transition-colors hover:border-brand-500/30"
                    >
                      <Icon
                        name={item.icon}
                        className="size-4 text-ink-500 transition-colors group-hover:text-brand-400"
                      />
                      <span className="text-sm text-ink-200">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-14 flex flex-col gap-5">
          <h2 className="font-mono text-eyebrow uppercase text-ink-500">All services</h2>
          <ul className="flex flex-wrap gap-2">
            {allServices
              .filter((s) => s.slug !== service.slug)
              .map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex rounded-full border border-ink-100/8 px-3.5 py-1.5 text-xs text-ink-400 transition-colors hover:border-brand-500/30 hover:text-ink-100"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </Section>

      <CTASection heading={service.cta?.heading} body={service.cta?.body} />
    </>
  )
}
