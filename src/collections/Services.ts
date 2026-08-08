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

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'updatedAt'],
    description:
      'Service pages live at /services/[slug]. Each one is a standalone ranking and conversion asset.',
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
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      defaultValue: 'build',
      options: [
        { label: 'Build', value: 'build' },
        { label: 'Get Found', value: 'get-found' },
        { label: 'Convert', value: 'convert' },
        { label: 'Automate', value: 'automate' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Groups the service in the mega menu and on the services hub.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'navLabel',
              type: 'text',
              required: true,
              admin: { description: 'Short label for navigation and cards.' },
            },
            {
              name: 'tagline',
              type: 'textarea',
              required: true,
              admin: { rows: 2, description: 'One sentence. Shown on service cards and in the mega menu.' },
            },
            heroGroup,
            paragraphsField('intro', 'Introduction'),
          ],
        },
        {
          label: 'Problem & Scope',
          fields: [
            { name: 'problemsHeading', type: 'text', required: true },
            titledBodyArray('problems', 'Problems this solves', { minRows: 2 }),
            { name: 'includedHeading', type: 'text', required: true },
            { name: 'includedIntro', type: 'textarea', required: true, admin: { rows: 3 } },
            titledBodyArray('included', "What's included", { minRows: 3 }),
          ],
        },
        {
          label: 'Approach & Outcomes',
          fields: [
            { name: 'approachHeading', type: 'text', required: true },
            {
              name: 'approach',
              type: 'array',
              label: 'Approach steps',
              minRows: 2,
              required: true,
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/components/admin/RowLabelTitle#RowLabelTitle' },
              },
              fields: [
                { name: 'step', type: 'text', required: true, admin: { description: 'e.g. 01' } },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true, admin: { rows: 3 } },
              ],
            },
            { name: 'outcomesHeading', type: 'text', required: true },
            { name: 'outcomesIntro', type: 'textarea', required: true, admin: { rows: 3 } },
            titledBodyArray('outcomes', 'Business outcomes', {
              minRows: 2,
              description:
                'Qualitative outcomes only. Never publish a performance number that has not been verified against real client data.',
            }),
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
              admin: { description: 'Drives the internal linking block at the foot of the page.' },
            },
            {
              name: 'relatedIndustries',
              type: 'relationship',
              relationTo: 'industries',
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
