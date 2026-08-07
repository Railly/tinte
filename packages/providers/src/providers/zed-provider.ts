import type { TinteTheme } from "@tinte/core";
import type { ZedThemeFamily } from "@tinte/core";
import type { ThemeProvider } from "./types";
import { tinteToZed } from "./zed";

export const zedProvider: ThemeProvider<ZedThemeFamily> = {
  metadata: {
    id: "zed",
    name: "Zed",
    description: "High-performance multiplayer code editor",
    category: "editor",
    tags: ["editor", "code", "multiplayer", "rust"],
    website: "https://zed.dev/",
    documentation: "https://zed.dev/docs/themes",
    experimental: true,
  },

  fileExtension: "json",
  mimeType: "application/json",

  convert: (theme: TinteTheme) => {
    const themeName = theme.name || "Custom Theme";
    const author = theme.author || "Tinte";
    return tinteToZed(theme.light, theme.dark, themeName, author);
  },

  export: (theme: TinteTheme, filename?: string) => {
    const converted = tinteToZed(
      theme.light,
      theme.dark,
      theme.name || "Custom Theme",
      theme.author || "Tinte",
    );
    const themeName = theme.name || "custom-theme";
    const sanitizedName = themeName.toLowerCase().replace(/\s+/g, "-");
    const defaultFilename = `${sanitizedName}.json`;

    return {
      filename: filename || defaultFilename,
      content: JSON.stringify(converted, null, 2),
      mimeType: "application/json",
    };
  },
};
