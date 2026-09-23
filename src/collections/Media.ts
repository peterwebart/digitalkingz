import path from 'path'
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
    // Resolved from process.cwd() at runtime — the directory the server
    // actually starts in (/app in production).
    //
    // Not import.meta.url: webpack bakes that in at BUILD time as the source
    // file's absolute path, so staticDir pointed wherever the image was built
    // rather than where it runs. Locally those are the same directory, which
    // is why this passed every local test and still 404'd in production.
    staticDir: path.resolve(process.cwd(), 'public/media'),
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
