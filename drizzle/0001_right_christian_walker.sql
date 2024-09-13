ALTER TABLE "workspace" RENAME TO "analysis_workspace";--> statement-breakpoint
ALTER TABLE "iocs" DROP CONSTRAINT "iocs_workspace_id_workspace_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iocs" ADD CONSTRAINT "iocs_workspace_id_analysis_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."analysis_workspace"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
