import { fal } from "@fal-ai/client";

import type { GeneratedImage, JsonValue } from "./types";

const recraftModel = process.env.KIT_RECRAFT_MODEL ?? "fal-ai/recraft-v3";
const fluxModel = process.env.KIT_FLUX_MODEL ?? "fal-ai/flux-pro/v1.1-ultra";

function configureFal() {
  if (process.env.FAL_KEY) {
    fal.config({ credentials: process.env.FAL_KEY });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findImageUrl(value: unknown): string | undefined {
  if (typeof value === "string" && value.startsWith("http")) return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = findImageUrl(item);
      if (url) return url;
    }
  }
  if (isRecord(value)) {
    for (const key of ["url", "image_url"]) {
      const candidate = value[key];
      if (typeof candidate === "string" && candidate.startsWith("http")) {
        return candidate;
      }
    }
    for (const candidate of Object.values(value)) {
      const url = findImageUrl(candidate);
      if (url) return url;
    }
  }
  return undefined;
}

function collectImageUrls(value: unknown): string[] {
  const urls = new Set<string>();
  const visit = (input: unknown) => {
    if (typeof input === "string" && input.startsWith("http")) {
      urls.add(input);
      return;
    }
    if (Array.isArray(input)) {
      for (const item of input) visit(item);
      return;
    }
    if (isRecord(input)) {
      for (const item of Object.values(input)) visit(item);
    }
  };
  visit(value);
  return [...urls];
}

async function downloadImage(
  url: string,
  filename: string,
  metadata: Record<string, JsonValue>,
) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download generated image: ${response.status}`);
  }
  const data = new Uint8Array(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/png";
  return {
    data,
    contentType,
    filename,
    sourceUrl: url,
    metadata,
  } satisfies GeneratedImage;
}

async function subscribe(model: string, input: Record<string, JsonValue>) {
  configureFal();
  const result = await fal.subscribe(model, { input });
  return result;
}

export async function generateLogo(prompt: string) {
  const result = await subscribe(recraftModel, {
    prompt,
    image_size: "square_hd",
    style: "vector_illustration",
  });
  const url = findImageUrl(result);
  if (!url) throw new Error("fal logo generation did not return an image URL");
  return downloadImage(url, "logo.png", { model: recraftModel, prompt });
}

export async function generateLogoVariations(prompt: string, count = 3) {
  const result = await subscribe(recraftModel, {
    prompt,
    image_size: "square_hd",
    style: "vector_illustration",
    num_images: count,
  });
  const urls = collectImageUrls(result).slice(0, count);
  if (urls.length === 0) {
    throw new Error("fal logo variation generation did not return image URLs");
  }
  return Promise.all(
    urls.map((url, index) =>
      downloadImage(url, `logo-variation-${index + 1}.png`, {
        model: recraftModel,
        prompt,
        variation: index + 1,
      }),
    ),
  );
}

export async function generateMoodboard(prompt: string) {
  const result = await subscribe(fluxModel, {
    prompt,
    image_size: "landscape_4_3",
    num_images: 1,
  });
  const url = findImageUrl(result);
  if (!url)
    throw new Error("fal moodboard generation did not return an image URL");
  return downloadImage(url, "moodboard.png", { model: fluxModel, prompt });
}
