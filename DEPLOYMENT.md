# Deployment — Coolify on Hetzner

Application code only. No Dockerfile, no Traefik config, no reverse proxy config — infrastructure
is managed in Coolify.

---

## 1. Create the database

In Coolify, on the same project as the application:

**+ New → Database → PostgreSQL**

Note the internal connection string. It looks like:

```
postgres://<user>:<password>@<internal-hostname>:5432/<database>
```

Use the **internal** hostname (the service name on the Docker network), not a public IP. The
application container reaches it over the internal network, which is both faster and not exposed.

---

## 2. Create the application

**+ New → Application → Public/Private Repository**

| Setting | Value |
|---|---|
| Build pack | Nixpacks |
| Branch | `main` |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Start command | `pnpm start` |
| Port | `3000` |
| Domain | `https://digitalkingz.com` |

Enable **Automatic Deployment** so `git push origin main` deploys.

---

## 3. Environment variables

Set these in **Application → Environment Variables**. Mark `DATABASE_URI`, `PAYLOAD_SECRET`,
`RESEND_API_KEY` and `CRM_WEBHOOK_SECRET` as build-time variables where Coolify offers the choice —
the build connects to the database to prerender pages.

### Required

```
DATABASE_URI=postgres://user:password@internal-hostname:5432/digitalkingz
PAYLOAD_SECRET=<openssl rand -base64 32>
NEXT_PUBLIC_SERVER_URL=https://digitalkingz.com
```

`NEXT_PUBLIC_SERVER_URL` must have **no trailing slash**. It drives canonicals, the sitemap, Open
Graph URLs, JSON-LD `@id` values and the CORS allowlist. Getting it wrong is the single most
common cause of duplicate-content problems after launch.

### Lead routing

```
RESEND_API_KEY=re_...
LEAD_EMAIL_FROM=Digital Kingz <notifications@digitalkingz.com>
LEAD_EMAIL_TO=sales@digitalkingz.com
CRM_WEBHOOK_URL=https://your-automation-platform/webhook/leads
CRM_WEBHOOK_SECRET=<a long random string>
```

The sending domain must be verified in Resend before `LEAD_EMAIL_FROM` will deliver. Until these
are set the form still works and still saves leads to the CMS — it just records
"Email skipped: RESEND_API_KEY not configured" against the lead so the gap is visible rather than
silent.

`CRM_WEBHOOK_URL` receives this payload on every submission:

```json
{
  "event": "lead.created",
  "leadId": 42,
  "score": 87,
  "submittedAt": "2026-08-07T14:03:11.000Z",
  "contact": { "name": "...", "email": "...", "phone": "...", "company": "...", "website": "..." },
  "brief": { "industry": "...", "services": ["seo"], "budget": "35k-75k", "timeline": "urgent", "message": "..." },
  "attribution": { "sourcePath": "...", "referrer": "...", "utmSource": "...", "utmMedium": "...",
                   "utmCampaign": "...", "utmTerm": "...", "utmContent": "...", "gclid": "..." }
}
```

If `CRM_WEBHOOK_SECRET` is set it arrives as the `X-Webhook-Secret` header. Verify it on the
receiving end.

### Optional

```
GOOGLE_SITE_VERIFICATION=<token from Search Console>
ENABLE_GRAPHQL_PLAYGROUND=false
```

---

## 4. First deploy

Push to `main`. On the first boot Payload creates its schema automatically
(`push` is enabled outside production; see the note below).

Then seed the content. From the Coolify application terminal:

```bash
pnpm seed
```

This creates the admin user and loads all 12 services, 8 industries, 8 articles, 5 categories and
site settings. It is idempotent — safe to re-run.

Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in Coolify first. Both must have a value; a
variable set to an empty string counts as unset and the seed will stop and tell you.

**Use a unique production password.** The value in `.env.example` is published in the repo, so
the seed refuses to use it when `NODE_ENV=production`.

Log in at `https://digitalkingz.com/admin` and **change the password immediately after first
login.** Re-running the seed never modifies an existing account's password.

---

## 5. Schema changes after launch

`src/payload.config.ts` sets `push: process.env.NODE_ENV !== 'production'`. In production, schema
changes go through migrations, not automatic push. When you change a collection:

```bash
pnpm payload migrate:create describe_the_change
git add src/migrations && git commit && git push
```

Then run `pnpm payload migrate` from the Coolify terminal after the deploy, or add it to the start
command as `pnpm payload migrate && pnpm start`.

If a change alters a `select` field's options, Postgres cannot always rewrite the underlying enum
in place. Generate the migration and check it before deploying.

---

## 6. Persistent storage

Uploaded media is written to `public/media`, which is inside the container and **will not survive a
redeploy**. Before you upload anything you care about, do one of:

- **Coolify persistent volume** — mount a volume at `/app/public/media`. Simplest option.
- **Object storage** — install `@payloadcms/storage-s3` and point it at Hetzner Object Storage or
  S3. Better if you ever run more than one container.

Nothing currently depends on uploads (the site ships with zero images by design, using generated
SVG and CSS visuals instead), so this is not blocking for launch — but do it before the first real
image upload.

---

## 7. Post-launch checklist

1. **Search Console** — add the property, submit `https://digitalkingz.com/sitemap.xml`.
2. **Bing Webmaster Tools** — same. Bing feeds several AI answer engines.
3. **Analytics** — add your tag. Prefer server-side tagging or a lightweight analytics script;
   the site currently ships zero third-party JavaScript, which is why it loads the way it does.
4. **Verify structured data** — run a service page and an article through the Rich Results Test.
5. **Verify Core Web Vitals** — run the homepage through PageSpeed Insights. The site claims
   performance; a prospect can check that claim in ninety seconds, so make sure it holds on your
   infrastructure.
6. **Test the form on production** — submit once, confirm the lead appears in `/admin`, the email
   arrives, and the webhook fires. Check the lead's Delivery section if anything is missing.
7. **Google Business Profile** — make the address and business name in Site Settings match it
   exactly. NAP consistency is the cheapest local ranking work there is.
8. **Offline conversion import** — the form captures `gclid`. Wire it into Google Ads so the
   algorithm optimises toward closed revenue rather than form fills. This is usually the single
   highest-ROI thing on this list.

---

## Troubleshooting

**Build fails with `cannot connect to Postgres`**
`DATABASE_URI` is not available at build time, or points at a hostname the build container cannot
resolve. Use the internal service hostname and mark the variable as build-time. The build is
designed to survive this — it falls back to on-demand rendering rather than failing — but you lose
prerendering, so fix it.

**`Module not found: Can't resolve 'net'` / `'dns'`**
A client component is importing a value from a module that transitively imports
`src/lib/payload.ts`. Import types only, or move the constant into `src/lib/nav-config.ts`.

**Admin panel renders unstyled or a custom component is missing**
Run `pnpm generate:importmap` and commit `src/app/(payload)/admin/importMap.js`.

**Content changes in the repo are not showing on the site**
The site reads from the database, not from `src/seed/content`. Run `pnpm seed` to push seed
changes into Payload, or make the edit in the admin panel.

**Pages serve stale content**
Routes use ISR with `revalidate = 300`. A change appears within five minutes. To make it immediate,
add an `afterChange` hook calling `revalidatePath()` on the relevant collections.
