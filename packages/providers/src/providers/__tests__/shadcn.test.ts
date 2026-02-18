import { describe, expect, it } from "vitest";
import type { TinteBlock, TinteTheme } from "@tinte/core";
import {
  computeShadowVars,
  convertTinteToShadcn,
  convertTinteToShadcnWithShadows,
  shadcnProvider,
} from "../shadcn";

const createMockBlock = (
  overrides: Partial<TinteBlock> = {},
  mode: "light" | "dark" = "light",
): TinteBlock => ({
  bg: mode === "light" ? "#ffffff" : "#0a0a0a",
  bg_2: mode === "light" ? "#fafafa" : "#141414",
  ui: mode === "light" ? "#e5e5e5" : "#262626",
  ui_2: mode === "light" ? "#d4d4d4" : "#3f3f46",
  ui_3: mode === "light" ? "#a3a3a3" : "#52525b",
  tx: mode === "light" ? "#0f0f0f" : "#fafafa",
  tx_2: mode === "light" ? "#525252" : "#a1a1aa",
  tx_3: mode === "light" ? "#737373" : "#71717a",
  pr: mode === "light" ? "#3b82f6" : "#60a5fa",
  sc: mode === "light" ? "#8b5cf6" : "#a78bfa",
  ac_1: mode === "light" ? "#10b981" : "#34d399",
  ac_2: mode === "light" ? "#f59e0b" : "#fbbf24",
  ac_3: mode === "light" ? "#ef4444" : "#f87171",
  ...overrides,
});

const mockTinteTheme: TinteTheme = {
  light: createMockBlock({}, "light"),
  dark: createMockBlock({}, "dark"),
};

type ExtendedShadcnBlock = Record<string, string>;

describe("convertTinteToShadcn", () => {
  it("converts light and dark blocks", () => {
    const result = convertTinteToShadcn(mockTinteTheme);
    expect(result.light).toBeDefined();
    expect(result.dark).toBeDefined();
  });

  it("sets background color from tinte theme", () => {
    const result = convertTinteToShadcn(mockTinteTheme);
    expect(result.light.background).toBe("#ffffff");
    expect(result.dark.background).toBe("#0a0a0a");
  });

  it("generates all required color tokens", () => {
    const result = convertTinteToShadcn(mockTinteTheme);
    const light = result.light as ExtendedShadcnBlock;
    const dark = result.dark as ExtendedShadcnBlock;
    const requiredTokens = [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
      "border",
      "input",
      "ring",
    ];

    for (const token of requiredTokens) {
      expect(light[token]).toBeDefined();
      expect(dark[token]).toBeDefined();
    }
  });

  it("generates chart colors", () => {
    const result = convertTinteToShadcn(mockTinteTheme);
    expect(result.light["chart-1"]).toBeDefined();
    expect(result.light["chart-2"]).toBeDefined();
    expect(result.light["chart-3"]).toBeDefined();
    expect(result.light["chart-4"]).toBeDefined();
    expect(result.light["chart-5"]).toBeDefined();
  });

  it("generates sidebar colors", () => {
    const result = convertTinteToShadcn(mockTinteTheme);
    expect(result.light.sidebar).toBeDefined();
    expect(result.light["sidebar-foreground"]).toBeDefined();
    expect(result.light["sidebar-primary"]).toBeDefined();
    expect(result.light["sidebar-accent"]).toBeDefined();
    expect(result.light["sidebar-border"]).toBeDefined();
    expect(result.light["sidebar-ring"]).toBeDefined();
  });

  it("includes default fonts", () => {
    const result = convertTinteToShadcn(mockTinteTheme);
    const light = result.light as ExtendedShadcnBlock;
    expect(light["font-sans"]).toBeDefined();
    expect(light["font-mono"]).toBeDefined();
    expect(light["font-serif"]).toBeDefined();
  });

  it("includes shadow properties", () => {
    const result = convertTinteToShadcn(mockTinteTheme);
    const light = result.light as ExtendedShadcnBlock;
    expect(light["shadow-x"]).toBeDefined();
    expect(light["shadow-y"]).toBeDefined();
    expect(light["shadow-blur"]).toBeDefined();
    expect(light["shadow-spread"]).toBeDefined();
    expect(light["shadow-opacity"]).toBeDefined();
    expect(light["shadow-color"]).toBeDefined();
  });
});

describe("convertTinteToShadcnWithShadows", () => {
  it("includes computed shadow variables", () => {
    const result = convertTinteToShadcnWithShadows(mockTinteTheme);
    const light = result.light as ExtendedShadcnBlock;
    expect(light["shadow-xs"]).toBeDefined();
    expect(light["shadow-sm"]).toBeDefined();
    expect(light.shadow).toBeDefined();
    expect(light["shadow-md"]).toBeDefined();
    expect(light["shadow-lg"]).toBeDefined();
    expect(light["shadow-xl"]).toBeDefined();
    expect(light["shadow-2xl"]).toBeDefined();
  });
});

