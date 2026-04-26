import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { type ZodType, z } from "zod";

import type { Brief, Prompts } from "./types";

interface PromptsRaw {
  recraftLogoPrompt: string;
  fluxMoodboardPrompts: string[];
  gptBentoPrompt: string;
  suggestedColors: string[];
  brandPersonality: string[];
}

const promptsSchema: ZodType<PromptsRaw> = z.object({
  recraftLogoPrompt: z.string(),
  fluxMoodboardPrompts: z.array(z.string()),
  gptBentoPrompt: z.string(),
  suggestedColors: z.array(z.string()),
  brandPersonality: z.array(z.string()),
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
  // biome-ignore lint/suspicious/noExplicitAny: AI SDK generic inference triggers TS2589
  const generateObjectAny = generateObject as unknown as (
    args: unknown,
  ) => Promise<{ object: PromptsRaw }>;
  const { object } = await generateObjectAny({
    model: getModel(),
    schema: promptsSchema,
    prompt: [
      `Brand name: ${brief.name}`,
      `Description: ${brief.description}`,
      `Advanced preferences: ${advanced}`,
      "Use advanced preferences as steering signals when present.",
      "Treat vibe tags as personality and composition direction.",
      "Use color hints as palette anchors, preserving HSL intent in suggestedColors.",
      "Use reference image URLs as visual reference descriptions, not as literal brands to copy.",
      "Create prompts for a premium brand kit generator.",
      "The logo prompt should favor clean vector identity, precise lettering, and strong silhouette.",
      "The three moodboard prompts should explore distinct but coherent visual worlds.",
      "The bento prompt should compose the outputs into one polished brand presentation image.",
    ].join("\n"),
  });
  const [m1, m2, m3] = object.fluxMoodboardPrompts;
  if (!m1 || !m2 || !m3) {
    throw new Error("Sonnet returned fewer than 3 moodboard prompts");
  }
  return {
    recraftLogoPrompt: object.recraftLogoPrompt,
    fluxMoodboardPrompts: [m1, m2, m3],
    gptBentoPrompt: object.gptBentoPrompt,
    suggestedColors: object.suggestedColors,
    brandPersonality: object.brandPersonality,
  };
}
