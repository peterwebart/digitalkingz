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

Set these in **Application → Environment Variables**.

### Build variables vs runtime variables

Coolify offers a **"Build Variable"** toggle per variable. Getting this wrong is what produces the
`SecretsUsedInArgOrEnv` warnings during the Docker build: anything marked as a build variable is
passed to Nixpacks as a Docker `ARG`/`ENV` and is therefore recorded in the image's layer history,
where anyone who can pull the image can read it.

**Nothing secret is needed to compile this application.** The build does not connect to the
database. Leave every secret unticked.

| Variable | Build variable? | Why |
|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | **Yes** | `NEXT_PUBLIC_*` values are compiled into the output. It is a public URL, not a secret. |
| `DATABASE_URI` | No | Needed by the running container only. |
| `PAYLOAD_SECRET` | No | Needed by the running container only. |
| `RESEND_API_KEY` | No | Read at request time when a lead is submitted. |
| `CRM_WEBHOOK_SECRET` | No | Read at request time. |
| `SEED_ADMIN_PASSWORD` | No | Read by `pnpm seed`, which is a manual operation. |
| everything else | No | |

There is a trade-off, and it is small. With no database at build time, the three index pages
(`/`, `/services`, `/industries`) plus `sitemap.xml` and `llms.txt` are prerendered from static
fallbacks and fill in from the CMS on their first revalidation — five minutes for the index pages,
an hour for the sitemap. Everything else is either static copy or rendered on demand. If you would
rather have a fully populated build, tick `DATABASE_URI` and `PAYLOAD_SECRET` as build variables
and accept that they land in the image history. Runtime-only is the better default.

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

Push to `main`. The build succeeds without a database — that is by design, and it is why no
secret needs to reach the builder.

**The database starts empty and `push` is disabled in production**, so the schema has to be
created once. Two ways, pick one:

**a. Generate migrations locally (preferred).** Against your local Docker Postgres:

```bash
pnpm db:migrate:create initial
git add src/migrations && git commit -m "Add initial migration" && git push
```

Then run `pnpm db:migrate` from the Coolify terminal after the deploy, or set the start command to
`pnpm db:migrate && pnpm start`.

**b. One-off push.** Set `PAYLOAD_DB_PUSH=true` in Coolify, redeploy, let Payload create the
schema, then **remove the variable**. Leaving it set lets any future deploy alter the live schema
without review.

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

**Build fails asking for `.env`, or for `PAYLOAD_SECRET`**
It should not. `.env` is local-only and the build needs no secrets. If you see this, the deployed
commit predates the environment-architecture fix — check that `package.json` runs
`node scripts/preflight.mjs --mode=build` on `prebuild`.

**Build logs say "building without DATABASE_URI / PAYLOAD_SECRET"**
That is the expected, healthy message on Coolify. Content routes render on first request and cache
from there. See the build/runtime variable table in section 3.

**`SecretsUsedInArgOrEnv` warnings during the Docker build**
Coolify is passing those variables to Nixpacks as build arguments. Untick "Build Variable" on every
secret; only `NEXT_PUBLIC_SERVER_URL` needs it.

**`UndefinedVar: $NIXPACKS_PATH`**
Generated inside the Dockerfile that Nixpacks writes itself. Not caused by anything in this repo
and safe to ignore.

**Server exits at startup naming a missing variable**
Working as intended — `prestart` refuses to boot a server that cannot reach its database. Set the
variable it names in Coolify → Environment Variables.

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
