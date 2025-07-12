import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { getThemesByUser, addTheme, getThemeById } from "../lib/db/queries";

const t = initTRPC.create();

export const appRouter = t.router({
  getThemesByUser: t.procedure.input(z.string()).query(async ({ input }) => {
    return await getThemesByUser(input);
  }),
  addTheme: t.procedure
    .input(z.object({ userId: z.string().uuid(), name: z.string() }))
    .mutation(async ({ input }) => {
      return await addTheme(input.userId, input.name);
    }),
  getThemeById: t.procedure.input(z.number()).query(async ({ input }) => {
    return await getThemeById(input);
  }),
});

export type AppRouter = typeof appRouter;
