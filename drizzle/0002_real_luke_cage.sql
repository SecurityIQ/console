CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"project_owner" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_projects" (
	"user_id" varchar(100),
	"project_id" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "analysis_workspace" RENAME TO "analysis_workspaces";--> statement-breakpoint
ALTER TABLE "iocs" DROP CONSTRAINT "iocs_workspace_id_analysis_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "analysis_workspaces" ADD COLUMN "project_id" varchar(100);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analysis_workspaces" ADD CONSTRAINT "analysis_workspaces_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iocs" ADD CONSTRAINT "iocs_workspace_id_analysis_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."analysis_workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
