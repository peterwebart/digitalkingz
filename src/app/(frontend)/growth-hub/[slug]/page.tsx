import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { TableOfContents } from '@/components/sections/TableOfContents'
import { extractHeadings } from '@/lib/toc'
import { FAQList } from '@/components/sections/FAQ'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { CTASection } from '@/components/sections/CTASection'
import { ArticleCard } from '@/components/ui/Cards'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { getPost, getPosts, postParams } from '@/lib/payload'
import { articleSchema, breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'
import { formatDate, mediaSrc } from '@/lib/utils'
import type { Author, Category, Service } from '@/payload-types'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return postParams()
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const author = typeof post.author === 'object' ? (post.author as Author) : null

  return buildMetadata({
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt ?? '',
    path: `/growth-hub/${post.slug}`,
    noIndex: post.seo?.noIndex ?? false,
    type: 'article',
    publishedTime: post.publishedAt ?? undefined,
    modifiedTime: post.updatedAt,
    authorName: author?.name,
  })
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const category = typeof post.category === 'object' ? (post.category as Category) : null
  // Article images were invisible because nothing rendered them. The field was
  // added to the collection and populated by the seed, but no component ever
  // read it — not a media URL or upload problem.
  const headings = extractHeadings(post.body)

  const hero =
    typeof post.heroImage === 'object' && post.heroImage !== null && post.heroImage.url
      ? post.heroImage
      : null

  const author = typeof post.author === 'object' ? (post.author as Author) : null
  const relatedServices = Array.isArray(post.relatedServices)
    ? (post.relatedServices.filter((s) => typeof s === 'object' && s !== null) as Service[])
    : []

  const all = await getPosts({ limit: 20 })
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3)

  const path = `/growth-hub/${post.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Insights', path: '/growth-hub' },
    { name: post.title, path },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          articleSchema({
            title: post.title,
            description: post.seo?.metaDescription ?? post.excerpt ?? '',
            path,
            publishedAt: post.publishedAt ?? post.createdAt,
            updatedAt: post.updatedAt,
            authorName: author?.name ?? 'Digital Kingz',
            section: category?.title,
            wordCount: post.readingMinutes ? post.readingMinutes * 225 : undefined,
          }),
          breadcrumbSchema(crumbs),
          faqSchema(post.faqs ?? []),
        ]}
      />

      <article>
        <header className="relative overflow-hidden border-b border-ink-100/8">
          <div
            aria-hidden="true"
            className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-50"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-48 left-1/3 size-[34rem] rounded-full bg-brand-600/7 blur-[120px]"
          />
          <div className="container-page relative">
            <div className="container-prose flex flex-col gap-7 py-16 md:py-20">
              <Breadcrumbs items={crumbs} />

              <div className="flex flex-wrap items-center gap-3">
                {category ? (
                  <Link
                    href={`/growth-hub?category=${category.slug}`}
                    className="rounded-full border border-brand-500/25 bg-brand-500/[0.06] px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-400 transition-colors hover:bg-brand-500/[0.12]"
                  >
                    {category.title}
                  </Link>
                ) : null}
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-600">
                  {post.publishedAt ? (
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  ) : null}
                  {post.readingMinutes ? ` · ${post.readingMinutes} min read` : null}
                </span>
              </div>

              <h1 className="text-display-xl text-balance">{post.title}</h1>

              {post.excerpt ? (
                // Quick answer. The excerpt already holds a self-contained
                // summary — hand-written, lifted from each article's editorial
                // brief — so it is labelled and given its own block rather than
                // left as an unmarked lead paragraph. An answer engine can
                // extract this without the surrounding article.
                <div className="rounded-xl border border-brand-500/20 bg-brand-500/[0.04] p-6">
                  <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-400">
                    Quick answer
                  </p>
                  <p className="text-[1.0625rem] leading-relaxed text-ink-200">{post.excerpt}</p>
                </div>
              ) : null}

              {hero ? (
                <figure className="flex flex-col gap-2">
                  {/* Natural aspect ratio, never cropped. These are portrait
                      infographics (roughly 2:3); forcing them into a landscape
                      box with object-cover cut off most of the image, and an
                      infographic with its bottom half missing is useless.
                      width/height come from the media record, so the space is
                      still reserved before the file loads — no layout shift. */}
                  <Image
                    src={mediaSrc(hero.url as string)}
                    alt={hero.alt ?? post.title}
                    width={hero.width ?? 1200}
                    height={hero.height ?? 1800}
                    sizes="(max-width: 768px) 100vw, 760px"
                    priority
                    className="h-auto w-full rounded-xl border border-ink-100/10 bg-ink-900"
                  />
                  {hero.caption ? (
                    <figcaption className="text-xs leading-relaxed text-ink-600">
                      {hero.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              {author ? (
                <div className="flex items-center gap-3 border-t border-ink-100/8 pt-6">
                  <span className="flex size-10 items-center justify-center rounded-full border border-brand-500/25 bg-brand-500/[0.08] font-mono text-sm text-brand-400">
                    {author.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-ink-100">{author.name}</span>
                    <span className="text-xs text-ink-500">{author.role}</span>
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="container-page">
          {/* Body sits in a readable measure; the contents column only appears
              on wide screens, so the article never narrows on tablets. */}
          <div className="container-page py-14 md:py-20">
            <div className="mx-auto flex max-w-[46rem] flex-col gap-0 lg:max-w-none lg:flex-row lg:items-start lg:justify-center lg:gap-14">
              <div className="w-full lg:max-w-[46rem]">
                <TableOfContents headings={headings} variant="mobile" />
                <RichText data={post.body} />
              </div>
              <aside className="hidden w-60 shrink-0 lg:block">
                <TableOfContents headings={headings} variant="desktop" />
              </aside>
            </div>
          </div>
        </div>

        {(post.faqs ?? []).length > 0 ? (
          <div className="container-page">
            <div className="container-prose pb-14 md:pb-20">
              <h2 className="text-display-md mb-8">Frequently asked</h2>
              <FAQList faqs={post.faqs ?? []} />
            </div>
          </div>
        ) : null}

        {relatedServices.length > 0 ? (
          <Section className="border-t border-ink-100/8">
            <div className="container-prose flex flex-col gap-6">
              <h2 className="text-display-sm">Work with us on this</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {relatedServices.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="surface-card surface-card-hover group flex items-center justify-between gap-4 p-5"
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          name={service.icon}
                          className="size-4 text-ink-500 transition-colors group-hover:text-brand-400"
                        />
                        <span className="text-sm font-medium text-ink-100">{service.title}</span>
                      </span>
                      <ArrowRight
                        className="size-4 text-ink-700 transition-all group-hover:translate-x-0.5 group-hover:text-brand-400"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        ) : null}
      </article>

      {more.length > 0 ? (
        <Section className="border-t border-ink-100/8">
          <div className="flex flex-col gap-10">
            <h2 className="text-display-md">Keep reading</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {more.map((item, i) => (
                <Reveal key={item.id} delay={i * 60}>
                  <ArticleCard
                    href={`/growth-hub/${item.slug}`}
                    title={item.title}
                    excerpt={item.excerpt}
                    category={typeof item.category === 'object' ? item.category?.title : undefined}
                    publishedAt={item.publishedAt}
                    readingMinutes={item.readingMinutes}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <CTASection />
    </>
  )
}
