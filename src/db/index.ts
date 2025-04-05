import { type NeonQueryFunction, neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

declare global {
  var sql: NeonQueryFunction<false, false> | undefined;
  var db: ReturnType<typeof drizzle<typeof schema>>;
}

if (!global.db) {
  if (!global.sql) {
    global.sql = neon(process.env.DATABASE_URL);
  }

  global.db = drizzle({
    client: global.sql,
    schema,
  });
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export const db = global.db;
