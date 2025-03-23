import { type NeonQueryFunction, neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not set");
}

declare global {
  var sql: NeonQueryFunction<false, false> | undefined;
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

if (!global.db) {
  if (!global.sql) {
    global.sql = neon(process.env.NEON_DATABASE_URL);
  }

  global.db = drizzle({
    client: global.sql,
    schema,
    logger: process.env.NODE_ENV === "development",
  });
}

export const db = global.db;
