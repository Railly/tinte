import OpenAI from "openai";

import type { GeneratedImage } from "./types";

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function generateBento(prompt: string, referenceImages: string[]) {
  const client = getOpenAI();
  const response = await client.images.generate({
    model: "gpt-image-1",
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
    filename: "bento.png",
    metadata: {
      model: "gpt-image-1",
      prompt,
      referenceImages,
    },
  } satisfies GeneratedImage;
}
