import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const themes = pgTable("themes", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
  userId: text("user_id").references(() => users.id, {
    onUpdate: "no action",
  }),
  name: text("name"),
  displayName: text("display_name"),
  isPublic: boolean("is_public").default(false),
  category: text("category").default("custom"),
});

export const themeLikes = pgTable("theme_likes", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
  userId: text("user_id").references(() => users.id, {
    onUpdate: "no action",
  }),
  themeId: text("theme_id").references(() => themes.id, {
    onUpdate: "no action",
  }),
});

export const themePalettes = pgTable("theme_palettes", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
  themeId: text("theme_id").references(() => themes.id, {
    onUpdate: "no action",
  }),
  mode: text("mode"),
  text: text("text"),
  text2: text("text_2"),
  text3: text("text_3"),
  interface: text("interface"),
  interface2: text("interface_2"),
  interface3: text("interface_3"),
  background: text("background"),
  background2: text("background_2"),
  primary: text("primary"),
  secondary: text("secondary"),
  accent: text("accent"),
  accent2: text("accent_2"),
  accent3: text("accent_3"),
});

export const tokenColors = pgTable("token_colors", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
  themeId: text("theme_id").references(() => themes.id, {
    onUpdate: "no action",
  }),
  plain: varchar("plain", { length: 20 }),
  classes: varchar("classes", { length: 20 }),
  interfaces: varchar("interfaces", { length: 20 }),
  structs: varchar("structs", { length: 20 }),
  enums: varchar("enums", { length: 20 }),
  keys: varchar("keys", { length: 20 }),
  methods: varchar("methods", { length: 20 }),
  functions: varchar("functions", { length: 20 }),
  variables: varchar("variables", { length: 20 }),
  variablesOther: varchar("variables_other", { length: 20 }),
  globalVariables: varchar("global_variables", { length: 20 }),
  localVariables: varchar("local_variables", { length: 20 }),
  parameters: varchar("parameters", { length: 20 }),
  properties: varchar("properties", { length: 20 }),
  strings: varchar("strings", { length: 20 }),
  stringEscapeSequences: varchar("string_escape_sequences", { length: 20 }),
  keywords: varchar("keywords", { length: 20 }),
  keywordsControl: varchar("keywords_control", { length: 20 }),
  storageModifiers: varchar("storage_modifiers", { length: 20 }),
  comments: varchar("comments", { length: 20 }),
  docComments: varchar("doc_comments", { length: 20 }),
  numbers: varchar("numbers", { length: 20 }),
  booleans: varchar("booleans", { length: 20 }),
  operators: varchar("operators", { length: 20 }),
  macros: varchar("macros", { length: 20 }),
  preprocessor: varchar("preprocessor", { length: 20 }),
  urls: varchar("urls", { length: 20 }),
  tags: varchar("tags", { length: 20 }),
  jsxTags: varchar("jsx_tags", { length: 20 }),
  attributes: varchar("attributes", { length: 20 }),
  types: varchar("types", { length: 20 }),
  constants: varchar("constants", { length: 20 }),
  labels: varchar("labels", { length: 20 }),
  namespaces: varchar("namespaces", { length: 20 }),
  modules: varchar("modules", { length: 20 }),
  typeParameters: varchar("type_parameters", { length: 20 }),
  exceptions: varchar("exceptions", { length: 20 }),
  decorators: varchar("decorators", { length: 20 }),
  calls: varchar("calls", { length: 20 }),
  punctuation: varchar("punctuation", { length: 20 }),
});
