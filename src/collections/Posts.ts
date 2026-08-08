import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { anyone, authenticated, publishedOrAuthenticated } from '@/access'
import { CalloutBlock, DataTableBlock } from '@/blocks'
import { faqsField, seoGroup, slugField } from '@/fields/shared'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Article', plural: 'Articles' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status', 'updatedAt'],
    description: 'Articles live at /growth-hub/[slug].',
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/growth-hub/${data?.slug ?? ''}`,
    },
  },
  access: {
    create: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
  defaultSort: '-publishedAt',
  fields: [
    slugField('title'),
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Surface this article on the homepage insights row.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: { rows: 3, description: 'One or two sentences. Shown on cards and under the article title.' },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional. A generated gradient card is used when empty.' },
            },
            {
              name: 'body',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({ blocks: [CalloutBlock, DataTableBlock] }),
                ],
              }),
            },
          ],
        },
        {
          label: 'FAQ & Linking',
          fields: [
            faqsField,
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              admin: { description: 'Rendered as the conversion block at the end of the article.' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoGroup],
        },
      ],
    },
    {
      name: 'readingMinutes',
      type: 'number',
      access: { update: () => false },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculated automatically on save.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Estimate reading time from the Lexical tree so the value stays in
        // sync with edits made in the admin panel.
        const countText = (node: unknown): number => {
          if (!node || typeof node !== 'object') return 0
          const n = node as { text?: unknown; children?: unknown }
          let words = 0
          if (typeof n.text === 'string') {
            words += n.text.split(/\s+/).filter(Boolean).length
          }
          if (Array.isArray(n.children)) {
            for (const child of n.children) words += countText(child)
          }
          return words
        }
        const root = (data?.body as { root?: unknown } | undefined)?.root
        const words = countText(root)
        if (words > 0) data.readingMinutes = Math.max(1, Math.round(words / 225))
        return data
      },
    ],
  },
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    slugField('title'),
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true, admin: { rows: 3 } },
  ],
}

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'updatedAt'],
    description: 'Author entities. Published as Person structured data to support E-E-A-T signals.',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    slugField('name'),
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea', required: true, admin: { rows: 5 } },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'links',
      type: 'array',
      label: 'Profile links',
      admin: {
        description: 'Used for the sameAs property in Person schema. Strengthens entity resolution.',
        initCollapsed: true,
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
