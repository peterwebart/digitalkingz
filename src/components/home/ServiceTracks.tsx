import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { TRACKS } from '@/lib/nav-config'
import type { CSSProperties } from 'react'

export function ServiceTracks() {
  return (
    <Section id="services" className="border-t border-ink-100/8">
      <div className="flex flex-col gap-10">
        <Reveal>
          <p className="text-center font-mono text-eyebrow uppercase tracking-[0.18em] text-ink-500">
            Everything you need to build, grow &amp; scale
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TRACKS.map((track, i) => (
            <Reveal key={track.key} delay={i * 70}>
              <div
                className="surface-track group flex h-full flex-col gap-5 p-6 md:p-7"
                style={{ '--track': track.token } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex items-center gap-2.5">
                    <span
                      className="flex size-9 items-center justify-center rounded-lg border"
                      style={{
                        borderColor: `color-mix(in oklch, ${track.token} 35%, transparent)`,
                        backgroundColor: `color-mix(in oklch, ${track.token} 14%, transparent)`,
                      }}
                    >
                      <Icon
                        name={track.icon}
                        className="size-4"
                        strokeWidth={1.75}
                      />
                    </span>
                    <span
                      className="text-lg font-semibold uppercase tracking-[0.06em]"
                      style={{ color: track.token }}
                    >
                      {track.label}
                    </span>
                  </span>
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-600">
                    {track.number}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-ink-400">{track.blurb}</p>

                <ul className="flex flex-1 flex-col gap-2.5 border-t border-ink-100/8 pt-5">
                  {track.bullets.map((bullet) => (
                    <li key={bullet.label}>
                      {bullet.slug ? (
                        <Link
                          href={`/services/${bullet.slug}`}
                          className="group/item flex items-center gap-2.5 text-sm text-ink-300 transition-colors hover:text-ink-50"
                        >
                          <span
                            aria-hidden="true"
                            className="size-1 shrink-0 rounded-full"
                            style={{ backgroundColor: track.token }}
                          />
                          <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover/item:decoration-ink-600">
                            {bullet.label}
                          </span>
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2.5 text-sm text-ink-400">
                          <span
                            aria-hidden="true"
                            className="size-1 shrink-0 rounded-full opacity-50"
                            style={{ backgroundColor: track.token }}
                          />
                          {bullet.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services#${track.key}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-transform duration-300 group-hover:translate-x-0.5"
                  style={{ color: track.token }}
                >
                  Explore {track.label}
                  <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
