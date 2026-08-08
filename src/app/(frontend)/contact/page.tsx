import type { Metadata } from 'next'
import { Calendar, Clock, Mail, MessageSquare, Phone } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import { JsonLd } from '@/components/JsonLd'
import { FAQSection } from '@/components/sections/FAQ'
import { PageHero } from '@/components/sections/PageHero'
import { getSiteSettings } from '@/lib/payload'
import { breadcrumbSchema, buildMetadata, faqSchema } from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Start a Project | Contact Digital Kingz',
  description:
    'Tell us what you sell, what a customer is worth and where the pipeline stalls. We reply within one business day with a time to talk or an honest reason we are not the right fit.',
  path: '/contact',
})

const WHAT_HAPPENS = [
  {
    icon: MessageSquare,
    title: 'We read it properly',
    body: 'Not an auto-responder and not a junior. Your enquiry is read by someone who can tell you whether the work makes commercial sense.',
  },
  {
    icon: Clock,
    title: 'Reply within one business day',
    body: 'Either a proposed time to talk, a few clarifying questions, or a direct explanation of why we are not the right fit for this.',
  },
  {
    icon: Calendar,
    title: 'A 30 minute discovery call',
    body: 'We map your current system, find where revenue is leaking and tell you what fixing it involves. You leave with the diagnosis whether or not you hire us.',
  },
]

const CONTACT_FAQS = [
  {
    question: 'What happens after I submit this form?',
    answer:
      'A person reads it and replies within one business day. If there is a fit, the next step is a 30 minute discovery call where we map your current acquisition system and identify the constraint. If there is not a fit, we say so directly rather than putting you through a sales process that ends in a decline.',
  },
  {
    question: 'Why do you ask for budget?',
    answer:
      'Because it determines what we can honestly propose. A range prevents us designing a system your business cannot fund, and prevents you sitting through a proposal that was never realistic. If you genuinely do not know yet, select that option and we will help you work out what the numbers support.',
  },
  {
    question: 'Do you charge for the discovery call?',
    answer:
      'No. The discovery call is free and you keep whatever comes out of it. We do this because the diagnosis is the fastest way for both sides to establish whether the work is worth doing, and because a business that leaves with a clear picture usually comes back even if the timing was wrong.',
  },
  {
    question: 'What information makes the first call most useful?',
    answer:
      'Three numbers: what an average customer is worth to you, roughly what you currently pay to acquire one, and how much additional demand you could actually service. With those we can do real arithmetic in the first conversation instead of talking in generalities.',
  },
  {
    question: 'Do you work with businesses outside of your listed industries?',
    answer:
      'Yes. The listed industries are where we have the deepest pattern library, so we start further along, but the underlying system applies to any business with a considered purchase and a measurable customer value. Tell us your numbers and we will be straight about whether it fits.',
  },
  {
    question: 'Will my details be added to a mailing list?',
    answer:
      'No. The form exists to start a conversation about a specific project, not to build a marketing list. We do not sell or share enquiry details, and there is no automated drip sequence attached to this form.',
  },
]

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema(crumbs),
          faqSchema(CONTACT_FAQS),
          {
            '@type': 'ContactPage',
            name: 'Contact Digital Kingz',
            description:
              'Start a project or book a strategy call with Digital Kingz Development.',
          },
        ]}
      />

      <PageHero
        eyebrow="Start a project"
        title="Tell us what a customer is worth. We'll tell you what the system should cost."
        description="Every recommendation we make is arithmetic on your numbers, not a package off a price list. The more context you give here, the more useful the first conversation is."
        breadcrumbs={crumbs}
        compact
      />

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <aside className="flex flex-col gap-8 lg:col-span-5">
              <div className="flex flex-col gap-6 rounded-2xl border border-ink-100/8 bg-ink-100/[0.02] p-7">
                <h2 className="text-display-sm">What happens next</h2>
                <ol className="flex flex-col gap-6">
                  {WHAT_HAPPENS.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-ink-100/10 bg-ink-100/[0.03]">
                        <step.icon
                          className="size-4 text-brand-500"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-baseline gap-2">
                          <span className="font-mono text-[0.625rem] text-brand-600">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[0.9375rem] font-medium text-ink-50">
                            {step.title}
                          </span>
                        </span>
                        <p className="text-sm leading-relaxed text-ink-400">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div id="book" className="flex flex-col gap-5 rounded-2xl border border-brand-500/20 bg-brand-500/[0.03] p-7 scroll-mt-28">
                <h2 className="text-display-sm">Prefer to just talk?</h2>
                <p className="text-sm leading-relaxed text-ink-300">
                  If you would rather skip the form, book a 30 minute strategy call directly or
                  email us. Same outcome, fewer fields.
                </p>
                <div className="flex flex-col gap-2.5">
                  {settings.bookingUrl ? (
                    <a
                      href={settings.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
                    >
                      <Calendar className="size-4" strokeWidth={2} aria-hidden="true" />
                      Book a strategy call
                    </a>
                  ) : null}
                  {settings.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-100/12 text-sm font-medium text-ink-100 transition-colors hover:border-brand-500/40"
                    >
                      <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      {settings.email}
                    </a>
                  ) : null}
                  {settings.phone ? (
                    <a
                      href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-100/12 text-sm font-medium text-ink-100 transition-colors hover:border-brand-500/40"
                    >
                      <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      {settings.phone}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-ink-100/8 p-7">
                <h2 className="mb-3 font-mono text-eyebrow uppercase text-ink-500">
                  Who this is for
                </h2>
                <p className="text-sm leading-relaxed text-ink-400">
                  Businesses with a considered purchase, a customer worth measuring, and the
                  capacity to service more demand than they currently get. If you need a five page
                  brochure site with no growth requirement, there are cheaper and faster options
                  than us, and we will point you at them.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <FAQSection
        faqs={CONTACT_FAQS}
        eyebrow="Before you send"
        title="What to expect"
      />
    </>
  )
}
