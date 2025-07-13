import {
  pgTable,
  text,
  timestamp,
  pgPolicy,
  pgEnum,
  uuid,
  bigserial,
  integer,
  smallint,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole, anonRole } from "drizzle-orm/supabase";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const editorTargetEnum = pgEnum("editor_target", [
  "vscode",
  "cursor", 
  "zed",
  "vim",
  "shadcn"
]);

export const visibilityEnum = pgEnum("vis", [
  "public",
  "private", 
  "unlisted"
]);

export const inputTypeEnum = pgEnum("input_type", [
  "prompt",
  "image",
  "url",
  "file"
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    visibility: visibilityEnum("visibility").default("private"),
    userId: text("userId").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("Public projects are viewable by anyone", {
      for: "select",
      to: anonRole,
      using: sql`${table.visibility} = 'public'`,
    }),
    pgPolicy("Users can view their own projects or public projects", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.userId} = (auth.jwt()->>'sub') OR ${table.visibility} IN ('public', 'unlisted')`,
    }),
    pgPolicy("Users can insert only their own projects", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.userId} = (auth.jwt()->>'sub')`,
    }),
    pgPolicy("Users can update only their own projects", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.userId} = (auth.jwt()->>'sub')`,
      withCheck: sql`${table.userId} = (auth.jwt()->>'sub')`,
    }),
    pgPolicy("Users can delete only their own projects", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.userId} = (auth.jwt()->>'sub')`,
    }),
  ]
);

export const paletteVersions = pgTable(
  "palette_versions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    projectId: uuid("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    tokensJson: jsonb("tokensJson").notNull(),
    changelog: text("changelog"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("Users can view palette versions for their projects or public projects", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${projects} p 
        WHERE p.id = ${table.projectId} 
        AND (p."userId" = (auth.jwt()->>'sub') OR p.visibility IN ('public', 'unlisted'))
      )`,
    }),
    pgPolicy("Anonymous users can view palette versions for public projects", {
      for: "select", 
      to: anonRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${projects} p 
        WHERE p.id = ${table.projectId} 
        AND p.visibility = 'public'
      )`,
    }),
    pgPolicy("Users can insert palette versions for their own projects", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${projects} p 
        WHERE p.id = ${table.projectId} 
        AND p."userId" = (auth.jwt()->>'sub')
      )`,
    }),
  ]
);

export const paletteInputs = pgTable(
  "palette_inputs",
  {
    paletteVersionId: bigserial("paletteVersionId", { mode: "number" }).notNull().references(() => paletteVersions.id, { onDelete: "cascade" }),
    idx: smallint("idx").notNull(),
    type: inputTypeEnum("type"),
    value: text("value"),
  },
  (table) => [
    pgPolicy("Users can view palette inputs for accessible palette versions", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${paletteVersions} pv
        JOIN ${projects} p ON p.id = pv."projectId"
        WHERE pv.id = ${table.paletteVersionId}
        AND (p."userId" = (auth.jwt()->>'sub') OR p.visibility IN ('public', 'unlisted'))
      )`,
    }),
    pgPolicy("Anonymous users can view palette inputs for public projects", {
      for: "select",
      to: anonRole, 
      using: sql`EXISTS (
        SELECT 1 FROM ${paletteVersions} pv
        JOIN ${projects} p ON p.id = pv."projectId"
        WHERE pv.id = ${table.paletteVersionId}
        AND p.visibility = 'public'
      )`,
    }),
    pgPolicy("Users can insert palette inputs for their own projects", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${paletteVersions} pv
        JOIN ${projects} p ON p.id = pv."projectId"
        WHERE pv.id = ${table.paletteVersionId}
        AND p."userId" = (auth.jwt()->>'sub')
      )`,
    }),
  ]
);

export const variantVersions = pgTable(
  "variant_versions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    paletteVersionId: bigserial("paletteVersionId", { mode: "number" }).notNull().references(() => paletteVersions.id, { onDelete: "cascade" }),
    target: editorTargetEnum("target").notNull(),
    specJson: jsonb("specJson"),
    triggerRunId: text("triggerRunId").unique(),
    status: text("status"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("Users can view variant versions for accessible palette versions", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${paletteVersions} pv
        JOIN ${projects} p ON p.id = pv."projectId"
        WHERE pv.id = ${table.paletteVersionId}
        AND (p."userId" = (auth.jwt()->>'sub') OR p.visibility IN ('public', 'unlisted'))
      )`,
    }),
    pgPolicy("Anonymous users can view variant versions for public projects", {
      for: "select",
      to: anonRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${paletteVersions} pv
        JOIN ${projects} p ON p.id = pv."projectId"
        WHERE pv.id = ${table.paletteVersionId}
        AND p.visibility = 'public'
      )`,
    }),
    pgPolicy("Users can insert/update variant versions for their own projects", {
      for: "all",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${paletteVersions} pv
        JOIN ${projects} p ON p.id = pv."projectId"
        WHERE pv.id = ${table.paletteVersionId}
        AND p."userId" = (auth.jwt()->>'sub')
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${paletteVersions} pv
        JOIN ${projects} p ON p.id = pv."projectId"
        WHERE pv.id = ${table.paletteVersionId}
        AND p."userId" = (auth.jwt()->>'sub')
      )`,
    }),
  ]
);

export const projectShares = pgTable(
  "project_shares",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
    tokenHash: text("tokenHash").unique(),
    permission: visibilityEnum("permission").default("unlisted"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("Users can manage shares for their own projects", {
      for: "all",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM ${projects} p 
        WHERE p.id = ${table.projectId} 
        AND p."userId" = (auth.jwt()->>'sub')
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM ${projects} p 
        WHERE p.id = ${table.projectId} 
        AND p."userId" = (auth.jwt()->>'sub')
      )`,
    }),
  ]
);

export const projectStars = pgTable(
  "project_stars",
  {
    projectId: uuid("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
    userId: text("userId").notNull(),
    starredAt: timestamp("starredAt").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("Users can manage their own stars", {
      for: "all",
      to: authenticatedRole,
      using: sql`${table.userId} = (auth.jwt()->>'sub')`,
      withCheck: sql`${table.userId} = (auth.jwt()->>'sub')`,
    }),
    pgPolicy("Anyone can view stars for accessible projects", {
      for: "select",
      to: [authenticatedRole, anonRole],
      using: sql`EXISTS (
        SELECT 1 FROM ${projects} p 
        WHERE p.id = ${table.projectId} 
        AND p.visibility IN ('public', 'unlisted')
      )`,
    }),
  ]
);

export type Project = InferSelectModel<typeof projects>;
export type ProjectInsert = InferInsertModel<typeof projects>;
export type PaletteVersion = InferSelectModel<typeof paletteVersions>;
export type PaletteVersionInsert = InferInsertModel<typeof paletteVersions>;
export type PaletteInput = InferSelectModel<typeof paletteInputs>;
export type PaletteInputInsert = InferInsertModel<typeof paletteInputs>;
export type VariantVersion = InferSelectModel<typeof variantVersions>;
export type VariantVersionInsert = InferInsertModel<typeof variantVersions>;
export type ProjectShare = InferSelectModel<typeof projectShares>;
export type ProjectShareInsert = InferInsertModel<typeof projectShares>;
export type ProjectStar = InferSelectModel<typeof projectStars>;
export type ProjectStarInsert = InferInsertModel<typeof projectStars>;
