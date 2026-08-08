import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import {
  ctaGroup,
  deepDiveField,
  faqsField,
  heroGroup,
  iconField,
  orderField,
  paragraphsField,
  seoGroup,
  slugField,
  titledBodyArray,
} from '@/fields/shared'

export const Industries: CollectionConfig = {
  slug: 'industries',
  labels: { singular: 'Industry', plural: 'Industries' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
    description:
      'Industry pages live at /industries/[slug]. Each must explain problems specific to that vertical, not a renamed generic page.',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    slugField('title'),
    iconField,
    orderField,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'navLabel', type: 'text', required: true },
            { name: 'tagline', type: 'textarea', required: true, admin: { rows: 2 } },
            heroGroup,
            paragraphsField('intro', 'Introduction'),
          ],
        },
        {
          label: 'Challenges & Buyers',
          fields: [
            { name: 'challengesHeading', type: 'text', required: true },
            { name: 'challengesIntro', type: 'textarea', required: true, admin: { rows: 3 } },
            titledBodyArray('challenges', 'Industry challenges', { minRows: 2 }),
            { name: 'buyerBehaviourHeading', type: 'text', required: true },
            paragraphsField(
              'buyerBehaviour',
              'How buyers in this industry search and decide',
              'Separate paragraphs with a blank line. This section is what makes the page vertical-specific rather than generic.',
            ),
          ],
        },
        {
          label: 'Growth System',
          fields: [
            { name: 'systemHeading', type: 'text', required: true },
            { name: 'systemIntro', type: 'textarea', required: true, admin: { rows: 3 } },
            titledBodyArray('system', 'System components', { minRows: 3 }),
          ],
        },
        {
          label: 'Long-form & FAQ',
          fields: [deepDiveField, faqsField],
        },
        {
          label: 'Linking & CTA',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
            },
            ctaGroup,
          ],
        },
        {
          label: 'SEO',
          fields: [seoGroup],
        },
      ],
    },
  ],
}
