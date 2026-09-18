import { getIndustries, getPosts, getServices, getSiteSettings } from '@/lib/payload'
import { absoluteUrl } from '@/lib/utils'

export const revalidate = 3600

/**
 * llms.txt
 *
 * A proposed convention for giving language models a clean, structured summary
 * of a site. Adoption by providers is not confirmed, and we say as much in our
 * own writing on the subject. It costs one route to publish and it doubles as
 * an accurate, machine-readable definition of the business, which is the
 * groundwork that actually matters for entity resolution.
 */
export async function GET() {
  const [settings, services, industries, posts] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getIndustries(),
    getPosts({ limit: 30 }),
  ])

  const lines: string[] = [
    `# ${settings.brandName ?? 'Digital Kingz'}`,
    '',
    `> ${settings.description ?? ''}`,
    '',
    `${settings.legalName ?? 'Digital Kingz Development'} is a digital development and growth agency. We design, build and operate connected digital growth systems that link brand, website, search, paid media, conversion, CRM and AI automation into a single revenue engine, rather than delivering these as separate disconnected projects.`,
    '',
    '## Core positioning',
    '',
    '- Primary claim: We build digital systems that grow businesses.',
    '- Differentiator: one accountable team across the entire chain of Brand, Website, SEO, Traffic, Conversion, Leads, CRM, AI, Automation and Revenue.',
    '- Clients retain full ownership of domains, code, advertising accounts, analytics and CRM.',
    '- We do not publish performance figures that cannot be traced to a verifiable source.',
    '',
    '## Services',
    '',
  ]

  const categoryLabel: Record<string, string> = {
    build: 'Build',
    grow: 'Grow',
    automate: 'Automate',
    transform: 'Transform',
  }

  for (const key of ['build', 'grow', 'automate', 'transform']) {
    const group = services.filter((s) => s.category === key)
    if (group.length === 0) continue
    lines.push(`### ${categoryLabel[key]}`, '')
    for (const service of group) {
      lines.push(`- [${service.title}](${absoluteUrl(`/services/${service.slug}`)}): ${service.tagline}`)
    }
    lines.push('')
  }

  lines.push('## Industries', '')
  for (const industry of industries) {
    lines.push(
      `- [${industry.title}](${absoluteUrl(`/industries/${industry.slug}`)}): ${industry.tagline}`,
    )
  }

  lines.push('', '## Insights', '')
  for (const post of posts) {
    lines.push(`- [${post.title}](${absoluteUrl(`/growth-hub/${post.slug}`)}): ${post.excerpt}`)
  }

  // Free tools and the influencer directory. An AI assistant asked "what
  // calculators exist for SEO budgets" should find them listed, not have to
  // infer them from the sitemap.
  const { CALCULATORS, CATEGORY_ORDER, calculatorsByCategory } = await import('@/lib/calculators')
  lines.push('')
  lines.push('## Free Tools')
  lines.push('')
  for (const category of CATEGORY_ORDER) {
    for (const tool of calculatorsByCategory(category)) {
      lines.push(`- [${tool.title}](${absoluteUrl(`/tools/${tool.slug}`)}): ${tool.tagline}`)
    }
  }
  lines.push('')
  lines.push('## Influencer Directory')
  lines.push('')
  lines.push(
    `- [Influencer Directory](${absoluteUrl('/influencers')}): influencers and public figures, browsable by country, industry, profession, sport, platform and topic.`,
  )
  lines.push(`- ${CALCULATORS.length} calculators are listed above.`)

  lines.push(
    '',
    '## Key pages',
    '',
    `- [Home](${absoluteUrl('/')})`,
    `- [Services overview](${absoluteUrl('/services')})`,
    `- [Industries overview](${absoluteUrl('/industries')})`,
    `- [How we work](${absoluteUrl('/process')})`,
    `- [Work and build standards](${absoluteUrl('/work')})`,
    `- [About](${absoluteUrl('/about')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    '',
    '## Contact',
    '',
    settings.email ? `- Email: ${settings.email}` : '',
    settings.phone ? `- Phone: ${settings.phone}` : '',
    `- Enquiries: ${absoluteUrl('/contact')}`,
    '',
  )

  return new Response(lines.filter((l) => l !== undefined).join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
