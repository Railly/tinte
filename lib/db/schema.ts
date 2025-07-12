import {
  uuid,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

// Themes table with RLS policies
export const themes = pgTable(
  "themes",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    content: text("content").notNull(), // Theme JSON content
    userId: uuid("user_id")
      .references(() => authUsers.id)
      .notNull(),
    public: boolean("public").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    // Users can view their own themes and all public themes
    pgPolicy("themes_select_policy", {
      for: "select",
      to: authenticatedRole,
      using: sql`${table.userId} = auth.uid() OR ${table.public} = true`,
    }),
    // Users can insert their own themes
    pgPolicy("themes_insert_policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${table.userId} = auth.uid()`,
    }),
    // Users can update their own themes
    pgPolicy("themes_update_policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`${table.userId} = auth.uid()`,
      withCheck: sql`${table.userId} = auth.uid()`,
    }),
    // Users can delete their own themes
    pgPolicy("themes_delete_policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${table.userId} = auth.uid()`,
    }),
  ]
);
