import { desc, eq } from "drizzle-orm";

import { brandKitAssets, brandKits, db } from "@/db";

interface RecentKitsGridProps {
  limit?: number;
  offset?: number;
}

const PLACEHOLDERS = [
  { name: "Acme", note: "Modular furniture" },
  { name: "Lumen", note: "Reading lamps" },
  { name: "Nova", note: "Astronomy app" },
  { name: "Forge", note: "AI compiler" },
  { name: "Halo", note: "Wellness device" },
  { name: "Drift", note: "Minimal travel" },
];

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
      placeholder: kit ? null : PLACEHOLDERS[index] ?? PLACEHOLDERS[0],
    };
  });

  return (
    <div className="grid gap-px overflow-hidden rounded border border-[var(--color-ui)] bg-[var(--color-ui)] sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <a
          className="group relative flex aspect-[4/5] flex-col justify-between bg-[var(--color-bg)] p-5 transition-colors hover:bg-[var(--color-bg-2)]"
          href={card.kit ? `/k/${card.kit.id}` : "/examples"}
          key={card.key}
        >
          {card.asset ? (
            <img
              alt={card.kit?.name ?? ""}
              className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-90"
              src={card.asset.url}
            />
          ) : (
            <div className="-z-10 absolute inset-0 bg-[var(--color-bg)] bg-grid opacity-40" />
          )}
          <div className="relative flex items-baseline justify-between">
            <span className="font-mono text-[10px] text-[var(--color-tx-3)] uppercase tracking-[0.18em]">
              {String(cards.indexOf(card) + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-tx-3)] uppercase tracking-[0.18em]">
              {card.kit ? "Live" : "Coming"}
            </span>
          </div>
          <div className="relative">
            <h3 className="font-serif text-[40px] text-[var(--color-tx)] leading-[1] sm:text-[44px]">
              {card.kit?.name ?? card.placeholder?.name}
            </h3>
            <p className="mt-2 text-[12px] text-[var(--color-tx-2)]">
              {card.kit?.description ?? card.placeholder?.note}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
