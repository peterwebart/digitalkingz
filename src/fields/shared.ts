import type { Field } from 'payload'

/**
 * Shared field factories.
 *
 * Every content collection needs the same slug, SEO group and repeatable
 * title/body structures. Defining them once keeps the admin UI consistent and
 * the schema honest.
 */

export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: `URL segment. Lowercase, hyphenated. Derived from ${from} if left blank.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const source = typeof value === 'string' && value.length > 0 ? value : (data?.[from] as string | undefined)
        if (!source) return value
        return source
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      },
    ],
  },
})

export const seoGroup: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { description: 'Controls the <title>, meta description and social preview for this page.' },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      required: true,
      maxLength: 70,
      admin: { description: 'Aim for 50-60 characters. Google truncates beyond roughly 60.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: { description: 'Aim for 140-158 characters. Written to earn the click, not to describe.' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. Falls back to the generated brand card if empty.' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Exclude this page from search engines and the sitemap.' },
    },
  ],
}

export const heroGroup: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea', required: true },
  ],
}

export const paragraphsField = (name: string, label: string, description?: string): Field => ({
  name,
  type: 'textarea',
  label,
  required: true,
  admin: {
    rows: 8,
    description: description ?? 'Separate paragraphs with a blank line.',
  },
})

export const titledBodyArray = (
  name: string,
  label: string,
  options: { minRows?: number; maxRows?: number; description?: string } = {},
): Field => ({
  name,
  type: 'array',
  label,
  minRows: options.minRows ?? 1,
  maxRows: options.maxRows,
  required: true,
  admin: {
    initCollapsed: true,
    description: options.description,
    components: {
      RowLabel: '@/components/admin/RowLabelTitle#RowLabelTitle',
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true, admin: { rows: 3 } },
  ],
})

export const faqsField: Field = {
  name: 'faqs',
  type: 'array',
  label: 'FAQs',
  minRows: 1,
  admin: {
    initCollapsed: true,
    description:
      'Rendered as FAQPage structured data. Answer the question directly in the first sentence so AI answer engines can lift it cleanly.',
    components: {
      RowLabel: '@/components/admin/RowLabelQuestion#RowLabelQuestion',
    },
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true, admin: { rows: 4 } },
  ],
}

export const deepDiveField: Field = {
  name: 'deepDive',
  type: 'array',
  label: 'Long-form sections',
  minRows: 1,
  admin: {
    initCollapsed: true,
    description: 'Carries the semantic SEO weight of the page. Each heading renders as an H2.',
    components: {
      RowLabel: '@/components/admin/RowLabelHeading#RowLabelHeading',
    },
  },
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'paragraphs',
      type: 'textarea',
      required: true,
      admin: { rows: 10, description: 'Separate paragraphs with a blank line.' },
    },
  ],
}

export const ctaGroup: Field = {
  name: 'cta',
  type: 'group',
  label: 'Closing call to action',
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
  ],
}

export const iconField: Field = {
  name: 'icon',
  type: 'text',
  required: true,
  defaultValue: 'Sparkles',
  admin: {
    position: 'sidebar',
    description: 'A lucide-react icon name in PascalCase, e.g. MapPin. See lucide.dev/icons.',
  },
}

export const orderField: Field = {
  name: 'order',
  type: 'number',
  required: true,
  defaultValue: 100,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Lower numbers appear first in navigation, hubs and the sitemap.',
  },
}
