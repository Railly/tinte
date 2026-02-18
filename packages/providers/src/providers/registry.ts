import type { TinteTheme } from "@tinte/core";
import type {
  PreviewableProvider,
  ProviderMetadata,
  ProviderOutput,
  ThemeProvider,
} from "./types";

export class ProviderRegistry {
  private providers = new Map<string, ThemeProvider>();
  private previewableProviders = new Map<string, PreviewableProvider>();

  register<T>(provider: ThemeProvider<T>): void {
    this.providers.set(provider.metadata.id, provider);
  }

  registerPreviewable<T>(provider: PreviewableProvider<T>): void {
    this.previewableProviders.set(provider.metadata.id, provider);
    this.providers.set(provider.metadata.id, provider);
  }

  get(id: string): ThemeProvider | undefined {
    return this.providers.get(id);
  }

  getPreviewable(id: string): PreviewableProvider | undefined {
    return this.previewableProviders.get(id);
  }

  getAll(): ThemeProvider[] {
    return Array.from(this.providers.values());
  }

  getAllPreviewable(): PreviewableProvider[] {
    return Array.from(this.previewableProviders.values());
  }

  getByCategory(category: ProviderMetadata["category"]): ThemeProvider[] {
    return this.getAll().filter(
      (provider) => provider.metadata.category === category,
    );
  }

  getByTag(tag: string): ThemeProvider[] {
    return this.getAll().filter((provider) =>
      provider.metadata.tags.includes(tag),
    );
  }

  convert<T>(providerId: string, theme: TinteTheme): T | null {
    const provider = this.get(providerId);
    if (!provider) return null;

    try {
      return provider.convert(theme) as T;
    } catch (error) {
      console.error(
        `Error converting theme with provider ${providerId}:`,
        error,
      );
      return null;
    }
  }

  export(
    providerId: string,
    theme: TinteTheme,
    filename?: string,
  ): ProviderOutput | null {
    const provider = this.get(providerId);
    if (!provider) return null;

    try {
      return provider.export(theme, filename);
    } catch (error) {
      console.error(
        `Error exporting theme with provider ${providerId}:`,
        error,
      );
      return null;
    }
  }

  validate<T>(providerId: string, output: T): boolean {
    const provider = this.get(providerId);
    if (!provider?.validate) return true;

    try {
      return provider.validate(output);
    } catch (error) {
      console.error(
        `Error validating output with provider ${providerId}:`,
        error,
      );
      return false;
    }
  }

  has(id: string): boolean {
    return this.providers.has(id);
  }

  hasPreviewable(id: string): boolean {
    return this.previewableProviders.has(id);
  }

  convertAll(theme: TinteTheme): Record<string, any> {
    const results: Record<string, any> = {};

    for (const provider of this.providers.values()) {
      const converted = this.convert(provider.metadata.id, theme);
      if (converted !== null) {
        results[provider.metadata.id] = converted;
      }
    }

    return results;
  }

  exportAll(theme: TinteTheme): Record<string, ProviderOutput> {
    const results: Record<string, ProviderOutput> = {};

    for (const provider of this.providers.values()) {
      const exported = this.export(provider.metadata.id, theme);
      if (exported) {
        results[provider.metadata.id] = exported;
      }
    }

    return results;
  }
}
