import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { getIndustries, getServices } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default async function NotFound() {
  let services: Awaited<ReturnType<typeof getServices>> = []
  let industries: Awaited<ReturnType<typeof getIndustries>> = []

  try {
    ;[services, industries] = await Promise.all([getServices(), getIndustries()])
  } catch {
    // A 404 must render even if the database is unreachable.
  }

  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'Work', href: '/work' },
    { label: 'Insights', href: '/growth-hub' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/3 size-[32rem] rounded-full bg-brand-600/8 blur-[120px]"
      />

      <div className="container-page relative">
        <div className="flex flex-col gap-14 py-24 md:py-32">
          <div className="flex max-w-2xl flex-col gap-6">
            <span className="font-mono text-eyebrow uppercase text-brand-500">Error 404</span>
            <h1 className="text-display-xl">This page doesn&rsquo;t exist.</h1>
            <p className="text-lead text-ink-400">
              The link may be outdated or the address mistyped. Everything below is a live page, so
              one of these will get you where you were going.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-ink-100/10 px-4 py-2 text-sm text-ink-300 transition-colors hover:border-brand-500/40 hover:text-ink-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              className="group mt-4 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
            >
              Start a project
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>

          {services.length > 0 ? (
            <div className="grid gap-10 border-t border-ink-100/8 pt-12 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <h2 className="font-mono text-eyebrow uppercase text-ink-500">Services</h2>
                <ul className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-sm text-ink-400 underline decoration-ink-700 underline-offset-4 transition-colors hover:text-brand-400"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="font-mono text-eyebrow uppercase text-ink-500">Industries</h2>
                <ul className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <li key={industry.id}>
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="text-sm text-ink-400 underline decoration-ink-700 underline-offset-4 transition-colors hover:text-brand-400"
                      >
                        {industry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
