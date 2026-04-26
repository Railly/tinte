import { desc, eq } from "drizzle-orm";

import { brandKitAssets, brandKits, db } from "@/db";

interface RecentKitsGridProps {
  limit?: number;
  offset?: number;
}

const PLACEHOLDERS = ["Acme", "Lumen", "Nova", "Forge", "Halo", "Drift"];

export async function RecentKitsGrid({
  limit = 6,
  offset = 0,
}: RecentKitsGridProps) {
  const kits = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.is_public, true))
    .orderBy(desc(brandKits.created_at))
    .limit(limit)
    .offset(offset);

  const assets = kits.length
    ? await db
        .select()
        .from(brandKitAssets)
        .where(eq(brandKitAssets.type, "bento"))
        .orderBy(desc(brandKitAssets.created_at))
    : [];

  const bentoByKitId = new Map<string, (typeof assets)[number]>();
  for (const asset of assets) {
    if (!bentoByKitId.has(asset.kit_id)) {
      bentoByKitId.set(asset.kit_id, asset);
    }
  }

  const cards = Array.from({ length: 6 }, (_, index) => {
    const kit = kits[index];
    return {
      key: kit?.id ?? `placeholder-${index}`,
      kit,
      asset: kit ? bentoByKitId.get(kit.id) : undefined,
      placeholder: kit ? null : PLACEHOLDERS[index] ?? `Brand ${index + 1}`,
    };
  });

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <a
            className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-[#2b2925] bg-[#171613] transition-all duration-300 hover:scale-[1.015] hover:border-[#3a372f]"
            href={card.kit ? `/k/${card.kit.id}` : "/examples"}
            key={card.key}
          >
            {card.asset ? (
              <img
                alt={card.kit?.name ?? ""}
                className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                src={card.asset.url}
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#171613] via-[#1f1d18] to-[#0c0c0b]">
                <span className="font-semibold text-[#3a372f] text-3xl tracking-tight">
                  {card.placeholder}
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c0c0b] via-[#0c0c0b]/60 to-transparent p-4">
              <p className="font-medium text-[#f4f1e8] text-sm">
                {card.kit?.name ?? card.placeholder}
              </p>
              {card.kit ? (
                <p className="line-clamp-1 text-[#a7a096] text-xs">
                  {card.kit.description}
                </p>
              ) : (
                <p className="text-[#a7a096] text-xs">Coming soon</p>
              )}
            </div>
          </a>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0c0c0b] via-[#0c0c0b]/70 to-transparent"
      />
    </div>
  );
}
