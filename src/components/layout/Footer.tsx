import Link from 'next/link'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { COMPANY_LINKS, RESOURCE_LINKS, type SiteNav } from '@/lib/nav-config'
import type { SiteSetting } from '@/payload-types'

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
]

export function Footer({ nav, settings }: { nav: SiteNav; settings: SiteSetting }) {
  const year = new Date().getFullYear()
  const socials = settings.socialLinks ?? []
  const address = settings.address
  const addressLine = [address?.locality, address?.region, address?.country]
    .filter(Boolean)
    .join(', ')

  const allServices = nav.serviceGroups.flatMap((g) => g.items)

  return (
    <footer className="relative border-t border-ink-100/8 bg-ink-950">
      <div className="container-page">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* --- Brand --------------------------------------------------- */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-ink-400">
              We build digital systems that help businesses get found, win customers and grow.
            </p>
            {socials.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {socials.map((social) => (
                  <li key={`${social.platform}-${social.url}`}>
                    <a
                      href={social.url}
                      rel="noopener noreferrer me"
                      target="_blank"
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-100/10 text-xs font-medium text-ink-400 transition-colors hover:border-brand-500/40 hover:text-ink-100"
                      aria-label={social.platform}
                    >
                      {social.platform.slice(0, 2)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* --- Link columns -------------------------------------------- */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-4 lg:gap-6">
            <FooterColumn
              title="Services"
              items={allServices.map((s) => ({ label: s.label, href: s.href }))}
            />
            <FooterColumn
              title="Industries"
              items={nav.industries.map((i) => ({ label: i.label, href: i.href }))}
            />
            <FooterColumn
              title="Resources"
              items={RESOURCE_LINKS.map((r) => ({ label: r.label, href: r.href }))}
            />
            <FooterColumn
              title="Company"
              items={COMPANY_LINKS.map((c) => ({ label: c.label, href: c.href }))}
            />
          </div>

          {/* --- Contact -------------------------------------------------- */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            <h2 className="font-mono text-eyebrow uppercase text-ink-500">Contact Us</h2>
            <ul className="flex flex-col gap-3 text-sm">
              {addressLine ? (
                <li className="flex items-start gap-2.5 text-ink-300">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-brand-500"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {addressLine}
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}
                    className="flex items-start gap-2.5 text-ink-300 transition-colors hover:text-brand-300"
                  >
                    <Phone
                      className="mt-0.5 size-4 shrink-0 text-brand-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-start gap-2.5 break-all text-ink-300 transition-colors hover:text-brand-300"
                  >
                    <Mail
                      className="mt-0.5 size-4 shrink-0 text-brand-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {settings.email}
                  </a>
                </li>
              ) : null}
            </ul>
            <Link
              href="/contact"
              className="group inline-flex h-11 w-fit items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
            >
              Start a Project
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <div className="rule-fade" />

        <div className="flex flex-col-reverse items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-500">
            &copy; {year} {settings.legalName ?? 'Digital Kingz Development'}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-ink-500 transition-colors hover:text-ink-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  items,
}: {
  title: string
  items: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <h2 className="font-mono text-eyebrow uppercase text-ink-500">{title}</h2>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link
              href={item.href}
              className="text-sm text-ink-400 transition-colors hover:text-ink-100"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
