import type { ThemeData } from "./theme-tokens";
import type { NormalizedOverrides, ProviderOverride } from "@/types/overrides";

function normalizeShadowProperties(shadowData: any) {
  if (!shadowData) return undefined;
  return {
    color: shadowData.color,
    opacity: shadowData.opacity,
    blur: shadowData.blur,
    spread: shadowData.spread,
    offsetX: shadowData.offsetX || shadowData.offset_x,
    offsetY: shadowData.offsetY || shadowData.offset_y,
  };
}

function normalizeProviderOverride(data: any): ProviderOverride | undefined {
  if (!data || typeof data !== "object") return undefined;

  const normalized: ProviderOverride = {};

  // Handle palettes with shadows per mode
  if (data.palettes) {
    if (data.palettes.light) {
      const { shadow, ...lightColors } = data.palettes.light;
      normalized.light = { ...lightColors };

      // Extract shadow from light palette
      if (shadow) {
        if (!normalized.shadows) normalized.shadows = {};
        normalized.shadows.light = normalizeShadowProperties(shadow);
      }
    }

    if (data.palettes.dark) {
      const { shadow, ...darkColors } = data.palettes.dark;
      normalized.dark = { ...darkColors };

      // Extract shadow from dark palette
      if (shadow) {
        if (!normalized.shadows) normalized.shadows = {};
        normalized.shadows.dark = normalizeShadowProperties(shadow);
      }
    }
  } else if (data.light?.palettes || data.dark?.palettes) {
    if (data.light?.palettes?.light) normalized.light = { ...data.light.palettes.light };
    if (data.dark?.palettes?.dark) normalized.dark = { ...data.dark.palettes.dark };
  } else {
    if (data.light) normalized.light = { ...data.light };
    if (data.dark) normalized.dark = { ...data.dark };
  }

  if (data.fonts) normalized.fonts = { ...data.fonts };
  if (data.radius) normalized.radius = data.radius;
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

  // If override already has shadows in normalized format (shadows.light/dark),
  // don't normalize again as it will lose the values
  if (override.shadows && (override.shadows.light || override.shadows.dark)) {
    console.log("🔧 [validateOverride] Already normalized, returning as-is:", override);
    return override as ProviderOverride;
  }

  // Otherwise, normalize from DB format
  const normalized = normalizeProviderOverride(override) || {};
  console.log("🔧 [validateOverride] Normalized from DB format:", normalized);
  return normalized;
}

export function mergeOverrides(
  base: NormalizedOverrides,
  updates: Partial<NormalizedOverrides>
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

export function denormalizeProviderOverride(normalized: ProviderOverride | undefined): any {
  if (!normalized) return undefined;

  const result: any = {};

  // Convert shadows back to palette structure
  if (normalized.shadows) {
    result.palettes = {};

    if (normalized.shadows.light || normalized.light) {
      result.palettes.light = {
        ...(normalized.light || {}),
      };

      if (normalized.shadows.light) {
        result.palettes.light.shadow = {
          color: normalized.shadows.light.color,
          opacity: normalized.shadows.light.opacity,
          blur: normalized.shadows.light.blur,
          spread: normalized.shadows.light.spread,
          offset_x: normalized.shadows.light.offsetX,
          offset_y: normalized.shadows.light.offsetY,
        };
      }
    }

    if (normalized.shadows.dark || normalized.dark) {
      result.palettes.dark = {
        ...(normalized.dark || {}),
      };

      if (normalized.shadows.dark) {
        result.palettes.dark.shadow = {
          color: normalized.shadows.dark.color,
          opacity: normalized.shadows.dark.opacity,
          blur: normalized.shadows.dark.blur,
          spread: normalized.shadows.dark.spread,
          offset_x: normalized.shadows.dark.offsetX,
          offset_y: normalized.shadows.dark.offsetY,
        };
      }
    }
  } else {
    // If no shadows, just convert light/dark palettes
    if (normalized.light || normalized.dark) {
      result.palettes = {
        ...(normalized.light && { light: normalized.light }),
        ...(normalized.dark && { dark: normalized.dark }),
      };
    }
  }

  if (normalized.fonts) result.fonts = normalized.fonts;
  if (normalized.radius) result.radius = normalized.radius;
  if (normalized.letter_spacing) result.letter_spacing = normalized.letter_spacing;

  return Object.keys(result).length > 0 ? result : undefined;
}
