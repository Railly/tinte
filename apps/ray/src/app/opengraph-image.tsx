import { ImageResponse } from "@takumi-rs/image-response";

export const alt = "Ray by Tinte - Beautiful code screenshots powered by 500+ themes";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div tw="flex h-full w-full flex-col items-center justify-center bg-[#09090b] relative">
      <div
        tw="absolute inset-0 flex"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #131316 0%, #09090b 100%)",
        }}
      />

      <div tw="flex flex-col items-center z-10" style={{ gap: 24 }}>
        <div tw="flex items-center" style={{ gap: 16 }}>
          <div
            tw="flex items-center justify-center rounded-xl"
            style={{
              width: 48,
              height: 48,
              background: "#fafafa",
            }}
          >
            <svg
              width="28"
              height="28"
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
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              fontFamily: "Geist Mono",
            }}
          >
            ray
          </span>
        </div>

        <span
          tw="text-[#71717a]"
          style={{
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          by tinte.dev
        </span>

        <div
          tw="flex"
          style={{
            width: 80,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #3f3f46, transparent)",
            marginTop: 8,
            marginBottom: 8,
          }}
        />

        <span
          tw="text-[#a1a1aa]"
          style={{
            fontSize: 32,
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
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            fontFamily: "Geist",
          }}
        >
          500+ themes · API · Claude Skill
        </span>

        <div
          tw="flex items-center rounded-lg"
          style={{
            gap: 4,
            marginTop: 24,
            padding: "12px 24px",
            border: "1px solid #27272a",
            background: "#0a0a0c",
          }}
        >
          <span
            tw="text-[#52525b]"
            style={{ fontSize: 14, fontFamily: "Geist Mono" }}
          >
            $
          </span>
          <span
            tw="text-[#a1a1aa]"
            style={{ fontSize: 14, fontFamily: "Geist Mono" }}
          >
            {" "}
            curl -X POST ray.tinte.dev/api/v1/screenshot
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
