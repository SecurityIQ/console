import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const analysis_workspaces = pgTable("analysis_workspaces", {
  id: varchar("id", { length: 100 }).primaryKey(),
  project_id: varchar("project_id", { length: 100 }).references(
    () => projects.id
  ), // project that the workspace belongs to
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type AnalysisWorkspace = typeof analysis_workspaces.$inferSelect;
export type NewAnalysisWorkspace = typeof analysis_workspaces.$inferInsert;

export const projects = pgTable("projects", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  project_owner_id: varchar("project_owner", { length: 100 }), // user_id from clerk
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// user_projects table is a many-to-many relationship between users and projects
export const user_projects = pgTable("user_projects", {
  user_id: varchar("user_id", { length: 100 }), // user that is part of the project
  project_id: varchar("project_id", { length: 100 }).references(
    () => projects.id
  ), // project that the user is part of
});

export type UserProject = typeof user_projects.$inferSelect;
export type NewUserProject = typeof user_projects.$inferInsert;

export const indicators = pgTable(
  "indicators",
  {
    indicator: varchar("indicator", { length: 255 }).primaryKey(),
    type: varchar("type", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      typeIndicatorIndex: uniqueIndex("type_indicator_idx").on(
        table.type,
        table.indicator
      ),
    };
  }
);

// a list of indicator that is in analysis workspace
export const iocs = pgTable("iocs", {
  id: varchar("id", { length: 100 }).primaryKey(),
  analysis_workspace_id: varchar("analysis_workspace_id", { length: 100 }).references(
    () => analysis_workspaces.id
  ),
  indicator: varchar("indicator", { length: 100 }).references(
    () => indicators.indicator
  ),
  context: text("context"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Ioc = typeof iocs.$inferSelect;
export type NewIoc = typeof iocs.$inferInsert;

// refresh the following information if the indicators are stale (too old)

export const rawEnrichedInfo = pgTable("raw_enriched_info", {
  id: varchar("id", { length: 100 }).primaryKey(),
  indicator: varchar("indicator", { length: 100 }).references(() => indicators.indicator),
  source: varchar("source", { length: 255 }).notNull(),
  data: jsonb("data").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type RawEnrichedInfo = typeof rawEnrichedInfo.$inferSelect;
export type NewRawEnrichedInfo = typeof rawEnrichedInfo.$inferInsert;

export const structuredEnrichedInfo = pgTable("enriched_info", {
  id: varchar("id", { length: 100 }).primaryKey(),
  indicator: varchar("indicator", {length: 100 }).references(() => indicators.indicator),
  enrichId: varchar("enrich_id", { length: 100 }).references(
    () => rawEnrichedInfo.id
  ),
  source: varchar("source", { length: 255 }).notNull(),
  data_type: varchar("data_type", { length: 255 }).notNull(),
  value: text("value").notNull(),
  confidence: integer("confidence"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type StructuredEnrichedInfo = typeof structuredEnrichedInfo.$inferSelect;
export type NewStructuredEnrichedInfo =
  typeof structuredEnrichedInfo.$inferInsert;
