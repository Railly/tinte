import { generateObject, gateway } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { Vibrant } from "node-vibrant/node";
import { z } from "zod";
import {
  type Palette,
  paletteToTheme,
  deriveGradientFromPalette,
  nameFromPalette,
} from "@/lib/palette-to-theme";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const TinteBlockSchema = z.object({
  bg: z.string(),
  bg_2: z.string(),
  ui: z.string(),
  ui_2: z.string(),
  ui_3: z.string(),
  tx: z.string(),
  tx_2: z.string(),
  tx_3: z.string(),
  pr: z.string(),
  sc: z.string(),
  ac_1: z.string(),
  ac_2: z.string(),
  ac_3: z.string(),
});

const ThemeResponseSchema = z.object({
  name: z.string(),
  dark: TinteBlockSchema,
  light: TinteBlockSchema,
});

async function extractWithAI(
  imageBase64: string,
  mimeType: string,
  vibrantPalette: Palette,
) {
  const swatchSummary = Object.entries(vibrantPalette)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v!.hex}`)
    .join(", ");

  const { object } = await generateObject({
    model: gateway("anthropic/claude-haiku-4-5-20251001"),
    schema: ThemeResponseSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: `data:${mimeType};base64,${imageBase64}`,
          },
          {
            type: "text",
            text: `You are a code editor theme designer. Given this image and its extracted color swatches (${swatchSummary}), create a beautiful code editor color theme inspired by the image's aesthetic.

Rules:
- name: 2-3 evocative words
- dark.bg: very dark (OKLCH lightness < 0.15)
- light.bg: very light (OKLCH lightness > 0.9)
- tx: >= 4.5:1 contrast ratio against bg
- pr, sc, ac_*: >= 3:1 contrast ratio against bg
- All values must be valid hex colors (#rrggbb)
- Use the image's color palette creatively, not just raw swatches

Color roles:
- bg/bg_2: editor background / sidebar panels
- ui/ui_2/ui_3: borders, hover states, selections
- tx/tx_2/tx_3: primary text, comments, line numbers
- pr: keywords, functions
- sc: strings, types
- ac_1: variables, params
- ac_2: constants, numbers
- ac_3: tags, attributes`,
          },
        ],
      },
    ],
  });

  return object;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    const mode = req.nextUrl.searchParams.get("mode") ?? "fast";

    let imageBuffer: Buffer;
    let fileType = "image/png";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "Missing 'image' field" },
          { status: 400 },
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Unsupported type: ${file.type}. Use PNG, JPEG, WebP, or GIF.`,
          },
          { status: 400 },
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Image too large. Max 5MB." },
          { status: 400 },
        );
      }
      imageBuffer = Buffer.from(await file.arrayBuffer());
      fileType = file.type;
    } else {
      const body = await req.arrayBuffer();
      if (body.byteLength === 0) {
        return NextResponse.json(
          {
            error:
              "Empty body. Send image as multipart/form-data or raw binary.",
          },
          { status: 400 },
        );
      }
      if (body.byteLength > MAX_SIZE) {
        return NextResponse.json(
          { error: "Image too large. Max 5MB." },
          { status: 400 },
        );
      }
      imageBuffer = Buffer.from(body);
    }

    const vibrantPalette = await Vibrant.from(imageBuffer).getPalette();

    const palette: Palette = {
      vibrant: vibrantPalette.Vibrant
        ? {
            hex: vibrantPalette.Vibrant.hex,
            population: vibrantPalette.Vibrant.population,
          }
        : undefined,
      darkVibrant: vibrantPalette.DarkVibrant
        ? {
            hex: vibrantPalette.DarkVibrant.hex,
            population: vibrantPalette.DarkVibrant.population,
          }
        : undefined,
      lightVibrant: vibrantPalette.LightVibrant
        ? {
            hex: vibrantPalette.LightVibrant.hex,
            population: vibrantPalette.LightVibrant.population,
          }
        : undefined,
      muted: vibrantPalette.Muted
        ? {
            hex: vibrantPalette.Muted.hex,
            population: vibrantPalette.Muted.population,
          }
        : undefined,
      darkMuted: vibrantPalette.DarkMuted
        ? {
            hex: vibrantPalette.DarkMuted.hex,
            population: vibrantPalette.DarkMuted.population,
          }
        : undefined,
      lightMuted: vibrantPalette.LightMuted
        ? {
            hex: vibrantPalette.LightMuted.hex,
            population: vibrantPalette.LightMuted.population,
          }
        : undefined,
    };

    let dark: ReturnType<typeof paletteToTheme>["dark"];
    let light: ReturnType<typeof paletteToTheme>["light"];
    let name: string;

    if (mode === "ai") {
      try {
        const aiResult = await extractWithAI(
          imageBuffer.toString("base64"),
          fileType,
          palette,
        );
        dark = aiResult.dark;
        light = aiResult.light;
        name = aiResult.name;
      } catch (aiErr) {
        console.error("AI extraction failed, falling back to fast:", aiErr);
        const theme = paletteToTheme(palette);
        dark = theme.dark;
        light = theme.light;
        name = nameFromPalette(palette);
      }
    } else {
      const theme = paletteToTheme(palette);
      dark = theme.dark;
      light = theme.light;
      name = nameFromPalette(palette);
    }

    const gradient = deriveGradientFromPalette(palette);

    return NextResponse.json(
      { dark, light, gradient, name, swatches: palette, mode },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (err) {
    console.error("extract-theme error:", err);
    return NextResponse.json(
      { error: "Failed to extract theme from image" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
