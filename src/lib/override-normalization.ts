import type { ThemeData } from "./theme-tokens";
import type { NormalizedOverrides, ProviderOverride } from "@/types/overrides";

function normalizeProviderOverride(data: any): ProviderOverride | undefined {
  if (!data || typeof data !== "object") return undefined;

  const normalized: ProviderOverride = {};

  if (data.palettes) {
    if (data.palettes.light) normalized.light = { ...data.palettes.light };
    if (data.palettes.dark) normalized.dark = { ...data.palettes.dark };
  } else if (data.light?.palettes || data.dark?.palettes) {
    if (data.light?.palettes?.light) normalized.light = { ...data.light.palettes.light };
    if (data.dark?.palettes?.dark) normalized.dark = { ...data.dark.palettes.dark };
  } else {
    if (data.light) normalized.light = { ...data.light };
    if (data.dark) normalized.dark = { ...data.dark };
  }

  if (data.fonts) normalized.fonts = { ...data.fonts };
  if (data.radius) normalized.radius = data.radius;
  if (data.shadows || data.shadow) normalized.shadows = { ...(data.shadows || data.shadow) };
  if (data.letter_spacing) normalized.letter_spacing = data.letter_spacing;

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export function normalizeOverrides(theme: ThemeData): NormalizedOverrides {
  const normalized: NormalizedOverrides = {};

  const rawTheme = theme.rawTheme as any;
  if (rawTheme?.fonts || rawTheme?.radius || rawTheme?.shadows) {
    normalized.shadcn = {
      ...(normalized.shadcn || {}),
      ...(rawTheme.fonts && { fonts: rawTheme.fonts }),
      ...(rawTheme.radius && { radius: rawTheme.radius }),
      ...(rawTheme.shadows && { shadows: rawTheme.shadows }),
    };
  }

  const dbOverrides = {
    shadcn: (theme as any).shadcn_override,
    vscode: (theme as any).vscode_override,
    shiki: (theme as any).shiki_override,
  };

  for (const [provider, data] of Object.entries(dbOverrides)) {
    if (data) {
      const providerNormalized = normalizeProviderOverride(data);
      if (providerNormalized) {
        normalized[provider as keyof NormalizedOverrides] = {
          ...normalized[provider as keyof NormalizedOverrides],
          ...providerNormalized,
        };
      }
    }
  }

  const legacyOverrides = (theme as any).overrides;
  if (legacyOverrides && typeof legacyOverrides === "object") {
    for (const [provider, data] of Object.entries(legacyOverrides)) {
      if (data) {
        const providerNormalized = normalizeProviderOverride(data);
        if (providerNormalized) {
          normalized[provider as keyof NormalizedOverrides] = {
            ...normalized[provider as keyof NormalizedOverrides],
            ...providerNormalized,
          };
        }
      }
    }
  }

  return normalized;
}

export function validateOverride(provider: string, override: any): ProviderOverride {
  const validProviders = ["shadcn", "vscode", "shiki"];
  if (!validProviders.includes(provider)) {
    throw new Error(`Invalid provider: ${provider}`);
  }

  if (!override || typeof override !== "object") {
    throw new Error("Override must be an object");
  }

  return normalizeProviderOverride(override) || {};
}

export function mergeOverrides(
  base: NormalizedOverrides,
  updates: Partial<NormalizedOverrides>
): NormalizedOverrides {
  const merged: NormalizedOverrides = { ...base };

  for (const [provider, override] of Object.entries(updates)) {
    if (override) {
      const key = provider as keyof NormalizedOverrides;
      merged[key] = {
        ...merged[key],
        ...normalizeProviderOverride(override),
      };
    }
  }

  return merged;
}
