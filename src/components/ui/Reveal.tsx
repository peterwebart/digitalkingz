'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll reveal built on IntersectionObserver plus a CSS transition.
 *
 * Deliberately not a motion library. The whole effect is a few lines of
 * compositor-only CSS, and shipping an animation runtime to every section
 * would cost more in JavaScript than the animation is worth.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  once = true,
}: {
  children: ReactNode
  className?: string
  /** Milliseconds. Use small increments to stagger a group. */
  delay?: number
  as?: ElementType
  once?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 motion-reduce:opacity-100',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
