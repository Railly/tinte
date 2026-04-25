import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../../drizzle/schema";

let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!database) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    database = drizzle(process.env.DATABASE_URL, { schema });
  }
  return database;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return (getDb() as unknown as Record<string, unknown>)[prop as string];
  },
});

export * from "../../drizzle/schema";
