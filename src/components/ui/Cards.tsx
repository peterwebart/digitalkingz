import Image from 'next/image'
import { mediaSrc } from '@/lib/utils'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { cn, formatDate } from '@/lib/utils'

export function ServiceCard({
  href,
  title,
  tagline,
  icon,
  className,
}: {
  href: string
  title: string
  tagline?: string | null
  icon?: string | null
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'surface-card surface-card-hover group flex flex-col gap-4 p-6 md:p-7',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-xl border border-ink-100/10 bg-ink-100/[0.03] transition-colors duration-300 group-hover:border-brand-500/30 group-hover:bg-brand-500/[0.08]">
          <Icon name={icon} className="size-5 text-ink-300 transition-colors group-hover:text-brand-400" />
        </span>
        <ArrowUpRight
          className="size-4 text-ink-600 transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-400"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[1.0625rem] font-medium text-ink-50">{title}</h3>
        {tagline ? (
          <p className="text-sm leading-relaxed text-ink-400">{tagline}</p>
        ) : null}
      </div>
    </Link>
  )
}

export function IndustryCard({
  href,
  title,
  tagline,
  icon,
}: {
  href: string
  title: string
  tagline?: string | null
  icon?: string | null
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-900 p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-brand-500/25 hover:bg-ink-850"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-brand-500/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-500/10"
      />
      <Icon
        name={icon}
        className="relative size-6 text-ink-500 transition-colors duration-300 group-hover:text-brand-400"
      />
      <div className="relative flex flex-col gap-2">
        <h3 className="text-[1.0625rem] font-medium text-ink-50">{title}</h3>
        {tagline ? <p className="text-sm leading-relaxed text-ink-400">{tagline}</p> : null}
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explore
          <ArrowUpRight className="size-3" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export function ArticleCard({
  href,
  title,
  excerpt,
  category,
  publishedAt,
  readingMinutes,
  featured = false,
  compact = false,
  image,
}: {
  href: string
  title: string
  excerpt?: string | null
  category?: string | null
  publishedAt?: string | null
  readingMinutes?: number | null
  featured?: boolean
  compact?: boolean
  /** The article's hero image, if it has one. */
  image?: { url?: string | null; alt?: string | null } | number | null
}) {
  const thumb = typeof image === 'object' && image?.url ? image : null
  return (
    <article
      className={cn(
        'group relative flex flex-col',
        featured && 'md:col-span-2 md:flex-row md:items-stretch',
      )}
    >
      <Link href={href} className="flex flex-1 flex-col gap-5">
        <div
          className={cn(
            'relative flex items-end overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-900 p-6 transition-colors duration-500 group-hover:border-brand-500/25',
            featured ? 'aspect-[2/1] md:aspect-[16/7]' : compact ? 'aspect-[16/9]' : 'aspect-[16/10]',
          )}
        >
          {thumb ? (
            // Anchored to the top, where each infographic carries its title,
            // so the thumbnail shows the recognisable part rather than a slice
            // from the middle of a tall portrait image.
            // The infographics are portrait (about 2:3) and the card is landscape,
            // so object-cover cropped away everything below the title. The full
            // image is now contained, over a blurred copy of itself so the box
            // is filled rather than letterboxed in empty space.
            <>
              <Image
                src={mediaSrc(thumb.url as string)}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="scale-125 object-cover opacity-35 blur-2xl"
              />
              <Image
                src={mediaSrc(thumb.url as string)}
                alt={thumb.alt ?? ''}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </>
          ) : (
            <div
              aria-hidden="true"
              className="bg-grid absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-80"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-brand-600/10 blur-[80px] transition-all duration-700 group-hover:bg-brand-500/16"
          />
          {category ? (
            <span className="relative rounded-full border border-ink-100/12 bg-ink-950/70 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-400 backdrop-blur-sm">
              {category}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <h3
            className={cn(
              'font-semibold leading-snug tracking-tight text-ink-50 transition-colors duration-300 group-hover:text-brand-200',
              featured ? 'text-2xl md:text-[1.75rem]' : compact ? 'text-[0.9375rem]' : 'text-lg',
            )}
          >
            {title}
          </h3>
          {excerpt && !compact ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-ink-400">{excerpt}</p>
          ) : null}
          <div className="mt-1 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-600">
            {publishedAt ? <time dateTime={publishedAt}>{formatDate(publishedAt)}</time> : null}
            {readingMinutes ? (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{readingMinutes} min read</span>
              </>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  )
}

export function StatCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3 border-l border-ink-100/10 pl-5">
      <span className="font-mono text-eyebrow uppercase text-brand-500">{label}</span>
      <span className="text-display-sm text-ink-50">{value}</span>
      <p className="text-sm leading-relaxed text-ink-400">{description}</p>
    </div>
  )
}
