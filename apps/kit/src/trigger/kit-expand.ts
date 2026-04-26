import {
  type GeneratedImage,
  generateComposition,
  uploadAsset,
} from "@tinte/kit-providers";
import { task } from "@trigger.dev/sdk";
import { and, asc, eq, inArray } from "drizzle-orm";

import { brandKitAssets, brandKits, db } from "@/db";
import { createKitId } from "@/lib/ids";
import type { PricingPlan } from "@/lib/polar";

type PremiumAssetType =
  | "icon_set"
  | "hero"
  | "mockup_product"
  | "lifestyle"
  | "urban_campaign";

interface KitExpandPayload {
  kitId: string;
  plan?: PricingPlan;
  orderId?: string;
}

const premiumPrompts: Array<{
  type: PremiumAssetType;
  filename: string;
  prompt: string;
}> = [
  {
    type: "icon_set",
    filename: "icon-set.png",
    prompt:
      "Create a coherent 12-piece brand icon set with crisp vector geometry, matching the logo identity and moodboard references.",
  },
  {
    type: "hero",
    filename: "hero-illustration.png",
    prompt:
      "Create a polished website hero illustration for this brand, using the logo identity, colors, texture, and art direction from the references.",
  },
  {
    type: "mockup_product",
    filename: "product-mockup.png",
    prompt:
      "Create premium product mockups that apply the brand across packaging, app surfaces, and launch collateral with realistic presentation lighting.",
  },
  {
    type: "lifestyle",
    filename: "lifestyle.png",
    prompt:
      "Create an editorial lifestyle campaign image that makes this brand feel real in use, with natural photography direction and brand-consistent styling.",
  },
  {
    type: "urban_campaign",
    filename: "urban-campaign.png",
    prompt:
      "Create an urban campaign visual showing the brand applied to posters, signage, and street-level launch media in a cohesive premium composition.",
  },
];

async function persistPremiumAsset(
  kitId: string,
  type: PremiumAssetType,
  image: GeneratedImage,
  index: number,
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
      index,
    },
    is_premium: true,
  });
}

export const kitExpand = task({
  id: "kit-expand",
  maxDuration: 600,
  run: async ({ kitId, plan, orderId }: KitExpandPayload) => {
    const [kit] = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.id, kitId))
      .limit(1);

    if (!kit) throw new Error(`Kit ${kitId} not found`);

    const references = await db
      .select()
      .from(brandKitAssets)
      .where(
        and(
          eq(brandKitAssets.kit_id, kitId),
          inArray(brandKitAssets.type, ["logo", "moodboard", "bento"]),
        ),
      )
      .orderBy(asc(brandKitAssets.created_at));

    const referenceUrls = references.map((asset) => asset.url);

    const promptBase = [
      `Brand name: ${kit.name}`,
      `Description: ${kit.description}`,
      kit.prompts ? `Saved prompt context: ${JSON.stringify(kit.prompts)}` : "",
      plan ? `Paid tier: ${plan}` : "",
      orderId ? `Polar order: ${orderId}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await Promise.all(
      premiumPrompts.map(async (asset, index) => {
        const image = await generateComposition(
          `${promptBase}\n\n${asset.prompt}`,
          referenceUrls,
          asset.filename,
        );
        await persistPremiumAsset(kitId, asset.type, image, index + 1);
      }),
    );

    return { kitId, generated: premiumPrompts.length };
  },
});
