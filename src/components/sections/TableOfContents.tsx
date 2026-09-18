import type { Heading } from '@/lib/toc'

/**
 * Table of contents.
 *
 * No JavaScript: a `<details>` element on mobile and a plain sticky list on
 * desktop. Native disclosure is keyboard accessible and announced correctly by
 * screen readers without a library, which matters more here than an animated
 * accordion would.
 */
export function TableOfContents({
  headings,
  variant,
}: {
  headings: Heading[]
  /** 'mobile' renders the disclosure, 'desktop' the sticky column. */
  variant: 'mobile' | 'desktop'
}) {
  // Two or three headings is a list, not a contents page.
  if (headings.length < 4) return null

  const items = (
    <ol className="flex flex-col gap-2 border-l border-ink-100/10">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? 'pl-7' : 'pl-4'}>
          <a
            href={`#${h.id}`}
            className={
              h.level === 3
                ? 'block text-[0.8125rem] leading-snug text-ink-500 transition-colors hover:text-ink-200'
                : 'block text-sm leading-snug text-ink-300 transition-colors hover:text-ink-50'
            }
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  )

  if (variant === 'mobile') {
    // Collapsed by default so it never eats the first screen.
    return (
      <details className="group mb-10 rounded-xl border border-ink-100/10 p-5 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-medium text-ink-100 marker:content-none">
          <span className="flex items-center justify-between gap-4">
            On this page
            <span className="text-xs text-ink-500 group-open:hidden">
              {headings.length} sections
            </span>
          </span>
        </summary>
        <nav aria-label="On this page" className="mt-4">
          {items}
        </nav>
      </details>
    )
  }

  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto"
    >
      <p className="mb-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
        On this page
      </p>
      {items}
    </nav>
  )
}
