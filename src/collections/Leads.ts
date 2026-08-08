import type { CollectionConfig } from 'payload'
import { authenticated, noone } from '@/access'

export const BUDGET_OPTIONS = [
  { label: 'Under $5,000', value: 'under-5k', score: 5 },
  { label: '$5,000 - $15,000', value: '5k-15k', score: 15 },
  { label: '$15,000 - $35,000', value: '15k-35k', score: 25 },
  { label: '$35,000 - $75,000', value: '35k-75k', score: 32 },
  { label: '$75,000+', value: '75k-plus', score: 35 },
  { label: 'Not sure yet', value: 'unsure', score: 10 },
] as const

export const TIMELINE_OPTIONS = [
  { label: 'Urgent - within 30 days', value: 'urgent', score: 25 },
  { label: '1 - 3 months', value: '1-3-months', score: 20 },
  { label: '3 - 6 months', value: '3-6-months', score: 12 },
  { label: 'Exploring options', value: 'exploring', score: 5 },
] as const

export const SERVICE_INTEREST_OPTIONS = [
  { label: 'Web Design', value: 'web-design' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'SEO', value: 'seo' },
  { label: 'Local SEO', value: 'local-seo' },
  { label: 'Google Ads', value: 'google-ads' },
  { label: 'Meta Ads', value: 'meta-ads' },
  { label: 'Conversion Optimization', value: 'conversion-optimization' },
  { label: 'AI & Automation', value: 'ai-automation' },
  { label: 'CRM & Marketing Automation', value: 'crm-systems' },
  { label: 'Branding & Strategy', value: 'branding' },
  { label: 'Website Maintenance', value: 'website-maintenance' },
  { label: 'A complete growth system', value: 'full-system' },
] as const

/**
 * Literal value tuples.
 *
 * `Array.prototype.map` widens to `string[]`, which loses the literal union
 * Zod and Payload both need. Declaring them explicitly keeps the form schema,
 * the collection field and the generated types in agreement.
 */
export const BUDGET_VALUES = [
  'under-5k',
  '5k-15k',
  '15k-35k',
  '35k-75k',
  '75k-plus',
  'unsure',
] as const

export const TIMELINE_VALUES = ['urgent', '1-3-months', '3-6-months', 'exploring'] as const

export const SERVICE_INTEREST_VALUES = [
  'web-design',
  'web-development',
  'ecommerce',
  'seo',
  'local-seo',
  'google-ads',
  'meta-ads',
  'conversion-optimization',
  'ai-automation',
  'crm-systems',
  'branding',
  'website-maintenance',
  'full-system',
] as const

export type BudgetValue = (typeof BUDGET_VALUES)[number]
export type TimelineValue = (typeof TIMELINE_VALUES)[number]
export type ServiceInterestValue = (typeof SERVICE_INTEREST_VALUES)[number]

const budgetScore = (value?: string | null) =>
  BUDGET_OPTIONS.find((o) => o.value === value)?.score ?? 0

const timelineScore = (value?: string | null) =>
  TIMELINE_OPTIONS.find((o) => o.value === value)?.score ?? 0

/**
 * Deterministic lead score, 0-100.
 *
 * Budget and timeline carry the most weight because together they predict
 * whether a conversation converts to a project. The remaining points reward
 * signals of a real business with a real brief.
 */
export function scoreLead(input: {
  budget?: string | null
  timeline?: string | null
  website?: string | null
  company?: string | null
  message?: string | null
  services?: string[] | null
  phone?: string | null
}): number {
  let score = budgetScore(input.budget) + timelineScore(input.timeline)

  if (input.website && input.website.trim().length > 3) score += 10
  if (input.company && input.company.trim().length > 1) score += 5
  if (input.phone && input.phone.trim().length > 6) score += 5
  if ((input.message?.trim().length ?? 0) > 160) score += 10
  else if ((input.message?.trim().length ?? 0) > 60) score += 5
  if ((input.services?.length ?? 0) >= 3 || input.services?.includes('full-system')) score += 10

  return Math.max(0, Math.min(100, score))
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    group: 'Pipeline',
    useAsTitle: 'company',
    defaultColumns: ['company', 'name', 'score', 'budget', 'timeline', 'status', 'createdAt'],
    description:
      'Every qualified enquiry from the site. Scored on submission so the highest-value conversations surface first.',
    pagination: { defaultLimit: 50 },
  },
  access: {
    // Submissions are written server-side through the local API, never
    // directly from the browser, so public create access is not required.
    create: noone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Call booked', value: 'call-booked' },
        { label: 'Proposal sent', value: 'proposal-sent' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'Disqualified', value: 'disqualified' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'score',
      type: 'number',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculated on submission from budget, timeline and brief quality.',
      },
    },
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'email', type: 'email', required: true, index: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'phone', type: 'text', admin: { width: '50%' } },
            { name: 'company', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        { name: 'website', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Brief',
      fields: [
        {
          name: 'industry',
          type: 'text',
          admin: { description: 'Free text as submitted, so the form stays usable for verticals we have not built a page for.' },
        },
        {
          name: 'services',
          type: 'select',
          hasMany: true,
          options: SERVICE_INTEREST_OPTIONS.map(({ label, value }) => ({ label, value })),
        },
        {
          type: 'row',
          fields: [
            {
              name: 'budget',
              type: 'select',
              options: BUDGET_OPTIONS.map(({ label, value }) => ({ label, value })),
              admin: { width: '50%' },
            },
            {
              name: 'timeline',
              type: 'select',
              options: TIMELINE_OPTIONS.map(({ label, value }) => ({ label, value })),
              admin: { width: '50%' },
            },
          ],
        },
        { name: 'message', type: 'textarea', required: true, admin: { rows: 8 } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Attribution',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'sourcePath', type: 'text', admin: { width: '50%', description: 'Page the form was submitted from.' } },
            { name: 'referrer', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmSource', type: 'text', admin: { width: '33%' } },
            { name: 'utmMedium', type: 'text', admin: { width: '33%' } },
            { name: 'utmCampaign', type: 'text', admin: { width: '34%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmTerm', type: 'text', admin: { width: '50%' } },
            { name: 'utmContent', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'gclid', type: 'text', admin: { description: 'Google click ID, for offline conversion import.' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Delivery',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'notificationSent',
          type: 'checkbox',
          defaultValue: false,
          admin: { readOnly: true },
        },
        {
          name: 'webhookDelivered',
          type: 'checkbox',
          defaultValue: false,
          admin: { readOnly: true },
        },
        {
          name: 'deliveryNotes',
          type: 'textarea',
          admin: { readOnly: true, rows: 3, description: 'Populated automatically when a delivery attempt fails.' },
        },
      ],
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: { rows: 5, description: 'Not visible to the submitter.' },
    },
  ],
  timestamps: true,
}
