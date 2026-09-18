import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { PersonAvatar } from '@/components/people/PersonAvatar'
import { AlphabetBar, PeopleSearchForm } from '@/components/people/PeopleSearchForm'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { FILTERS, filterOptions, primaryType, searchPeople, type PeopleQuery } from '@/lib/people'
import { buildMetadata } from '@/lib/seo'

/**
 * Filtered directory results.
 *
 * Deliberately noindex: these are permutations of a query string, and letting a
 * crawler discover thousands of them is how a directory buries its own canonical
 * pages. The pages worth indexing are the profiles and the taxonomy landings,
 * both of which are in the sitemap.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Search the people directory',
    description: 'Search and filter influencers and public figures by name, country, industry, platform, sport and language.',
    path: '/people/search',
    noIndex: true,
  }),
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined

export default async function PeopleSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const query: PeopleQuery = {
    q: first(sp.q),
    type: first(sp.type),
    letter: first(sp.letter)?.slice(0, 1).toUpperCase(),
    page: Number(first(sp.page)) || 1,
    ...Object.fromEntries(FILTERS.map((f) => [f.key, first(sp[f.key as string])])),
  }

  const [result, filters] = await Promise.all([searchPeople(query), filterOptions()])

  const activeLabels = [
    query.q && `“${query.q}”`,
    query.type && (query.type === 'influencer' ? 'Influencers' : 'Public figures'),
    query.letter && `Starting with ${query.letter}`,
    ...FILTERS.map((f) => query[f.key] && `${f.label}: ${query[f.key]}`),
  ].filter(Boolean) as string[]

  /** Preserves the current filters while changing one parameter. */
  const urlWith = (changes: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ ...query, ...changes })) {
      if (v !== undefined && v !== '' && !(k === 'page' && v === 1)) params.set(k, String(v))
    }
    const qs = params.toString()
    return `/people/search${qs ? `?${qs}` : ''}`
  }

  return (
    <>
      <PageHero
        eyebrow="People directory"
        title="Search the directory"
        description={
          activeLabels.length > 0
            ? `${result.totalDocs.toLocaleString()} ${result.totalDocs === 1 ? 'result' : 'results'} · ${activeLabels.join(' · ')}`
            : `${result.totalDocs.toLocaleString()} published profiles.`
        }
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'People', path: '/people' },
          { name: 'Search', path: '/people/search' },
        ]}
      />

      <Section>
        <div className="flex flex-col gap-8">
          <PeopleSearchForm filters={filters} query={query} />
          <AlphabetBar active={query.letter} />

          {result.docs.length === 0 ? (
            <div className="surface-card flex flex-col items-start gap-3 p-8">
              <p className="text-ink-200">Nothing matched those filters.</p>
              <p className="text-sm leading-relaxed text-ink-500">
                Only published profiles are searchable. Most of the directory is still in
                editorial review, so a narrow filter can legitimately return nothing.
              </p>
              <Link href="/people/search" className="text-sm text-brand-400 hover:text-brand-300">
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((person, i) => (
                <Reveal key={person.id} delay={Math.min(i, 8) * 30}>
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
          )}

          {result.totalPages > 1 ? (
            <nav aria-label="Pagination" className="flex items-center justify-between gap-4 border-t border-ink-100/8 pt-6">
              {result.hasPrevPage ? (
                <Link href={urlWith({ page: (query.page ?? 1) - 1 })} className="text-sm text-brand-400 hover:text-brand-300">
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-ink-500">
                Page {result.page} of {result.totalPages}
              </span>
              {result.hasNextPage ? (
                <Link href={urlWith({ page: (query.page ?? 1) + 1 })} className="text-sm text-brand-400 hover:text-brand-300">
                  Next →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </div>
      </Section>
    </>
  )
}
