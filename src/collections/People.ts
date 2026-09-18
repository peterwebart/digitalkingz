import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { seoGroup } from '@/fields/shared'

/**
 * A person in the directory.
 *
 * One canonical identity at /influencers/{slug}, as the roadmap specifies, so that
 * reclassifying somebody from Influencer to Public Figure — or marking them as
 * both — never changes their URL.
 *
 * Classification lives entirely in `taxonomies` relationships rather than in
 * text columns, so the same person is reachable from country, industry, sport,
 * platform, topic and profession pages without duplicating rows.
 */
export const PERSON_TYPES = ['influencer', 'public-figure'] as const
export const PERSON_STATUSES = ['draft', 'review', 'published'] as const

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'People' },
  admin: {
    group: 'People',
    useAsTitle: 'name',
    defaultColumns: ['name', 'personTypes', 'status', 'completeness', 'updatedAt'],
    description:
      'Profiles at /influencers/[slug]. A profile is only worth indexing once it has a bio, an image and at least one verifiable source.',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'externalId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Source system identifier. The importer matches on this before it matches on slug.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Canonical URL segment: /influencers/[slug].' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: PERSON_STATUSES.map((value) => ({ value, label: value })),
      admin: {
        position: 'sidebar',
        description: 'Only published profiles are routable and appear in the sitemap.',
      },
    },
    {
      name: 'nameInitial',
      type: 'text',
      maxLength: 1,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'First letter of the name, set by the importer. Exists because Payload wraps every `like` in wildcards, so "A%" matches any name containing A rather than one starting with it. A-Z, or # for anything else.',
      },
    },
    {
      name: 'completeness',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          '0-100, set by the importer. The quality threshold for indexing is applied against this.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            { name: 'name', type: 'text', required: true, index: true },
            {
              name: 'alternateNames',
              type: 'text',
              admin: { description: 'Legal or birth name, stage names. Comma separated. Used by search.' },
            },
            { name: 'usernamePrimary', type: 'text', index: true },
            {
              name: 'personTypes',
              type: 'select',
              hasMany: true,
              required: true,
              index: true,
              options: PERSON_TYPES.map((value) => ({ value, label: value })),
              admin: { description: 'A person can legitimately be both.' },
            },
            { name: 'gender', type: 'text' },
            { name: 'generation', type: 'text' },
            { name: 'dateOfBirth', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'nationality', type: 'text' },
            { name: 'city', type: 'text' },
            {
              name: 'countryCode',
              type: 'text',
              maxLength: 2,
              index: true,
              admin: { description: 'Denormalised from the country taxonomy for fast filtering.' },
            },
          ],
        },
        {
          label: 'Classification',
          description: 'Every relationship here creates a route into this profile.',
          fields: [
            { name: 'countries', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'regions', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'industries', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'sports', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'platforms', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'topics', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'genres', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'professions', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            { name: 'languages', type: 'relationship', relationTo: 'taxonomies', hasMany: true },
            {
              name: 'primaryIndustry',
              type: 'relationship',
              relationTo: 'taxonomies',
              admin: { description: 'Shown on the result card and used for the default breadcrumb.' },
            },
            { name: 'sportRole', type: 'text' },
            { name: 'niches', type: 'text', admin: { description: 'Comma separated. Free text, not yet a taxonomy.' } },
            { name: 'audienceType', type: 'text' },
            { name: 'audienceScope', type: 'text' },
          ],
        },
        {
          label: 'Profile',
          fields: [
            {
              name: 'bioShort',
              type: 'textarea',
              maxLength: 400,
              admin: { description: 'One or two sentences. Used on cards and in meta descriptions.' },
            },
            { name: 'bioLong', type: 'textarea' },
            { name: 'knownFor', type: 'text' },
            { name: 'notableWork', type: 'text' },
            { name: 'awards', type: 'text' },
            { name: 'organizations', type: 'text' },
            { name: 'brands', type: 'text' },
            { name: 'profileImage', type: 'upload', relationTo: 'media' },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Social',
          description:
            'Empty on import: the supplied CSV carries no handles or follower counts beyond a primary username.',
          fields: [
            {
              name: 'socialProfiles',
              type: 'array',
              labels: { singular: 'Profile', plural: 'Profiles' },
              fields: [
                {
                  name: 'platform',
                  type: 'relationship',
                  relationTo: 'taxonomies',
                  required: true,
                },
                { name: 'handle', type: 'text' },
                { name: 'url', type: 'text' },
                { name: 'followers', type: 'number' },
                { name: 'engagementRate', type: 'number' },
                {
                  name: 'lastCheckedAt',
                  type: 'date',
                  admin: { description: 'A follower count with no date on it is not a fact, it is a rumour.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Sources',
          description: 'A profile without at least one source should not be published.',
          fields: [
            { name: 'websiteUrl', type: 'text' },
            { name: 'wikipediaUrl', type: 'text' },
            { name: 'officialSourceUrl', type: 'text' },
            { name: 'verified', type: 'checkbox', defaultValue: false, index: true },
            { name: 'verificationDate', type: 'date' },
            { name: 'claimed', type: 'checkbox', defaultValue: false },
            {
              name: 'editorialNotes',
              type: 'textarea',
              admin: { description: 'Internal. Never rendered on the public page.' },
            },
          ],
        },
        { label: 'SEO', fields: [seoGroup] },
      ],
    },
  ],
}
