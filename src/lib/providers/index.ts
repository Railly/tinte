import { TinteTheme } from "@/types/tinte";

export * from './types';
export { ProviderRegistry } from './registry';
export { providerRegistry } from './instance';
export * from './shadcn';
export * from './vscode';

// Export new Poline-based providers
export * from './poline-base';
export { AlacrittyProvider } from './alacritty';
export { KittyProvider } from './kitty';
export { WarpProvider } from './warp';
export { WindowsTerminalProvider } from './windows-terminal';
export { GIMPProvider } from './gimp';
export { SlackProvider } from './slack';

import { providerRegistry } from './instance';

export function getAvailableProviders() {
  return providerRegistry.getAll();
}

export function getPreviewableProviders() {
  return providerRegistry.getAllPreviewable();
}

export function getProvidersByCategory(category: string) {
  return providerRegistry.getByCategory(category as any);
}

export function convertTheme<T>(providerId: string, theme: TinteTheme): T | null {
  return providerRegistry.convert<T>(providerId, theme);
}

export function exportTheme(providerId: string, theme: TinteTheme, filename?: string) {
  return providerRegistry.export(providerId, theme, filename);
}

export function convertAllThemes(theme: TinteTheme) {
  return providerRegistry.convertAll(theme);
}

export function exportAllThemes(theme: TinteTheme) {
  return providerRegistry.exportAll(theme);
}
