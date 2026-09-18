import Link from 'next/link'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { PersonAvatar } from '@/components/influencers/PersonAvatar'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { AlphabetBar, PeopleSearchForm } from '@/components/influencers/PeopleSearchForm'
import { filterOptions, getPeople, getTerms, primaryType, termHref } from '@/lib/people'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import type { Taxonomy } from '@/payload-types'

export const revalidate = 900

const TITLE = 'Influencer Directory'
const DESCRIPTION =
  'A global directory of influencers and public figures, browsable by country, industry, profession, sport, platform and topic.'

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/influencers',
})

function TermGrid({ heading, terms }: { heading: string; terms: Taxonomy[] }) {
  if (terms.length === 0) return null
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-ink-100">{heading}</h3>
      <ul className="flex flex-wrap gap-2">
        {terms.slice(0, 16).map((term) => (
          <li key={term.id}>
            <Link
              href={termHref(term)}
              className="inline-flex items-center gap-2 rounded-full border border-ink-100/10 px-3.5 py-1.5 text-sm text-ink-300 transition-colors hover:border-brand-500/35 hover:text-ink-50"
            >
              {term.title}
              <span className="text-xs text-ink-600">{term.personCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function PeoplePage() {
  const [people, countries, industries, professions, sports, filters] = await Promise.all([
    getPeople({ limit: 36 }),
    getTerms('country'),
    getTerms('industry'),
    getTerms('profession'),
    getTerms('sport'),
    filterOptions(),
  ])

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Influencers', path: '/influencers' },
  ]

  return (
    <>
      <JsonLd nodes={[breadcrumbSchema(crumbs), { '@type': 'CollectionPage', name: TITLE, description: DESCRIPTION }]} />

      <PageHero
        eyebrow="Digital Kingz Influencers"
        title="Discover the influencers shaping the world"
        description={DESCRIPTION}
        breadcrumbs={crumbs}
      />

      <Section>
        <div className="flex flex-col gap-10">
          <Reveal>
            <PeopleSearchForm filters={filters} />
          </Reveal>
          <Reveal delay={40}>
            <AlphabetBar />
          </Reveal>
          <Reveal>
            <SectionHeading eyebrow="Browse" title="Find influencers by category" />
          </Reveal>
          <Reveal delay={60}>
            <div className="flex flex-col gap-9">
              <TermGrid heading="By country" terms={countries} />
              <TermGrid heading="By industry" terms={industries} />
              <TermGrid heading="By profession" terms={professions} />
              <TermGrid heading="By sport" terms={sports} />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="Profiles"
              title="Influencers in the directory"
              description={
                people.totalDocs > 0
                  ? `${people.totalDocs.toLocaleString()} published profiles.`
                  : 'No profiles have been published yet. Imported profiles stay in draft until an editor reviews them.'
              }
            />
          </Reveal>

          {people.docs.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {people.docs.map((person, i) => (
                <Reveal key={person.id} delay={Math.min(i, 8) * 40}>
                  <Link
                    href={`/influencers/${person.slug}`}
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

      <CTASection
        heading="Should someone be in this directory?"
        body="Tell us who is missing. We verify against public sources before anything is published."
      />
    </>
  )
}
