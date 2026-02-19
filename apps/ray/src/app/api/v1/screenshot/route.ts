import { ImageResponse } from "@takumi-rs/image-response";
import type { TinteBlock } from "@tinte/core";
import { TinteBlockSchema } from "@tinte/core";
import { DEFAULT_THEME } from "@/data/bundled-themes";
import {
  ScreenshotRequestSchema,
  tinteBlockToTextMateTheme,
  highlightCode,
  buildScreenshotJsx,
} from "@/lib/screenshot";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function resolveTheme(
  theme: string | TinteBlock,
  mode: "dark" | "light",
): Promise<TinteBlock> {
  if (typeof theme === "object") {
    return theme;
  }

  if (theme === "one-hunter") {
    return mode === "dark" ? DEFAULT_THEME.dark : DEFAULT_THEME.light;
  }

  try {
    const res = await fetch(
      `https://www.tinte.dev/api/themes/slug/${encodeURIComponent(theme)}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      return mode === "dark" ? DEFAULT_THEME.dark : DEFAULT_THEME.light;
    }

    const data = await res.json();
    const raw = data.rawTheme;
    if (!raw) {
      return mode === "dark" ? DEFAULT_THEME.dark : DEFAULT_THEME.light;
    }

    const block = mode === "dark" ? raw.dark : raw.light;
    const parsed = TinteBlockSchema.safeParse(block);
    if (!parsed.success) {
      return mode === "dark" ? DEFAULT_THEME.dark : DEFAULT_THEME.light;
    }

    return parsed.data;
  } catch {
    return mode === "dark" ? DEFAULT_THEME.dark : DEFAULT_THEME.light;
  }
}

function estimateDimensions(
  code: string,
  fontSize: number,
  padding: number,
  lineNumbers: boolean,
): { width: number; height: number } {
  const lines = code.split("\n");
  const maxLineLength = Math.max(...lines.map((l) => l.length));
  const charWidth = fontSize * 0.6;
  const lineHeight = fontSize * 1.6;

  const codeWidth = maxLineLength * charWidth + 48;
  const lineNumWidth = lineNumbers
    ? String(lines.length).length * charWidth + 16
    : 0;
  const chromeHeight = 40;
  const codePadding = 32;

  const width = Math.max(
    400,
    Math.ceil(codeWidth + lineNumWidth + codePadding + padding * 2),
  );
  const height = Math.ceil(
    lines.length * lineHeight + chromeHeight + codePadding + padding * 2,
  );

  return { width, height };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ScreenshotRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const {
      code,
      language,
      theme,
      mode,
      padding,
      fontSize,
      lineNumbers,
      title,
      background,
      scale,
    } = parsed.data;

    const block = await resolveTheme(theme, mode);
    const textMateTheme = tinteBlockToTextMateTheme(block, mode);
    const { tokens, fg } = await highlightCode(code, language, textMateTheme);

    const jsx = buildScreenshotJsx({
      tokens,
      bg: block.bg,
      bg2: block.bg_2,
      fg,
      gradient: background,
      padding,
      fontSize,
      lineNumbers,
      title,
    });

    const { width, height } = estimateDimensions(
      code,
      fontSize,
      padding,
      lineNumbers,
    );

    return new ImageResponse(jsx, {
      width: width * scale,
      height: height * scale,
      format: "png",
      headers: CORS_HEADERS,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Screenshot generation failed:", message);
    return Response.json(
      {
        error: "Screenshot generation failed",
        message,
      },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
