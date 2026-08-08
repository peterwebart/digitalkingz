import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    description: 'Images used across the site. Alt text is required for accessibility and SEO.',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      { name: 'thumbnail', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 800, height: undefined, position: 'centre' },
      { name: 'wide', width: 1400, height: undefined, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows, for screen readers and image search. Leave decorative images with a short factual description.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional. Displayed under the image where the layout supports it.' },
    },
  ],
}
