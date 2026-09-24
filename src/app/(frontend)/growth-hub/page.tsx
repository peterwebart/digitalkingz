import Link from 'next/link'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { CTASection } from '@/components/sections/CTASection'
import { PageHero } from '@/components/sections/PageHero'
import { ArticleCard } from '@/components/ui/Cards'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { getCategories, getPosts } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'
import { absoluteUrl, cn } from '@/lib/utils'

export const revalidate = 300

export const metadata: Metadata = buildMetadata({
  title: 'Insights on Growth Systems, SEO, AI and Conversion',
  description:
    'Long-form analysis on what actually moves revenue: website economics, SEO and AI search visibility, paid media allocation, conversion, CRM and automation.',
  path: '/growth-hub',
})

type Search = { searchParams: Promise<{ category?: string }> }

export default async function InsightsPage({ searchParams }: Search) {
  const { category } = await searchParams
  const [posts, categories] = await Promise.all([getPosts({ limit: 50 }), getCategories()])

  const activeCategory = categories.find((c) => c.slug === category)
  const filtered = activeCategory
    ? posts.filter((p) => typeof p.category === 'object' && p.category?.slug === activeCategory.slug)
    : posts

  const [lead, ...rest] = filtered

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Insights', path: '/growth-hub' },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          {
            '@type': 'Blog',
            '@id': `${absoluteUrl('/growth-hub')}#blog`,
            name: 'Digital Kingz Insights',
            description:
              'Long-form analysis on growth systems, SEO, AI search, paid media, conversion and automation.',
            blogPost: posts.slice(0, 12).map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: absoluteUrl(`/growth-hub/${p.slug}`),
              datePublished: p.publishedAt,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Insights"
        title="Long-form, not thought leadership."
        description="No listicles, no recycled statistics, no vendor talking points. These are the frameworks and mechanics we use when deciding where a client should put the next dollar."
        breadcrumbs={crumbs}
        compact
      >
        <nav aria-label="Filter by category" className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/growth-hub"
            className={cn(
              'rounded-full border px-4 py-2 text-sm transition-colors',
              !activeCategory
                ? 'border-brand-500/40 bg-brand-500/[0.08] text-brand-300'
                : 'border-ink-100/10 text-ink-400 hover:border-ink-100/25 hover:text-ink-100',
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/growth-hub?category=${c.slug}`}
              className={cn(
                'rounded-full border px-4 py-2 text-sm transition-colors',
                activeCategory?.slug === c.slug
                  ? 'border-brand-500/40 bg-brand-500/[0.08] text-brand-300'
                  : 'border-ink-100/10 text-ink-400 hover:border-ink-100/25 hover:text-ink-100',
              )}
            >
              {c.title}
            </Link>
          ))}
        </nav>
      </PageHero>

      <Section>
        {filtered.length === 0 ? (
          <p className="text-ink-400">No articles in this category yet.</p>
        ) : (
          <div className="flex flex-col gap-14">
            {lead ? (
              <Reveal>
                <ArticleCard
                  href={`/growth-hub/${lead.slug}`}
                    image={lead.heroImage}
                  title={lead.title}
                  excerpt={lead.excerpt}
                  category={typeof lead.category === 'object' ? lead.category?.title : undefined}
                  publishedAt={lead.publishedAt}
                  readingMinutes={lead.readingMinutes}
                  featured
                />
              </Reveal>
            ) : null}

            {rest.length > 0 ? (
              <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal key={post.id} delay={i * 50}>
                    <ArticleCard
                      href={`/growth-hub/${post.slug}`}
                    image={post.heroImage}
                      title={post.title}
                      excerpt={post.excerpt}
                      category={
                        typeof post.category === 'object' ? post.category?.title : undefined
                      }
                      publishedAt={post.publishedAt}
                      readingMinutes={post.readingMinutes}
                    />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </Section>

      <CTASection
        heading="Reading about it is cheaper than learning it the expensive way."
        body="If any of this describes a problem you are currently paying for, a discovery conversation will tell you what it would take to fix. We will be direct about whether it is worth doing."
      />
    </>
  )
}
