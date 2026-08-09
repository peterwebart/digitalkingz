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
