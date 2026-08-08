import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowUpRight, Check } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { caseStudyParams, getCaseStudy } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { absoluteUrl, splitParagraphs } from '@/lib/utils'
import type { Industry, Service, Testimonial } from '@/payload-types'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return caseStudyParams()
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) return {}

  return buildMetadata({
    title: study.seo?.metaTitle ?? study.title,
    description: study.seo?.metaDescription ?? study.summary ?? '',
    path: `/work/${study.slug}`,
    noIndex: study.seo?.noIndex ?? false,
  })
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) notFound()

  const services = Array.isArray(study.services)
    ? (study.services.filter((s) => typeof s === 'object' && s !== null) as Service[])
    : []
  const industry = typeof study.industry === 'object' ? (study.industry as Industry) : null
  const testimonial =
    typeof study.testimonial === 'object' ? (study.testimonial as Testimonial) : null

  const path = `/work/${study.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: study.title, path },
  ]

  const SECTIONS = [
    { heading: 'The challenge', content: study.challenge },
    { heading: 'The strategy', content: study.strategy },
    { heading: 'Execution', content: study.execution },
  ].filter((s) => Boolean(s.content))

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          {
            '@type': 'Article',
            '@id': `${absoluteUrl(path)}#case-study`,
            headline: study.title,
            description: study.summary,
            url: absoluteUrl(path),
            datePublished: study.createdAt,
            dateModified: study.updatedAt,
            about: study.client,
          },
        ]}
      />

      <PageHero
        eyebrow={study.client}
        title={study.title}
        description={study.summary}
        breadcrumbs={crumbs}
        aside={
          <div className="surface-card flex flex-col gap-5 p-7">
            {industry ? (
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                  Industry
                </span>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="inline-flex w-fit items-center gap-2 text-sm text-ink-100 hover:text-brand-400"
                >
                  <Icon name={industry.icon} className="size-4 text-brand-500" />
                  {industry.title}
                </Link>
              </div>
            ) : null}

            {services.length > 0 ? (
              <div className="flex flex-col gap-2 border-t border-ink-100/8 pt-5">
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                  Services
                </span>
                <ul className="flex flex-wrap gap-1.5">
                  {services.map((s) => (
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

            {(study.technologies ?? []).length > 0 ? (
              <div className="flex flex-col gap-2 border-t border-ink-100/8 pt-5">
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                  Technology
                </span>
                <p className="text-sm text-ink-300">
                  {(study.technologies ?? []).map((t) => t.name).join(', ')}
                </p>
              </div>
            ) : null}

            {study.liveUrl ? (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-100/12 text-sm font-medium text-ink-100 transition-colors hover:border-brand-500/40"
              >
                Visit the live site
                <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden="true" />
              </a>
            ) : null}
          </div>
        }
      />

      {(study.results ?? []).length > 0 ? (
        <Section className="border-b border-ink-100/8">
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="Verified results" title="What changed" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(study.results ?? []).map((result) => (
                <div key={result.id} className="surface-card flex flex-col gap-2 p-6">
                  <span className="text-display-sm text-gradient-brand w-fit">{result.value}</span>
                  <span className="text-sm font-medium text-ink-100">{result.metric}</span>
                  <span className="text-xs text-ink-500">{result.period}</span>
                  <span className="mt-2 border-t border-ink-100/8 pt-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-600">
                    Source: {result.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section>
        <div className="container-prose flex flex-col gap-14">
          {SECTIONS.map((section, i) => (
            <Reveal key={section.heading} delay={i * 40}>
              <article className="flex flex-col gap-5">
                <h2 className="text-display-md">{section.heading}</h2>
                <div className="flex flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-300">
                  {splitParagraphs(section.content).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}

          {(study.deliverables ?? []).length > 0 ? (
            <Reveal>
              <div className="flex flex-col gap-6">
                <h2 className="text-display-md">What we delivered</h2>
                <ul className="flex flex-col gap-4">
                  {(study.deliverables ?? []).map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <Check
                        className="mt-1 size-4 shrink-0 text-brand-500"
                        strokeWidth={2.25}
                        aria-hidden="true"
                      />
                      <span className="flex flex-col gap-1">
                        <span className="font-medium text-ink-100">{item.title}</span>
                        <span className="text-[0.9375rem] leading-relaxed text-ink-400">
                          {item.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}

          {testimonial ? (
            <Reveal>
              <blockquote className="flex flex-col gap-5 rounded-2xl border border-brand-500/20 bg-brand-500/[0.03] p-8">
                <p className="text-lead text-ink-100">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="text-sm text-ink-400">
                  <span className="font-medium text-ink-200">{testimonial.author}</span>
                  {', '}
                  {testimonial.role}, {testimonial.company}
                </footer>
              </blockquote>
            </Reveal>
          ) : null}
        </div>
      </Section>

      <CTASection />
    </>
  )
}
