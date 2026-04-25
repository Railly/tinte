import { auth as clerkAuth } from "@clerk/nextjs/server";
import { auth as triggerAuth } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { brandKits, db } from "@/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, { params }: RouteContext) {
  const { userId } = await clerkAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [kit] = await db
    .select({
      user_id: brandKits.user_id,
      trigger_run_id: brandKits.trigger_run_id,
    })
    .from(brandKits)
    .where(eq(brandKits.id, id))
    .limit(1);

  if (!kit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (kit.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!kit.trigger_run_id) {
    return NextResponse.json(
      { error: "Kit does not have a Trigger run" },
      { status: 409 },
    );
  }

  const accessToken = await triggerAuth.createPublicToken({
    scopes: {
      read: {
        runs: [kit.trigger_run_id],
      },
    },
    expirationTime: "2h",
  });

  return NextResponse.json({ accessToken, runId: kit.trigger_run_id });
}
