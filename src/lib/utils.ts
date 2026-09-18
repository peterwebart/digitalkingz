import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Content is authored as a single textarea with blank-line separated
 * paragraphs. This keeps the Payload admin pleasant to write in while still
 * rendering semantic <p> elements.
 */
export function splitParagraphs(value?: string | null): string[] {
  if (!value) return []
  return value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function formatDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function isoDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input
  return date.toISOString()
}

/** Rough reading time from a word count, at 225 words per minute. */
export function readingTime(words: number): number {
  return Math.max(1, Math.round(words / 225))
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trimEnd()}…`
}

/** Canonical origin, no trailing slash. */
export function getServerUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SERVER_URL || 'https://digitalkingz.com'
  return raw.replace(/\/$/, '')
}

export function absoluteUrl(path = '/'): string {
  const base = getServerUrl()
  if (!path.startsWith('/')) return `${base}/${path}`
  return `${base}${path}`
}

/**
 * Makes a Payload media URL relative.
 *
 * Payload prefixes uploads with `serverURL`, producing an absolute URL. Next's
 * image optimiser treats any absolute URL as remote and rejects it with a 400
 * unless the host is listed in `images.remotePatterns` — which is the second
 * reason article images were not appearing.
 *
 * Stripping the origin is better than whitelisting the host: it works on any
 * domain without config, and it stops the server making an HTTP request to
 * itself to fetch a file already on its own disk.
 */
export function mediaSrc(url: string): string {
  if (!url) return url
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}
