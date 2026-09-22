# Article hero images

Uploaded through Payload by `pnpm seed`, not copied into `public/`, so each one
gets a real media record and the Media collection's resize pipeline. Seeding
matches on filename, so re-running reuses the existing upload.

Filenames match the article slug they belong to.

## Assigned — 10

| File | Article |
|---|---|
| `complete-digital-marketing-guide.jpg` | The Complete Digital Marketing Guide |
| `how-to-build-a-digital-marketing-strategy.jpg` | How to Build a Digital Marketing Strategy |
| `seo-vs-geo-vs-aeo.jpg` | SEO vs GEO vs AEO |
| `complete-ai-marketing-guide.jpg` | The Complete AI Marketing Guide |
| `complete-local-seo-guide.jpg` | The Complete Local SEO Guide |
| `complete-conversion-rate-optimization-guide.jpg` | The Complete CRO Guide |
| `complete-marketing-analytics-guide.jpg` | The Complete Marketing Analytics Guide |
| `complete-b2b-marketing-guide.jpg` | The Complete B2B Marketing Guide |
| `complete-marketing-guide-small-business.jpg` | The Complete Marketing Guide for Small Businesses |
| `complete-marketing-automation-guide.jpg` | The Complete Marketing Automation Guide |

## Staged, no article — 2

- `complete-ecommerce-marketing-guide.jpg` — the ecommerce article was held back
  (1,400 words, only two question headings). Attaches automatically once that
  article is written or expanded.
- `complete-email-marketing-guide.jpg` — the email marketing article was never
  delivered in the batch. It is one of the seven missing from the 30-article plan.

## Artwork edits applied

Both images were edited in place with Pillow. The originals came with problems
that would have shipped.

- `complete-marketing-guide-small-business.jpg` — two typos corrected:
  "MEASURBŁE ROI" to "MEASURABLE ROI" in the strapline, and "BUILD PROCF" to
  "BUILD PROOF" in step 4. Both lines were repainted whole rather than patched
  word by word, to avoid a kerning seam. The replacement face is DejaVu Sans
  Condensed Bold, which is close to but not identical to the original
  condensed grotesque. If you still have the design source, re-exporting from
  it will match better.
- `complete-marketing-analytics-guide.jpg` — the figures (CAC $18.50, ROAS 3.2x,
  $4.2M pipeline, $12.8M revenue, LTV $115, 4.8% conversion) are not Digital
  Kingz results, and the brief forbids invented metrics. A caption now reads
  "ILLUSTRATIVE EXAMPLE FIGURES — NOT DIGITAL KINGZ CLIENT RESULTS" beneath the
  row, and the alt text says the same. The numbers were kept because the panel
  exists to show which metrics matter; labelling them was the honest fix that
  preserved that. Replace them with real figures when you have permission to
  publish some.

---

# Social profiles on influencer pages

`SocialEmbed.tsx` renders two things on `/influencers/[slug]`:

- **SocialLinks** — outbound links. No third-party request, so no consent needed.
- **SocialEmbed** — a click-to-load gate. Nothing is fetched from Instagram,
  TikTok or Google until the visitor presses the button. The choice is stored
  per platform in localStorage.

This matters for Quebec's Law 25 and the GDPR: loading a third-party resource
is processing personal data, and it happens before any consent if the embed is
unconditional. It also protects the performance claim the services pages make.

## What is still missing: handles

Both components only render entries that have a real `url` in the `socialProfiles`
array on the People collection. That array is **empty for all 721 profiles**.

`username_primary` in the source CSV holds display names, not handles —
"Leo Messi", "Cristiano Ronaldo", "MrBeast". `instagram.com/Leo Messi` is a 404,
and deriving `leomessi` by lowercasing and stripping spaces is a guess that
would link to real strangers' accounts at scale. Nothing is rendered until a
verified URL exists.

To populate: add `instagram_url`, `tiktok_url`, `youtube_url` columns to
`data/people/people.csv` and extend the `socialProfiles` mapping in
`scripts/import-people.ts`. Or enter them per profile in `/admin`.

## Note on Instagram profile embeds

Instagram removed profile embeds. Its embed feature covers posts and reels only,
which is what the "Options → Embed → Copy Embed Code" flow produces. The gate
falls back to `/{profile}/embed`, which Instagram may serve in a reduced form or
refuse. A post URL gives a reliable embed; a profile URL does not. YouTube is
embedded through youtube-nocookie.com.
