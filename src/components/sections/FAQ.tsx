import { Plus } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'

export interface FaqItem {
  question?: string | null
  answer?: string | null
  id?: string | null
}

/**
 * Native details/summary rather than a JS accordion.
 *
 * The content stays in the DOM and in the initial HTML, which matters because
 * these blocks are also the FAQPage structured data that AI answer engines
 * lift from. Keyboard and screen reader behaviour comes free.
 */
export function FAQList({ faqs }: { faqs: FaqItem[] }) {
  const valid = faqs.filter((f) => f.question && f.answer)
  if (valid.length === 0) return null

  return (
    <div className="divide-y divide-ink-100/8 border-y border-ink-100/8">
      {valid.map((faq, i) => (
        <details key={faq.id ?? i} name="faq" className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-[1.0625rem] font-medium leading-snug text-ink-100 transition-colors group-hover:text-ink-50 md:text-lg">
              {faq.question}
            </h3>
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-ink-100/12 text-ink-400 transition-all duration-300 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:border-brand-500/40 group-open:text-brand-400">
              <Plus className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </span>
          </summary>
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-[var(--ease-out-expo)] group-open:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="max-w-3xl pb-6 pr-12 text-[0.9375rem] leading-relaxed text-ink-400 md:text-base">
                {faq.answer}
              </p>
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}

export function FAQSection({
  faqs,
  eyebrow = 'Questions',
  title = 'Answers before you ask',
  description,
}: {
  faqs: FaqItem[]
  eyebrow?: string
  title?: string
  description?: string
}) {
  if (faqs.filter((f) => f.question && f.answer).length === 0) return null

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <Reveal delay={80}>
            <FAQList faqs={faqs} />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
