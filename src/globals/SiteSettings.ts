import type { GlobalConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description:
      'Organization-level facts. These feed the footer, the contact page and the Organization structured data that search engines and AI answer engines read.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'legalName', type: 'text', required: true, defaultValue: 'Digital Kingz Development' },
            { name: 'brandName', type: 'text', required: true, defaultValue: 'Digital Kingz' },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              defaultValue: 'We Build Digital Systems That Grow Businesses.',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                rows: 4,
                description:
                  'The canonical one-paragraph definition of the company. Used in Organization schema and as the default meta description.',
              },
            },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'foundingYear',
              type: 'number',
              admin: { description: 'Leave empty unless accurate. Published in Organization schema.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email', required: true, defaultValue: 'solutions@digitalkingz.com' },
            { name: 'phone', type: 'text' },
            {
              name: 'bookingUrl',
              type: 'text',
              admin: {
                description:
                  'Calendar link used by the "Book a Strategy Call" button. Leave empty to route that button to the contact page instead.',
              },
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'streetAddress', type: 'text' },
                { name: 'locality', type: 'text', label: 'City' },
                { name: 'region', type: 'text', label: 'Province / State' },
                { name: 'postalCode', type: 'text' },
                { name: 'country', type: 'text' },
              ],
              admin: {
                description:
                  'Optional. Complete this before running Local SEO on your own brand, and keep it identical to your Google Business Profile.',
              },
            },
            {
              name: 'serviceAreas',
              type: 'array',
              label: 'Service areas',
              fields: [{ name: 'name', type: 'text', required: true }],
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'Social & Entity',
          description:
            'Every profile listed here is published as a sameAs link. Consistent entity signals are what let AI answer engines resolve who you are.',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    'LinkedIn',
                    'Instagram',
                    'Facebook',
                    'X',
                    'YouTube',
                    'GitHub',
                    'Google Business Profile',
                    'Clutch',
                    'Other',
                  ].map((p) => ({ label: p, value: p })),
                },
                { name: 'url', type: 'text', required: true },
              ],
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'Proof',
          description:
            'The homepage trust bar. Leave both lists empty and the site falls back to its verifiable engineering standards instead. Only publish figures and client names you can evidence and have permission to use.',
          fields: [
            {
              name: 'trustStats',
              type: 'array',
              label: 'Trust statistics',
              maxRows: 4,
              admin: {
                initCollapsed: true,
                description:
                  'Four at most. Every figure here should be defensible if a prospect asks you to back it up on a call.',
                components: { RowLabel: '@/components/admin/RowLabelValue#RowLabelValue' },
              },
              fields: [
                { name: 'value', type: 'text', required: true, admin: { description: 'e.g. 150+' } },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. Projects delivered' },
                },
                {
                  name: 'icon',
                  type: 'text',
                  defaultValue: 'Rocket',
                  admin: { description: 'lucide-react icon name in PascalCase.' },
                },
              ],
            },
            {
              name: 'clients',
              type: 'array',
              label: 'Client logos',
              admin: {
                initCollapsed: true,
                description:
                  'Only add clients who have agreed to be named. Upload a logo, or leave it empty to render the name as a wordmark.',
                components: { RowLabel: '@/components/admin/RowLabelName#RowLabelName' },
              },
              fields: [
                { name: 'name', type: 'text', required: true },
                {
                  name: 'descriptor',
                  type: 'text',
                  admin: { description: 'Small line under the name, e.g. Law Firm.' },
                },
                { name: 'logo', type: 'upload', relationTo: 'media' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Announcement',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                { name: 'text', type: 'text' },
                { name: 'linkLabel', type: 'text' },
                { name: 'linkUrl', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
