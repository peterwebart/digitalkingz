import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { PersonAvatar } from '@/components/influencers/PersonAvatar'
import { SocialLinks } from '@/components/influencers/SocialEmbed'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import {
  getPerson,
  isIndexable,
  peopleParams,
  personTerms,
  personTypeLabels,
  primaryType,
  termHref,
} from '@/lib/people'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { absoluteUrl, splitParagraphs } from '@/lib/utils'
import type { Taxonomy } from '@/payload-types'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  return peopleParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const person = await getPerson(slug)
  if (!person) return {}

  return buildMetadata({
    title: person.seo?.metaTitle ?? `${person.name} — ${primaryType(person)}`,
    description:
      person.seo?.metaDescription ?? person.bioShort ?? `${person.name} on the Digital Kingz influencer directory.`,
    path: `/influencers/${person.slug}`,
    // A profile below the completeness threshold is a thin page. It stays
    // reachable for anyone who lands on it, but it is not offered to search.
    noIndex: person.seo?.noIndex ?? !isIndexable(person),
  })
}

function TermList({ label, terms }: { label: string; terms: Taxonomy[] }) {
  if (terms.length === 0) return null
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">{label}</span>
      <ul className="flex flex-wrap gap-1.5">
        {terms.map((term) => (
          <li key={term.id}>
            <Link
              href={termHref(term)}
              className="inline-flex rounded-full border border-ink-100/10 px-3 py-1 text-xs text-ink-300 transition-colors hover:border-brand-500/35 hover:text-ink-50"
            >
              {term.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const person = await getPerson(slug)
  if (!person) notFound()

  const terms = personTerms(person)
  const path = `/influencers/${person.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Influencers', path: '/influencers' },
    { name: person.name, path },
  ]

  // Social profiles come from the CMS. Only entries with a real URL are shown:
  // a handle guessed from a display name would link to a stranger's account.
  const socials = (person.socialProfiles ?? [])
    .map((sp) => ({
      platform:
        typeof sp.platform === 'object' && sp.platform !== null
          ? (sp.platform.title ?? '')
          : String(sp.platform ?? ''),
      handle: sp.handle,
      url: sp.url,
    }))
    .filter((sp) => sp.platform && sp.url)

  const sources = [
    person.officialSourceUrl && { label: 'Official source', url: person.officialSourceUrl },
    person.wikipediaUrl && { label: 'Wikipedia', url: person.wikipediaUrl },
    person.websiteUrl && { label: 'Website', url: person.websiteUrl },
  ].filter(Boolean) as { label: string; url: string }[]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          {
            '@type': 'Person',
            '@id': absoluteUrl(path),
            name: person.name,
            alternateName: person.alternateNames || undefined,
            description: person.bioShort || undefined,
            nationality: person.nationality || undefined,
            jobTitle: terms.professions[0]?.title || undefined,
            knowsLanguage: terms.languages.map((l) => l.title),
            url: absoluteUrl(path),
            sameAs: sources.map((s) => s.url),
          },
        ]}
      />

      <PageHero
        eyebrow={personTypeLabels(person).join(' · ') || 'Person'}
        title={person.name}
        description={person.bioShort ?? undefined}
        breadcrumbs={crumbs}
        aside={
          <div className="surface-card flex flex-col gap-5 p-7">
            <PersonAvatar name={person.name} slug={person.slug} image={person.profileImage} size="lg" />
            <dl className="flex flex-col gap-3 text-sm">
              {terms.countries[0] ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Country</dt>
                  <dd className="text-ink-100">{terms.countries[0].title}</dd>
                </div>
              ) : null}
              {terms.professions[0] ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Profession</dt>
                  <dd className="text-ink-100">{terms.professions[0].title}</dd>
                </div>
              ) : null}
              {person.knownFor ? (
                <div className="flex flex-col gap-1">
                  <dt className="text-ink-500">Known for</dt>
                  <dd className="text-ink-100">{person.knownFor}</dd>
                </div>
              ) : null}
            </dl>
            {socials.length > 0 ? (
              <div className="border-t border-ink-100/8 pt-4">
                <span className="mb-2 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                  Profiles
                </span>
                <SocialLinks profiles={socials} />
              </div>
            ) : null}
            {sources.length > 0 ? (
              <div className="border-t border-ink-100/8 pt-4">
                <span className="mb-2 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                  Sources
                </span>
                <ul className="flex flex-col gap-1.5">
                  {sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                        className="text-sm text-brand-400 hover:text-brand-300"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              // Stated rather than hidden. 672 of 721 imported profiles have no
              // source at all, and pretending otherwise would be the dishonest
              // version of this page.
              <p className="border-t border-ink-100/8 pt-4 text-xs leading-relaxed text-ink-600">
                No public source has been recorded for this profile yet.
              </p>
            )}
          </div>
        }
      />

      {person.bioLong ? (
        <Section>
          <div className="container-prose flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-ink-300">
            {splitParagraphs(person.bioLong).map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lead text-ink-200' : undefined}>
                {p}
              </p>
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="border-y border-ink-100/8 bg-ink-900/40">
        <div className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading eyebrow="Classification" title="Where this profile appears" />
          </Reveal>
          <Reveal delay={60}>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TermList label="Countries" terms={terms.countries} />
              <TermList label="Regions" terms={terms.regions} />
              <TermList label="Industries" terms={terms.industries} />
              <TermList label="Professions" terms={terms.professions} />
              <TermList label="Topics" terms={terms.topics} />
              <TermList label="Sports" terms={terms.sports} />
              <TermList label="Genres" terms={terms.genres} />
              <TermList label="Platforms" terms={terms.platforms} />
              <TermList label="Languages" terms={terms.languages} />
            </div>
          </Reveal>
        </div>
      </Section>

      <CTASection
        heading="Want your profile corrected or claimed?"
        body="Profiles are compiled from public information. If something here is wrong, out of date, or yours to claim, tell us and we will fix it."
      />
    </>
  )
}
