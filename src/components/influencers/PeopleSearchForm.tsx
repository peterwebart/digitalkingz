import Link from 'next/link'
import { ALPHABET, type PeopleQuery } from '@/lib/people'
import type { Taxonomy } from '@/payload-types'

/**
 * Search and filters as a plain GET form.
 *
 * No client runtime, no state, no hydration: submitting navigates to
 * /influencers/search with the values in the query string. That makes every filtered
 * view a real URL — shareable, bookmarkable, crawlable and cacheable — which
 * matters more for a directory than a fractionally smoother interaction would.
 */

type FilterGroup = { key: string; label: string; options: Taxonomy[] }

export function PeopleSearchForm({
  filters,
  query = {},
  compact = false,
}: {
  filters: FilterGroup[]
  query?: PeopleQuery
  compact?: boolean
}) {
  const value = (key: string) => (query as Record<string, unknown>)[key]

  return (
    <form action="/influencers/search" method="GET" className="surface-card flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="people-q">
          Search influencers
        </label>
        <input
          id="people-q"
          name="q"
          type="search"
          defaultValue={query.q ?? ''}
          placeholder="Search influencers, usernames, industries…"
          className="flex-1 rounded-lg border border-ink-100/12 bg-ink-950/50 px-4 py-2.5 text-sm text-ink-100 outline-none placeholder:text-ink-600 focus-visible:border-brand-500/50"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
        >
          Search
        </button>
      </div>

      {!compact ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="people-type" className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
              Type
            </label>
            <select
              id="people-type"
              name="type"
              defaultValue={query.type ?? ''}
              className="rounded-lg border border-ink-100/12 bg-ink-950/50 px-3 py-2 text-sm text-ink-100 outline-none focus-visible:border-brand-500/50"
            >
              <option value="">All types</option>
              <option value="influencer">Influencers</option>
              <option value="public-figure">Public figures</option>
            </select>
          </div>

          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-1.5">
              <label
                htmlFor={`people-${filter.key}`}
                className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500"
              >
                {filter.label}
              </label>
              <select
                id={`people-${filter.key}`}
                name={filter.key}
                defaultValue={(value(filter.key) as string) ?? ''}
                className="rounded-lg border border-ink-100/12 bg-ink-950/50 px-3 py-2 text-sm text-ink-100 outline-none focus-visible:border-brand-500/50"
              >
                <option value="">All {filter.label.toLowerCase()}s</option>
                {filter.options.map((option) => (
                  <option key={option.id} value={option.slug}>
                    {option.title} ({option.personCount})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : null}
    </form>
  )
}

/** A–Z browse. Plain links, so every letter is its own crawlable URL. */
export function AlphabetBar({ active }: { active?: string }) {
  return (
    <nav aria-label="Browse influencers by first letter" className="flex flex-wrap gap-1.5">
      {ALPHABET.map((letter) => {
        const selected = active?.toUpperCase() === letter
        return (
          <Link
            key={letter}
            href={`/influencers/search?letter=${letter}`}
            aria-current={selected ? 'page' : undefined}
            className={
              selected
                ? 'flex size-9 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 text-sm text-brand-300'
                : 'flex size-9 items-center justify-center rounded-lg border border-ink-100/10 text-sm text-ink-400 transition-colors hover:border-brand-500/35 hover:text-ink-50'
            }
          >
            {letter}
          </Link>
        )
      })}
    </nav>
  )
}
