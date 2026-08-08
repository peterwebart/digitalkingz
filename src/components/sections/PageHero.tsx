import Link from 'next/link'
import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Eyebrow } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

export interface Crumb {
  name: string
  path: string
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-ink-300">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition-colors hover:text-ink-200">
                    {item.name}
                  </Link>
                  <ChevronRight className="size-3 text-ink-700" strokeWidth={2} aria-hidden="true" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  aside,
  children,
  compact = false,
}: {
  eyebrow?: string | null
  title: ReactNode
  description?: ReactNode
  breadcrumbs?: Crumb[]
  aside?: ReactNode
  children?: ReactNode
  compact?: boolean
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100/8">
      <div
        aria-hidden="true"
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/3 size-[36rem] rounded-full bg-brand-600/7 blur-[120px]"
      />

      <div className="container-page relative">
        <div className={cn('flex flex-col gap-8', compact ? 'py-14 md:py-16' : 'py-16 md:py-24')}>
          {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}

          <div
            className={cn(
              'grid gap-10',
              aside ? 'lg:grid-cols-12 lg:gap-12' : 'max-w-4xl',
            )}
          >
            <div className={cn('flex flex-col gap-6', aside && 'lg:col-span-7')}>
              {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
              <h1
                className={cn(
                  'text-balance',
                  compact ? 'text-display-lg' : 'text-display-xl',
                )}
              >
                {title}
              </h1>
              {description ? (
                <div className="text-lead max-w-2xl text-ink-400">{description}</div>
              ) : null}
              {children}
            </div>
            {aside ? <div className="lg:col-span-5">{aside}</div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
