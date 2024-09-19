import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

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
      "Enhanced theme description prompt for vscode (ideally 10-200 characters)",
    ),
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
    system: `You are an expert at enhancing theme descriptions for Visual Studio Code. Your task is to take a user's initial theme idea and expand it into a more detailed and creative description. Follow these guidelines:
    - Maintain the core concept of the original prompt
    - Add specific color suggestions or palettes
    - Keep the enhanced prompt concise (max 150 characters)
    - Use descriptive and evocative language`,
    schema: outputSchema,
    prompt: `Enhance this theme description: "${prompt}"`,
  });

  return Response.json({ enhancedPrompt: result.object.enhancedPrompt });
}
