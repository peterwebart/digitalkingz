import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { CalculatorForm } from '@/components/tools/CalculatorForm'
import { Section } from '@/components/ui/Section'
import { CALCULATORS, calculatorsByCategory, getCalculator } from '@/lib/calculators'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/utils'

export const revalidate = 86400

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const calculator = getCalculator(slug)
  if (!calculator) return {}
  return buildMetadata({
    title: calculator.title,
    description: calculator.description,
    path: `/tools/${calculator.slug}`,
  })
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const calculator = getCalculator(slug)
  if (!calculator) notFound()

  const path = `/tools/${calculator.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: calculator.title, path },
  ]
  const siblings = calculatorsByCategory(calculator.category).filter((c) => c.slug !== calculator.slug)

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          {
            '@type': 'WebApplication',
            '@id': absoluteUrl(path),
            name: calculator.title,
            description: calculator.description,
            url: absoluteUrl(path),
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        ]}
      />

      <PageHero
        eyebrow={`${calculator.category} tool`}
        title={calculator.title}
        description={calculator.tagline}
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="flex flex-col gap-8">
          <p className="max-w-prose text-[1.0625rem] leading-relaxed text-ink-300">{calculator.description}</p>
          <CalculatorForm slug={calculator.slug} />

          {calculator.notes?.length ? (
            <div className="rounded-xl border border-ink-100/8 bg-ink-900/40 p-6">
              <h2 className="mb-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                Worth knowing
              </h2>
              <ul className="flex flex-col gap-2">
                {calculator.notes.map((note) => (
                  <li key={note} className="text-sm leading-relaxed text-ink-400">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {siblings.length > 0 ? (
        <Section className="border-y border-ink-100/8 bg-ink-900/40">
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-medium text-ink-100">Other {calculator.category} tools</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/tools/${tool.slug}`} className="surface-card surface-card-hover flex h-full flex-col gap-1.5 p-5">
                    <span className="text-[0.9375rem] font-medium text-ink-50">{tool.title}</span>
                    <span className="text-sm leading-relaxed text-ink-400">{tool.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <CTASection
        heading="Numbers look promising?"
        body="A calculator tells you what is possible. Getting there is the work. Tell us what you are trying to hit and we will tell you what it takes."
      />
    </>
  )
}
