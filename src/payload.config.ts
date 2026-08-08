import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Services } from '@/collections/Services'
import { Industries } from '@/collections/Industries'
import { Authors, Categories, Posts } from '@/collections/Posts'
import { CaseStudies, Testimonials } from '@/collections/CaseStudies'
import { Leads } from '@/collections/Leads'
import { SiteSettings } from '@/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL: serverUrl,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Digital Kingz',
      description: 'Content and lead pipeline for digitalkingz.com',
    },
    components: {
      graphics: {},
    },
  },
  collections: [
    Services,
    Industries,
    Posts,
    Categories,
    Authors,
    CaseStudies,
    Testimonials,
    Media,
    Leads,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Schema changes are applied by Payload on boot in development. In
    // production Coolify runs migrations, so leave push disabled there.
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    disablePlaygroundInProduction: process.env.ENABLE_GRAPHQL_PLAYGROUND !== 'true',
  },
  cors: [serverUrl].filter(Boolean),
  csrf: [serverUrl].filter(Boolean),
  upload: {
    limits: { fileSize: 8_000_000 },
  },
})
