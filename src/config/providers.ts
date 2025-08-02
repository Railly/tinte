// Import removed to fix circular dependency
import { ShadcnIcon } from "@/components/shared/icons/shadcn";
import { VSCodeIcon } from "@/components/shared/icons/vscode";
import { WarpIcon } from "@/components/shared/icons/warp";
import { AlacrittyIcon } from "@/components/shared/icons/alacritty";
import { WindowsTerminalIcon } from "@/components/shared/icons/windows-terminal";
import { KittyIcon } from "@/components/shared/icons/kitty";
import { GhosttyIcon } from "@/components/shared/icons/ghostty";
import { CursorIcon } from "@/components/shared/icons/cursor";
import { JetBrainsIcon } from "@/components/shared/icons/jetbrains";
import { SlackIcon } from "@/components/shared/icons/slack";
import { ZedIcon } from "@/components/shared/icons/zed";
import { ReplitIcon } from "@/components/shared/icons/replit";
import { NeovimIcon } from "@/components/shared/icons/neovim";
import { ObsidianIcon } from "@/components/shared/icons/obsidian";
import { GIMPIcon } from "@/components/shared/icons/gimp";

export function getAvailableProviders() {
  return [];
}

export function getPreviewableProviders() {
  return [];
}

export function getProvidersByCategory(category: string) {
  return [];
}

export const LEGACY_PROVIDERS = [
  "shadcn/ui",
  "VS Code",
  "Warp",
  "Alacritty",
  "Windows Terminal",
  "Kitty",
  "Ghostty",
  "Cursor",
  "JetBrains",
  "Slack",
  "Zed",
  "Replit",
  "Neovim",
  "Obsidian",
  "GIMP",
] as const;

export type LegacyProvider = (typeof LEGACY_PROVIDERS)[number];

export const LEGACY_PROVIDER_ICONS: Record<
  LegacyProvider,
  React.ComponentType<{ className?: string }>
> = {
  "shadcn/ui": ShadcnIcon,
  "VS Code": VSCodeIcon,
  Warp: WarpIcon,
  Alacritty: AlacrittyIcon,
  "Windows Terminal": WindowsTerminalIcon,
  Kitty: KittyIcon,
  Ghostty: GhosttyIcon,
  Cursor: CursorIcon,
  JetBrains: JetBrainsIcon,
  Slack: SlackIcon,
  Zed: ZedIcon,
  Replit: ReplitIcon,
  Neovim: NeovimIcon,
  Obsidian: ObsidianIcon,
  GIMP: GIMPIcon,
};

export const PLANNED_PROVIDERS = [
  { id: "zed", name: "Zed", icon: ZedIcon, category: "editor" },
  { id: "warp", name: "Warp", icon: WarpIcon, category: "terminal" },
  { id: "alacritty", name: "Alacritty", icon: AlacrittyIcon, category: "terminal" },
  { id: "slack", name: "Slack", icon: SlackIcon, category: "other" },
  { id: "kitty", name: "Kitty", icon: KittyIcon, category: "terminal" },
  { id: "ghostty", name: "Ghostty", icon: GhosttyIcon, category: "terminal" },
  { id: "obsidian", name: "Obsidian", icon: ObsidianIcon, category: "other" },
  {
    id: "windows-terminal",
    name: "Windows Terminal",
    icon: WindowsTerminalIcon,
    category: "terminal",
  },
  { id: "jetbrains", name: "JetBrains", icon: JetBrainsIcon, category: "editor" },
  { id: "replit", name: "Replit", icon: ReplitIcon, category: "editor" },
  { id: "neovim", name: "Neovim", icon: NeovimIcon, category: "editor" },
  { id: "cursor", name: "Cursor", icon: CursorIcon, category: "editor" },
  { id: "gimp", name: "GIMP", icon: GIMPIcon, category: "design" },
];

// Legacy compatibility exports
export const PROVIDERS = LEGACY_PROVIDERS;
export type Provider = LegacyProvider;
export const PROVIDER_ICONS = LEGACY_PROVIDER_ICONS;
export const ALL_PROVIDERS = [
  { id: "shadcn", name: "shadcn/ui", icon: ShadcnIcon },
  { id: "vscode", name: "VS Code", icon: VSCodeIcon },
  ...PLANNED_PROVIDERS,
];
