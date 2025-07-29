import { useMemo } from "react";
import { TinteTheme } from "@/types/tinte";
import { providerRegistry } from "@/lib/providers";

export function useThemeAdapters() {
  return useMemo(() => ({
    availableProviders: providerRegistry.getAll(),
    previewableProviders: providerRegistry.getAllPreviewable(),
    
    convertTheme: <T>(providerId: string, theme: TinteTheme): T | null => {
      return providerRegistry.convert<T>(providerId, theme);
    },
    
    exportTheme: (providerId: string, theme: TinteTheme, filename?: string) => {
      return providerRegistry.export(providerId, theme, filename);
    },
    
    convertAllThemes: (theme: TinteTheme) => {
      return providerRegistry.convertAll(theme);
    },
    
    exportAllThemes: (theme: TinteTheme) => {
      return providerRegistry.exportAll(theme);
    },
    
    getProvider: (providerId: string) => {
      return providerRegistry.get(providerId);
    },
    
    getPreviewableProvider: (providerId: string) => {
      return providerRegistry.getPreviewable(providerId);
    },
    
    getProvidersByCategory: (category: string) => {
      return providerRegistry.getByCategory(category as any);
    },
    
    getProvidersByTag: (tag: string) => {
      return providerRegistry.getByTag(tag);
    },
    
    validateOutput: <T>(providerId: string, output: T): boolean => {
      return providerRegistry.validate(providerId, output);
    },
  }), []);
}

export function useThemeConversion(theme: TinteTheme) {
  const providers = useThemeAdapters();
  
  return useMemo(() => {
    const conversions: Record<string, any> = {};
    
    for (const provider of providers.availableProviders) {
      const converted = providers.convertTheme(provider.metadata.id, theme);
      if (converted !== null) {
        conversions[provider.metadata.id] = converted;
      }
    }
    
    return {
      conversions,
      exportAll: () => providers.exportAllThemes(theme),
      convertTo: <T>(providerId: string) => providers.convertTheme<T>(providerId, theme),
      exportTo: (providerId: string, filename?: string) => 
        providers.exportTheme(providerId, theme, filename),
    };
  }, [theme, providers]);
}