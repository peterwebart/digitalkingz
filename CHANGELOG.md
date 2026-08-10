# Changelog

## 2026-08-10

### Fixed

- **Contact form rejected valid phone numbers.** `src/lib/lead-schema.ts` required the
  phone field to begin with `+` or a digit, so `(514) 555-0142` — the standard North
  American format, and the value iOS and Android autofill insert — failed validation and
  blocked the whole submission. Validation now checks the digits (7–15, optional leading
  `+`) rather than the leading character.
- **A failed submission emptied the form.** React 19 resets an uncontrolled form after
  every action completes, success or failure, so a rejected submission wiped everything
  typed. The server action now echoes the submitted values back and the fields repopulate
  from them. The form is only cleared after a genuine success.
- **Error state now identifies the field.** Field-level messages render against the field
  that failed, with the summary banner above the form.

### Verified

- Contact form submitted end to end through the real server action: `(514) 555-0142`,
  `514-555-0142` and an empty phone all succeed and persist to Postgres.
- Failure path: an invalid email returns a field error while name, phone, budget and the
  consent checkbox retain their values.
- Database migration `20260810_003440_initial` applied (52 tables).
- Seed run twice — idempotent (12 services, 8 industries, 8 articles, 5 categories).
- TypeScript: clean. ESLint: clean.
- Production build: 49/49 pages generated.

### Not changed

- Database configuration, `DATABASE_URI` handling, and the Postgres adapter.
- Email sending logic. See DEPLOYMENT.md for the Resend variables still to be set.
