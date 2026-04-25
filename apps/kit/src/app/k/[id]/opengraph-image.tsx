import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { brandKitAssets, brandKits, db } from "@/db";

export const alt = "kit.tinte.dev brand kit";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OpenGraphImageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { id } = await params;
  const [kit] = await db
    .select()
    .from(brandKits)
    .where(eq(brandKits.id, id))
    .limit(1);

  if (!kit || !kit.is_public) {
    notFound();
  }

  const assets = await db
    .select()
    .from(brandKitAssets)
    .where(eq(brandKitAssets.kit_id, id))
    .orderBy(asc(brandKitAssets.created_at));
  const bento = assets.find((asset) => asset.type === "bento");
  const logo = assets.find((asset) => asset.type === "logo");
  const moodboards = assets
    .filter((asset) => asset.type === "moodboard")
    .slice(0, 2);
  const images = [bento, logo, ...moodboards].filter(
    (asset): asset is NonNullable<typeof asset> => Boolean(asset),
  );

  return new ImageResponse(
    <div
      style={{
        background: "#0c0c0b",
        color: "#f4f1e8",
        display: "flex",
        fontFamily: "Arial",
        height: "100%",
        padding: 56,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          justifyContent: "space-between",
          width: 430,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#d8ff5f",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            kit.tinte.dev
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {kit.name}
          </div>
          <div
            style={{
              color: "#c6b8ad",
              display: "flex",
              fontSize: 28,
              lineHeight: 1.25,
            }}
          >
            {kit.description}
          </div>
        </div>
        {!kit.is_paid ? (
          <div
            style={{
              background: "rgba(216,255,95,0.12)",
              border: "1px solid rgba(216,255,95,0.45)",
              borderRadius: 16,
              color: "#d8ff5f",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              padding: "14px 18px",
              width: "max-content",
            }}
          >
            Made with kit.tinte.dev
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: 16,
          marginLeft: 42,
        }}
      >
        {images.length > 0 ? (
          <div
            style={{
              display: "flex",
              flex: 1,
              gap: 16,
            }}
          >
            <img
              alt=""
              src={images[0].url}
              style={{
                border: "1px solid #2b2925",
                borderRadius: 24,
                height: "100%",
                objectFit: "cover",
                width: 430,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: 220,
              }}
            >
              {images.slice(1, 3).map((asset) => (
                <img
                  alt=""
                  key={asset.id}
                  src={asset.url}
                  style={{
                    border: "1px solid #2b2925",
                    borderRadius: 24,
                    height: 252,
                    objectFit: "cover",
                    width: 220,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              alignItems: "center",
              border: "1px solid #2b2925",
              borderRadius: 24,
              color: "#a7a096",
              display: "flex",
              flex: 1,
              fontSize: 34,
              justifyContent: "center",
            }}
          >
            Brand kit preview
          </div>
        )}
      </div>
    </div>,
    size,
  );
}
