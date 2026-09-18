import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_people_person_types" AS ENUM('influencer', 'public-figure');
  CREATE TYPE "public"."enum_people_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "public"."enum_taxonomies_type" AS ENUM('person-type', 'country', 'region', 'industry', 'sport', 'platform', 'topic', 'genre', 'profession', 'language', 'audience-type');
  CREATE TABLE "people_person_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_people_person_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "people_social_profiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform_id" integer NOT NULL,
  	"handle" varchar,
  	"url" varchar,
  	"followers" numeric,
  	"engagement_rate" numeric,
  	"last_checked_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"external_id" varchar,
  	"slug" varchar NOT NULL,
  	"status" "enum_people_status" DEFAULT 'draft' NOT NULL,
  	"completeness" numeric DEFAULT 0,
  	"name" varchar NOT NULL,
  	"alternate_names" varchar,
  	"username_primary" varchar,
  	"gender" varchar,
  	"generation" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"nationality" varchar,
  	"city" varchar,
  	"country_code" varchar,
  	"primary_industry_id" integer,
  	"sport_role" varchar,
  	"niches" varchar,
  	"audience_type" varchar,
  	"audience_scope" varchar,
  	"bio_short" varchar,
  	"bio_long" varchar,
  	"known_for" varchar,
  	"notable_work" varchar,
  	"awards" varchar,
  	"organizations" varchar,
  	"brands" varchar,
  	"profile_image_id" integer,
  	"cover_image_id" integer,
  	"website_url" varchar,
  	"wikipedia_url" varchar,
  	"official_source_url" varchar,
  	"verified" boolean DEFAULT false,
  	"verification_date" timestamp(3) with time zone,
  	"claimed" boolean DEFAULT false,
  	"editorial_notes" varchar,
  	"seo_meta_title" varchar NOT NULL,
  	"seo_meta_description" varchar NOT NULL,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"taxonomies_id" integer
  );
  
  CREATE TABLE "taxonomies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_taxonomies_type" NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"country_code" varchar,
  	"parent_id" integer,
  	"person_count" numeric DEFAULT 0,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "taxonomies_id" integer;
  ALTER TABLE "people_person_types" ADD CONSTRAINT "people_person_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_social_profiles" ADD CONSTRAINT "people_social_profiles_platform_id_taxonomies_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."taxonomies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_social_profiles" ADD CONSTRAINT "people_social_profiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_primary_industry_id_taxonomies_id_fk" FOREIGN KEY ("primary_industry_id") REFERENCES "public"."taxonomies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_rels" ADD CONSTRAINT "people_rels_taxonomies_fk" FOREIGN KEY ("taxonomies_id") REFERENCES "public"."taxonomies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "taxonomies" ADD CONSTRAINT "taxonomies_parent_id_taxonomies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."taxonomies"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "people_person_types_order_idx" ON "people_person_types" USING btree ("order");
  CREATE INDEX "people_person_types_parent_idx" ON "people_person_types" USING btree ("parent_id");
  CREATE INDEX "people_person_types_value_idx" ON "people_person_types" USING btree ("value");
  CREATE INDEX "people_social_profiles_order_idx" ON "people_social_profiles" USING btree ("_order");
  CREATE INDEX "people_social_profiles_parent_id_idx" ON "people_social_profiles" USING btree ("_parent_id");
  CREATE INDEX "people_social_profiles_platform_idx" ON "people_social_profiles" USING btree ("platform_id");
  CREATE UNIQUE INDEX "people_external_id_idx" ON "people" USING btree ("external_id");
  CREATE UNIQUE INDEX "people_slug_idx" ON "people" USING btree ("slug");
  CREATE INDEX "people_status_idx" ON "people" USING btree ("status");
  CREATE INDEX "people_completeness_idx" ON "people" USING btree ("completeness");
  CREATE INDEX "people_name_idx" ON "people" USING btree ("name");
  CREATE INDEX "people_username_primary_idx" ON "people" USING btree ("username_primary");
  CREATE INDEX "people_country_code_idx" ON "people" USING btree ("country_code");
  CREATE INDEX "people_primary_industry_idx" ON "people" USING btree ("primary_industry_id");
  CREATE INDEX "people_profile_image_idx" ON "people" USING btree ("profile_image_id");
  CREATE INDEX "people_cover_image_idx" ON "people" USING btree ("cover_image_id");
  CREATE INDEX "people_verified_idx" ON "people" USING btree ("verified");
  CREATE INDEX "people_seo_seo_og_image_idx" ON "people" USING btree ("seo_og_image_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people_rels_order_idx" ON "people_rels" USING btree ("order");
  CREATE INDEX "people_rels_parent_idx" ON "people_rels" USING btree ("parent_id");
  CREATE INDEX "people_rels_path_idx" ON "people_rels" USING btree ("path");
  CREATE INDEX "people_rels_taxonomies_id_idx" ON "people_rels" USING btree ("taxonomies_id");
  CREATE INDEX "taxonomies_type_idx" ON "taxonomies" USING btree ("type");
  CREATE INDEX "taxonomies_slug_idx" ON "taxonomies" USING btree ("slug");
  CREATE INDEX "taxonomies_parent_idx" ON "taxonomies" USING btree ("parent_id");
  CREATE INDEX "taxonomies_person_count_idx" ON "taxonomies" USING btree ("person_count");
  CREATE INDEX "taxonomies_order_idx" ON "taxonomies" USING btree ("order");
  CREATE INDEX "taxonomies_updated_at_idx" ON "taxonomies" USING btree ("updated_at");
  CREATE INDEX "taxonomies_created_at_idx" ON "taxonomies" USING btree ("created_at");
  CREATE UNIQUE INDEX "type_slug_idx" ON "taxonomies" USING btree ("type","slug");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_taxonomies_fk" FOREIGN KEY ("taxonomies_id") REFERENCES "public"."taxonomies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_taxonomies_id_idx" ON "payload_locked_documents_rels" USING btree ("taxonomies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "people_person_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people_social_profiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "people_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "taxonomies" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "people_person_types" CASCADE;
  DROP TABLE "people_social_profiles" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "people_rels" CASCADE;
  DROP TABLE "taxonomies" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_people_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_taxonomies_fk";
  
  DROP INDEX "payload_locked_documents_rels_people_id_idx";
  DROP INDEX "payload_locked_documents_rels_taxonomies_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "people_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "taxonomies_id";
  DROP TYPE "public"."enum_people_person_types";
  DROP TYPE "public"."enum_people_status";
  DROP TYPE "public"."enum_taxonomies_type";`)
}
