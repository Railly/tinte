import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

export const maxDuration = 30;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
});

const HSLAColorSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
  a: z.number().min(0).max(1),
});

const ColorSchemaObject = z.object({
  background: HSLAColorSchema,
  foreground: HSLAColorSchema,
  card: HSLAColorSchema,
  "card-foreground": HSLAColorSchema,
  popover: HSLAColorSchema,
  "popover-foreground": HSLAColorSchema,
  primary: HSLAColorSchema,
  "primary-foreground": HSLAColorSchema,
  secondary: HSLAColorSchema,
  "secondary-foreground": HSLAColorSchema,
  muted: HSLAColorSchema,
  "muted-foreground": HSLAColorSchema,
  accent: HSLAColorSchema,
  "accent-foreground": HSLAColorSchema,
  destructive: HSLAColorSchema,
  "destructive-foreground": HSLAColorSchema,
  border: HSLAColorSchema.describe("subtle color"),
  input: HSLAColorSchema,
  ring: HSLAColorSchema,
});

const ChartColorSchema = z.object({
  chart1: HSLAColorSchema,
  chart2: HSLAColorSchema,
  chart3: HSLAColorSchema,
  chart4: HSLAColorSchema,
  chart5: HSLAColorSchema,
});

const outputSchema = z.object({
  displayName: z.string().min(3).describe("Shorty theme name"),
  light: ColorSchemaObject,
  dark: ColorSchemaObject,
  fonts: z.object({
    heading: z.enum([
      "inter",
      "Inter",
      "roboto",
      "Roboto",
      "opensans",
      "Open Sans",
      "Open sans",
    ]),
    body: z.enum([
      "inter",
      "Inter",
      "roboto",
      "Roboto",
      "opensans",
      "Open Sans",
      "Open sans",
    ]),
  }),
  radius: z.number().describe("in rem units"),
  space: z.number().describe("in rem units"),
  shadow: z.string(),
  charts: z.object({
    light: ChartColorSchema,
    dark: ChartColorSchema,
  }),
  icons: z.enum(["@phosphor-icons/react", "lucide-react"]).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("X-Forwarded-For") ?? "ip";
  const { success } = await ratelimit.limit(ip);
  const { prompt }: { prompt: string } = await req.json();

  if (!success) {
    return new Response("Ratelimited!", { status: 429 });
  }

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    system: `You are an expert at generating shadcn themes. Create a visually appealing and cohesive theme based on the user's prompt. Follow these guidelines:
  - Create both light and dark mode color schemes.
  - Ensure high contrast between background and foreground for readability in both modes.
  - Use appropriate colors for primary, secondary, accent, and destructive elements in both modes.
  - Choose suitable fonts for headings and body text.
  - Set appropriate values for radius, space, and shadow.
  - Create sets of chart colors that work well together and with the main theme for both light and dark modes.
  - Suggest an appropriate icon set.
  - All color values should be in HSLA format.
  - Radius and space should be in rem units.
  - Shadow should be a valid CSS box-shadow value.`,
    schema: outputSchema,
    prompt: `Generate a shadcn theme with light and dark modes based on this description: "${prompt}"`,
  });

  return Response.json({ theme: result.object });
}
