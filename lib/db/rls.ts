import { sql } from "drizzle-orm";
import { adminDb, userDb } from "./index";
import type { PgDatabase } from "drizzle-orm/pg-core";

type DrizzleClient = typeof userDb;

export interface RLSContext {
  userId: string;
  db: DrizzleClient;
}

// Helper function to run queries with RLS context
export async function withRLS<T>(
  userId: string,
  operation: (ctx: { userId: string; db: any }) => Promise<T>
): Promise<T> {
  return await userDb.transaction(async (tx) => {
    // Set RLS context
    await tx.execute(sql`
      select set_config('request.jwt.claim.sub', ${userId}, TRUE);
      set local role authenticated;
    `);
    
    try {
      // Execute the operation with the transaction
      return await operation({ userId, db: tx });
    } finally {
      // Reset context (transaction will handle rollback if needed)
      await tx.execute(sql`
        select set_config('request.jwt.claim.sub', NULL, TRUE);
        reset role;
      `);
    }
  });
}

// Admin database for operations that bypass RLS
export const admin = {
  db: adminDb,
};