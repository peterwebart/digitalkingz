import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn('group flex items-center gap-2.5 rounded-md', className)}
      aria-label="Digital Kingz home"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center">
        <svg viewBox="0 0 36 36" className="size-9" fill="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="dk-mark-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-signal-400)" />
              <stop offset="100%" stopColor="var(--color-brand-600)" />
            </linearGradient>
            <linearGradient id="dk-mark-b" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-400)" />
              <stop offset="100%" stopColor="var(--color-violet-500)" />
            </linearGradient>
          </defs>
          {/* Two crossing strokes forming a K/X: the point where systems connect. */}
          <path
            d="M5 4 L14.5 4 L31 32 L21.5 32 Z"
            fill="url(#dk-mark-a)"
            className="transition-opacity duration-300 group-hover:opacity-90"
          />
          <path
            d="M31 4 L21.5 4 L5 32 L14.5 32 Z"
            fill="url(#dk-mark-b)"
            className="transition-opacity duration-300 group-hover:opacity-90"
          />
          <circle cx="18" cy="18" r="3.1" className="fill-ink-950" />
          <circle cx="18" cy="18" r="1.5" className="fill-brand-300" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-ink-50">
          Digital
        </span>
        <span className="text-[1.0625rem] font-bold uppercase leading-tight tracking-[0.02em] text-ink-50">
          Kingz
        </span>
        <span className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-ink-500">
          Development
        </span>
      </span>
    </Link>
  )
}
