import OpenAI from "openai";

import type { GeneratedImage } from "./types";

const imageModel = process.env.KIT_IMAGE_MODEL ?? "gpt-image-2";

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function generateComposition(
  prompt: string,
  referenceImages: string[],
  filename: string,
) {
  const client = getOpenAI();
  const response = await client.images.generate({
    model: imageModel,
    prompt: `${prompt}\n\nReference image URLs:\n${referenceImages.join("\n")}`,
    size: "1024x1024",
  });
  const image = response.data?.[0];
  if (!image?.b64_json) {
    throw new Error("OpenAI image generation did not return b64_json");
  }
  return {
    data: Uint8Array.from(Buffer.from(image.b64_json, "base64")),
    contentType: "image/png",
    filename,
    metadata: {
      model: imageModel,
      prompt,
      referenceImages,
    },
  } satisfies GeneratedImage;
}

export async function generateBento(prompt: string, referenceImages: string[]) {
  return generateComposition(prompt, referenceImages, "bento.png");
}
