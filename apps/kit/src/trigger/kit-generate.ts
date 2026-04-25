import {
  type Brief,
  briefToPrompts,
  type GeneratedImage,
  generateBento,
  generateLogo,
  generateLogoVariations,
  generateMoodboard,
  type JsonValue,
  uploadAsset,
} from "@tinte/kit-providers";
import { metadata, task } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";

import { brandKitAssets, brandKits, db } from "@/db";
import { createKitId } from "@/lib/ids";

type AssetType = "logo" | "logo_variation" | "moodboard" | "bento";

interface KitGeneratePayload {
  kitId: string;
  brief: Brief;
}

type MetadataAssets = Record<AssetType, string[]>;

async function setCurrentStep(
  step:
    | "drafting_prompts"
    | "generating_logo"
    | "generating_moodboard"
    | "composing_bento"
    | "completed",
) {
  metadata.set("currentStep", step);
  await metadata.flush();
}

async function setMetadataAssets(assets: MetadataAssets) {
  metadata.set("assets", assets);
  await metadata.flush();
}

async function persistAsset(
  kitId: string,
  type: AssetType,
  image: GeneratedImage,
  index?: number,
) {
  const uploaded = await uploadAsset(image, kitId);
  await db.insert(brandKitAssets).values({
    id: createKitId(),
    kit_id: kitId,
    type,
    url: uploaded.url,
    metadata: {
      ...image.metadata,
      sourceUrl: image.sourceUrl ?? null,
      uploadKey: uploaded.key,
      index: index ?? null,
    },
    is_premium: false,
  });
  return uploaded.url;
}

export const kitGenerate = task({
  id: "kit-generate",
  maxDuration: 600,
  run: async ({ kitId, brief }: KitGeneratePayload) => {
    const metadataAssets: MetadataAssets = {
      logo: [],
      logo_variation: [],
      moodboard: [],
      bento: [],
    };

    try {
      await setCurrentStep("drafting_prompts");
      const prompts = await briefToPrompts(brief);

      await db
        .update(brandKits)
        .set({
          prompts: prompts as unknown as Record<string, JsonValue>,
          status: "generating",
        })
        .where(eq(brandKits.id, kitId));

      await setCurrentStep("generating_logo");
      const [logo, variations, moodboard] = await Promise.all([
        generateLogo(prompts.recraftLogoPrompt),
        generateLogoVariations(prompts.recraftLogoPrompt, 3),
        Promise.all(
          prompts.fluxMoodboardPrompts.map((prompt) =>
            generateMoodboard(prompt),
          ),
        ),
      ]);

      const logoUrl = await persistAsset(kitId, "logo", logo);
      metadataAssets.logo = [logoUrl];
      await setMetadataAssets(metadataAssets);

      const variationUrls = await Promise.all(
        variations.map((image, index) =>
          persistAsset(kitId, "logo_variation", image, index + 1),
        ),
      );
      metadataAssets.logo_variation = variationUrls;
      await setMetadataAssets(metadataAssets);

      await setCurrentStep("generating_moodboard");
      const moodboardUrls = await Promise.all(
        moodboard.map((image, index) =>
          persistAsset(kitId, "moodboard", image, index + 1),
        ),
      );
      metadataAssets.moodboard = moodboardUrls;
      await setMetadataAssets(metadataAssets);

      await setCurrentStep("composing_bento");
      const bento = await generateBento(prompts.gptBentoPrompt, [
        logoUrl,
        ...variationUrls,
        ...moodboardUrls,
      ]);

      const bentoUrl = await persistAsset(kitId, "bento", bento);
      metadataAssets.bento = [bentoUrl];
      await setMetadataAssets(metadataAssets);

      await db
        .update(brandKits)
        .set({ status: "completed" })
        .where(eq(brandKits.id, kitId));

      await setCurrentStep("completed");
      return { kitId };
    } catch (error) {
      await db
        .update(brandKits)
        .set({ status: "failed" })
        .where(eq(brandKits.id, kitId));
      throw error;
    }
  },
});
