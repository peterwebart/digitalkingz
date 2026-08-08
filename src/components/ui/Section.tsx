import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Section({
  children,
  className,
  id,
  as: Tag = 'section',
  bleed = false,
}: {
  children: ReactNode
  className?: string
  id?: string
  as?: ElementType
  /** Skip the horizontal container. Used by full-bleed visuals. */
  bleed?: boolean
}) {
  return (
    <Tag id={id} className={cn('relative py-20 md:py-28 lg:py-(--spacing-section)', className)}>
      {bleed ? children : <div className="container-page">{children}</div>}
    </Tag>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'font-mono text-eyebrow inline-flex items-center gap-2 uppercase text-brand-500',
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block h-px w-6 bg-brand-600/60" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  titleClassName,
  as = 'h2',
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  titleClassName?: string
  as?: 'h1' | 'h2' | 'h3'
  children?: ReactNode
}) {
  const Tag = as
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className={cn('text-display-md', titleClassName)}>{title}</Tag>
      {description ? (
        <div className="text-lead text-ink-400 [&_strong]:font-medium [&_strong]:text-ink-200">
          {description}
        </div>
      ) : null}
      {children}
    </div>
  )
}
