import type { Block } from 'payload'

/**
 * Custom rich-text blocks.
 *
 * Lexical covers prose, headings and lists natively. Callouts and comparison
 * tables are editorial devices we use often enough to deserve first-class
 * blocks rather than hand-written HTML in a text field.
 */

export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true, admin: { rows: 4 } },
  ],
}

export const DataTableBlock: Block = {
  slug: 'dataTable',
  interfaceName: 'DataTableBlock',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Rendered as the table caption and used by screen readers.' },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        rows: 10,
        description:
          'One row per line, cells separated by a pipe character. The first line is the header row.',
      },
    },
  ],
}
