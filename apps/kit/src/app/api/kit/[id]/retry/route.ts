import { auth } from "@clerk/nextjs/server";
import { tasks } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { brandKits, db } from "@/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(_: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [kit] = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.id, id))
    .limit(1);

  if (!kit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (kit.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const brief = {
    name: kit.name,
    description: kit.description,
    advanced: kit.advanced ?? undefined,
  };
  const run = await tasks.trigger("kit-generate", { kitId: kit.id, brief });

  await db
    .update(brandKits)
    .set({
      status: "queued",
      trigger_run_id: run.id,
    })
    .where(eq(brandKits.id, kit.id));

  return NextResponse.json({ kitId: kit.id, runId: run.id });
}
