import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { track } from "@vercel/analytics/server";

export const maxDuration = 30;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
});

const HSLAColorString = z
  .string()
  .regex(
    /^hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%,\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\)$/,
  );

const ThemeSchema = z.object({
  background: HSLAColorString,
  foreground: HSLAColorString,
  card: HSLAColorString,
  "card-foreground": HSLAColorString,
  popover: HSLAColorString,
  "popover-foreground": HSLAColorString,
  primary: HSLAColorString,
  "primary-foreground": HSLAColorString,
  secondary: HSLAColorString,
  "secondary-foreground": HSLAColorString,
  muted: HSLAColorString,
  "muted-foreground": HSLAColorString,
  accent: HSLAColorString,
  "accent-foreground": HSLAColorString,
  destructive: HSLAColorString,
  "destructive-foreground": HSLAColorString,
  border: HSLAColorString,
  input: HSLAColorString,
  ring: HSLAColorString,
});

const ChartColorSchema = z.object({
  "chart-1": HSLAColorString,
  "chart-2": HSLAColorString,
  "chart-3": HSLAColorString,
  "chart-4": HSLAColorString,
  "chart-5": HSLAColorString,
});

const outputSchema = z.object({
  displayName: z.string().min(3).describe("Short theme name"),
  light: ThemeSchema,
  dark: ThemeSchema,
  radius: z.number().describe("in rem units"),
  charts: z.object({
    light: ChartColorSchema,
    dark: ChartColorSchema,
  }),
});

function parseHSLA(hsla: string): {
  h: number;
  s: number;
  l: number;
  a: number;
} {
  const match = hsla.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/);
  if (!match || match.length !== 5) {
    throw new Error(`Invalid HSLA string: ${hsla}`);
  }

  const [, h, s, l, a] = match;

  if (
    h === undefined ||
    s === undefined ||
    l === undefined ||
    a === undefined
  ) {
    throw new Error(`Invalid HSLA string: ${hsla}`);
  }

  return {
    h: parseInt(h, 10),
    s: parseInt(s, 10),
    l: parseInt(l, 10),
    a: parseFloat(a),
  };
}

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("X-Forwarded-For") ?? "ip";
  const { success } = await ratelimit.limit(ip);
  const { prompt }: { prompt: string } = await req.json();

  if (!success) {
    await track("Theme Generation Ratelimited", { ip });
    return new Response("Ratelimited!", { status: 429 });
  }

  try {
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      system: `You are an expert at generating shadcn themes. Create a visually appealing and cohesive theme based on the user's prompt. Follow these guidelines:
        - Create both light and dark mode color schemes.
        - Ensure high contrast between background and foreground for readability in both modes.
        - Use appropriate colors for primary, secondary, accent, and destructive elements in both modes.
        - All color values should be in HSLA format as strings (e.g., "hsla(360, 100%, 50%, 1)").
        - Radius should be in rem units.
        - Create sets of chart colors that work well together and with the main theme for both light and dark modes.`,
      schema: outputSchema,
      prompt: `Generate a shadcn theme with light and dark modes based on this description: "${prompt}"`,
    });

    const parsedTheme = {
      ...result.object,
      light: Object.fromEntries(
        Object.entries(result.object.light).map(([key, value]) => [
          key,
          parseHSLA(value as string),
        ]),
      ),
      dark: Object.fromEntries(
        Object.entries(result.object.dark).map(([key, value]) => [
          key,
          parseHSLA(value as string),
        ]),
      ),
      charts: {
        light: Object.fromEntries(
          Object.entries(result.object.charts.light).map(([key, value]) => [
            key,
            parseHSLA(value as string),
          ]),
        ),
        dark: Object.fromEntries(
          Object.entries(result.object.charts.dark).map(([key, value]) => [
            key,
            parseHSLA(value as string),
          ]),
        ),
      },
    };

    await track("Theme Generated", {
      displayName: parsedTheme.displayName,
    });

    return Response.json({ theme: parsedTheme });
  } catch (error) {
    console.error("Theme generation error:", error);
    await track("Theme Generation Failed", { error: (error as Error).message });
    return Response.json(
      { error: "Failed to generate theme" },
      { status: 500 },
    );
  }
}
