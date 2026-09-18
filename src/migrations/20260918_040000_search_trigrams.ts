import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Trigram indexes for directory search.
 *
 * Hand-written rather than generated: `payload migrate:create` diffs the
 * collection schema, and an extension plus GIN indexes are not expressible as
 * Payload fields.
 *
 * `pg_trgm` gives two things the previous search had no way to do. Substring
 * matching becomes index-backed instead of a sequential ILIKE scan across 721
 * rows, and `similarity()` provides a rank, so "cristano" can still find
 * "Cristiano Ronaldo" and the closest match comes first.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS people_name_trgm_idx
      ON "people" USING gin ("name" gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS people_alternate_names_trgm_idx
      ON "people" USING gin ("alternate_names" gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS people_username_trgm_idx
      ON "people" USING gin ("username_primary" gin_trgm_ops);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // The extension is left in place: other things may depend on it, and
  // dropping it is not the inverse of adding three indexes.
  await db.execute(sql`
    DROP INDEX IF EXISTS people_name_trgm_idx;
    DROP INDEX IF EXISTS people_alternate_names_trgm_idx;
    DROP INDEX IF EXISTS people_username_trgm_idx;
  `)
}
