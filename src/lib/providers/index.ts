import { TinteTheme } from "@/types/tinte";

export * from './types';
export { ProviderRegistry } from './registry';
export * from './shadcn';
export * from './vscode';

// Export new Poline-based providers
export * from './poline-base';
export { alacrittyProvider } from './alacritty';
export { kittyProvider } from './kitty';
export { warpProvider } from './warp';
export { windowsTerminalProvider } from './windows-terminal';
export { gimpProvider } from './gimp';
export { slackProvider } from './slack';

import { ProviderRegistry } from './registry';
import { shadcnProvider } from './shadcn';
import { vscodeProvider } from './vscode';
import { alacrittyProvider } from './alacritty';
import { kittyProvider } from './kitty';
import { warpProvider } from './warp';
import { windowsTerminalProvider } from './windows-terminal';
import { gimpProvider } from './gimp';
import { slackProvider } from './slack';

const registry = new ProviderRegistry();
registry.registerPreviewable(shadcnProvider);
registry.registerPreviewable(vscodeProvider);
registry.register(alacrittyProvider);
registry.register(kittyProvider);
registry.register(warpProvider);
registry.register(windowsTerminalProvider);
registry.register(gimpProvider);
registry.register(slackProvider);

export function getAvailableProviders() {
  return registry.getAll();
}

export function getPreviewableProviders() {
  return registry.getAllPreviewable();
}

export function getProvidersByCategory(category: string) {
  return registry.getByCategory(category as any);
}

export function convertTheme<T>(providerId: string, theme: TinteTheme): T | null {
  return registry.convert<T>(providerId, theme);
}

export function exportTheme(providerId: string, theme: TinteTheme, filename?: string) {
  return registry.export(providerId, theme, filename);
}

export function convertAllThemes(theme: TinteTheme) {
  return registry.convertAll(theme);
}

export function exportAllThemes(theme: TinteTheme) {
  return registry.exportAll(theme);
}

export function getProvider(providerId: string) {
  return registry.get(providerId);
}

export function getPreviewableProvider(providerId: string) {
  return registry.getPreviewable(providerId);
}

export function hasProvider(providerId: string): boolean {
  return registry.has(providerId);
}

export function hasPreviewableProvider(providerId: string): boolean {
  return registry.hasPreviewable(providerId);
}

