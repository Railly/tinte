import { type NextRequest, NextResponse } from "next/server";
import { Vibrant } from "node-vibrant/node";
import {
  paletteToTheme,
  deriveGradientFromPalette,
  nameFromPalette,
} from "@/lib/palette-to-theme";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    let imageBuffer: Buffer;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      if (!file) {
        return NextResponse.json(
          { error: "Missing 'image' field" },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported type: ${file.type}. Use PNG, JPEG, WebP, or GIF.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Image too large. Max 5MB." },
          { status: 400 }
        );
      }
      imageBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      const body = await req.arrayBuffer();
      if (body.byteLength === 0) {
        return NextResponse.json(
          { error: "Empty body. Send image as multipart/form-data or raw binary." },
          { status: 400 }
        );
      }
      if (body.byteLength > MAX_SIZE) {
        return NextResponse.json(
          { error: "Image too large. Max 5MB." },
          { status: 400 }
        );
      }
      imageBuffer = Buffer.from(body);
    }

    const vibrantPalette = await Vibrant.from(imageBuffer).getPalette();

    const palette = {
      vibrant: vibrantPalette.Vibrant
        ? { hex: vibrantPalette.Vibrant.hex, population: vibrantPalette.Vibrant.population }
        : undefined,
      darkVibrant: vibrantPalette.DarkVibrant
        ? { hex: vibrantPalette.DarkVibrant.hex, population: vibrantPalette.DarkVibrant.population }
        : undefined,
      lightVibrant: vibrantPalette.LightVibrant
        ? { hex: vibrantPalette.LightVibrant.hex, population: vibrantPalette.LightVibrant.population }
        : undefined,
      muted: vibrantPalette.Muted
        ? { hex: vibrantPalette.Muted.hex, population: vibrantPalette.Muted.population }
        : undefined,
      darkMuted: vibrantPalette.DarkMuted
        ? { hex: vibrantPalette.DarkMuted.hex, population: vibrantPalette.DarkMuted.population }
        : undefined,
      lightMuted: vibrantPalette.LightMuted
        ? { hex: vibrantPalette.LightMuted.hex, population: vibrantPalette.LightMuted.population }
        : undefined,
    };

    const { dark, light } = paletteToTheme(palette);
    const gradient = deriveGradientFromPalette(palette);
    const name = nameFromPalette(palette);

    return NextResponse.json(
      { dark, light, gradient, name, swatches: palette },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("extract-theme error:", err);
    return NextResponse.json(
      { error: "Failed to extract theme from image" },
      { status: 500 }
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
