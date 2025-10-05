import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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

    // Read globals.css content
    const currentContent = readFileSync(globalsPath, "utf-8");

    // Extract :root and .dark sections with their tokens
    const rootMatch = currentContent.match(/:root\s*\{([^}]*)\}/);
    const darkMatch = currentContent.match(/\.dark\s*\{([^}]*)\}/);

    if (!rootMatch || !darkMatch) {
      return NextResponse.json(
        { error: "Could not find :root or .dark sections in globals.css" },
        { status: 400 },
      );
    }

    // Parse tokens from CSS sections
    const parseTokens = (cssContent: string) => {
      const tokens: Record<string, string> = {};
      const lines = cssContent.split("\n");

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("--") && trimmedLine.includes(":")) {
          const [key, ...valueParts] = trimmedLine.split(":");
          const value = valueParts.join(":").replace(";", "").trim();
          const tokenName = key.replace("--", "").trim();

          // Only include shadcn tokens, exclude other CSS custom properties
          if (isShadcnToken(tokenName)) {
            tokens[tokenName] = value;
          }
        }
      }

      return tokens;
    };

    const lightTokens = parseTokens(rootMatch[1]);
    const darkTokens = parseTokens(darkMatch[1]);

    return NextResponse.json({
      success: true,
      theme: {
        light: lightTokens,
        dark: darkTokens,
      },
    });
  } catch (error) {
    console.error("Failed to read globals.css:", error);
    return NextResponse.json(
      { error: "Failed to read globals.css" },
      { status: 500 },
    );
  }
}

// Check if a token is a valid shadcn token
function isShadcnToken(tokenName: string): boolean {
  const validTokens = [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
  ];

  return validTokens.includes(tokenName);
}
