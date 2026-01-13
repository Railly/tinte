import type { NormalizedOverrides, ProviderOverride } from "@/types/overrides";
import type { TinteTheme } from "@/types/tinte";
import type { ThemeData } from "./theme-tokens";

interface RawOverrideInput {
  palettes?: {
    light?: Record<string, unknown>;
    dark?: Record<string, unknown>;
  };
  fonts?: {
    sans?: string;
    serif?: string;
    mono?: string;
  };
  radius?: string | Record<string, string>;
  letter_spacing?: string;
  light?: Record<string, unknown>;
  dark?: Record<string, unknown>;
}

interface ThemeDataWithOverrides extends ThemeData {
  shadcn_override?: RawOverrideInput;
  vscode_override?: RawOverrideInput;
  shiki_override?: RawOverrideInput;
  overrides?: Record<string, RawOverrideInput>;
}

function normalizeProviderOverride(
  data: unknown,
  provider?: string,
): ProviderOverride | undefined {
  if (!data || typeof data !== "object") return undefined;

  const input = data as RawOverrideInput;

  if (provider === "vscode" || provider === "shiki") {
    return input as ProviderOverride;
  }

  const normalized: ProviderOverride = {};

  if (input.palettes) {
    normalized.palettes = {
      light: input.palettes.light
        ? { ...(input.palettes.light as Record<string, string>) }
        : undefined,
      dark: input.palettes.dark
        ? { ...(input.palettes.dark as Record<string, string>) }
        : undefined,
    };
  }

  if (input.fonts) normalized.fonts = { ...input.fonts };
  if (input.radius) normalized.radius = input.radius;
  if (input.letter_spacing) normalized.letter_spacing = input.letter_spacing;

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

interface RawThemeWithExtras extends TinteTheme {
  fonts?: { sans?: string; serif?: string; mono?: string };
  radius?: string;
  shadows?: Record<string, unknown>;
}

export function normalizeOverrides(theme: ThemeData): NormalizedOverrides {
  const normalized: NormalizedOverrides = {};
  const themeWithOverrides = theme as ThemeDataWithOverrides;

  const rawTheme = theme.rawTheme as RawThemeWithExtras | undefined;
  if (rawTheme?.fonts || rawTheme?.radius || rawTheme?.shadows) {
    normalized.shadcn = {
      ...(normalized.shadcn || {}),
      ...(rawTheme.fonts && { fonts: rawTheme.fonts }),
      ...(rawTheme.radius && { radius: rawTheme.radius }),
    };
  }

  const dbOverrides = {
    shadcn: themeWithOverrides.shadcn_override,
    vscode: themeWithOverrides.vscode_override,
    shiki: themeWithOverrides.shiki_override,
  };

  for (const [provider, data] of Object.entries(dbOverrides)) {
    if (data) {
      const providerNormalized = normalizeProviderOverride(data, provider);
      if (providerNormalized) {
        normalized[provider as keyof NormalizedOverrides] = providerNormalized;
      }
    }
  }

  const legacyOverrides = themeWithOverrides.overrides;
  if (legacyOverrides && typeof legacyOverrides === "object") {
    for (const [provider, data] of Object.entries(legacyOverrides)) {
      if (data) {
        const providerNormalized = normalizeProviderOverride(data, provider);
        if (providerNormalized) {
          normalized[provider as keyof NormalizedOverrides] =
            providerNormalized;
        }
      }
    }
  }

  return normalized;
}

type ValidProvider = "shadcn" | "vscode" | "shiki" | "zed";
const VALID_PROVIDERS: ValidProvider[] = ["shadcn", "vscode", "shiki", "zed"];

export function validateOverride(
  provider: string,
  override: unknown,
): ProviderOverride {
  if (!VALID_PROVIDERS.includes(provider as ValidProvider)) {
    throw new Error(`Invalid provider: ${provider}`);
  }

  if (!override || typeof override !== "object") {
    throw new Error("Override must be an object");
  }

  return normalizeProviderOverride(override, provider) ?? {};
}

export function mergeOverrides(
  base: NormalizedOverrides,
  updates: Partial<NormalizedOverrides>,
): NormalizedOverrides {
  const merged: NormalizedOverrides = { ...base };

  for (const [provider, override] of Object.entries(updates)) {
    if (override) {
      const key = provider as keyof NormalizedOverrides;
      // Don't normalize again - data coming from validateOverride is already normalized
      merged[key] = {
        ...merged[key],
        ...override,
      };
    }
  }

  return merged;
}

export function denormalizeProviderOverride(
  normalized: ProviderOverride | undefined,
): ProviderOverride | undefined {
  if (!normalized) return undefined;
  return normalized;
}
