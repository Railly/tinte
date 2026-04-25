import { PassThrough, Readable } from "node:stream";
import { auth } from "@clerk/nextjs/server";
import archiver from "archiver";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { brandKitAssets, brandKits, db } from "@/db";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "kit"
  );
}

function extension(contentType: string | null, url: string) {
  if (contentType?.includes("jpeg")) return "jpg";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("json")) return "json";
  const parsed = new URL(url);
  const match = parsed.pathname.match(/\.([a-z0-9]+)$/i);
  return match?.[1] ?? "png";
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

  const assets = await db
    .select()
    .from(brandKitAssets)
    .where(eq(brandKitAssets.kit_id, id))
    .orderBy(asc(brandKitAssets.created_at));

  const stream = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(stream);

  queueMicrotask(async () => {
    try {
      await Promise.all(
        assets.map(async (asset, index) => {
          const response = await fetch(asset.url);
          if (!response.ok) return;
          const buffer = Buffer.from(await response.arrayBuffer());
          const ext = extension(
            response.headers.get("content-type"),
            asset.url,
          );
          archive.append(buffer, {
            name: `${String(index + 1).padStart(2, "0")}-${asset.type}.${ext}`,
          });
        }),
      );
      await archive.finalize();
    } catch (error) {
      archive.destroy(error instanceof Error ? error : new Error("ZIP failed"));
    }
  });

  return new Response(Readable.toWeb(stream) as ReadableStream<Uint8Array>, {
    headers: {
      "content-disposition": `attachment; filename="${slugify(kit.name)}-brand-kit.zip"`,
      "content-type": "application/zip",
    },
  });
}
