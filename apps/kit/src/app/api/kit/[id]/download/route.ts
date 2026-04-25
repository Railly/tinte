import { auth } from "@clerk/nextjs/server";
import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { brandKitAssets, brandKits, db } from "@/db";
import { applyWatermark } from "@/lib/watermark";

const downloadableTypes = new Set(["logo", "bento", "moodboard"]);
type DownloadableType = "logo" | "bento" | "moodboard";

interface DownloadRouteProps {
  params: Promise<{
    id: string;
  }>;
}

function parseType(value: string | null) {
  const [type, indexValue] = (value ?? "bento").split(":");
  const index = indexValue ? Number.parseInt(indexValue, 10) : 0;

  if (!downloadableTypes.has(type) || Number.isNaN(index) || index < 0) {
    return null;
  }

  return { type: type as DownloadableType, index };
}

export async function GET(request: Request, { params }: DownloadRouteProps) {
  const { id } = await params;
  const selected = parseType(new URL(request.url).searchParams.get("type"));

  if (!selected) {
    return NextResponse.json({ error: "Invalid asset type" }, { status: 400 });
  }

  const { userId } = await auth();
  const [kit] = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.id, id))
    .limit(1);

  if (!kit) {
    return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  }

  if (!kit.is_public && userId !== kit.user_id) {
    return NextResponse.json({ error: "Kit not found" }, { status: 404 });
  }

  const assets = await db
    .select()
    .from(brandKitAssets)
    .where(
      and(
        eq(brandKitAssets.kit_id, id),
        eq(brandKitAssets.type, selected.type),
      ),
    )
    .orderBy(asc(brandKitAssets.created_at));
  const asset = assets[selected.index];

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const assetResponse = await fetch(asset.url);

  if (!assetResponse.ok) {
    return NextResponse.json(
      { error: "Asset could not be fetched" },
      { status: 502 },
    );
  }

  const original = Buffer.from(await assetResponse.arrayBuffer());
  const body = kit.is_paid ? original : await applyWatermark(original);
  const filename = `${
    kit.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "kit"
  }-${selected.type}.png`;

  return new Response(new Uint8Array(body), {
    headers: {
      "content-disposition": `attachment; filename="${filename}"`,
      "content-type": kit.is_paid
        ? (assetResponse.headers.get("content-type") ?? "image/png")
        : "image/png",
    },
  });
}
