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
