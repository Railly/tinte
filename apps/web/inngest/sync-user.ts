import { PrismaClient } from "@prisma/client";
import { inngest } from "./client";

const prisma = new PrismaClient();

export const syncUser = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const user = event.data;
    const { id: clerk_id, username, image_url } = user;

    await step.run("Sync user to database", async () => {
      await prisma.users.create({
        data: {
          clerk_id,
          username,
          xata_id: clerk_id,
          image_url,
        },
      });
    });

    return { result: "User synced successfully" };
  },
);
