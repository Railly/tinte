import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { track } from "@vercel/analytics/server";

export const maxDuration = 15;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "10s"),
  analytics: true,
});

const outputSchema = z.object({
  enhancedPrompt: z
    .string()
    .describe(
      "Enhanced theme description prompt for shadcn/ui (ideally 10-200 characters)",
    ),
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("X-Forwarded-For") ?? "ip";
  const { success } = await ratelimit.limit(ip);
  const { prompt }: { prompt: string } = await req.json();

  if (!success) {
    await track("Theme Description Enhancement Ratelimited", { ip });
    return new Response("Ratelimited!", { status: 429 });
  }

  try {
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      system: `You are an expert at enhancing theme descriptions for shadcn/ui, a React component library. Your task is to take a user's initial theme idea and expand it into a more evocative and atmospheric description. Follow these guidelines:
      - Maintain the core concept and mood of the original prompt
      - Use rich, descriptive language to evoke a specific atmosphere or feeling
      - Suggest a cohesive color palette that fits the theme's mood (e.g., "deep grays, silvers, and muted blues")
      - Incorporate thematic elements that could influence UI design (e.g., "gothic and fantasy elements")
      - Keep the enhanced prompt concise (max 150 characters)
      - Aim for a tone similar to this example: "A theme inspired by Mistborn, evoking a dark, mysterious, and magical atmosphere. Expect deep grays, silvers, and muted blues with gothic and fantasy elements."`,
      schema: outputSchema,
      prompt: `Enhance this shadcn/ui theme description, maintaining its mood and adding atmospheric details: "${prompt}"`,
    });

    await track("Theme Description Enhanced", {
      originalLength: prompt.length,
      enhancedLength: result.object.enhancedPrompt.length,
    });

    return Response.json({ enhancedPrompt: result.object.enhancedPrompt });
  } catch (error) {
    console.error("Theme description enhancement error:", error);
    await track("Theme Description Enhancement Failed", {
      error: (error as Error)?.message,
    });
    return Response.json(
      { error: "Failed to enhance theme description" },
      { status: 500 },
    );
  }
}
