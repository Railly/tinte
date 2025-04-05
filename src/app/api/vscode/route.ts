import { db } from "@/db";
import * as schema from "@/db/schema";
import { count, desc, like } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") ?? "";

    const themes = await db
      .select()
      .from(schema.vsCodeThemes)
      .where(like(schema.vsCodeThemes.name, `%${search}%`))
      .orderBy(desc(schema.vsCodeThemes.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [meta] = await db
      .select({ count: count() })
      .from(schema.vsCodeThemes)
      .where(like(schema.vsCodeThemes.name, `%${search}%`));

    const total = meta?.count ?? 0;

    return NextResponse.json({
      themes: themes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Error fetching VSCodeThemes:", error);
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 }
    );
  }
}
