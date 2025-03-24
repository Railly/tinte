import { db } from "@/db";
import { ShadcnThemeSchema } from "@/db/schema";
import * as schema from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { track } from "@vercel/analytics/server";
import { generateObject } from "ai";

export const maxDuration = 30;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
});

export async function POST(request: Request) {
  const ip = request.headers.get("X-Forwarded-For") ?? "ip";
  const { success } = await ratelimit.limit(ip);
  const { prompt }: { prompt: string } = await request.json();
  const { userId } = await auth();

  if (!success) {
    await track("Theme Generation Ratelimited", { ip });
    return new Response("Ratelimited!", { status: 429 });
  }

  try {
    const result = await generateObject({
      model: openai("o3-mini"),
      system: `You are an expert at generating shadcn themes. Create a visually appealing and cohesive theme based on the user's prompt. Follow these guidelines:
        - Create both light and dark mode color schemes.
        - Ensure high contrast between background and foreground for readability in both modes.
        - Use appropriate colors for primary, secondary, accent, and destructive elements in both modes.
        - All color values should be in Oklch format as strings (e.g., "oklch(50% 0.2 25)").
        - Radius should be in rem units.
        - Create sets of chart colors that work well together and with the main theme for both light and dark modes.`,
      schema: ShadcnThemeSchema,
      prompt: `Generate a shadcn theme with light and dark modes based on this description: "${prompt}"`,
    });

    await track("Theme Generated", {
      name: result.object.name,
    });

    const id = nanoid();
    await db.insert(schema.shadcnThemes).values({
      id,
      name: result.object.name,
      lightThemeColors: result.object.light,
      darkThemeColors: result.object.dark,
      radius: result.object.radius.toString(),
      userId,
    });

    return Response.json({
      id,
    });
  } catch (error) {
    console.error("Theme generation error:", error);
    await track("Theme Generation Failed", { error: (error as Error).message });
    return Response.json(
      { error: "Failed to generate theme" },
      { status: 500 },
    );
  }
}
