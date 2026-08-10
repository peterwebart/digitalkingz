/**
 * Environment variable access.
 *
 * `process.env.X ?? fallback` is a trap. A variable declared in a .env file
 * with no value — `SEED_ADMIN_PASSWORD=` — is an empty *string*, not
 * undefined, so nullish coalescing does not fall back and the empty string
 * flows downstream. That is exactly how an empty password reached Payload's
 * user creation and failed validation.
 *
 * These helpers treat blank and whitespace-only values as absent, which is
 * what "unset" means in a .env file in practice.
 */

/** Returns the trimmed value, or undefined when unset, blank or whitespace. */
export function env(key: string): string | undefined {
  const raw = process.env[key]
  if (typeof raw !== 'string') return undefined
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/** Returns the trimmed value, or `fallback` when unset, blank or whitespace. */
export function envOr(key: string, fallback: string): string {
  return env(key) ?? fallback
}

/** True when the variable holds a usable value. */
export function hasEnv(key: string): boolean {
  return env(key) !== undefined
}

/** True when running under NODE_ENV=production (Coolify sets this). */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * True only while `next build` is compiling, including the static-generation
 * worker processes it forks.
 *
 * This is the switch that lets the data layer degrade gracefully during image
 * compilation — where no database exists — without also swallowing real
 * database outages at runtime, where an error must stay an error so Next keeps
 * serving the last good cached page instead of caching an empty one.
 *
 * `DK_BUILD_PHASE` is set explicitly by the `build` script rather than relying
 * on Next's internal `NEXT_PHASE`, which is checked as a fallback for anyone
 * running `next build` directly.
 */
export function isBuildPhase(): boolean {
  return (
    process.env.DK_BUILD_PHASE === '1' ||
    process.env.NEXT_PHASE === 'phase-production-build'
  )
}

/**
 * True when Payload has enough configuration to connect at all. Used to skip
 * a doomed connection attempt during a database-free build rather than pay for
 * a pool timeout on every query.
 */
export function hasDatabaseConfig(): boolean {
  return hasEnv('DATABASE_URI') && hasEnv('PAYLOAD_SECRET')
}
