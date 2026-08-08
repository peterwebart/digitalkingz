import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { FAQSection } from '@/components/sections/FAQ'
import { PageHero } from '@/components/sections/PageHero'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getIndustries, getIndustry, industryParams } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'
import { absoluteUrl, splitParagraphs } from '@/lib/utils'
import type { Service } from '@/payload-types'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return industryParams()
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const industry = await getIndustry(slug)
  if (!industry) return {}

  return buildMetadata({
    title: industry.seo?.metaTitle ?? industry.title,
    description: industry.seo?.metaDescription ?? industry.tagline ?? '',
    path: `/industries/${industry.slug}`,
    noIndex: industry.seo?.noIndex ?? false,
  })
}

export default async function IndustryPage({ params }: Params) {
  const { slug } = await params
  const industry = await getIndustry(slug)
  if (!industry) notFound()

  const services = Array.isArray(industry.relatedServices)
    ? (industry.relatedServices.filter((s) => typeof s === 'object' && s !== null) as Service[])
    : []
  const allIndustries = await getIndustries()

  const path = `/industries/${industry.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries' },
    { name: industry.title, path },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          faqSchema(industry.faqs ?? []),
          {
            '@type': 'WebPage',
            '@id': absoluteUrl(path),
            name: industry.seo?.metaTitle ?? industry.title,
            description: industry.seo?.metaDescription ?? undefined,
            about: {
              '@type': 'Thing',
              name: `${industry.title} digital marketing`,
            },
          },
        ]}
      />

      <PageHero
        eyebrow={industry.hero?.eyebrow}
        title={industry.hero?.heading ?? industry.title}
        description={industry.hero?.subheading}
        breadcrumbs={crumbs}
        aside={
          <div className="surface-card flex flex-col gap-5 p-7">
            <span className="flex size-11 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/[0.08]">
              <Icon name={industry.icon} className="size-5 text-brand-400" />
            </span>
            <p className="text-sm leading-relaxed text-ink-300">{industry.tagline}</p>
            {services.length > 0 ? (
              <div className="border-t border-ink-100/8 pt-5">
                <span className="mb-3 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                  Typical stack
                </span>
                <ul className="flex flex-wrap gap-1.5">
                  {services.slice(0, 6).map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="inline-flex rounded-full border border-ink-100/10 px-2.5 py-1 text-xs text-ink-400 transition-colors hover:border-brand-500/30 hover:text-ink-100"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <Link
              href="/contact"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
            >
              Discuss your practice
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        }
      />

      <Section>
        <div className="container-prose flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-300">
          {splitParagraphs(industry.intro).map((p, i) => (
            <p key={i} className={i === 0 ? 'text-lead text-ink-200' : undefined}>
              {p}
            </p>
          ))}
        </div>
      </Section>

      {/* --- Challenges --------------------------------------------------- */}
      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="What breaks"
              title={industry.challengesHeading}
              description={industry.challengesIntro}
            />
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-100/8 md:grid-cols-2">
            {(industry.challenges ?? []).map((item, i) => (
              <Reveal key={item.id} delay={i * 50}>
                <div className="flex h-full flex-col gap-3 bg-ink-950 p-7">
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium leading-snug text-ink-50">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-400">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --- Buyer behaviour ---------------------------------------------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading eyebrow="How they buy" title={industry.buyerBehaviourHeading} />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={60}>
              <div className="flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-300">
                {splitParagraphs(industry.buyerBehaviour).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* --- The system --------------------------------------------------- */}
      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-12">
          <Reveal>
            <SectionHeading
              eyebrow="The system"
              title={industry.systemHeading}
              description={industry.systemIntro}
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(industry.system ?? []).map((item, i) => (
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

      {/* --- Long form ---------------------------------------------------- */}
      <Section>
        <div className="container-prose flex flex-col gap-14">
          {(industry.deepDive ?? []).map((block, i) => (
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
        faqs={industry.faqs ?? []}
        eyebrow="FAQ"
        title={`${industry.title}: common questions`}
      />

      {/* --- Linking ------------------------------------------------------ */}
      <Section className="border-t border-ink-100/8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {services.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-display-sm">Services for {industry.title.toLowerCase()}</h2>
              <ul className="flex flex-col divide-y divide-ink-100/8 border-y border-ink-100/8">
                {services.map((item) => (
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

          <div className="flex flex-col gap-6">
            <h2 className="text-display-sm">Other industries</h2>
            <ul className="grid grid-cols-2 gap-2">
              {allIndustries
                .filter((i) => i.slug !== industry.slug)
                .map((item) => (
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
        </div>
      </Section>

      <CTASection heading={industry.cta?.heading} body={industry.cta?.body} />
    </>
  )
}
