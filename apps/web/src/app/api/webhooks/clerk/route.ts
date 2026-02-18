import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/db";
import { user } from "@/db/schema";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;

    const primaryEmail = email_addresses.find(
      (email) => email.id === evt.data.primary_email_address_id,
    );

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    try {
      await db
        .insert(user)
        .values({
          id: id, // Clerk ID is now the primary key
          email: primaryEmail?.email_address || null,
          email_verified: primaryEmail?.verification?.status === "verified",
          name,
          image: image_url || null,
        })
        .onConflictDoUpdate({
          target: user.id,
          set: {
            email: primaryEmail?.email_address || null,
            email_verified: primaryEmail?.verification?.status === "verified",
            name,
            image: image_url || null,
            updated_at: new Date(),
          },
        });

      console.log(`User ${id} synced to database`);
    } catch (error) {
      console.error("Error syncing user to database:", error);
      return new Response("Error syncing user", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
