'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/layout/Logo'
import { COMPANY_LINKS, RESOURCE_LINKS, type SiteNav } from '@/lib/nav-config'
import { cn } from '@/lib/utils'

type MenuKey = 'services' | 'industries' | 'company' | 'resources' | null

export function Header({ nav, bookingUrl }: { nav: SiteNav; bookingUrl?: string | null }) {
  const [open, setOpen] = useState<MenuKey>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setOpen(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(null), 140)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]',
        scrolled || open || mobileOpen
          ? 'border-b border-ink-100/8 bg-ink-950/85 backdrop-blur-xl supports-[backdrop-filter]:bg-ink-950/70'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>

      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <MenuTrigger
              label="Services"
              expanded={open === 'services'}
              active={isActive('/services')}
              onEnter={() => {
                cancelClose()
                setOpen('services')
              }}
              onClick={() => setOpen(open === 'services' ? null : 'services')}
            />
            <MenuTrigger
              label="Industries"
              expanded={open === 'industries'}
              active={isActive('/industries')}
              onEnter={() => {
                cancelClose()
                setOpen('industries')
              }}
              onClick={() => setOpen(open === 'industries' ? null : 'industries')}
            />
            <NavLink href="/work" active={isActive('/work')} onEnter={() => setOpen(null)}>
              Work
            </NavLink>
            <NavLink
              href="/growth-hub"
              active={isActive('/growth-hub')}
              onEnter={() => setOpen(null)}
            >
              Growth Hub
            </NavLink>
            <MenuTrigger
              label="About"
              expanded={open === 'company'}
              active={isActive('/about') || isActive('/process')}
              onEnter={() => {
                cancelClose()
                setOpen('company')
              }}
              onClick={() => setOpen(open === 'company' ? null : 'company')}
            />
            <MenuTrigger
              label="Resources"
              expanded={open === 'resources'}
              active={isActive('/growth-hub')}
              onEnter={() => {
                cancelClose()
                setOpen('resources')
              }}
              onClick={() => setOpen(open === 'resources' ? null : 'resources')}
            />
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href={bookingUrl || '/contact#book'}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-300 transition-colors duration-300 hover:text-ink-50"
            >
              Book a Call
            </Link>
            <Link
              href="/contact"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-medium text-ink-950 transition-all duration-300 ease-[var(--ease-out-expo)] hover:bg-brand-400"
            >
              Start a Project
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink-100/10 text-ink-200 transition-colors hover:border-ink-100/25 hover:text-ink-50 lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" strokeWidth={1.75} />
            ) : (
              <Menu className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* --- Desktop mega menu ------------------------------------------- */}
      <div
        onMouseEnter={cancelClose}
        className={cn(
          'absolute inset-x-0 top-full hidden origin-top overflow-hidden border-b border-ink-100/8 bg-ink-950/95 backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-out-expo)] lg:block',
          open ? 'visible opacity-100' : 'invisible -translate-y-1 opacity-0',
        )}
      >
        <div className="container-page py-9">
          {open === 'services' ? (
            <div className="grid grid-cols-4 gap-x-8 gap-y-6">
              {nav.serviceGroups.map((group) => (
                <div key={group.key} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 border-b border-ink-100/8 pb-3">
                    <span className="font-mono text-eyebrow uppercase text-brand-500">
                      {group.label}
                    </span>
                    <span className="text-xs leading-relaxed text-ink-500">{group.blurb}</span>
                  </div>
                  <ul className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="group flex items-start gap-3 rounded-lg px-2.5 py-2 transition-colors duration-200 hover:bg-ink-100/[0.05]"
                        >
                          <Icon
                            name={item.icon}
                            className="mt-0.5 size-4 shrink-0 text-ink-500 transition-colors group-hover:text-brand-500"
                          />
                          <span className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-ink-100">{item.label}</span>
                            {item.description ? (
                              <span className="line-clamp-2 text-xs leading-snug text-ink-500">
                                {item.description}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-4 flex items-center justify-between rounded-xl border border-ink-100/8 bg-ink-100/[0.03] px-5 py-4">
                <p className="text-sm text-ink-400">
                  <span className="font-medium text-ink-100">
                    Your website shouldn&rsquo;t exist in isolation.
                  </span>{' '}
                  See how the pieces connect into one revenue system.
                </p>
                <Link
                  href="/services"
                  className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300"
                >
                  All services
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </div>
          ) : null}

          {open === 'industries' ? (
            <div className="grid grid-cols-4 gap-3">
              {nav.industries.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col gap-2 rounded-xl border border-ink-100/8 p-4 transition-all duration-300 ease-[var(--ease-out-expo)] hover:border-brand-500/30 hover:bg-ink-100/[0.04]"
                >
                  <Icon
                    name={item.icon}
                    className="size-5 text-ink-500 transition-colors group-hover:text-brand-500"
                  />
                  <span className="text-sm font-medium text-ink-100">{item.label}</span>
                  {item.description ? (
                    <span className="line-clamp-2 text-xs leading-snug text-ink-500">
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}

          {open === 'company' ? (
            <div className="grid grid-cols-4 gap-3">
              {COMPANY_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col gap-1.5 rounded-xl border border-ink-100/8 p-4 transition-all duration-300 hover:border-brand-500/30 hover:bg-ink-100/[0.04]"
                >
                  <span className="text-sm font-medium text-ink-100">{item.label}</span>
                  <span className="text-xs leading-snug text-ink-500">{item.description}</span>
                </Link>
              ))}
            </div>
          ) : null}

          {open === 'resources' ? (
            <div className="grid grid-cols-4 gap-3">
              {RESOURCE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex flex-col gap-1.5 rounded-xl border border-ink-100/8 p-4 transition-all duration-300 hover:border-brand-500/30 hover:bg-ink-100/[0.04]"
                >
                  <span className="text-sm font-medium text-ink-100">{item.label}</span>
                  <span className="text-xs leading-snug text-ink-500">{item.description}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* --- Mobile drawer ------------------------------------------------ */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-ink-100/8 bg-ink-950 lg:hidden"
      >
        <div className="container-page flex flex-col gap-8 py-8">
          {nav.serviceGroups.map((group) => (
            <div key={group.key} className="flex flex-col gap-3">
              <span className="font-mono text-eyebrow uppercase text-brand-500">{group.label}</span>
              <ul className="flex flex-col divide-y divide-ink-100/6">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 py-3 text-[0.9375rem] text-ink-200"
                    >
                      <Icon name={item.icon} className="size-4 text-ink-500" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <span className="font-mono text-eyebrow uppercase text-brand-500">Industries</span>
            <ul className="grid grid-cols-2 gap-2">
              {nav.industries.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg border border-ink-100/8 px-3 py-2.5 text-sm text-ink-200"
                  >
                    <Icon name={item.icon} className="size-4 text-ink-500" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-eyebrow uppercase text-brand-500">Company</span>
            <ul className="flex flex-col divide-y divide-ink-100/6">
              {[...COMPANY_LINKS, { label: 'Growth Hub', href: '/growth-hub' }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block py-3 text-[0.9375rem] text-ink-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 pb-4">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 text-[0.9375rem] font-medium text-ink-950"
            >
              Start a Project
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
            <Link
              href={bookingUrl || '/contact#book'}
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink-100/12 text-[0.9375rem] font-medium text-ink-100"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuTrigger({
  label,
  expanded,
  active,
  onEnter,
  onClick,
}: {
  label: string
  expanded: boolean
  active: boolean
  onEnter: () => void
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onClick}
      aria-expanded={expanded}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300',
        active || expanded ? 'text-ink-50' : 'text-ink-400 hover:text-ink-100',
      )}
    >
      {label}
      <ChevronDown
        className={cn(
          'size-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)]',
          expanded && 'rotate-180',
        )}
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  )
}

function NavLink({
  href,
  active,
  onEnter,
  children,
}: {
  href: string
  active: boolean
  onEnter: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      className={cn(
        'rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300',
        active ? 'text-ink-50' : 'text-ink-400 hover:text-ink-100',
      )}
    >
      {children}
    </Link>
  )
}
