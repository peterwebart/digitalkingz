# Changelog

## Calculators — 20 tools

### Added

- `/tools` index and `/tools/[slug]` for 20 calculators across SEO, PPC, Website, Marketing
  and GEO, plus `WebApplication` structured data and 21 sitemap entries.
- `src/lib/calculators.ts` — each tool is a config entry (fields in, pure compute function
  out), so a new tool is data rather than a new page.
- `CalculatorForm` — the only interactive component. No libraries; the definitions module is
  shared across all 20 pages, so tool 21 adds no JavaScript.

### Notes

- Every tool states its formula on the page.
- The three GEO tools are scored self-assessments. None of them queries ChatGPT, Perplexity,
  Gemini or Google AI overviews, and each says so on the page.
- Budget and cost estimators encode rate assumptions that need commercial review before
  launch.


## People Directory — Stage 4 (search and filters)

### Added

- `/people/search` — name/username/bio search, six filters (type, country, industry,
  platform, sport, language), A-Z browse and pagination. Every view is a real URL.
- `PeopleSearchForm` and `AlphabetBar`, added to the directory hub as well.

### Notes

- The form is a plain GET form. No client runtime, no hydration — filtered views are
  shareable, bookmarkable and cacheable, which matters more for a directory than a
  fractionally smoother interaction.
- `/people/search` is `noindex` and excluded from the sitemap. Query-string permutations
  are not pages worth crawling; profiles and taxonomy landings are.
- An unknown filter slug returns nothing rather than being ignored: `?country=atlantis`
  must not quietly return the whole directory.
- `/people` stays static; only the results page renders per request.

## People Directory — Stage 3 (taxonomy landings)

### Added

- `/people/[slug]/[term]` — one route serving all eleven taxonomy landing families
  (countries, industries, professions, sports, platforms, topics, genres, languages,
  regions, types). Closes the outbound links stage 2 left dangling.
- Sitemap now includes the directory: 103 profiles and 228 taxonomy pages, filtered by the
  same indexing rules the pages apply.

### Notes

- The nested params are `[slug]/[term]` rather than `[segment]/[slug]` because Next requires
  one param name per depth, and `/people/[slug]` already owns that position.
- `audience-type` gets no landing page: the source data carries it only as free text, so a
  page would list nobody.

## People Directory — Stage 2 (profiles)

### Added

- `/people/[slug]` canonical profile page with `Person` structured data, source attribution,
  and links into every taxonomy the profile belongs to.
- `/people` directory index listing published profiles and browsable term groups.
- `PersonAvatar` — initials fallback, deterministic per slug, because 0 of 721 imported rows
  carry an image. Swaps to a real portrait automatically once one is uploaded.
- `--publish-above=<score>` on the importer. Off by default.

### Rules enforced in the data layer

- Only `published` profiles are routable; drafts 404.
- Profiles below 60/100 completeness render but are marked `noindex`.

## People Directory — Stage 1 (data foundation)

### Added

- `people` and `taxonomies` collections. One taxonomy collection with a `type`
  discriminator covers country, region, industry, sport, platform, topic, genre,
  profession, language, audience-type and person-type, so all eleven landing-page
  families come from one schema and one route rather than eleven near-identical ones.
- `pnpm import:people` — idempotent CSV importer with a `--dry-run` mode that reports data
  quality without writing. Matches on `externalId` then `slug`.
- Migration `20260902_031420_people_directory` (5 tables).

### Data notes

- `person_type` arrived in 8 spellings for 2 concepts; normalised on import.
- 0 of 721 rows carry a profile image, cover image, Wikipedia URL or official source URL.
- 618 of 721 profiles score below the 60/100 completeness threshold. Everything imported as
  `draft`; nothing is publishable without editorial work.


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
