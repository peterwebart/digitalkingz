import Link from 'next/link'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { CALCULATORS, CATEGORY_BLURBS, CATEGORY_ORDER, calculatorsByCategory } from '@/lib/calculators'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'

export const revalidate = 86400

const TITLE = 'Marketing & Growth Calculators'
const DESCRIPTION =
  'Free calculators for SEO, paid media, websites, marketing economics and AI search visibility. Every tool shows its formula.'

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: '/tools' })

export default function ToolsPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          { '@type': 'CollectionPage', name: TITLE, description: DESCRIPTION },
        ]}
      />

      <PageHero
        eyebrow="Free tools"
        title={TITLE}
        description={`${CALCULATORS.length} calculators for sizing an opportunity, setting a budget and checking whether the numbers work. Every one shows its formula, because a calculator that hides its working is a lead magnet pretending to be an instrument.`}
        breadcrumbs={crumbs}
      />

      {CATEGORY_ORDER.map((category, index) => {
        const tools = calculatorsByCategory(category)
        return (
          <Section
            key={category}
            className={index % 2 === 1 ? 'border-y border-ink-100/8 bg-ink-900/40' : undefined}
          >
            <div className="flex flex-col gap-8">
              <Reveal>
                <SectionHeading eyebrow={category} title={`${category} tools`} description={CATEGORY_BLURBS[category]} />
              </Reveal>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool, i) => (
                  <li key={tool.slug}>
                    <Reveal delay={Math.min(i, 6) * 40}>
                      <Link href={`/tools/${tool.slug}`} className="surface-card surface-card-hover flex h-full flex-col gap-2 p-6">
                        <span className="text-[0.9375rem] font-medium text-ink-50">{tool.title}</span>
                        <span className="text-sm leading-relaxed text-ink-400">{tool.tagline}</span>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )
      })}

      <CTASection
        heading="Want the version with your actual numbers in it?"
        body="These tools use assumptions. We can run the same models against your analytics, ad accounts and CRM."
      />
    </>
  )
}
