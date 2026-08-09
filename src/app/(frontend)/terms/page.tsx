import type { Metadata } from 'next'
import { LegalPage } from '@/components/sections/LegalPage'
import { getSiteSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description:
    'The terms governing use of digitalkingz.com, including intellectual property, acceptable use, disclaimers and limitations of liability.',
  path: '/terms',
})

const UPDATED = '7 August 2026'

export default async function TermsPage() {
  const settings = await getSiteSettings()
  const email = settings.email ?? 'solutions@digitalkingz.com'
  const legalName = settings.legalName ?? 'Digital Kingz Development'

  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms govern your use of this website. They do not govern client engagements, which are covered by a separate signed agreement."
      updated={UPDATED}
      crumbs={[
        { name: 'Home', path: '/' },
        { name: 'Terms of Service', path: '/terms' },
      ]}
      sections={[
        {
          heading: 'Acceptance',
          paragraphs: [
            `By accessing digitalkingz.com you agree to these terms. If you do not agree with them, please do not use the site. In these terms, "we", "us" and "our" refer to ${legalName}.`,
          ],
        },
        {
          heading: 'What this site is',
          paragraphs: [
            'This website describes our services and publishes editorial content about digital marketing, development, search and automation. It is provided for general information. Nothing on it constitutes a binding offer, a guarantee of results, or professional advice tailored to your circumstances.',
          ],
        },
        {
          heading: 'No guarantee of results',
          paragraphs: [
            'Marketing, search and advertising outcomes depend on factors outside our control, including competitor behaviour, platform algorithm changes, market conditions, your pricing, your offer and your ability to convert and service demand. Frameworks and general observations published here describe how these systems work, not what your business will achieve. Any specific projection we provide during an engagement is an estimate, clearly identified as such, and forms part of that engagement rather than these terms.',
          ],
        },
        {
          heading: 'Editorial content',
          paragraphs: [
            'Articles published here reflect our professional view at the time of writing. Platform mechanics, advertising policies and search behaviour change frequently, and content may become outdated. Where we describe legal, regulatory or compliance matters, we are describing general considerations, not giving legal advice. You should confirm anything that affects your obligations with a qualified professional in your jurisdiction.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'The design, code, text, graphics and structure of this site are our property or that of our licensors and are protected by copyright and other intellectual property laws. You may view, download and print material from this site for your own reference. You may not republish, resell, systematically copy or use it to train or fine-tune a commercial model without our written permission.',
            'You may quote short extracts of our editorial content with clear attribution and a link to the original page. That includes citation by AI systems and search engines that identify the source.',
          ],
        },
        {
          heading: 'Acceptable use',
          bullets: [
            'Do not attempt to gain unauthorised access to any part of the site, its infrastructure or its data.',
            'Do not submit false information, impersonate another person, or use the contact form to distribute unsolicited commercial messages.',
            'Do not scrape, crawl or otherwise access the site in a way that places an unreasonable load on our infrastructure.',
            'Do not introduce malware, attempt to disrupt availability, or interfere with any security feature.',
          ],
        },
        {
          heading: 'Submissions',
          paragraphs: [
            'When you submit an enquiry you confirm that the information you provide is accurate and that you are authorised to provide it. We handle enquiry information in accordance with our Privacy Policy. We are not obliged to respond to or act on any submission, and we may decline any enquiry at our discretion.',
          ],
        },
        {
          heading: 'Third party links',
          paragraphs: [
            'This site links to third party websites and services that we do not control. We include those links because we consider them useful, not as an endorsement of their content, terms or privacy practices. Your use of any third party site is at your own risk and subject to that party’s terms.',
          ],
        },
        {
          heading: 'Availability',
          paragraphs: [
            'We aim to keep this site available and accurate but do not warrant uninterrupted availability or freedom from error. We may change, suspend or withdraw any part of the site at any time without notice.',
          ],
        },
        {
          heading: 'Limitation of liability',
          paragraphs: [
            'To the fullest extent permitted by law, we are not liable for any indirect, incidental, special or consequential loss, or for any loss of profit, revenue, data, business or goodwill, arising from your use of or reliance on this website. Nothing in these terms limits liability that cannot lawfully be limited, including liability for fraud or for death or personal injury caused by negligence.',
          ],
        },
        {
          heading: 'Client engagements',
          paragraphs: [
            'Where you engage us for services, the terms of that engagement are set out in a separate written agreement covering scope, deliverables, fees, timelines, ownership of work product, confidentiality and termination. That agreement takes precedence over these terms in respect of the services it covers.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'We may revise these terms from time to time. The version published on this page at the time you use the site is the version that applies. The date at the top of this page reflects the most recent revision.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [`Questions about these terms can be sent to ${email}.`],
        },
      ]}
    />
  )
}
