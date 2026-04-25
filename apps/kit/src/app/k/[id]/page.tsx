import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { brandKitAssets, brandKits, db } from "@/db";

interface KitPageProps {
  params: Promise<{
    id: string;
  }>;
}

const slots = [
  { type: "logo", title: "Logo" },
  { type: "logo_variation", title: "Logo variations" },
  { type: "moodboard", title: "Moodboard" },
  { type: "bento", title: "Bento" },
] as const;

export default async function KitPage({ params }: KitPageProps) {
  const { id } = await params;
  const [kit] = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.id, id))
    .limit(1);

  if (!kit) notFound();

  const assets = await db
    .select()
    .from(brandKitAssets)
    .where(eq(brandKitAssets.kit_id, id))
    .orderBy(asc(brandKitAssets.created_at));

  return (
    <main className="min-h-screen px-6 py-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between border-[#2b2925] border-b pb-5">
        <a className="font-semibold text-lg" href="/">
          kit.tinte.dev
        </a>
        <span className="rounded-full border border-[#3a372f] px-3 py-1 text-[#a7a096] text-sm">
          {kit.status}
        </span>
      </nav>
      <section className="mx-auto max-w-6xl py-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-[#d8ff5f] text-sm uppercase tracking-[0.18em]">
            Brand kit
          </p>
          <h1 className="mt-3 font-semibold text-4xl">{kit.name}</h1>
          <p className="mt-3 text-[#a7a096]">{kit.description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {slots.map((slot) => {
            const slotAssets = assets.filter(
              (asset) => asset.type === slot.type,
            );
            return (
              <section
                className="min-h-[360px] rounded-lg border border-[#2b2925] bg-[#171613] p-4"
                key={slot.type}
              >
                <h2 className="mb-4 font-medium">{slot.title}</h2>
                {slotAssets.length > 0 ? (
                  <div className="grid gap-3">
                    {slotAssets.map((asset) => (
                      <img
                        alt={`${kit.name} ${slot.title}`}
                        className="aspect-[4/3] w-full rounded-md border border-[#2b2925] object-cover"
                        key={asset.id}
                        src={asset.url}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-[#2b2925] bg-[#0c0c0b] text-[#a7a096]">
                    Waiting for image
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
