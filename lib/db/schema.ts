import {
  pgSchema,
  uuid,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Reference only for FK, do NOT export or use in migration
const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

// Themes table, related to auth.users
export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: uuid("user_id")
    .references(() => authUsers.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
