import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

import type { Brief, Prompts } from "./types";

const promptsSchema = z.object({
  recraftLogoPrompt: z.string().min(20),
  fluxMoodboardPrompts: z.tuple([
    z.string().min(20),
    z.string().min(20),
    z.string().min(20),
  ]),
  gptBentoPrompt: z.string().min(20),
  suggestedColors: z.array(z.string()).min(3).max(8),
  brandPersonality: z.array(z.string()).min(3).max(8),
});

function getModel() {
  const apiKey = process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_GATEWAY_API_KEY or OPENAI_API_KEY is required");
  }
  const provider = createOpenAI({
    apiKey,
    baseURL:
      process.env.AI_GATEWAY_BASE_URL ?? "https://ai-gateway.vercel.sh/v1",
  });
  return provider(
    process.env.KIT_PROMPT_MODEL ?? "anthropic/claude-sonnet-4-5",
  );
}

export async function briefToPrompts(brief: Brief): Promise<Prompts> {
  const advanced = brief.advanced ? JSON.stringify(brief.advanced) : "none";
  const { text } = await generateText({
    model: getModel(),
    prompt: [
      `Brand name: ${brief.name}`,
      `Description: ${brief.description}`,
      `Advanced preferences: ${advanced}`,
      "Return only valid JSON matching this TypeScript shape:",
      "{ recraftLogoPrompt: string; fluxMoodboardPrompts: [string, string, string]; gptBentoPrompt: string; suggestedColors: string[]; brandPersonality: string[] }",
      "Create prompts for a premium brand kit generator.",
      "The logo prompt should favor clean vector identity, precise lettering, and strong silhouette.",
      "The three moodboard prompts should explore distinct but coherent visual worlds.",
      "The bento prompt should compose the outputs into one polished brand presentation image.",
    ].join("\n"),
  });
  return promptsSchema.parse(JSON.parse(text));
}
