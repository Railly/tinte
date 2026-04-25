import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { brandKits, db } from "@/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function GET(_: Request, { params }: RouteContext) {
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

  if (!kit.is_paid) {
    return NextResponse.json({ error: "Pro required" }, { status: 402 });
  }

  const prompts = kit.prompts ?? {};
  const colors = readStringArray(prompts.suggestedColors);
  const personality = readStringArray(prompts.brandPersonality);

  return NextResponse.json(
    {
      name: kit.name,
      description: kit.description,
      colors: colors.map((value, index) => ({
        name: index === 0 ? "primary" : `color_${index + 1}`,
        value,
      })),
      personality,
      typography: {
        heading: "Inter",
        body: "Inter",
      },
      source: "kit.tinte.dev",
    },
    {
      headers: {
        "content-disposition": `attachment; filename="${kit.id}-tokens.json"`,
      },
    },
  );
}
