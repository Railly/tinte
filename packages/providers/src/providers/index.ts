import type { TinteTheme } from "@tinte/core";

export * from "./alacritty";
export * from "./banana";
export * from "./brand-guidelines";
export * from "./codex";
export * from "./design-system";
export * from "./gimp";
export * from "./kitty";
export * from "./poline-base";
export { ProviderRegistry } from "./registry";
export * from "./shadcn";
export * from "./shiki";
export * from "./slack";
export * from "./types";
export * from "./vscode";
export * from "./warp";
export * from "./windows-terminal";
export * from "./zed";
export * from "./zed-provider";

import { alacrittyProvider } from "./alacritty";
import { bananaProvider } from "./banana";
import { brandGuidelinesProvider } from "./brand-guidelines";
import { codexProvider } from "./codex";
import { designSystemProvider } from "./design-system";
import { gimpProvider } from "./gimp";
import { kittyProvider } from "./kitty";
import { ProviderRegistry } from "./registry";
import { shadcnProvider } from "./shadcn";
import { shikiProvider } from "./shiki";
import { slackProvider } from "./slack";
import { vscodeProvider } from "./vscode";
import { warpProvider } from "./warp";
import { windowsTerminalProvider } from "./windows-terminal";
import { zedProvider } from "./zed-provider";

const registry = new ProviderRegistry();
registry.register(alacrittyProvider);
registry.register(bananaProvider);
registry.register(brandGuidelinesProvider);
registry.register(codexProvider);
registry.register(designSystemProvider);
registry.register(gimpProvider);
registry.register(kittyProvider);
registry.register(shadcnProvider);
registry.register(shikiProvider);
registry.register(slackProvider);
registry.register(vscodeProvider);
registry.register(warpProvider);
registry.register(windowsTerminalProvider);
registry.register(zedProvider);

export function getAvailableProviders() {
  return registry.getAll();
}

export function getPreviewableProviders() {
  return registry.getAllPreviewable();
}

export function getProvidersByCategory(category: string) {
  return registry.getByCategory(category as any);
}

export function convertTheme<T>(
  providerId: string,
  theme: TinteTheme,
): T | null {
  return registry.convert<T>(providerId, theme);
}

export function exportTheme(
  providerId: string,
  theme: TinteTheme,
  filename?: string,
) {
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
