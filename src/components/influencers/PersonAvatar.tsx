import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

/**
 * Portrait, or initials when there is no portrait.
 *
 * The supplied dataset carries no images at all — 0 of 721 rows have a
 * profile_image_url — so an avatar that assumes a photo would render 721 broken
 * frames. The initials fallback is deterministic: the same person always gets
 * the same accent, so the directory looks composed rather than accidental, and
 * a real image takes over automatically once one is uploaded.
 */

const ACCENTS = [
  'bg-brand-500/12 text-brand-300 border-brand-500/25',
  'bg-violet-500/12 text-violet-300 border-violet-500/25',
  'bg-signal-500/12 text-signal-300 border-signal-500/25',
  'bg-emerald-500/12 text-emerald-300 border-emerald-500/25',
  'bg-amber-500/12 text-amber-300 border-amber-500/25',
]

function accentFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return ACCENTS[hash % ACCENTS.length]
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function PersonAvatar({
  name,
  slug,
  image,
  size = 'md',
  className,
}: {
  name: string
  slug: string
  image?: number | Media | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dimensions = { sm: 'size-11 text-sm', md: 'size-16 text-lg', lg: 'size-28 text-3xl' }[size]
  const url = typeof image === 'object' && image !== null ? image.url : null

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        className={cn('rounded-full border border-ink-100/10 object-cover', dimensions, className)}
        loading="lazy"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border font-medium',
        dimensions,
        accentFor(slug),
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  )
}
