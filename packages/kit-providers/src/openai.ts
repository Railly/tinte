import { toFile } from "openai";
import OpenAI from "openai";

import type { GeneratedImage } from "./types";

const imageModel = process.env.KIT_IMAGE_MODEL ?? "gpt-image-2";

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function fetchAsUploadable(url: string, index: number) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch reference image ${url}: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = (res.headers.get("content-type") ?? "image/png").includes("jpeg")
    ? "jpg"
    : "png";
  return toFile(buf, `ref-${index}.${ext}`, { type: `image/${ext}` });
}

export async function generateComposition(
  prompt: string,
  referenceImages: string[],
  filename: string,
) {
  const client = getOpenAI();

  if (referenceImages.length === 0) {
    const response = await client.images.generate({
      model: imageModel,
      prompt,
      size: "1024x1024",
      quality: "high",
    });
    const image = response.data?.[0];
    if (!image?.b64_json) {
      throw new Error("OpenAI image generation did not return b64_json");
    }
    return {
      data: Uint8Array.from(Buffer.from(image.b64_json, "base64")),
      contentType: "image/png",
      filename,
      metadata: { model: imageModel, prompt, referenceImages: [] },
    } satisfies GeneratedImage;
  }

  const uploadables = await Promise.all(
    referenceImages.map((url, i) => fetchAsUploadable(url, i)),
  );

  const response = await client.images.edit({
    model: imageModel,
    image: uploadables,
    prompt,
    size: "1024x1024",
    quality: "high",
  });
  const image = response.data?.[0];
  if (!image?.b64_json) {
    throw new Error("OpenAI image edit did not return b64_json");
  }
  return {
    data: Uint8Array.from(Buffer.from(image.b64_json, "base64")),
    contentType: "image/png",
    filename,
    metadata: { model: imageModel, prompt, referenceImages },
  } satisfies GeneratedImage;
}

export async function generateBento(prompt: string, referenceImages: string[]) {
  return generateComposition(prompt, referenceImages, "bento.png");
}
