/**
 * Environment preflight — mode aware.
 *
 *   node scripts/preflight.mjs --mode=dev      before `next dev`
 *   node scripts/preflight.mjs --mode=build    before `next build`
 *   node scripts/preflight.mjs --mode=start    before `next start`
 *   node scripts/preflight.mjs --mode=seed     before `pnpm seed`
 *
 * The distinction that matters is *when* a variable is needed.
 *
 * `.env` is a local-development convenience. It is git-ignored and never
 * exists inside a Docker/Nixpacks build context, so requiring it there is
 * simply wrong — that check is what broke the Coolify deploy. Production
 * receives its configuration from the platform through `process.env`.
 *
 * Nothing secret is needed to *compile* this application. Secrets are needed
 * to *run* it. So the build validates almost nothing, and the runtime gate
 * (`--mode=start`) does the strict checking, at the only point where the full
 * environment is actually knowable.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Minimal .env reader, deliberately dependency-free.
 *
 * This script runs on `prebuild`, so anything it imports becomes a hard
 * requirement for building the application. It used to import a devDependency,
 * which meant a missing or pruned node_modules failed the build before Next
 * even started, with an error pointing at the package rather than at the real
 * problem. Node's own primitives are enough for a key=value file.
 *
 * Values already present in the real environment always win, which is what
 * Coolify relies on.
 */
function loadEnvFile(path) {
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (trimmed.length === 0 || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq < 1) continue

    const key = trimmed.slice(0, eq).trim().replace(/^export\s+/, '')
    if (key in process.env) continue

    let value = trimmed.slice(eq + 1).trim()
    const quote = value[0]
    if ((quote === '"' || quote === "'") && value.endsWith(quote) && value.length > 1) {
      value = value.slice(1, -1)
      if (quote === '"') value = value.replace(/\\n/g, '\n')
    }
    process.env[key] = value
  }
}

const root = process.cwd()
const envPath = resolve(root, '.env')
const envFileExists = existsSync(envPath)

// Load .env when it is there, carry on when it is not. Values already present
// in the real environment always win, which is what Coolify relies on.
if (envFileExists) loadEnvFile(envPath)

const VALID_MODES = ['dev', 'build', 'start', 'seed', 'migrate']
const modeArg = process.argv.find((a) => a.startsWith('--mode='))
const mode = modeArg ? modeArg.slice('--mode='.length) : 'dev'
if (!VALID_MODES.includes(mode)) {
  console.error(`  preflight: unknown mode "${mode}". Expected one of ${VALID_MODES.join(', ')}.`)
  process.exit(1)
}

const isProduction = process.env.NODE_ENV === 'production'

const RESET = '\x1b[0m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
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

/** Blank and whitespace-only values count as unset, as they do in a .env file. */
const value = (key) => {
  const raw = process.env[key]
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : undefined
}
const missingOf = (keys) => keys.filter((k) => value(k) === undefined)

/** Where the operator should go to set a variable, given how this is running. */
const configuredIn = isProduction
  ? 'your Coolify application → Environment Variables'
  : `.env  ${DIM}(${envPath})${RESET}`

function requireVars(keys, context) {
  const missing = missingOf(keys)
  if (missing.length === 0) return

  // Locally, a missing .env is almost always the whole story. Say that instead
  // of listing variables the person has never seen.
  if (!isProduction && !envFileExists) {
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
      '',
      `${DIM}Note: .env is only for local development. Production reads the same${RESET}`,
      `${DIM}variables from the environment and needs no file.${RESET}`,
    ])
  }

  fail(`Missing required environment variable${missing.length > 1 ? 's' : ''} ${context}`, [
    ...missing.map((m) => `  ${RED}x${RESET} ${BOLD}${m}${RESET}`),
    '',
    `Set ${missing.length > 1 ? 'them' : 'it'} in ${configuredIn}`,
    '',
    'DATABASE_URI      Postgres connection string.',
    `                  Local (Docker): ${DIM}postgres://digitalkingz:localdev@127.0.0.1:5433/digitalkingz${RESET}`,
    '                  Production: the internal hostname of your Coolify Postgres resource.',
    '',
    'PAYLOAD_SECRET    Any random string of 32+ characters. Generate one with:',
    `                  ${DIM}node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"${RESET}`,
    '',
    'SEED_ADMIN_*      Email and password for the first admin account.',
    '',
    `${YELLOW}Never reuse the production PAYLOAD_SECRET locally, and never commit .env.${RESET}`,
  ])
}

// --- Checks shared by every mode ------------------------------------------

// A trailing slash on the canonical origin produces double-slashed canonicals
// and sitemap URLs, which is a slow, annoying SEO bug to notice later. This is
// baked into the build output, so it is the one thing worth failing a build for.
const serverUrl = value('NEXT_PUBLIC_SERVER_URL')
if (serverUrl && serverUrl.endsWith('/')) {
  fail('NEXT_PUBLIC_SERVER_URL has a trailing slash', [
    `Found: ${serverUrl}`,
    `Use:   ${serverUrl.replace(/\/+$/, '')}`,
    '',
    'It drives canonicals, the sitemap, Open Graph URLs and JSON-LD @id values.',
    'A trailing slash here causes duplicate-content problems after launch.',
  ])
}

const secret = value('PAYLOAD_SECRET')
if (secret && secret.length < 24) {
  console.warn('')
  console.warn(`${YELLOW}  ! PAYLOAD_SECRET is short. Use 32+ random characters in production.${RESET}`)
  console.warn('')
}

