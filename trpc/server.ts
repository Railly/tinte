import "server-only";
import { appRouter } from "@/server/trpc";

export const trpc = appRouter.createCaller({});
