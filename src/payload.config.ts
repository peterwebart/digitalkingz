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
import { People } from '@/collections/People'
import { Taxonomies } from '@/collections/Taxonomies'
import { SiteSettings } from '@/globals/SiteSettings'
import { env, hasEnv, isBuildPhase } from '@/lib/env'

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
    People,
    Taxonomies,
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
      // Without a bound, an unreachable host hangs on the OS TCP timeout —
      // minutes per query. Fail fast instead, so a misconfigured DATABASE_URI
      // is reported rather than looking like a stalled build or a hung request.
      connectionTimeoutMillis: isBuildPhase() ? 5_000 : 10_000,
      // Next forks several static-generation workers, each with its own pool.
      // Left unbounded they exhausted Postgres max_connections once the people
      // directory pushed the prerender count past 500, and the build died with
      // "too many clients already". Four per worker is ample for rendering
      // pages sequentially.
      max: isBuildPhase() ? 4 : 10,
      idleTimeoutMillis: 10_000,
    },
    // Schema changes are applied by Payload on boot in development. In
    // production they go through migrations, so push is off by default.
    //
    // PAYLOAD_DB_PUSH=true overrides this for the very first production deploy,
    // where the database is empty and no migration exists yet. Remove it once
    // the schema is created; leaving it on lets a deploy alter the live schema
    // without review.
    push: hasEnv('PAYLOAD_DB_PUSH')
      ? env('PAYLOAD_DB_PUSH') === 'true'
      : process.env.NODE_ENV !== 'production',
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
