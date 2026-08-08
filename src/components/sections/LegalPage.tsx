import { Breadcrumbs, type Crumb } from '@/components/sections/PageHero'

export interface LegalSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

export function LegalPage({
  title,
  intro,
  updated,
  sections,
  crumbs,
}: {
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
  crumbs: Crumb[]
}) {
  return (
    <article className="py-16 md:py-20">
      <div className="container-page">
        <div className="container-prose flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <Breadcrumbs items={crumbs} />
            <h1 className="text-display-lg">{title}</h1>
            <p className="text-lead text-ink-400">{intro}</p>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-600">
              Last updated {updated}
            </p>
          </div>

          <div className="rule-fade" />

          <div className="prose-dk">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
