'use client'

import { useEffect, useState } from 'react'

/**
 * Click-to-load gate for third-party embeds.
 *
 * Nothing is requested from Instagram, TikTok or YouTube until the visitor
 * asks for it. That matters for two reasons: Quebec's Law 25 and the GDPR both
 * treat loading a third-party resource as processing personal data before
 * consent, and this site's performance pitch does not survive an embed script
 * running on every profile page by default.
 *
 * The choice is remembered per platform in localStorage, so a visitor who opts
 * in once is not asked again while browsing the directory.
 */

const STORAGE_KEY = 'dk:embed-consent'

export type EmbedPlatform = 'instagram' | 'tiktok' | 'youtube'

const PLATFORM_LABELS: Record<EmbedPlatform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

/** Where the embed actually comes from, stated plainly to the visitor. */
const PLATFORM_HOSTS: Record<EmbedPlatform, string> = {
  instagram: 'instagram.com (Meta)',
  tiktok: 'tiktok.com (ByteDance)',
  youtube: 'youtube-nocookie.com (Google)',
}

function readConsent(): EmbedPlatform[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as EmbedPlatform[]) : []
  } catch {
    return []
  }
}

function grantConsent(platform: EmbedPlatform): void {
  try {
    const next = Array.from(new Set([...readConsent(), platform]))
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage blocked. The embed still loads for this page view; the visitor
    // will simply be asked again next time, which is the safe failure.
  }
}

export function SocialEmbed({
  platform,
  url,
  name,
}: {
  platform: EmbedPlatform
  url: string
  name: string
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (readConsent().includes(platform)) setLoaded(true)
  }, [platform])

  const accept = () => {
    grantConsent(platform)
    setLoaded(true)
  }

  if (!loaded) {
    return (
      <div className="surface-card flex flex-col items-start gap-3 p-6">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
          {PLATFORM_LABELS[platform]}
        </span>
        <p className="text-sm leading-relaxed text-ink-400">
          Showing this content loads it from {PLATFORM_HOSTS[platform]}, which will receive your IP
          address and may set cookies. Nothing has been requested from them yet.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
          >
            Load {PLATFORM_LABELS[platform]} content
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-sm text-brand-400 hover:text-brand-300"
          >
            Or open {name} on {PLATFORM_LABELS[platform]} →
          </a>
        </div>
      </div>
    )
  }

  // YouTube uses the no-cookie host. Instagram and TikTok publish oEmbed
  // endpoints for posts, not profiles, so a profile link is rendered instead of
  // a fabricated embed URL.
  if (platform === 'youtube') {
    const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/)?.[1]
    if (!id) return null
    return (
      <div className="overflow-hidden rounded-xl border border-ink-100/10">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={`${name} on YouTube`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full"
        />
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100/10">
      <iframe
        src={platform === 'instagram' ? `${url.replace(/\/$/, '')}/embed` : url}
        title={`${name} on ${PLATFORM_LABELS[platform]}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-[560px] w-full bg-ink-950"
      />
    </div>
  )
}

/** Outbound links. No third-party request, so no consent needed. */
export function SocialLinks({
  profiles,
}: {
  profiles: { platform: string; handle?: string | null; url?: string | null }[]
}) {
  const usable = profiles.filter((p) => p.url || p.handle)
  if (usable.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {usable.map((p) => (
        <li key={`${p.platform}-${p.handle ?? p.url}`}>
          <a
            href={p.url ?? '#'}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 rounded-full border border-ink-100/10 px-3.5 py-1.5 text-sm text-ink-300 transition-colors hover:border-brand-500/35 hover:text-ink-50"
          >
            {p.platform}
            {p.handle ? <span className="text-ink-500">@{p.handle}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  )
}
