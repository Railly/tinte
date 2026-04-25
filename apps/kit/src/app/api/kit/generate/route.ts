import { auth } from "@clerk/nextjs/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { brandKits, db, type JsonValue } from "@/db";
import { createKitId } from "@/lib/ids";
import { kitGenerateRatelimit, rateLimitHeaders } from "@/lib/ratelimit";

const advancedSchema = z.object({
  vibe: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  colors: z.array(z.string().trim().min(1).max(80)).max(3).default([]),
  refImages: z.array(z.string().url()).max(3).default([]),
});

const bodySchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(500),
  advanced: advancedSchema.optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await kitGenerateRatelimit.limit(userId);
  if (!result.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: rateLimitHeaders(result) },
    );
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten() },
      { status: 400, headers: rateLimitHeaders(result) },
    );
  }

  const kitId = createKitId();
  const brief = parsed.data;

  await db.insert(brandKits).values({
    id: kitId,
    user_id: userId,
    name: brief.name,
    description: brief.description,
    advanced: brief.advanced as Record<string, JsonValue> | undefined,
    status: "queued",
  });

  const run = await tasks.trigger("kit-generate", { kitId, brief });

  await db
    .update(brandKits)
    .set({ trigger_run_id: run.id })
    .where(eq(brandKits.id, kitId));

  return NextResponse.json(
    { kitId, runId: run.id },
    { headers: rateLimitHeaders(result) },
  );
}
