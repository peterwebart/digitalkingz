import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-ink-950 hover:bg-brand-400 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.3)_inset,0_12px_32px_-8px_color-mix(in_oklch,var(--color-brand-500)_45%,transparent)]',
  secondary:
    'border border-ink-100/12 bg-ink-100/[0.04] text-ink-100 backdrop-blur-sm hover:border-ink-100/25 hover:bg-ink-100/[0.08]',
  ghost: 'text-ink-300 hover:text-ink-50 hover:bg-ink-100/[0.06]',
  link: 'text-brand-400 hover:text-brand-300 px-0 rounded-none',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-[3.25rem] px-7 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /** Renders a right arrow that slides on hover. */
  withArrow?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  withArrow,
  ...props
}: CommonProps & ComponentProps<'button'>) {
  return (
    <button
      className={cn(base, variants[variant], variant !== 'link' && sizes[size], className)}
      {...props}
    >
      {children}
      {withArrow ? (
        <ArrowRight
          className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  withArrow,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], variant !== 'link' && sizes[size], className)}
      {...props}
    >
      {children}
      {withArrow ? (
        <ArrowRight
          className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}
    </Link>
  )
}
