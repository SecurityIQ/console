CREATE TABLE IF NOT EXISTS "analysis_workspaces" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"project_id" varchar(100),
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "indicators" (
	"indicator" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iocs" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"analysis_workspace_id" varchar(100),
	"indicator" varchar(100),
	"context" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"project_owner" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "raw_enriched_info" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"indicator" varchar(100),
	"source" varchar(255) NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "enriched_info" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"indicator" varchar(100),
	"enrich_id" varchar(100),
	"source" varchar(255) NOT NULL,
	"data_type" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"confidence" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_projects" (
	"user_id" varchar(100),
	"project_id" varchar(100)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analysis_workspaces" ADD CONSTRAINT "analysis_workspaces_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iocs" ADD CONSTRAINT "iocs_analysis_workspace_id_analysis_workspaces_id_fk" FOREIGN KEY ("analysis_workspace_id") REFERENCES "public"."analysis_workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iocs" ADD CONSTRAINT "iocs_indicator_indicators_indicator_fk" FOREIGN KEY ("indicator") REFERENCES "public"."indicators"("indicator") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "raw_enriched_info" ADD CONSTRAINT "raw_enriched_info_indicator_indicators_indicator_fk" FOREIGN KEY ("indicator") REFERENCES "public"."indicators"("indicator") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "enriched_info" ADD CONSTRAINT "enriched_info_indicator_indicators_indicator_fk" FOREIGN KEY ("indicator") REFERENCES "public"."indicators"("indicator") ON DELETE no action ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "type_indicator_idx" ON "indicators" USING btree ("type","indicator");