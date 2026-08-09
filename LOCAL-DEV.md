# Local development — Windows + Docker Desktop + Coolify

Written for PowerShell. Every command works the same in cmd or a Unix shell.

---

## First time only

Start **Docker Desktop** and wait for the whale icon to go steady. Then:

```powershell
cd C:\AI\digitalkingz\digitalkingz
pnpm install
pnpm setup
```

`pnpm setup` does four things:

1. Creates `.env` with a freshly generated `PAYLOAD_SECRET`
2. Starts a Postgres container on port **5433** (not 5432, so it can't collide with anything already installed)
3. Waits for it to accept connections
4. Seeds all the content

Then:

```powershell
pnpm dev
```

- Site → http://localhost:3000
- Admin → http://localhost:3000/admin
- Login → the `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` values in your `.env`

`pnpm setup` deliberately does not print the password to the terminal. Open `.env` to read it.
Out of the box it is `solutions@digitalkingz.com` with the placeholder password from
`.env.example`. **Change it on first login.**

> **Why your build failed before:** there was no `.env` file. It's git-ignored on purpose so
> secrets never end up in a repo or a zip, which means a fresh clone never has one.
> `pnpm dev` and `pnpm build` now check for it first and tell you exactly what to do.

---

## The two kinds of change

This matters more than anything else in this document.

| You want to change | Where | Deploy needed? |
|---|---|---|
| Page copy, headlines, FAQs, service descriptions, articles | **Admin panel** at `/admin` | No — live in ≤5 min |
| Adding a service, industry or article | **Admin panel** | No |
| Contact details, social links, trust stats | **Admin panel** → Site Settings | No |
| Colours, layout, new sections, new page types | **Code** → git push | Yes |
| Form fields, CMS structure, integrations | **Code** → git push | Yes |

Most of what you'll want day to day is the top half. You don't need this document for those —
just log into `/admin` on the live site and edit.

The rest of this is for code changes.

---

## Daily loop for code changes

```powershell
# 1. Start the database (only if Docker was restarted)
pnpm db:up

# 2. Work
pnpm dev
#    edit files, browser refreshes automatically

# 3. Check it before committing — this is the gate
pnpm check          # typecheck + lint + content validation
pnpm build          # the real production build

# 4. Ship it
git add .
git commit -m "describe what changed"
git push origin main
```

Coolify sees the push and redeploys automatically. Watch it in
**Coolify → your application → Deployments**. Typically 2–4 minutes.

**Never push without running `pnpm build` first.** If it fails locally it will fail in Coolify,
except there it fails after you've already pushed and your site sits on the old version while you
work out why.

---

## Connecting the repo to Coolify (one time)

1. Push this folder to a **private** GitHub repo:

   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/digitalkingz.git
   git branch -M main
   git push -u origin main
   ```

   The repo already has a `.git` folder with the full build committed, so this just points it at GitHub.

2. In Coolify: **+ New → Application → Private Repository (GitHub App)**, authorise, pick the repo.

3. Settings:

   | Field | Value |
   |---|---|
   | Build pack | Nixpacks |
   | Branch | `main` |
   | Install command | `pnpm install --frozen-lockfile` |
   | Build command | `pnpm build` |
   | Start command | `pnpm start` |
   | Port | `3000` |

4. Add the environment variables (see `DEPLOYMENT.md`). **Production values, not your local ones —
   especially a different `PAYLOAD_SECRET`.**

5. Turn on **Automatic Deployment**.

From then on `git push origin main` is the whole deploy process.

---

## Resend setup (for the contact form)

1. Sign up at resend.com, add **digitalkingz.com** under **Domains**.
2. Resend gives you DNS records. Add them at your domain registrar. Use a sending subdomain like
   `send.digitalkingz.com` — that way a deliverability problem can never damage your main domain's
   reputation for normal business email.
3. Wait for Resend to show the domain as **Verified**.
4. Create an API key under **API Keys**.
5. In Coolify, set:

   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   LEAD_EMAIL_FROM=Digital Kingz <notifications@send.digitalkingz.com>
   LEAD_EMAIL_TO=solutions@digitalkingz.com
   ```

6. Redeploy, submit the form on the live site, confirm the email arrives.

`LEAD_EMAIL_FROM` must be on the verified domain or Resend rejects the send. `LEAD_EMAIL_TO` can be
any address, and takes a comma-separated list if you want more than one person notified.

Every notification has `replyTo` set to the prospect's address, so hitting reply goes straight to
them, not to Resend.

**Until Resend is configured**, the form still works and still saves every enquiry to the CMS.
It records "Email skipped: RESEND_API_KEY not configured" in the lead's Delivery section, so the
gap is visible rather than silent. You'd see the leads at `/admin`, just not by email.

---

## Getting the live database onto your machine

Your local database and the production one are separate. If you want to work against real
production content locally:

```powershell
# Dump from production — run in the Coolify terminal for the Postgres resource
pg_dump -U <user> -d digitalkingz > /tmp/dump.sql
```

Download it, then:

```powershell
pnpm db:reset
docker exec -i digitalkingz-db psql -U digitalkingz -d digitalkingz < dump.sql
```

Going the other way — pushing local content up to production — is almost never what you want.
Edit production content in the production admin panel.

---

## Command reference

| Command | What it does |
|---|---|
| `pnpm setup` | Full local bootstrap. Safe to re-run. |
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Production build. **Run before every push.** |
| `pnpm start` | Serve the production build locally |
| `pnpm check` | Typecheck + lint + content validation |
| `pnpm db:up` | Start the local Postgres container |
| `pnpm db:down` | Stop it (data kept) |
| `pnpm db:reset` | Wipe it and start clean — then `pnpm seed` |
| `pnpm db:logs` | Tail database logs |
| `pnpm seed` | Load `src/seed/content` into the CMS. Safe to re-run. |
| `pnpm generate:types` | Regenerate types after changing a collection |
| `pnpm devsafe` | Clear the `.next` cache and start dev — fixes most weird cache bugs |

---

## Troubleshooting

**`missing secret key. A secret key is needed to secure Payload.`**
No `.env`. Run `pnpm setup`. (The preflight check now catches this before the build starts.)

**`ValidationError: The following field is invalid: password`**
`SEED_ADMIN_PASSWORD` in `.env` has no value after the `=`. A key with an empty value is an
empty string, not "unset", so it reaches Payload and fails validation. Give it a value of 12+
characters, or delete `.env` and run `pnpm setup` again. The seed now catches this itself and
tells you which variable to fix.

**`Nothing is listening on 127.0.0.1:5433`**
Docker Desktop isn't running, or the container is stopped. Start Docker Desktop, then `pnpm db:up`.

**`Could not read "services" for static params`**
Warning, not an error. The build can't reach the database, so pages render on demand instead of
being prerendered. Fix the database connection to get prerendering back.

**Build works locally but fails in Coolify**
Almost always a missing environment variable. `DATABASE_URI` and `PAYLOAD_SECRET` must be available
at *build* time, not just runtime — the build connects to the database to prerender pages.

**Changed a collection and the build breaks**
Run `pnpm generate:types`, then `pnpm typecheck` to see what needs updating. Commit
`src/payload-types.ts`.

**Admin panel looks unstyled, or a custom field component is missing**
`pnpm generate:importmap`, then commit `src/app/(payload)/admin/importMap.js`.

**Content edits in `src/seed/content` aren't showing**
The site reads from the database, not those files. Run `pnpm seed` to push them in. Note this
overwrites admin-panel edits for those fields.

**Everything is behaving strangely**
```powershell
pnpm devsafe
```
If that doesn't do it:
```powershell
rimraf node_modules .next
pnpm install
pnpm dev
```

**Windows: `pnpm` isn't recognised**
```powershell
corepack enable
corepack use pnpm@10.28.0
```

---

## Rules that will save you time

1. **`pnpm build` before every push.** Non-negotiable.
2. **Never commit `.env`.** It's git-ignored; keep it that way.
3. **Different `PAYLOAD_SECRET` and `SEED_ADMIN_PASSWORD` locally and in production.** The
   password in `.env.example` is public — the seed refuses to use it when `NODE_ENV=production`.
4. **Edit content in the admin panel, not in the seed files** — unless you want the change to
   survive a database reset.
5. **One change at a time.** Small commits are easy to roll back; a 40-file commit that breaks the
   build is not.
