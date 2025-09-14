import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    camelCase: false,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // Move anonymous user themes to the new authenticated user
        try {
          await db
            .update(schema.theme)
            .set({ user_id: newUser.user.id })
            .where(eq(schema.theme.user_id, anonymousUser.user.id));
        } catch (error) {
          console.error("Error transferring themes to authenticated user:", error);
        }
      },
    }),
  ],
});
