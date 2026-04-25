import { desc, eq } from "drizzle-orm";

import { brandKitAssets, brandKits, db } from "@/db";

interface RecentKitsGridProps {
  limit?: number;
  offset?: number;
}

export async function RecentKitsGrid({
  limit = 12,
  offset = 0,
}: RecentKitsGridProps) {
  const kits = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.is_public, true))
    .orderBy(desc(brandKits.created_at))
    .limit(limit)
    .offset(offset);

  if (kits.length === 0) {
    return (
      <div className="rounded-lg border border-[#2b2925] bg-[#171613] p-6 text-[#a7a096]">
        Recent public kits will appear here.
      </div>
    );
  }

  const assets = await db
    .select()
    .from(brandKitAssets)
    .where(eq(brandKitAssets.type, "bento"))
    .orderBy(desc(brandKitAssets.created_at));
  const bentoByKitId = new Map<string, (typeof assets)[number]>();

  for (const asset of assets) {
    if (!bentoByKitId.has(asset.kit_id)) {
      bentoByKitId.set(asset.kit_id, asset);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kits.map((kit) => {
        const asset = bentoByKitId.get(kit.id);

        return (
          <a
            className="group overflow-hidden rounded-lg border border-[#2b2925] bg-[#171613] transition-colors hover:border-[#d8ff5f]"
            href={`/k/${kit.id}`}
            key={kit.id}
          >
            {asset ? (
              <img
                alt={`${kit.name} bento`}
                className="aspect-[4/3] w-full object-cover"
                src={asset.url}
              />
            ) : (
              <div className="kit-shimmer aspect-[4/3]" />
            )}
            <div className="grid gap-2 p-4">
              <h3 className="font-medium">{kit.name}</h3>
              <p className="line-clamp-2 text-[#a7a096] text-sm">
                {kit.description}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
