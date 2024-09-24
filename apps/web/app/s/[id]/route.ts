import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ShadcnThemes } from "@prisma/client";
import { ChartColors, ColorScheme, HSLAColor } from "@/lib/atoms";
import { track } from "@vercel/analytics/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const themeId = `rec_${params.id}`;

  try {
    const theme = await prisma.shadcnThemes.findUnique({
      where: { xata_id: themeId },
    });

    if (!theme) {
      await track("Theme Fetch Failed", { themeId, reason: "Not Found" });
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const formattedTheme = formatTheme(theme);

    await track("Theme Fetched", {
      themeId: theme.xata_id,
      themeName: theme.name,
      displayName: theme.display_name,
    });

    return NextResponse.json(formattedTheme);
  } catch (error) {
    console.error("Error fetching ShadcnTheme:", error);
    await track("Theme Fetch Failed", { themeId, reason: "Server Error" });
    return NextResponse.json(
      { error: "Failed to fetch theme" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

function formatTheme(theme: ShadcnThemes) {
  const lightScheme = theme.light_scheme as ColorScheme;
  const darkScheme = theme.dark_scheme as ColorScheme;
  const charts = theme.charts as { light: ChartColors; dark: ChartColors };

  function hslToString(color: HSLAColor) {
    return `${color.h} ${color.s}% ${color.l}%`;
  }

  function processColorScheme(scheme: ColorScheme) {
    const processed: Record<string, string> = {};
    for (const [key, value] of Object.entries(scheme)) {
      processed[key] = hslToString(value);
    }
    return processed;
  }

  function processChartColors(chartScheme: ChartColors) {
    const processed: Record<string, string> = {};
    for (const [key, value] of Object.entries(chartScheme)) {
      processed[`chart-${key.at(-1)}`] = hslToString(value);
    }
    return processed;
  }

  const lightColors = processColorScheme(lightScheme);
  const darkColors = processColorScheme(darkScheme);
  const lightChartColors = processChartColors(charts.light);
  const darkChartColors = processChartColors(charts.dark);

  const finalTheme = {
    name: theme.name,
    type: "registry:theme",
    cssVars: {
      light: {
        ...lightColors,
        ...lightChartColors,
        radius: `${theme.radius}rem` || "9rem",
      },
      dark: {
        ...darkColors,
        ...darkChartColors,
      },
    },
    //fonts: theme.fonts as Record<string, string> | undefined,
    //space: theme.space || undefined,
    //shadow: theme.shadow || undefined,
  };

  return finalTheme;
}
