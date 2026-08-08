import type { Metadata } from 'next'
import { LegalPage } from '@/components/sections/LegalPage'
import { getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility Statement',
  description:
    'How digitalkingz.com is built for accessibility, the standard we work to, known limitations, and how to report a barrier.',
  path: '/accessibility',
})

const UPDATED = '7 August 2026'

export default async function AccessibilityPage() {
  const settings = await getSiteSettings()
  const email = settings.email ?? 'hello@digitalkingz.com'

  return (
    <LegalPage
      title="Accessibility Statement"
      intro="We build for accessibility because a site that excludes people also excludes customers. This page sets out what we do, what we know is imperfect, and how to tell us when we have got it wrong."
      updated={UPDATED}
      crumbs={[
        { name: 'Home', path: '/' },
        { name: 'Accessibility', path: '/accessibility' },
      ]}
      sections={[
        {
          heading: 'The standard we work to',
          paragraphs: [
            'We aim to meet the Web Content Accessibility Guidelines at level AA. That standard covers perceivable content, operable interfaces, understandable language and robust markup that works with assistive technology. We apply the same standard to client projects, not only to our own site.',
          ],
        },
        {
          heading: 'What we do',
          bullets: [
            'Semantic HTML, so headings, lists, landmarks and form labels convey structure to screen readers rather than relying on visual styling alone.',
            'Full keyboard operability, with a visible focus indicator on every interactive element and a skip link to the main content.',
            'Colour contrast checked against the AA thresholds for body text, headings and interface elements.',
            'Text alternatives for meaningful images, and accessible names and descriptions for the diagrams used throughout the site.',
            'Respect for the reduced motion preference: where a visitor has asked their system to minimise animation, animation is disabled rather than merely shortened.',
            'Form fields with programmatically associated labels, hints and error messages, and errors announced rather than only shown in colour.',
            'Interactive components built on native elements where possible, so browser and assistive technology behaviour comes as standard rather than being reimplemented.',
          ],
        },
        {
          heading: 'Known limitations',
          paragraphs: [
            'The before and after comparison control is operable with a keyboard using the arrow keys, but the visual comparison it produces is inherently a sighted experience. The same information is provided in the two lists immediately below it, so no content is available only through that control.',
            'Where we embed third party content such as a scheduling tool, we do not control that provider’s accessibility. If an embedded tool creates a barrier for you, contact us and we will provide an alternative way to complete the same task.',
          ],
        },
        {
          heading: 'Assistive technology',
          paragraphs: [
            'The site is developed to work with current versions of common screen readers and browser combinations, and with browser zoom and text resizing up to 200 percent without loss of content or functionality.',
          ],
        },
        {
          heading: 'Tell us about a barrier',
          paragraphs: [
            `If any part of this site prevents you from doing what you came to do, email ${email} with the page address and a description of the problem. We treat accessibility reports as defects rather than feature requests, and we will confirm receipt and tell you what we intend to do about it.`,
            'If you need information from this site in an alternative format, or would prefer to make an enquiry by phone or email rather than through the form, contact us and we will accommodate that.',
          ],
        },
        {
          heading: 'Ongoing work',
          paragraphs: [
            'Accessibility is a continuing obligation rather than a launch checklist. New pages and components are assessed before release, and we re-check the site when we make significant changes. This statement is updated when the position changes.',
          ],
        },
      ]}
    />
  )
}
