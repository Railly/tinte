import { db } from "@/db";
import { ShadcnThemeSchema } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { track } from "@vercel/analytics/server";
import { generateObject } from "ai";
import { schema } from "./schema";
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
      model: openai("gpt-4o-mini"),
      system: `You are an expert Visual Studio Code theme generator. Create visually appealing dark/light themes based on the user's prompt:
    - Use a consistent, limited color palette with complementary colors.
    - Ensure high contrast between background and foreground for readability.
    - Use desaturated colors for large areas, saturated for accents.
    - Always use different colors for light/dark, adjusting saturation and lightness.
    - Color shade order:
    dark: bg > bg-2 > ui > ui-2 > ui-3 > tx-3 > tx-2 > tx
    light: bg < bg-2 < ui < ui-2 < ui-3 < tx-3 < tx-2 < tx
    - For light theme:
        - Never use the same brightness as the dark theme.
        - Reduce lightness to 60% and chroma (0.094) for appealing, readable colors.
        - Ensure bg, bg-2, and all shades are harmonious and not too far apart.
        - UI should be precise and carefully selected.
        - Output as hex codes.`,
      schema,
      prompt,
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
      { status: 500 }
    );
  }
}
