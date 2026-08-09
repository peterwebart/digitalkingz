# DigitalKingz.com

Next.js 15 + Payload CMS 3 + PostgreSQL. Deployed via GitHub → Coolify → Hetzner.

**Positioning:** We Build Digital Systems That Grow Businesses.
**Primary goal:** qualified leads → discovery calls → projects → recurring growth retainers.

---

## What ships at launch

| | Count | Route |
|---|---|---|
| Service pages | 12 | `/services/[slug]` |
| Industry pages | 8 | `/industries/[slug]` |
| Articles | 8 | `/growth-hub/[slug]` |
| Hubs | 3 | `/services`, `/industries`, `/growth-hub` |
| Company | 4 | `/about`, `/process`, `/work`, `/contact` |
| Legal | 3 | `/privacy`, `/terms`, `/accessibility` |
| Machine-readable | 4 | `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/manifest.webmanifest` |

**~46,000 words** of original, geography-neutral commercial content. 49 prerendered routes.
102 kB shared JS. No fabricated statistics, client names, testimonials or performance claims anywhere.

---

## Quick start

Requires Docker Desktop running.

```bash
pnpm install
pnpm setup     # creates .env, starts Postgres in Docker, seeds all content
pnpm dev       # http://localhost:3000, admin at /admin
```

Seed admin: `solutions@digitalkingz.com` / `ChangeMe-DigitalKingz-2026`
Override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. **Change it on first login.**

Full Windows walkthrough, the git → Coolify loop and troubleshooting: **`LOCAL-DEV.md`**.

### Scripts

| Command | Purpose |
|---|---|
| `pnpm setup` | One-command local bootstrap. Safe to re-run. |
| `pnpm dev` | Dev server (runs the env preflight first) |
| `pnpm build` | Import map + production build. **Must pass before any push.** |
| `pnpm check` | Typecheck + lint + content validation |
| `pnpm db:up` / `db:down` / `db:reset` / `db:logs` | Local Postgres container |
| `pnpm seed` | Idempotent content seed — safe to re-run |
| `pnpm content:check` | Content integrity: cross-references, SEO field limits, word counts |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after schema changes |
| `pnpm generate:importmap` | Regenerate the admin import map after adding admin components |
| `pnpm devsafe` | Clear the `.next` cache and start dev |

---

## Architecture

```
src/
  app/
    robots.ts, manifest.ts        ← root-only metadata conventions
    (frontend)/                   ← the public site
    (payload)/                    ← admin panel + REST/GraphQL API
  collections/                    ← Payload schema
  globals/SiteSettings.ts         ← org-level facts (feeds footer, contact, schema)
  fields/shared.ts                ← reusable field factories
  blocks/                         ← custom rich-text blocks (Callout, DataTable)
  components/
    home/                         ← homepage sections
    layout/                       ← Header, Footer, Logo
    sections/                     ← shared page sections
    ui/                           ← design system primitives
    admin/                        ← Payload admin row labels
  lib/
    payload.ts                    ← cached data access (server-only)
    nav-config.ts                 ← client-safe nav constants and tracks
    nav.ts                        ← server-side nav builder
    seo.ts                        ← metadata + JSON-LD builders
    lead-schema.ts                ← shared Zod contract for the contact form
    lexical.ts                    ← portable blocks → Lexical, plus the autolinker
  seed/
    content/                      ← version-controlled source of truth for launch content
    run.ts                        ← idempotent seeder
    validate.ts                   ← content integrity gate
```

### Two things worth knowing before you edit

**1. `lib/payload.ts` is server-only.** It imports the Postgres driver. Any client component that
imports a *value* from a module that touches it will pull `net`/`dns` into the browser bundle and
fail the build. That is why navigation constants live in `nav-config.ts` and the data-fetching
lives in `nav.ts`. `import 'server-only'` guards it.

**2. Content lives in Payload, but the seed is version-controlled.** `src/seed/content/*` is the
canonical launch copy. `pnpm seed` upserts it by slug, so re-running never duplicates. Once you
start editing in the admin panel, the CMS becomes the source of truth for those fields — re-running
the seed will overwrite them. Edit the seed files if you want a change to survive a reseed.

---

## Design system

Deep navy graphite surface, electric blue primary, violet secondary, cyan for data flows.
Four service tracks carry their own accent: Build (blue), Get Found (emerald),
Convert (violet), Automate (amber).

Everything is defined once in `src/styles/globals.css` under `@theme`. Change a token there and it
propagates site-wide. Type scale is fluid (`clamp`) — `text-display-2xl` down to `text-eyebrow`.

