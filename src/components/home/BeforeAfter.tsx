'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

const BEFORE = [
  'Loads slowly on mobile',
  'Describes the company, not the customer problem',
  'No clear primary action',
  'Thin or missing service pages',
  'No structured data',
  'Enquiries land in a shared inbox',
]

const AFTER = [
  'Server-rendered and measured against Core Web Vitals',
  'Message built around what the buyer is trying to fix',
  'One obvious next step on every page',
  'A ranking page for every service and industry sold',
  'Schema on every template, readable by AI search',
  'Qualified, scored and routed into a CRM automatically',
]

/**
 * Interactive transformation panel.
 *
 * The two sides are illustrative interface states, not client screenshots.
 * The brief is explicit about never publishing unverified client results, and
 * that includes implying a redesign we cannot evidence.
 */
export function BeforeAfterSlider() {
  const [position, setPosition] = useState(52)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(96, Math.max(4, next)))
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => updateFromClientX(e.clientX)
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, updateFromClientX])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(4, p - 4))
    if (e.key === 'ArrowRight') setPosition((p) => Math.min(96, p + 4))
    if (e.key === 'Home') setPosition(4)
    if (e.key === 'End') setPosition(96)
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          setDragging(true)
          updateFromClientX(e.clientX)
        }}
        className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-2xl border border-ink-100/10 bg-ink-900 md:aspect-[16/8]"
      >
        {/* AFTER (underneath, revealed on the right) */}
        <MockSite variant="after" />

        {/* BEFORE (clipped from the left) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <MockSite variant="before" />
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-ink-100/12 bg-ink-950/80 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-400 backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-brand-500/25 bg-ink-950/80 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-400 backdrop-blur-sm">
          After
        </span>

        {/* Handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-brand-500/70"
          style={{ left: `${position}%` }}
        >
          <div className="pointer-events-none absolute inset-y-0 -left-4 w-8" />
        </div>
        <button
          type="button"
          role="slider"
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)} percent before`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={() => setDragging(true)}
          className="absolute top-1/2 z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-brand-500/40 bg-ink-950/90 text-brand-400 shadow-lg backdrop-blur-sm transition-transform duration-200 hover:scale-105"
          style={{ left: `${position}%` }}
        >
          <span aria-hidden="true" className="font-mono text-xs tracking-tighter">
            &lt;&nbsp;&gt;
          </span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ul className="flex flex-col gap-3">
          {BEFORE.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-ink-400">
              <X className="mt-0.5 size-4 shrink-0 text-ink-600" strokeWidth={2} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-3">
          {AFTER.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-ink-200">
              <Check
                className="mt-0.5 size-4 shrink-0 text-brand-500"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Stylised browser frame. Illustrative only, no client work depicted. */
function MockSite({ variant }: { variant: 'before' | 'after' }) {
  const before = variant === 'before'
  return (
    <div className="absolute inset-0 flex flex-col bg-ink-950">
      <div className="flex items-center gap-2 border-b border-ink-100/8 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-ink-700" />
          <span className="size-2 rounded-full bg-ink-700" />
          <span className="size-2 rounded-full bg-ink-700" />
        </span>
        <span
          className={`ml-2 h-4 flex-1 rounded-sm ${before ? 'bg-ink-800' : 'bg-ink-850'}`}
          aria-hidden="true"
        />
      </div>

      {before ? (
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <span className="h-3 w-24 rounded-sm bg-ink-700" />
            <span className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="h-2 w-9 rounded-sm bg-ink-800" />
              ))}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <span className="h-4 w-3/4 rounded-sm bg-ink-700" />
            <span className="h-2.5 w-full rounded-sm bg-ink-800" />
            <span className="h-2.5 w-11/12 rounded-sm bg-ink-800" />
            <span className="h-2.5 w-10/12 rounded-sm bg-ink-800" />
            <span className="h-2.5 w-11/12 rounded-sm bg-ink-800" />
          </div>
          <div className="mt-1 grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="h-9 rounded-sm bg-ink-850" />
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2">
            <span className="h-6 w-20 rounded-sm bg-ink-800" />
            <span className="h-6 w-16 rounded-sm bg-ink-800" />
          </div>
        </div>
      ) : (
        <div className="relative flex flex-1 flex-col gap-5 p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-brand-600/12 blur-3xl"
          />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="size-3.5 rounded-md bg-brand-500" />
              <span className="h-2.5 w-16 rounded-sm bg-ink-500" />
            </span>
            <span className="flex items-center gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="h-2 w-10 rounded-sm bg-ink-700" />
              ))}
              <span className="h-5 w-16 rounded-full bg-brand-500" />
            </span>
          </div>
          <div className="mt-4 flex max-w-[70%] flex-col gap-3">
            <span className="h-2 w-20 rounded-sm bg-brand-600/70" />
            <span className="h-5 w-full rounded-sm bg-ink-300" />
            <span className="h-5 w-4/5 rounded-sm bg-ink-400" />
            <span className="h-2 w-full rounded-sm bg-ink-800" />
            <span className="h-2 w-5/6 rounded-sm bg-ink-800" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-24 rounded-full bg-brand-500" />
            <span className="h-7 w-24 rounded-full border border-ink-100/12" />
          </div>
          <div className="mt-auto grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className="h-12 rounded-lg border border-ink-100/8 bg-ink-900"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
