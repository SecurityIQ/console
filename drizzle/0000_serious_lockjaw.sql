CREATE TABLE IF NOT EXISTS "indicators" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"indicator" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iocs" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"workspace_id" varchar(100),
	"indicator_id" varchar(100),
	"context" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "raw_enriched_info" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"ioc_id" varchar(100),
	"source" varchar(255) NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "enriched_info" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"enrich_id" varchar(100),
	"source" varchar(255) NOT NULL,
	"data_type" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"confidence" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iocs" ADD CONSTRAINT "iocs_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iocs" ADD CONSTRAINT "iocs_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "raw_enriched_info" ADD CONSTRAINT "raw_enriched_info_ioc_id_indicators_id_fk" FOREIGN KEY ("ioc_id") REFERENCES "public"."indicators"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enriched_info" ADD CONSTRAINT "enriched_info_enrich_id_raw_enriched_info_id_fk" FOREIGN KEY ("enrich_id") REFERENCES "public"."raw_enriched_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "type_indicator_idx" ON "indicators" USING btree ("type","indicator");