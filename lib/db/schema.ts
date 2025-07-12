import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole, anonRole } from "drizzle-orm/supabase";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const themes = pgTable(
  "themes",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    content: text("content").notNull(),
    userId: text("userId").notNull(),
    public: boolean("public").notNull().default(false),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("Public themes are viewable by anyone", {
      for: "select",
      to: anonRole,
      using: sql`${table.public} = true`,
    }),
    pgPolicy("Users can view their own themes or public themes", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.userId} = (auth.jwt()->>'sub') OR ${table.public} = true`,
    }),
    pgPolicy("Users can insert only their own themes", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.userId} = (auth.jwt()->>'sub')`,
    }),
    pgPolicy("Users can update only their own themes", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.userId} = (auth.jwt()->>'sub')`,
      withCheck: sql`${table.userId} = (auth.jwt()->>'sub')`,
    }),
    pgPolicy("Users can delete only their own themes", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.userId} = (auth.jwt()->>'sub')`,
    }),
  ]
);

export type Theme = InferSelectModel<typeof themes>;
export type ThemeInsert = InferInsertModel<typeof themes>;

export type ThemeOptimistic = Theme & {
  deleted?: boolean;
  deleteFailed?: boolean;
};

export type ThemeFormData = {
  name: string;
  description?: string;
  content: string;
  public?: boolean;
};