describe("computeShadowVars", () => {
  it("generates all shadow variants", () => {
    const tokens = {
      "shadow-color": "hsl(0 0% 0%)",
      "shadow-opacity": "0.1",
      "shadow-x": "0px",
      "shadow-y": "2px",
      "shadow-blur": "4px",
      "shadow-spread": "0px",
    };

    const result = computeShadowVars(tokens);

    expect(result["shadow-2xs"]).toBeDefined();
    expect(result["shadow-xs"]).toBeDefined();
    expect(result["shadow-sm"]).toBeDefined();
    expect(result.shadow).toBeDefined();
    expect(result["shadow-md"]).toBeDefined();
    expect(result["shadow-lg"]).toBeDefined();
    expect(result["shadow-xl"]).toBeDefined();
    expect(result["shadow-2xl"]).toBeDefined();
  });

  it("uses default values when tokens missing", () => {
    const result = computeShadowVars({});
    expect(result["shadow-sm"]).toBeDefined();
    expect(result["shadow-sm"]).toContain("oklch");
  });
});

describe("shadcnProvider", () => {
  it("has correct metadata", () => {
    expect(shadcnProvider.metadata.id).toBe("shadcn");
    expect(shadcnProvider.metadata.name).toBe("shadcn/ui");
    expect(shadcnProvider.metadata.category).toBe("ui");
  });

  it("exports CSS file", () => {
    expect(shadcnProvider.fileExtension).toBe("css");
    expect(shadcnProvider.mimeType).toBe("text/css");
  });

  it("export generates valid CSS", () => {
    const output = shadcnProvider.export(mockTinteTheme);
    expect(output.content).toContain(":root");
    expect(output.content).toContain(".dark");
    expect(output.content).toContain("--background:");
    expect(output.content).toContain("--primary:");
    expect(output.filename).toBe("shadcn-theme.css");
    expect(output.mimeType).toBe("text/css");
  });

  it("export uses oklch format for colors", () => {
    const output = shadcnProvider.export(mockTinteTheme);
    expect(output.content).toContain("oklch(");
  });

  it("validate returns true for valid theme", () => {
    const theme = convertTinteToShadcn(mockTinteTheme);
    expect(shadcnProvider.validate?.(theme)).toBe(true);
  });

  it("validate returns false for invalid theme", () => {
    expect(shadcnProvider.validate?.({} as never)).toBe(false);
    expect(shadcnProvider.validate?.({ light: {} } as never)).toBe(false);
  });
});

describe("extended theme features", () => {
  it("applies custom fonts", () => {
    const themeWithFonts = {
      ...mockTinteTheme,
      fonts: {
        sans: "Geist",
        serif: "Playfair Display",
        mono: "Fira Code",
      },
    };

    const result = convertTinteToShadcn(themeWithFonts);
    const light = result.light as ExtendedShadcnBlock;
    expect(light["font-sans"]).toContain("Geist");
    expect(light["font-serif"]).toContain("Playfair Display");
    expect(light["font-mono"]).toContain("Fira Code");
  });

  it("applies string radius", () => {
    const themeWithRadius = {
      ...mockTinteTheme,
      radius: "0.75rem",
    };

    const result = convertTinteToShadcn(themeWithRadius);
    const light = result.light as ExtendedShadcnBlock;
    expect(light.radius).toBe("0.75rem");
    expect(light["radius-md"]).toBe("0.75rem");
  });

  it("applies object radius", () => {
    const themeWithRadius = {
      ...mockTinteTheme,
      radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    };

    const result = convertTinteToShadcn(themeWithRadius);
    const light = result.light as ExtendedShadcnBlock;
    expect(light["radius-sm"]).toBe("0.25rem");
    expect(light["radius-md"]).toBe("0.5rem");
    expect(light["radius-lg"]).toBe("0.75rem");
    expect(light["radius-xl"]).toBe("1rem");
  });

  it("applies custom shadows", () => {
    const themeWithShadows = {
      ...mockTinteTheme,
      shadows: {
        offsetX: "2px",
        offsetY: "4px",
        blur: "8px",
        spread: "2px",
        opacity: "0.2",
        color: "hsl(220 50% 20%)",
      },
    };

    const result = convertTinteToShadcn(themeWithShadows);
    const light = result.light as ExtendedShadcnBlock;
    expect(light["shadow-x"]).toBe("2px");
    expect(light["shadow-y"]).toBe("4px");
    expect(light["shadow-blur"]).toBe("8px");
    expect(light["shadow-spread"]).toBe("2px");
    expect(light["shadow-opacity"]).toBe("0.2");
    expect(light["shadow-color"]).toBe("hsl(220 50% 20%)");
  });
});
