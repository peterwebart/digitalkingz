import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "people" ADD COLUMN "name_initial" varchar;
  CREATE INDEX "people_name_initial_idx" ON "people" USING btree ("name_initial");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "people_name_initial_idx";
  ALTER TABLE "people" DROP COLUMN "name_initial";`)
}
