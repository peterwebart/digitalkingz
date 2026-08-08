import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/access'
import { seoGroup, slugField, titledBodyArray } from '@/fields/shared'

/**
 * Case studies ship as an empty collection deliberately.
 *
 * The brief is explicit: use real metrics only when verified, never invent
 * performance numbers. So rather than seeding fabricated results, the /work
 * route renders the capability presentation until real case studies exist,
 * and switches to the case study index automatically once the first document
 * is published here.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'industry', '_status', 'updatedAt'],
    description:
      'Publish only verified results. Every number entered here should be traceable to an analytics export or a client sign-off.',
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/work/${data?.slug ?? ''}`,
    },
  },
  access: {
    create: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
    maxPerDoc: 25,
  },
  defaultSort: 'order',
  fields: [
    slugField('title'),
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the homepage featured work row.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'client', type: 'text', required: true, admin: { description: 'Confirm the client has approved being named.' } },
            {
              name: 'industry',
              type: 'relationship',
              relationTo: 'industries',
              admin: { description: 'Links the case study into the industry hub.' },
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
            },
            { name: 'summary', type: 'textarea', required: true, admin: { rows: 3 } },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            { name: 'liveUrl', type: 'text', admin: { description: 'Optional link to the live site.' } },
          ],
        },
        {
          label: 'The Work',
          fields: [
            { name: 'challenge', type: 'textarea', required: true, admin: { rows: 6, description: 'Separate paragraphs with a blank line.' } },
            { name: 'strategy', type: 'textarea', required: true, admin: { rows: 6 } },
            { name: 'execution', type: 'textarea', required: true, admin: { rows: 6 } },
            titledBodyArray('deliverables', 'What we delivered', { minRows: 1 }),
            {
              name: 'technologies',
              type: 'array',
              label: 'Technologies used',
              fields: [{ name: 'name', type: 'text', required: true }],
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'Results',
          description:
            'Leave empty rather than estimating. An empty results section is more credible than an unverifiable one.',
          fields: [
            {
              name: 'results',
              type: 'array',
              label: 'Verified results',
              admin: {
                initCollapsed: true,
                description:
                  'Only publish figures you can evidence. Record the measurement window and source for each.',
                components: { RowLabel: '@/components/admin/RowLabelMetric#RowLabelMetric' },
              },
              fields: [
                { name: 'metric', type: 'text', required: true, admin: { description: 'e.g. Organic sessions' } },
                { name: 'value', type: 'text', required: true, admin: { description: 'e.g. +140%' } },
                { name: 'period', type: 'text', required: true, admin: { description: 'e.g. 6 months post-launch' } },
                {
                  name: 'source',
                  type: 'text',
                  required: true,
                  admin: { description: 'Where this number came from, e.g. GA4 export, Search Console.' },
                },
              ],
            },
            {
              name: 'beforeAfter',
              type: 'group',
              label: 'Before / after',
              fields: [
                { name: 'beforeImage', type: 'upload', relationTo: 'media' },
                { name: 'afterImage', type: 'upload', relationTo: 'media' },
                { name: 'beforeNotes', type: 'textarea', admin: { rows: 4 } },
                { name: 'afterNotes', type: 'textarea', admin: { rows: 4 } },
              ],
            },
            {
              name: 'testimonial',
              type: 'relationship',
              relationTo: 'testimonials',
            },
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

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Content',
    useAsTitle: 'author',
    defaultColumns: ['author', 'company', 'updatedAt'],
    description:
      'Publish real, attributed testimonials only. Anything unattributed reads as invented and costs more trust than it earns.',
  },
  access: {
    create: authenticated,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true, admin: { rows: 4 } },
    { name: 'author', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