**No animation library.** Every animation is CSS: `Reveal` is an IntersectionObserver plus a
compositor-only transition, the diagrams are SVG with `stroke-dashoffset` keyframes. Shipping an
animation runtime to every page would have cost more than the animations are worth on a site whose
pitch is performance.

Fonts are self-hosted (Geist via the `geist` package) — no Google Fonts request at build or runtime.

---

## SEO and GEO

Every page builds its metadata through `buildMetadata()` in `lib/seo.ts`, so canonicals, Open Graph
and Twitter cards cannot drift apart. Social cards are generated on demand at `/og?title=…`.

Structured data is emitted as a single `@graph` per page:

| Page type | Schema |
|---|---|
| All | `ProfessionalService`, `WebSite` |
| Service | `Service`, `BreadcrumbList`, `FAQPage` |
| Industry | `WebPage`, `BreadcrumbList`, `FAQPage` |
| Article | `Article`, `Person`, `BreadcrumbList`, `FAQPage` |
| Process | `HowTo` |
| Contact | `ContactPage`, `FAQPage` |
| Growth Hub | `Blog` |

**AI search (GEO).** `robots.ts` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
PerplexityBot, Google-Extended and Applebot-Extended. Being citable is a channel, not a leak.
`/llms.txt` publishes a structured summary of the business generated from live CMS content.
Every FAQ answer is written to answer its question in the first sentence so a passage can be lifted
and attributed cleanly.

**Internal linking** is generated at seed time by `autolink()` in `lib/lexical.ts`: the first
mention of a service name in an article body becomes a link to that service page, capped at five
per article, never inside headings. Anchor text stays natural because it uses words the writer
already chose.

---

## Lead pipeline

`/contact` → server action (`src/app/(frontend)/contact/actions.ts`):

1. **Validate** against the shared Zod schema. Attribution fields use `.catch()` so a malformed UTM
   can never reject a real enquiry.
2. **Honeypot** — a hidden `botField`. If filled, return success so the bot learns nothing.
3. **Rate limit** — 5 submissions per IP per 10 minutes, in-memory.
4. **Score** 0–100 (`scoreLead()`): budget and timeline carry the most weight, with points for a
   real website, a phone number and a substantial brief.
5. **Persist first** to the `leads` collection. The lead survives even if email and webhook fail.
6. **Email** via Resend, with `replyTo` set to the prospect so you can just hit reply.
7. **Webhook** — POSTs the full payload to `CRM_WEBHOOK_URL` with an optional `X-Webhook-Secret`
   header. Works with n8n, Make, Zapier, HubSpot, Go High Level, Pipedrive.
8. **Record delivery status** back onto the lead, so a silent failure is visible in the admin
   panel rather than invisible.

Captured per lead: name, email, phone, company, website, industry, service interests, budget,
timeline, brief, source path, referrer, all five UTM parameters and `gclid` — the last one so you
can run offline conversion imports and optimise Google Ads toward closed revenue instead of form
fills.

Leads are read-only via the public API (`create: noone`) — submissions go through the local API
server-side only.

---

## Content rules baked into the build

The brief says: *use real metrics only when verified, never invent performance numbers.* That is
enforced structurally, not just editorially.

- **Case studies ship as an empty collection.** `/work` renders the build-anatomy presentation
  until real case studies exist, then automatically switches to the case study index. Add one in
  the admin panel and it appears on `/work` and the homepage. Each result row requires a `source`
  field — where the number came from.
- **Testimonials ship empty** and the component hides itself.
- **The homepage trust bar** falls back to four verifiable engineering standards until you enter
  real statistics under **Settings → Site Settings → Proof**. Add stats and client logos there and
  the bar switches to your version.

### Before you go live

1. **Settings → Site Settings → Proof** — add your real project count, years, industries served, and
   only clients who have agreed to be named. Leave empty and the fallback stays.
2. **Settings → Site Settings → Contact** — add your phone number and booking URL. The
   "Book a Call" button routes to `/contact#book` until a booking URL exists.
3. **Settings → Site Settings → Social** — every profile you add is published as a `sameAs` link.
   This is the groundwork for AI answer engines resolving who you are; do not skip it.
4. **Change the seeded admin password.**
5. Add real case studies once you have client approval and an analytics export to back the numbers.

---

## Deployment

See `DEPLOYMENT.md`. Short version: create a Postgres resource and an application in Coolify, set
the environment variables from `.env.example`, point it at the GitHub repo, push to `main`.
