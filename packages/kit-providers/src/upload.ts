import { UTApi } from "uploadthing/server";

import type { GeneratedImage, UploadedAsset } from "./types";

function getUploadthing() {
  if (!process.env.UPLOADTHING_TOKEN) {
    throw new Error("UPLOADTHING_TOKEN is not set");
  }
  return new UTApi({ token: process.env.UPLOADTHING_TOKEN });
}

export async function uploadAsset(image: GeneratedImage, prefix: string) {
  const uploadthing = getUploadthing();
  const file = new File(
    [Buffer.from(image.data)],
    `${prefix}/${image.filename}`,
    {
      type: image.contentType,
    },
  );
  const result = await uploadthing.uploadFiles(file);
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (!result.data) {
    throw new Error("Uploadthing did not return upload data");
  }
  return {
    url: result.data.ufsUrl ?? result.data.url,
    key: result.data.key,
    name: result.data.name,
    size: result.data.size,
  } satisfies UploadedAsset;
}
