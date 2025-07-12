import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";

config({ path: ".env.local" });

const adminClient = postgres(process.env.DATABASE_URL!);
const userClient = postgres(process.env.DATABASE_URL!);

export const adminDb = drizzle(adminClient);
export const userDb = drizzle(userClient);

// For backward compatibility
export const db = adminDb;

type DrizzleClient = PgDatabase<any>;

export interface RLSDatabase {
  admin: DrizzleClient;
  user: (userId: string) => Promise<DrizzleClient>;
}

export function createRLSDatabase(): RLSDatabase {
  return {
    admin: adminDb,
    user: async (userId: string) => {
      // Create a transaction that sets the RLS context
      return {
        ...userDb,
        transaction: async (transaction, ...rest) => {
          return await userDb.transaction(async (tx) => {
            try {
              // Set Supabase auth context for RLS
              await tx.execute(sql`
                -- Set auth.uid() for RLS policies
                select set_config('request.jwt.claim.sub', ${userId}, TRUE);
                -- Set role for RLS
                set local role authenticated;
              `);
              return await transaction(tx);
            } finally {
              // Reset context
              await tx.execute(sql`
                select set_config('request.jwt.claim.sub', NULL, TRUE);
                reset role;
              `);
            }
          }, ...rest);
        },
      } as DrizzleClient;
    },
  };
}
