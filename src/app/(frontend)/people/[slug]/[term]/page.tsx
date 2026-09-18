import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { PersonAvatar } from '@/components/people/PersonAvatar'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import {
  SEGMENT_TO_TYPE,
  TYPE_NOUNS,
  getPeopleByTerm,
  getTerm,
  getTerms,
  isTermIndexable,
  primaryType,
  termHref,
  termParams,
} from '@/lib/people'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/utils'
import type { TaxonomyType } from '@/collections/Taxonomies'

/**
 * Every taxonomy landing page — country, industry, sport, platform, topic,
 * genre, profession, language, person type — is served from this one route.
 *
 * That is the whole reason the taxonomy collection carries a `type`
 * discriminator instead of being nine separate collections: nine landing-page
 * templates would drift apart, and eight of them would end up worse than the
 * one somebody was paying attention to.
 */

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  return (await termParams()).map((p) => ({ slug: p.segment, term: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; term: string }>
}): Promise<Metadata> {
  const { slug: segment, term: slug } = await params
  const term = await getTerm(segment, slug)
  if (!term) return {}

  const noun = TYPE_NOUNS[term.type as TaxonomyType] ?? 'category'
  const count = term.personCount ?? 0

  return buildMetadata({
    title: `${term.title} — Influencers & Public Figures`,
    description:
      term.description ??
      `Browse ${count} ${count === 1 ? 'profile' : 'profiles'} in the Digital Kingz people directory for the ${term.title} ${noun}.`,
    path: `/people/${segment}/${slug}`,
    // A term holding two people is a thin page no matter how it is worded.
    noIndex: !isTermIndexable(term),
  })
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ slug: string; term: string }>
}) {
  const { slug: segment, term: slug } = await params
  const type = SEGMENT_TO_TYPE[segment]
  if (!type) notFound()

  const term = await getTerm(segment, slug)
  if (!term) notFound()

  const [result, siblings] = await Promise.all([
    getPeopleByTerm(term),
    getTerms(type, 5),
  ])

  const noun = TYPE_NOUNS[type] ?? 'category'
  const path = `/people/${segment}/${slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'People', path: '/people' },
    { name: term.title, path },
  ]

  const others = siblings.filter((s) => s.id !== term.id).slice(0, 12)

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          {
            '@type': 'CollectionPage',
            '@id': absoluteUrl(path),
            name: `${term.title} influencers and public figures`,
            description: term.description ?? undefined,
            url: absoluteUrl(path),
          },
        ]}
      />

      <PageHero
        eyebrow={`People by ${noun}`}
        title={term.title}
        description={
          term.description ??
          `People in the directory associated with the ${term.title} ${noun}.`
        }
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="Profiles"
              title={`${result.totalDocs} ${result.totalDocs === 1 ? 'person' : 'people'}`}
              description={
                result.totalDocs === 0
                  ? 'No published profiles carry this term yet. Imported profiles stay in draft until an editor reviews them.'
                  : undefined
              }
            />
          </Reveal>

          {result.docs.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((person, i) => (
                <Reveal key={person.id} delay={Math.min(i, 8) * 40}>
                  <Link
                    href={`/people/${person.slug}`}
                    className="surface-card surface-card-hover flex h-full items-start gap-4 p-5"
                  >
                    <PersonAvatar name={person.name} slug={person.slug} image={person.profileImage} />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="truncate text-[0.9375rem] font-medium text-ink-50">{person.name}</span>
                      <span className="text-xs text-ink-500">{primaryType(person)}</span>
                      {person.bioShort ? (
                        <span className="line-clamp-2 text-sm leading-relaxed text-ink-400">{person.bioShort}</span>
                      ) : null}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </Section>

      {others.length > 0 ? (
        <Section className="border-y border-ink-100/8 bg-ink-900/40">
          <div className="flex flex-col gap-8">
            <Reveal>
              <SectionHeading eyebrow="Keep exploring" title={`Other ${noun} pages`} />
            </Reveal>
            <Reveal delay={60}>
              <ul className="flex flex-wrap gap-2">
                {others.map((other) => (
                  <li key={other.id}>
                    <Link
                      href={termHref(other)}
                      className="inline-flex items-center gap-2 rounded-full border border-ink-100/10 px-3.5 py-1.5 text-sm text-ink-300 transition-colors hover:border-brand-500/35 hover:text-ink-50"
                    >
                      {other.title}
                      <span className="text-xs text-ink-600">{other.personCount}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <CTASection
        heading="Should someone be listed here?"
        body="Tell us who is missing. We verify against public sources before anything is published."
      />
    </>
  )
}
