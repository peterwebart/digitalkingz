import 'server-only'

import { FALLBACK_NAV } from '@/lib/fallbacks'
import { getIndustries, getServices, usedBuildFallback } from '@/lib/payload'
import { SERVICE_CATEGORY_META, type NavGroup, type NavItem, type SiteNav } from '@/lib/nav-config'

export type { NavGroup, NavItem, SiteNav }
export { COMPANY_LINKS, SERVICE_CATEGORY_META } from '@/lib/nav-config'

/** Builds the navigation from live CMS content so the menu never goes stale. */
export async function getSiteNav(): Promise<SiteNav> {
  const [services, industries] = await Promise.all([getServices(), getIndustries()])

  // The header and footer render on every page, so a database-free build would
  // otherwise bake an empty menu into every prerendered route and serve it
  // until that route's revalidate window expires — a full day on the legal
  // pages. The static fallback stands in until the first revalidation against
  // the live CMS.
  //
  // Only when the query actually failed. A reachable but genuinely empty CMS
  // must still render an empty menu rather than link to pages that 404.
  if (services.length === 0 && industries.length === 0 && usedBuildFallback()) {
    return FALLBACK_NAV
  }

  const grouped = new Map<string, NavItem[]>()
  for (const service of services) {
    const key = service.category ?? 'build'
    const list = grouped.get(key) ?? []
    list.push({
      label: service.navLabel || service.title,
      href: `/services/${service.slug}`,
      description: service.tagline ?? undefined,
      icon: service.icon ?? undefined,
    })
    grouped.set(key, list)
  }

  const serviceGroups: NavGroup[] = Object.entries(SERVICE_CATEGORY_META)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      blurb: meta.blurb,
      items: grouped.get(key) ?? [],
    }))
    .filter((group) => group.items.length > 0)

  return {
    serviceGroups,
    industries: industries.map((industry) => ({
      label: industry.navLabel || industry.title,
      href: `/industries/${industry.slug}`,
      description: industry.tagline ?? undefined,
      icon: industry.icon ?? undefined,
    })),
  }
}
