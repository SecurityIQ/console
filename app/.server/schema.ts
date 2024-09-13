import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspace", {
    id: varchar("id", { length: 100 }).primaryKey(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export const indicators = pgTable("indicators", {
    id: varchar("id", { length: 255 }).primaryKey(),
    type: varchar("type", { length: 255 }).notNull(),
    indicator: varchar("indicator", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        typeIndicatorIndex: uniqueIndex('type_indicator_idx').on(table.type, table.indicator),
    }
});

export const iocs = pgTable("iocs", {
    id: varchar("id", { length: 100 }).primaryKey(),
    workspace_id: varchar("workspace_id", { length: 100 }).references(() => workspaces.id),
    indicator_id: varchar("indicator_id", { length: 100 }).references(() => indicators.id),
    context: text("context"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type Ioc = typeof iocs.$inferSelect;
export type NewIoc = typeof iocs.$inferInsert;

// refresh the following information if the indicators are stale (too old)

export const rawEnrichedInfo = pgTable("raw_enriched_info", {
    id: varchar("id", { length: 100 }).primaryKey(),
    ioc_id: varchar("ioc_id", { length: 100 }).references(() => indicators.id),
    source: varchar("source", { length: 255 }).notNull(),
    data: jsonb("data").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type RawEnrichedInfo = typeof rawEnrichedInfo.$inferSelect;
export type NewRawEnrichedInfo = typeof rawEnrichedInfo.$inferInsert;

export const structuredEnrichedInfo = pgTable("enriched_info", {
    id: varchar("id", { length: 100 }).primaryKey(),
    enrichId: varchar("enrich_id", { length: 100 }).references(() => rawEnrichedInfo.id),
    source: varchar("source", { length: 255 }).notNull(),
    data_type: varchar("data_type", { length: 255 }).notNull(),
    value: text("value").notNull(),
    confidence: integer("confidence"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type StructuredEnrichedInfo = typeof structuredEnrichedInfo.$inferSelect;
export type NewStructuredEnrichedInfo = typeof structuredEnrichedInfo.$inferInsert;