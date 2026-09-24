import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { BeforeAfterSlider } from '@/components/home/BeforeAfter'
import { SearchAndAutomation } from '@/components/home/Capabilities'
import { Ecosystem } from '@/components/home/Ecosystem'
import { Hero } from '@/components/home/Hero'
import { ServiceTracks } from '@/components/home/ServiceTracks'
import { TrustBar } from '@/components/home/TrustBar'
import { CTASection } from '@/components/sections/CTASection'
import { ProcessRow } from '@/components/sections/ProcessTimeline'
import { ArticleCard, IndustryCard } from '@/components/ui/Cards'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { getCaseStudies, getIndustries, getPosts, getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 300

export const metadata: Metadata = buildMetadata({
  title: 'Digital Kingz | We Build Digital Systems That Grow Businesses',
  description:
    'Digital strategy, high-performance websites, SEO, AI and automation, engineered to help businesses get found, convert more customers and scale.',
  path: '/',
})

export default async function HomePage() {
  const [settings, industries, posts, caseStudies] = await Promise.all([
    getSiteSettings(),
    getIndustries(),
    getPosts({ limit: 4, featured: true }),
    getCaseStudies({ featured: true, limit: 4 }),
  ])

  return (
    <>
      <Hero settings={settings} />
      <TrustBar settings={settings} />
      <Ecosystem />
      <ServiceTracks />

      {/* --- Featured work (renders only when real case studies exist) ---- */}
      {caseStudies.length > 0 ? (
        <Section className="border-t border-ink-100/8">
          <div className="flex flex-col gap-10">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <h2 className="text-display-lg">
                  Digital Experiences Built for{' '}
                  <span className="text-gradient-brand">Real Businesses.</span>
                </h2>
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-brand-200"
                >
                  View All Projects
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {caseStudies.map((study, i) => (
                <Reveal key={study.id} delay={i * 60}>
                  <Link
                    href={`/work/${study.slug}`}
                    className="surface-card surface-card-hover flex h-full flex-col gap-3 p-6"
                  >
                    <span className="w-fit rounded-full border border-brand-500/25 bg-brand-500/[0.08] px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-brand-300">
                      {study.client}
                    </span>
                    <h3 className="text-[1.0625rem] font-medium text-ink-50">{study.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-400">{study.summary}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* --- Before / After ---------------------------------------------- */}
      <Section className="border-t border-ink-100/8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex flex-col gap-5 lg:sticky lg:top-28">
                <h2 className="text-display-lg">
                  From <span className="text-gradient-brand">Digital Presence</span> to{' '}
                  <span className="text-gradient-brand">Digital Growth Engine.</span>
                </h2>
                <p className="text-lead text-ink-400">
                  We don&rsquo;t just build websites. We transform how your business shows up, gets
                  found and grows.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={80}>
              <BeforeAfterSlider />
            </Reveal>
          </div>
        </div>
      </Section>

      <SearchAndAutomation />

      {/* --- Industries --------------------------------------------------- */}
      <Section id="industries">
        <div className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                title={
                  <>
                    Built Around <span className="text-gradient-brand">Your Business.</span>
                  </>
                }
                titleClassName="text-display-lg"
                description="A law firm and a plumbing company both need leads, and almost nothing else about their acquisition economics is the same. Case value, buying cycle, regulation and capacity all change what the right system looks like."
                className="max-w-2xl"
              />
              <Link
                href="/industries"
                className="group inline-flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-brand-200"
              >
                All Industries
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, i) => (
              <Reveal key={industry.id} delay={i * 40}>
                <IndustryCard
                  href={`/industries/${industry.slug}`}
                  title={industry.title}
                  tagline={industry.tagline}
                  icon={industry.icon}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --- Process ------------------------------------------------------ */}
      <Section className="border-y border-ink-100/8 bg-ink-900/30">
        <div className="flex flex-col gap-12">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-display-lg max-w-xl">
                Our Proven <span className="text-gradient-brand">Process.</span>
                <br />
                Your Growth. Our System.
              </h2>
              <Link
                href="/process"
                className="group inline-flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-brand-200"
              >
                See Full Process
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>
          <ProcessRow />
        </div>
      </Section>

      {/* --- Growth Hub --------------------------------------------------- */}
      {posts.length > 0 ? (
        <Section>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-3">
              <Reveal>
                <div className="flex flex-col gap-5 lg:sticky lg:top-28">
                  <h2 className="text-display-lg">
                    Digital Kingz
                    <br />
                    <span className="text-gradient-brand">Growth Hub.</span>
                  </h2>
                  <p className="text-sm leading-relaxed text-ink-400">
                    Insights, strategies and guides to help your business grow in the digital age.
                  </p>
                  <Link
                    href="/growth-hub"
                    className="group inline-flex w-fit items-center gap-2 rounded-full border border-ink-100/12 px-5 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-brand-500/45"
                  >
                    View All Articles
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </Reveal>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-4">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 60}>
                  <ArticleCard
                    href={`/growth-hub/${post.slug}`}
                    image={post.heroImage}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={typeof post.category === 'object' ? post.category?.title : undefined}
                    publishedAt={post.publishedAt}
                    readingMinutes={post.readingMinutes}
                    compact
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <CTASection
        heading="Tell us what a customer is worth. We'll tell you what the system should cost."
        body="Every recommendation we make is arithmetic on your numbers: lifetime value, close rate, current cost per lead and the capacity you have to service more of them. Bring those and the first conversation is already useful."
      />
    </>
  )
}
