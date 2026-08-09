/**
 * One-command local bootstrap.
 *
 *   pnpm setup
 *
 * Creates .env with a generated secret, starts the local Postgres container,
 * waits for it to accept connections, and seeds the content. Safe to re-run.
 * Cross-platform: works in PowerShell, cmd, and any Unix shell.
 */
import { execSync, spawnSync } from 'node:child_process'
import { createConnection } from 'node:net'
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const envPath = resolve(root, '.env')
const examplePath = resolve(root, '.env.example')

const RESET = '\x1b[0m'
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'

const LOCAL_DB = 'postgres://digitalkingz:localdev@127.0.0.1:5433/digitalkingz'

let step = 0
const say = (msg) => console.log(`  ${CYAN}${String(++step).padStart(2, '0')}${RESET}  ${msg}`)
const ok = (msg) => console.log(`      ${GREEN}✓${RESET} ${DIM}${msg}${RESET}`)
const warn = (msg) => console.log(`      ${DIM}· ${msg}${RESET}`)

function die(msg, hint) {
  console.error(`\n  ${RED}✗ ${msg}${RESET}`)
  if (hint) console.error(`    ${DIM}${hint}${RESET}`)
  console.error('')
  process.exit(1)
}

console.log(`\n  ${BOLD}Digital Kingz — local setup${RESET}\n`)

// --- 1. .env --------------------------------------------------------------
say('Environment file')

if (existsSync(envPath)) {
  ok('.env already exists, leaving it alone')
} else {
  if (!existsSync(examplePath)) die('.env.example is missing from the repo.')

  const secret = randomBytes(32).toString('base64')
  const contents = readFileSync(examplePath, 'utf8')
    .replace(
      /^DATABASE_URI=.*$/m,
      `DATABASE_URI=${LOCAL_DB}`,
    )
    .replace(/^PAYLOAD_SECRET=.*$/m, `PAYLOAD_SECRET=${secret}`)
    .replace(/^NEXT_PUBLIC_SERVER_URL=.*$/m, 'NEXT_PUBLIC_SERVER_URL=http://localhost:3000')

  writeFileSync(envPath, contents, 'utf8')
  ok('created .env with a freshly generated PAYLOAD_SECRET')
  warn('.env is git-ignored — it will never be committed or pushed')
}

// --- 2. Docker ------------------------------------------------------------
say('Local database')

const compose = (() => {
  for (const [cmd, args] of [
    ['docker', ['compose']],
    ['docker-compose', []],
  ]) {
    const probe = spawnSync(cmd, [...args, 'version'], { stdio: 'ignore', shell: process.platform === 'win32' })
    if (probe.status === 0) return { cmd, args }
  }
  return null
})()

if (!compose) {
  die(
    'Docker is not available.',
    'Start Docker Desktop and run this again. Alternatively, install Postgres directly and\n    set DATABASE_URI in .env to point at it.',
  )
}

try {
  execSync(`${compose.cmd} ${[...compose.args, 'up', '-d'].join(' ')}`, {
    stdio: 'pipe',
    shell: process.platform === 'win32',
  })
  ok('postgres container running on port 5433')
} catch (error) {
  die(
    'Could not start the database container.',
    `${error.stderr?.toString().trim() || error.message}\n\n    Is Docker Desktop running?`,
  )
}

// --- 3. Wait for it -------------------------------------------------------
say('Waiting for Postgres to accept connections')

const reachable = () =>
  new Promise((resolveCheck) => {
    const socket = createConnection({ host: '127.0.0.1', port: 5433 })
    const done = (v) => {
      socket.destroy()
      resolveCheck(v)
    }
    socket.setTimeout(1500)
    socket.on('connect', () => done(true))
    socket.on('error', () => done(false))
    socket.on('timeout', () => done(false))
  })

let up = false
for (let i = 0; i < 40; i += 1) {
  if (await reachable()) {
    up = true
    break
  }
  await new Promise((r) => setTimeout(r, 1000))
}

if (!up) die('Postgres did not come up within 40 seconds.', 'Check: docker compose logs postgres')
ok('accepting connections')

// --- 4. Seed --------------------------------------------------------------
say('Seeding content')

const seed = spawnSync('pnpm', ['seed'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (seed.status !== 0) {
  die('Seed failed.', 'Scroll up for the error. Re-running `pnpm setup` is safe.')
}

// --- Done -----------------------------------------------------------------
console.log(`\n  ${GREEN}${BOLD}Ready.${RESET}\n`)
console.log(`  ${BOLD}pnpm dev${RESET}     ${DIM}→ http://localhost:3000${RESET}`)
console.log(`  ${DIM}admin panel  → http://localhost:3000/admin${RESET}`)
console.log(`  ${DIM}login        → solutions@digitalkingz.com / ChangeMe-DigitalKingz-2026${RESET}`)
console.log('')
