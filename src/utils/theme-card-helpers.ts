import type {
  ThemeColors,
  ThemeData,
  TinteThemeData,
} from "@/lib/theme-tokens";
import { convertTinteToShadcn } from "@/lib/providers/shadcn";

export function extractThemeColors(theme: ThemeData): Partial<ThemeColors> {
  // Safety check for theme
  if (!theme) {
    return {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0066cc",
      foreground: "#000000",
      background: "#ffffff",
    };
  }

  const tinteTheme = theme as TinteThemeData;

  // First check for computedTokens (tinte themes)
  if (tinteTheme.computedTokens?.light) {
    const tokens = tinteTheme.computedTokens.light;
    return {
      primary: tokens.primary || "#000000",
      secondary: tokens.secondary || "#666666",
      accent: tokens.accent || "#0066cc",
      foreground: tokens.foreground || "#000000",
      background: tokens.background || "#ffffff",
    };
  }

  // Check for colors object with null safety
  if (theme.colors) {
    return {
      primary: theme.colors.primary || "#000000",
      secondary: theme.colors.secondary || "#666666",
      accent: theme.colors.accent || "#0066cc",
      foreground: theme.colors.foreground || "#000000",
      background: theme.colors.background || "#ffffff",
    };
  }

  // Fallback to rawTheme if available
  if (theme.rawTheme?.light) {
    const rawTokens = theme.rawTheme.light;
    return {
      primary: rawTokens.pr || "#000000",
      secondary: rawTokens.sc || "#666666",
      accent: rawTokens.ac_1 || "#0066cc",
      foreground: rawTokens.tx || "#000000",
      background: rawTokens.bg || "#ffffff",
    };
  }

  // Final fallback
  return {
    primary: "#000000",
    secondary: "#666666",
    accent: "#0066cc",
    foreground: "#000000",
    background: "#ffffff",
  };
}

export function extractShadcnColors(theme: ThemeData, isDark = false) {
  let shadcnTheme;
  
  // Check if theme has rawTheme with shadcn format (tweakcn themes)
  if ('rawTheme' in theme && theme.rawTheme && 'light' in theme.rawTheme && typeof theme.rawTheme.light === 'object' && 'background' in theme.rawTheme.light) {
    // Already in shadcn format (tweakcn)
    shadcnTheme = theme.rawTheme as any;
  } else if ('rawTheme' in theme && theme.rawTheme) {
    // Tinte format - needs conversion
    try {
      shadcnTheme = convertTinteToShadcn(theme.rawTheme);
    } catch (error) {
      console.warn('Failed to convert tinte theme:', error);
      shadcnTheme = null;
    }
  }
  
  if (shadcnTheme) {
    const colorSet = isDark ? shadcnTheme.dark : shadcnTheme.light;
    
    return {
      // Core colors
      "--background": colorSet.background,
      "--foreground": colorSet.foreground,
      "--card": colorSet.card,
      "--card-foreground": colorSet["card-foreground"],
      "--popover": colorSet.popover,
      "--popover-foreground": colorSet["popover-foreground"],
      
      // Primary colors
      "--primary": colorSet.primary,
      "--primary-foreground": colorSet["primary-foreground"],
      "--secondary": colorSet.secondary,
      "--secondary-foreground": colorSet["secondary-foreground"],
      
      // Accent colors
      "--accent": colorSet.accent,
      "--accent-foreground": colorSet["accent-foreground"],
      "--muted": colorSet.muted,
      "--muted-foreground": colorSet["muted-foreground"],
      
      // Destructive
      "--destructive": colorSet.destructive,
      "--destructive-foreground": colorSet["destructive-foreground"],
      
      // Borders and inputs
      "--border": colorSet.border,
      "--input": colorSet.input,
      "--ring": colorSet.ring,
      
      // Chart colors
      "--chart-1": colorSet["chart-1"],
      "--chart-2": colorSet["chart-2"], 
      "--chart-3": colorSet["chart-3"],
      "--chart-4": colorSet["chart-4"],
      "--chart-5": colorSet["chart-5"],
      
      // Sidebar colors
      "--sidebar": colorSet.sidebar,
      "--sidebar-foreground": colorSet["sidebar-foreground"],
      "--sidebar-primary": colorSet["sidebar-primary"],
      "--sidebar-primary-foreground": colorSet["sidebar-primary-foreground"],
      "--sidebar-accent": colorSet["sidebar-accent"],
      "--sidebar-accent-foreground": colorSet["sidebar-accent-foreground"],
      "--sidebar-border": colorSet["sidebar-border"],
      "--sidebar-ring": colorSet["sidebar-ring"],
      
      // Radius (if available)
      "--radius": colorSet.radius,
    };
  }
  
  // Fallback to basic colors
  const basicColors = extractThemeColors(theme);
  return {
    "--primary": basicColors.primary,
    "--secondary": basicColors.secondary,
    "--accent": basicColors.accent,
    "--background": basicColors.background,
    "--foreground": basicColors.foreground,
  };
}

export function extractShadcnFonts(theme: ThemeData) {
  // First check rawTheme for fonts (tweakcn themes have fonts directly in the palette)
  if ('rawTheme' in theme && theme.rawTheme && typeof theme.rawTheme === 'object') {
    const rawTheme = theme.rawTheme as any;
    
    // Check for nested fonts object first
    if ('fonts' in rawTheme) {
      const fonts = rawTheme.fonts;
      if (fonts) {
        return {
          "--font-sans": fonts.sans || fonts.primary,
          "--font-serif": fonts.serif || fonts.secondary,
          "--font-mono": fonts.mono || fonts.code,
          "fontFamily": fonts.sans || fonts.primary,
        };
      }
    }
    
    // Check for font properties directly in light/dark themes (tweakcn structure)
    // Use light mode fonts by default, since that's what we extract colors from too
    const themeData = rawTheme.light || rawTheme.dark || rawTheme;
    
    if (themeData && (themeData['font-sans'] || themeData['font-serif'] || themeData['font-mono'])) {
      return {
        "--font-sans": themeData['font-sans'],
        "--font-serif": themeData['font-serif'],
        "--font-mono": themeData['font-mono'],
        "fontFamily": themeData['font-sans'], // Apply sans as default
      };
    }
  }
  
  // Fall back to shadcn_override with fonts (database themes)
  const themeWithOverride = theme as any;
  if (themeWithOverride.shadcn_override?.fonts) {
    const fonts = themeWithOverride.shadcn_override.fonts;
    return {
      "--font-sans": fonts.sans,
      "--font-serif": fonts.serif, 
      "--font-mono": fonts.mono,
      "fontFamily": fonts.sans, // Apply sans as default
    };
  }
  
  // No custom fonts available
  return {};
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}
