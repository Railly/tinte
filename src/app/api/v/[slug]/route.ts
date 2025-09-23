import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { theme } from "@/db/schema/theme";
import { eq } from "drizzle-orm";
import { convertTinteToVSCode } from "@/lib/providers/vscode";
import type { TinteTheme } from "@/types/tinte";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

function generateSettingsJsonContent(tinteTheme: TinteTheme, themeName: string, themeId: string): string {
  // Convert theme to VS Code format using the existing provider functions
  const vscodeTheme = convertTinteToVSCode(tinteTheme, themeName);

  // Extract workbench colors (UI colors) - these are the exact same colors the provider generates
  const workbenchColors = vscodeTheme.dark.colors;

  // Create token color customizations using textMateRules format
  const tokenColorCustomizations = {
    textMateRules: vscodeTheme.dark.tokenColors.map(tokenColor => ({
      scope: tokenColor.scope,
      settings: tokenColor.settings
    }))
  };

  // Create the complete settings.json content - tema-agnóstico and dominante
  const settingsContent = {
    // 🎨 Workbench Color Customizations (UI colors) - takes precedence over any installed theme
    "workbench.colorCustomizations": workbenchColors,

    // 🎨 Token Color Customizations (syntax highlighting) - tema-agnóstico dominance
    "editor.tokenColorCustomizations": tokenColorCustomizations,

    // 🔒 Disable semantic highlighting to ensure TextMate rules dominate over any theme
    "editor.semanticHighlighting.enabled": false,

    // 🔒 Prevent OS auto-detection from changing theme
    "window.autoDetectColorScheme": false,
  };

  // Return clean JSON for VS Code settings.json
  return JSON.stringify(settingsContent, null, 2);
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // Get theme by slug - must be public for registry access
    const themeData = await db
      .select()
      .from(theme)
      .where(eq(theme.slug, slug))
      .limit(1);

    if (themeData.length === 0) {
      return NextResponse.json(
        { error: "Theme not found" },
        { status: 404 }
      );
    }

    const themeRecord = themeData[0];

    // Only allow public themes for registry access
    if (!themeRecord.is_public) {
      return NextResponse.json(
        { error: "Theme not found" },
        { status: 404 }
      );
    }

    // Reconstruct TinteTheme from database record
    const tinteTheme: TinteTheme = {
      light: {
        bg: themeRecord.light_bg,
        bg_2: themeRecord.light_bg_2,
        ui: themeRecord.light_ui,
        ui_2: themeRecord.light_ui_2,
        ui_3: themeRecord.light_ui_3,
        tx: themeRecord.light_tx,
        tx_2: themeRecord.light_tx_2,
        tx_3: themeRecord.light_tx_3,
        pr: themeRecord.light_pr,
        sc: themeRecord.light_sc,
        ac_1: themeRecord.light_ac_1,
        ac_2: themeRecord.light_ac_2,
        ac_3: themeRecord.light_ac_3,
      },
      dark: {
        bg: themeRecord.dark_bg,
        bg_2: themeRecord.dark_bg_2,
        ui: themeRecord.dark_ui,
        ui_2: themeRecord.dark_ui_2,
        ui_3: themeRecord.dark_ui_3,
        tx: themeRecord.dark_tx,
        tx_2: themeRecord.dark_tx_2,
        tx_3: themeRecord.dark_tx_3,
        pr: themeRecord.dark_pr,
        sc: themeRecord.dark_sc,
        ac_1: themeRecord.dark_ac_1,
        ac_2: themeRecord.dark_ac_2,
        ac_3: themeRecord.dark_ac_3,
      },
    };

    const themeName = themeRecord.name;
    const themeSlug = themeRecord.slug || themeRecord.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    // Generate the settings.json content
    const settingsJsonContent = generateSettingsJsonContent(tinteTheme, themeName, themeRecord.id);

    // Escape the content for registry format
    const escapedContent = settingsJsonContent

    // Create shadcn registry-compatible format for VS Code settings
    const registryItem = {
      "$schema": "https://ui.shadcn.com/schema/registry-item.json",
      "name": `${themeSlug}-vscode-theme`,
      "type": "registry:ui",
      "title": `${themeName} VS Code Theme`,
      "description": `${themeName} - VS Code theme configuration created with Tinte. Copy the settings to your VS Code settings.json file.`,
      "author": "Tinte User",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": `registry/default/themes/${themeSlug}-settings.json`,
          "content": escapedContent,
          "type": "registry:file",
          "target": ".vscode/settings.json"
        }
      ],
      "docs": `To use this VS Code theme glance:\\n\\n1. The .vscode/settings.json file will be created automatically in your project\\n2. This theme glance takes precedence over any installed theme for this workspace\\n3. Works with any base theme - the glance overrides colors independently\\n4. Semantic highlighting is disabled to ensure consistent appearance\\n\\nNote: This creates a 'theme glance' that dominates over user themes. The settings will merge with existing .vscode/settings.json if present.`,
      "categories": ["theme", "vscode", "editor"]
    };

    return NextResponse.json(registryItem, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error("Error generating VS Code registry theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
