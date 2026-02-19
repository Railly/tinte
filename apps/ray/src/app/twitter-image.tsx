import { ImageResponse } from "@takumi-rs/image-response";

export const alt = "Ray by Tinte - Beautiful code screenshots powered by 500+ themes";
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      tw="flex h-full w-full flex-row items-center justify-center bg-[#09090b] relative"
      style={{ gap: 80, padding: "0 80px" }}
    >
      <div
        tw="absolute inset-0 flex"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, #131316 0%, #09090b 100%)",
        }}
      />

      <div tw="flex flex-col z-10 flex-1" style={{ gap: 20 }}>
        <div tw="flex items-center" style={{ gap: 14 }}>
          <div
            tw="flex items-center justify-center rounded-lg"
            style={{
              width: 40,
              height: 40,
              background: "#fafafa",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#09090b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span
            tw="text-white"
            style={{
              fontSize: 56,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              fontFamily: "Geist Mono",
            }}
          >
            ray
          </span>
          <span
            tw="text-[#52525b]"
            style={{
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginLeft: 8,
            }}
          >
            by tinte
          </span>
        </div>

        <span
          tw="text-[#a1a1aa]"
          style={{
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            fontFamily: "Geist",
          }}
        >
          Beautiful code screenshots
        </span>

        <span
          tw="text-[#52525b]"
          style={{
            fontSize: 18,
            fontWeight: 500,
            fontFamily: "Geist",
          }}
        >
          500+ themes · API · Claude Skill
        </span>
      </div>

      <div
        tw="flex flex-col z-10"
        style={{
          gap: 6,
          padding: "32px 28px",
          borderRadius: 12,
          border: "1px solid #27272a",
          background: "#0c0c0e",
          width: 380,
        }}
      >
        <div tw="flex" style={{ gap: 8, marginBottom: 12 }}>
          <div tw="rounded-full" style={{ width: 12, height: 12, background: "#FF5F57" }} />
          <div tw="rounded-full" style={{ width: 12, height: 12, background: "#FFBD2E" }} />
          <div tw="rounded-full" style={{ width: 12, height: 12, background: "#28C840" }} />
        </div>
        <div tw="flex" style={{ fontFamily: "Geist Mono", fontSize: 13, color: "#7c3aed" }}>
          function
          <span style={{ color: "#fbbf24", marginLeft: 6 }}>greet</span>
          <span style={{ color: "#a1a1aa" }}>()</span>
          <span style={{ color: "#a1a1aa", marginLeft: 4 }}>{"{"}</span>
        </div>
        <div tw="flex" style={{ fontFamily: "Geist Mono", fontSize: 13, color: "#7c3aed", paddingLeft: 20 }}>
          return
          <span style={{ color: "#22c55e", marginLeft: 6 }}>&quot;Hello, World!&quot;</span>
        </div>
        <div tw="flex" style={{ fontFamily: "Geist Mono", fontSize: 13, color: "#a1a1aa" }}>
          {"}"}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
