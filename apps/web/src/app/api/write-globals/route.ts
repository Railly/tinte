import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { css } = await request.json();

    if (!css || typeof css !== "string") {
      return NextResponse.json(
        { error: "Invalid CSS content" },
        { status: 400 },
      );
    }

    // Read components.json to get CSS path dynamically
    let globalsPath: string;
    try {
      const componentsConfigPath = join(process.cwd(), "components.json");
      const componentsConfig = JSON.parse(
        readFileSync(componentsConfigPath, "utf-8"),
      );
      const cssPath = componentsConfig?.tailwind?.css || "src/app/globals.css";
      globalsPath = join(process.cwd(), cssPath);
    } catch (_error) {
      // Fallback to default path if components.json doesn't exist or is invalid
      globalsPath = join(process.cwd(), "src/app/globals.css");
    }

    // Read current globals.css
    const currentContent = readFileSync(globalsPath, "utf-8");

    // Find and replace the :root and .dark sections
    const rootRegex = /:root\s*\{[^}]*\}/g;
    const darkRegex = /\.dark\s*\{[^}]*\}/g;

    // Extract new root and dark sections from the provided CSS
    const rootMatch = css.match(rootRegex);
    const darkMatch = css.match(darkRegex);

    if (!rootMatch || !darkMatch) {
      return NextResponse.json(
        { error: "CSS must contain both :root and .dark sections" },
        { status: 400 },
      );
    }

    let updatedContent = currentContent;

    // Replace :root section
    updatedContent = updatedContent.replace(rootRegex, rootMatch[0]);

    // Replace .dark section
    updatedContent = updatedContent.replace(darkRegex, darkMatch[0]);

    // Write back to file
    writeFileSync(globalsPath, updatedContent, "utf-8");

    return NextResponse.json({
      success: true,
      message: "globals.css updated successfully",
    });
  } catch (error) {
    console.error("Failed to write globals.css:", error);
    return NextResponse.json(
      { error: "Failed to write globals.css" },
      { status: 500 },
    );
  }
}
