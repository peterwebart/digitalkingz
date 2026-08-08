import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'

const REASONS = [
  {
    title: 'One accountable party for the whole chain',
    body: 'Design, build, search, media, conversion, CRM and automation under a single roof. Nobody gets to blame the other vendor, because there is no other vendor.',
  },
  {
    title: 'We optimise for revenue, not for reporting',
    body: 'Form fills are a vanity metric if sales cannot use them. We instrument the path from click to closed deal and tune the system against that, including feeding closed revenue back into ad platforms.',
  },
  {
    title: 'Performance is architecture, not a plugin',
    body: 'Server-rendered by default, minimal client JavaScript, disciplined third-party scripts. Speed is a conversion variable and an ad-cost variable, so we treat it as an engineering requirement.',
  },
  {
    title: 'Built for AI search from day one',
    body: 'Entity clarity, structured data, citable passages and consistent facts across the web. The buyer increasingly asks a model before they visit a website, and that requires different groundwork.',
  },
  {
    title: 'You own everything',
    body: 'Domains, repositories, ad accounts, analytics, CRM. The system keeps working if you replace us, which is the only honest way to earn a retainer.',
  },
  {
    title: 'We will tell you when not to spend',
    body: 'Some channels do not fit some businesses, and some projects should not be built yet. Recommending the wrong scope is a fast way to lose a client and a slow way to lose a reputation.',
  },
]

const ENGAGEMENTS = [
  {
    name: 'Project',
    tag: 'Fixed scope',
    body: 'A defined build with a defined outcome. Website, e-commerce platform, rebrand, or a specific automation system.',
    points: [
      'Discovery, strategy and architecture',
      'Design system and full build',
      'Technical SEO foundation and schema',
      'Analytics, tracking and CRM wiring',
      'Launch, redirect mapping and handover',
    ],
    cta: 'Scope a project',
  },
  {
    name: 'Growth Partnership',
    tag: 'Monthly retainer',
    body: 'The compounding engagement. We run and improve the system month over month against agreed commercial targets.',
    points: [
      'SEO, content and authority building',
      'Paid media management and creative',
      'Conversion testing and iteration',
      'AI and automation coverage expansion',
      'Reporting tied to pipeline and revenue',
    ],
    cta: 'Discuss a partnership',
    featured: true,
  },
  {
    name: 'Advisory',
    tag: 'Strategic',
    body: 'For teams with in-house capability that need direction, architecture or a second opinion before committing budget.',
    points: [
      'Digital and channel strategy',
      'Technical and SEO audits',
      'Martech and CRM architecture',
      'Vendor and scope review',
      'Roadmap and prioritisation',
    ],
    cta: 'Book advisory time',
  },
]

export function WhyDigitalKingz() {
  return (
    <Section className="border-y border-ink-100/8 bg-ink-900/40">
      <div className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Why Digital Kingz"
            title="Six reasons this works when the last three agencies didn't."
            titleClassName="text-display-lg"
          />
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100/8 bg-ink-100/8 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 50}>
              <div className="flex h-full flex-col gap-3 bg-ink-950 p-7">
                <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-brand-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[1.0625rem] font-medium leading-snug text-ink-50">
                  {reason.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-400">{reason.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function Engagement() {
  return (
    <Section id="engagement">
      <div className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="How we work together"
            title="Three ways to engage."
            titleClassName="text-display-lg"
            description="Pricing depends on scope, competitive density and what a customer is worth to you. We quote after a discovery conversation, never from a template, and we will tell you if the numbers do not support the work."
          />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {ENGAGEMENTS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 70}>
              <div
                className={`relative flex h-full flex-col gap-6 rounded-2xl border p-7 transition-colors duration-300 md:p-8 ${
                  tier.featured
                    ? 'border-brand-500/30 bg-brand-500/[0.04]'
                    : 'border-ink-100/8 bg-ink-900'
                }`}
              >
                {tier.featured ? (
                  <span className="absolute -top-2.5 left-8 rounded-full bg-brand-500 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-ink-950">
                    Most common
                  </span>
                ) : null}

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-500">
                    {tier.tag}
                  </span>
                  <h3 className="text-display-sm">{tier.name}</h3>
                  <p className="text-sm leading-relaxed text-ink-400">{tier.body}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-2.5 border-t border-ink-100/8 pt-5">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-ink-300">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-brand-500"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`group inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors ${
                    tier.featured
                      ? 'bg-brand-500 text-ink-950 hover:bg-brand-400'
                      : 'border border-ink-100/12 text-ink-100 hover:border-brand-500/40'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
