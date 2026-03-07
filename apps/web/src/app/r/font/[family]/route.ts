import { type NextRequest, NextResponse } from "next/server";
import { buildFontRegistryItem } from "@/lib/registry";

interface RouteContext {
  params: Promise<{
    family: string;
  }>;
}

const VARIABLE_MAP: Record<string, "--font-sans" | "--font-serif" | "--font-mono"> = {
  sans: "--font-sans",
  serif: "--font-serif",
  mono: "--font-mono",
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { family } = await context.params;
    const variable = request.nextUrl.searchParams.get("variable");
    const cssVar = VARIABLE_MAP[variable || "sans"] || "--font-sans";

    const familyName = family
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const registryItem = buildFontRegistryItem(familyName, cssVar);

    return NextResponse.json(registryItem, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating font registry item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
