import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

/**
 * Every way a person can be classified, in one collection.
 *
 * The roadmap asks for discovery by country, industry, sport, platform, topic,
 * profession, language and audience. Modelling each as its own collection would
 * mean eight near-identical schemas and eight near-identical landing-page
 * routes. One collection with a `type` discriminator gives the same URLs
 * (/influencers/countries/canada, /influencers/industries/fitness) from a single route
 * and a single admin screen.
 *
 * Slugs are unique per type, not globally: "football" is legitimately both a
 * sport and a topic.
 */
export const TAXONOMY_TYPES = [
  'person-type',
  'country',
  'region',
  'industry',
  'sport',
  'platform',
  'topic',
  'genre',
  'profession',
  'language',
  'audience-type',
] as const

export type TaxonomyType = (typeof TAXONOMY_TYPES)[number]

/** Plural URL segment for each type, e.g. /influencers/countries/canada. */
export const TAXONOMY_SEGMENTS: Record<TaxonomyType, string> = {
  'person-type': 'types',
  country: 'countries',
  region: 'regions',
  industry: 'industries',
  sport: 'sports',
  platform: 'platforms',
  topic: 'topics',
  genre: 'genres',
  profession: 'professions',
  language: 'languages',
  'audience-type': 'audiences',
}

export const Taxonomies: CollectionConfig = {
  slug: 'taxonomies',
  labels: { singular: 'Taxonomy', plural: 'Taxonomies' },
  admin: {
    group: 'People',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'slug', 'personCount', 'updatedAt'],
    description:
      'Countries, industries, sports, platforms and the other ways people are classified. Each row can become a landing page once it holds enough profiles.',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  indexes: [{ fields: ['type', 'slug'], unique: true }],
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: TAXONOMY_TYPES.map((value) => ({ value, label: value })),
      admin: { position: 'sidebar', description: 'Determines the URL segment this term lives under.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { position: 'sidebar', description: 'Lowercase, hyphenated. Unique within its type.' },
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description:
          'Intro copy for the landing page. A term with no description should not be indexed — it is a thin page.',
      },
    },
    {
      name: 'countryCode',
      type: 'text',
      maxLength: 2,
      admin: {
        condition: (data) => data?.type === 'country',
        description: 'ISO 3166-1 alpha-2, used for flags and hreflang.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'taxonomies',
      admin: { description: 'Optional. Lets countries roll up into a region.' },
    },
    {
      name: 'personCount',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Maintained by the importer. Drives whether this term is worth a landing page.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Surface this term on the People homepage.' },
    },
    { name: 'order', type: 'number', defaultValue: 100, index: true, admin: { position: 'sidebar' } },
  ],
}
