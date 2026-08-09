/**
 * Environment preflight.
 *
 * Runs before `dev` and `build`. Payload's own error for a missing secret is
 * "missing secret key", forty lines into a build, with no indication of which
 * file to create. This turns that into an actionable message.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config } from 'dotenv'

const root = process.cwd()
const envPath = resolve(root, '.env')

config({ path: envPath, quiet: true })

const RESET = '\x1b[0m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'

const line = (s = '') => console.error(`  ${s}`)

function fail(title, body) {
  console.error('')
  console.error(`${RED}${BOLD}  ${'─'.repeat(66)}${RESET}`)
  console.error(`${RED}${BOLD}  ${title}${RESET}`)
  console.error(`${RED}${BOLD}  ${'─'.repeat(66)}${RESET}`)
  console.error('')
  body.forEach((l) => line(l))
  console.error('')
  process.exit(1)
}

if (!existsSync(envPath)) {
  fail('No .env file found', [
    'The site reads its database connection and signing secret from .env.',
    'That file is git-ignored on purpose, so it never ships in a repo or a zip.',
    '',
    `${CYAN}Fix it in one command:${RESET}`,
    '',
    `  ${BOLD}pnpm setup${RESET}`,
    '',
    `${DIM}That creates .env with a freshly generated PAYLOAD_SECRET, starts the${RESET}`,
    `${DIM}local Postgres container, and seeds the content.${RESET}`,
    '',
    `${DIM}Prefer to do it by hand? Copy .env.example to .env and fill in${RESET}`,
    `${DIM}DATABASE_URI and PAYLOAD_SECRET.${RESET}`,
  ])
}

const missing = []
if (!process.env.DATABASE_URI?.trim()) missing.push('DATABASE_URI')
if (!process.env.PAYLOAD_SECRET?.trim()) missing.push('PAYLOAD_SECRET')

if (missing.length > 0) {
  fail(`Missing required environment variable${missing.length > 1 ? 's' : ''}`, [
    ...missing.map((m) => `  ${RED}x${RESET} ${BOLD}${m}${RESET}`),
    '',
    `Set ${missing.length > 1 ? 'them' : 'it'} in ${CYAN}${envPath}${RESET}`,
    '',
    'DATABASE_URI      Postgres connection string.',
    `                  Local (Docker): ${DIM}postgres://digitalkingz:localdev@127.0.0.1:5433/digitalkingz${RESET}`,
    '                  Production: the internal hostname of your Coolify Postgres resource.',
    '',
    'PAYLOAD_SECRET    Any random string of 32+ characters. Generate one with:',
    `                  ${DIM}node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"${RESET}`,
    '',
    `${YELLOW}Never reuse the production PAYLOAD_SECRET locally, and never commit .env.${RESET}`,
  ])
}

if (process.env.PAYLOAD_SECRET.trim().length < 24) {
  console.warn('')
  console.warn(`${YELLOW}  ! PAYLOAD_SECRET is short. Use 32+ random characters in production.${RESET}`)
  console.warn('')
}

// A trailing slash on the canonical origin produces double-slashed canonicals
// and sitemap URLs, which is a slow, annoying SEO bug to notice later.
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
if (serverUrl && serverUrl.endsWith('/')) {
  fail('NEXT_PUBLIC_SERVER_URL has a trailing slash', [
    `Found: ${serverUrl}`,
    `Use:   ${serverUrl.replace(/\/+$/, '')}`,
    '',
    'It drives canonicals, the sitemap, Open Graph URLs and JSON-LD @id values.',
    'A trailing slash here causes duplicate-content problems after launch.',
  ])
}

// Warn, do not fail, when the lead pipeline is not wired up. The form still
// captures leads into the CMS without it.
if (process.env.NODE_ENV === 'production' || process.argv.includes('--strict')) {
  const softMissing = []
  if (!process.env.RESEND_API_KEY?.trim()) softMissing.push('RESEND_API_KEY (no lead emails)')
  if (!process.env.LEAD_EMAIL_TO?.trim()) softMissing.push('LEAD_EMAIL_TO (no lead emails)')
  if (!process.env.CRM_WEBHOOK_URL?.trim()) softMissing.push('CRM_WEBHOOK_URL (no CRM handoff)')

  if (softMissing.length > 0) {
    console.warn('')
    console.warn(`${YELLOW}  Lead routing is not fully configured:${RESET}`)
    softMissing.forEach((m) => console.warn(`${YELLOW}    ! ${m}${RESET}`))
    console.warn(`${DIM}  Enquiries will still be saved to the CMS and visible at /admin.${RESET}`)
    console.warn('')
  }
}

// Quick, non-fatal reachability check so a stopped Docker container is obvious
// before the build spends a minute compiling.
const uri = process.env.DATABASE_URI
const match = uri.match(/@([^:/]+):(\d+)/)
if (match) {
  const [, host, port] = match
  const isLocal = ['127.0.0.1', 'localhost', '::1'].includes(host)
  if (isLocal) {
    const { createConnection } = await import('node:net')
    const reachable = await new Promise((resolveCheck) => {
      const socket = createConnection({ host, port: Number(port) })
      const done = (ok) => {
        socket.destroy()
        resolveCheck(ok)
      }
      socket.setTimeout(2500)
      socket.on('connect', () => done(true))
      socket.on('error', () => done(false))
      socket.on('timeout', () => done(false))
    })

    if (!reachable) {
      const composeFile = resolve(root, 'docker-compose.yml')
      const usesCompose =
        existsSync(composeFile) && readFileSync(composeFile, 'utf8').includes(port)

      fail(`Nothing is listening on ${host}:${port}`, [
        'DATABASE_URI points at a local Postgres that is not running.',
        '',
        ...(usesCompose
          ? [
              `${CYAN}Start it:${RESET}`,
              '',
              `  ${BOLD}pnpm db:up${RESET}`,
              '',
              `${DIM}Docker Desktop needs to be running first.${RESET}`,
            ]
          : [
              'Start your Postgres server, or point DATABASE_URI at one that is running.',
            ]),
      ])
    }
  }
}