/** Warns, never fails: the form still captures leads into the CMS without these. */
function warnLeadRouting() {
  const soft = []
  if (!value('RESEND_API_KEY')) soft.push('RESEND_API_KEY (no lead emails)')
  if (!value('LEAD_EMAIL_TO')) soft.push('LEAD_EMAIL_TO (no lead emails)')
  if (!value('LEAD_EMAIL_FROM')) soft.push('LEAD_EMAIL_FROM (no lead emails)')
  if (!value('CRM_WEBHOOK_URL')) soft.push('CRM_WEBHOOK_URL (no CRM handoff)')
  if (soft.length === 0) return

  console.warn('')
  console.warn(`${YELLOW}  Lead routing is not fully configured:${RESET}`)
  soft.forEach((m) => console.warn(`${YELLOW}    ! ${m}${RESET}`))
  console.warn(`${DIM}  Enquiries will still be saved to the CMS and visible at /admin.${RESET}`)
  console.warn('')
}

/** Warns when the Resend sender is not a shape Resend will accept. */
function warnSender() {
  const from = value('LEAD_EMAIL_FROM')
  if (!from) return
  const plain = /^[^<>@\s]+@[^<>@\s.]+\.[^<>@\s]+$/.test(from)
  const named = /<[^<>@\s]+@[^<>@\s.]+\.[^<>@\s]+>$/.test(from)
  if (plain || named) return
  console.warn('')
  console.warn(`${YELLOW}  ! LEAD_EMAIL_FROM does not look like an address Resend will accept.${RESET}`)
  console.warn(`${DIM}    Expected "you@yourdomain.com" or "Name <you@yourdomain.com>".${RESET}`)
  console.warn(`${DIM}    The domain must be verified in Resend or every send returns 403.${RESET}`)
  console.warn('')
}

/** Non-fatal TCP probe so a stopped Docker container is obvious immediately. */
async function checkLocalDatabase() {
  const uri = value('DATABASE_URI')
  if (!uri) return
  const match = uri.match(/@([^:/]+):(\d+)/)
  if (!match) return

  const [, host, port] = match
  if (!['127.0.0.1', 'localhost', '::1'].includes(host)) return

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

  if (reachable) return

  const composeFile = resolve(root, 'docker-compose.yml')
  const usesCompose = existsSync(composeFile) && readFileSync(composeFile, 'utf8').includes(port)

  fail(`Nothing is listening on ${host}:${port}`, [
    'DATABASE_URI points at a local Postgres that is not running.',
    '',
    ...(usesCompose
      ? [`${CYAN}Start it:${RESET}`, '', `  ${BOLD}pnpm db:up${RESET}`, '', `${DIM}Docker Desktop needs to be running first.${RESET}`]
      : ['Start your Postgres server, or point DATABASE_URI at one that is running.']),
  ])
}

// --- Per-mode behaviour ----------------------------------------------------

if (mode === 'dev') {
  requireVars(['DATABASE_URI', 'PAYLOAD_SECRET'], 'for local development')
  await checkLocalDatabase()
}

if (mode === 'build') {
  // Compiling needs no database and no secret. Payload's schema is declared in
  // TypeScript, page bodies are fetched at request time, and any content query
  // that fails during the build falls back to prerendering from static data.
  //
  // So this mode reports, it does not gate. Failing here on a missing
  // PAYLOAD_SECRET would force secrets into the image build — which is both
  // unnecessary and the reason Docker was warning about SecretsUsedInArgOrEnv.
  const runtimeVars = ['DATABASE_URI', 'PAYLOAD_SECRET']
  const absent = missingOf(runtimeVars)

  console.log('')
  console.log(`  ${BOLD}Build preflight${RESET}  ${DIM}${isProduction ? 'production' : 'development'}${RESET}`)

  if (!serverUrl) {
    console.log(`  ${YELLOW}!${RESET}  NEXT_PUBLIC_SERVER_URL is not set — canonical URLs will fall back`)
    console.log(`     ${DIM}to https://digitalkingz.com. This one IS needed at build time: it is${RESET}`)
    console.log(`     ${DIM}compiled into the output, so set it as a build variable in Coolify.${RESET}`)
  } else {
    console.log(`  ${GREEN}✓${RESET}  canonical origin  ${DIM}${serverUrl}${RESET}`)
  }

  if (absent.length === 0) {
    console.log(`  ${GREEN}✓${RESET}  database credentials present — content routes will prerender`)
  } else {
    console.log(`  ${DIM}·${RESET}  ${DIM}building without ${absent.join(' / ')}${RESET}`)
    console.log(`     ${DIM}Expected on Coolify: these are runtime variables. Content routes${RESET}`)
    console.log(`     ${DIM}render on first request and then cache under their revalidate window.${RESET}`)
  }
  console.log('')
}

if (mode === 'start') {
  // The real gate. Everything the running application needs must be here, and
  // this is the first moment the full environment is knowable.
  requireVars(['DATABASE_URI', 'PAYLOAD_SECRET'], 'to start the server')
  warnLeadRouting()
  warnSender()
  await checkLocalDatabase()
}

if (mode === 'migrate') {
  // Migrations need a reachable database and the secret Payload boots with —
  // nothing else. Runs in the Coolify terminal and as part of the production
  // start command, so the message has to make sense in both places.
  requireVars(['DATABASE_URI', 'PAYLOAD_SECRET'], 'to run migrations')
  await checkLocalDatabase()
}

if (mode === 'seed') {
  requireVars(
    ['DATABASE_URI', 'PAYLOAD_SECRET', 'SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD'],
    'to seed the database',
  )
  await checkLocalDatabase()
}
