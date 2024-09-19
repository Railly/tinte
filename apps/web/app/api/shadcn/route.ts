// app/api/shadcn/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ShadcnThemes } from "@prisma/client";
import { sanitizeJsonInput } from "@/lib/utils";
import { Theme } from "@/lib/atoms";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Theme> & { userId: string };

  if (!body.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newTheme = await prisma.shadcnThemes.create({
      data: {
        name: body.name!,
        display_name: body.displayName,
        User: body.userId,
        light_scheme: sanitizeJsonInput(body.light),
        dark_scheme: sanitizeJsonInput(body.dark),
        fonts: sanitizeJsonInput(body.fonts),
        radius: String(body.radius),
        space: String(body.space),
        shadow: body.shadow,
        charts: sanitizeJsonInput(body.charts),
        icons: body.icons,
      },
    });

    return NextResponse.json(newTheme);
  } catch (error) {
    console.error("Error creating ShadcnTheme:", error);
    return NextResponse.json(
      { error: "Failed to create theme" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const userId = searchParams.get("userId");

  try {
    const themes = await prisma.shadcnThemes.findMany({
      where: userId ? { User: userId } : undefined,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { xata_createdat: "desc" },
    });

    const total = await prisma.shadcnThemes.count({
      where: userId ? { User: userId } : undefined,
    });

    return NextResponse.json({
      themes: themes as ShadcnThemes[],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("Error fetching ShadcnThemes:", error);
    return NextResponse.json(
      { error: "Failed to fetch themes" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
