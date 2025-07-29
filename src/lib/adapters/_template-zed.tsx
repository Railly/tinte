// Template for creating new adapters - Zed Editor Example
// To use this template:
// 1. Copy this file and rename it (e.g., zed.tsx)
// 2. Replace all instances of "Zed" with your adapter name
// 3. Define your theme output type
// 4. Implement the convert function
// 5. Add preview component if needed
// 6. Register the adapter in index.ts

import { TinteTheme } from "@/types/tinte";
import { PreviewableAdapter, AdapterMetadata } from "./types";
import { ZedIcon } from "@/components/shared/icons/zed";

// Define the output format for your adapter
interface ZedTheme {
  name: string;
  author: string;
  themes: Array<{
    name: string;
    appearance: "light" | "dark";
    style: {
      background: string;
      foreground: string;
      // Add other Zed-specific properties
    };
    syntax: Record<string, { color: string; font_style?: string }>;
  }>;
}

// Simple preview component (optional - remove if not needed)
function ZedPreview({ theme, className }: { theme: ZedTheme; className?: string }) {
  return (
    <div className={className}>
      <div className="p-4 rounded-lg border">
        <h3 className="font-medium mb-2">Zed Theme Preview</h3>
        <div className="space-y-2 text-sm font-mono">
          {theme.themes.map((t) => (
            <div key={t.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: t.style.background }}
              />
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function convertTinteToZed(tinte: TinteTheme): ZedTheme {
  return {
    name: "Tinte Theme",
    author: "Tinte Generator",
    themes: [
      {
        name: "Tinte Light",
        appearance: "light",
        style: {
          background: tinte.light.background,
          foreground: tinte.light.text,
          // Map other Tinte tokens to Zed properties
        },
        syntax: {
          "comment": { color: tinte.light.text_3 },
          "keyword": { color: tinte.light.primary },
          "string": { color: tinte.light.accent },
          "function": { color: tinte.light.accent_2 },
          // Add more syntax mappings
        },
      },
      {
        name: "Tinte Dark",
        appearance: "dark",
        style: {
          background: tinte.dark.background,
          foreground: tinte.dark.text,
        },
        syntax: {
          "comment": { color: tinte.dark.text_3 },
          "keyword": { color: tinte.dark.primary },
          "string": { color: tinte.dark.accent },
          "function": { color: tinte.dark.accent_2 },
        },
      },
    ],
  };
}

export const zedAdapter: PreviewableAdapter<ZedTheme> = {
  id: "zed",
  name: "Zed",
  description: "High-performance code editor theme format",
  version: "1.0.0",
  fileExtension: "json",
  mimeType: "application/json",

  convert: convertTinteToZed,

  export: (theme: TinteTheme, filename?: string) => ({
    content: JSON.stringify(convertTinteToZed(theme), null, 2),
    filename: filename || "zed-theme.json",
    mimeType: "application/json",
  }),

  validate: (output: ZedTheme) => {
    return !!(output.name && output.themes && output.themes.length > 0);
  },

  preview: {
    component: ZedPreview,
  },
};

export const zedAdapterMetadata: AdapterMetadata = {
  id: "zed",
  name: "Zed",
  description: "High-performance, multiplayer code editor",
  category: "editor",
  tags: ["editor", "code", "collaborative", "performance"],
  icon: ZedIcon,
  website: "https://zed.dev/",
  documentation: "https://zed.dev/docs/themes",
};

// Don't forget to register in index.ts:
// import { zedAdapter, zedAdapterMetadata } from "./zed";
// adapterRegistry.registerPreviewable(
//   createPreviewableAdapter(zedAdapter, zedAdapterMetadata)
// );