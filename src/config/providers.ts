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

export const PROVIDERS = [
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
  "Obsidian"
] as const;

export type Provider = typeof PROVIDERS[number];

export const PROVIDER_ICONS: Record<Provider, React.ComponentType<{ className?: string }>> = {
  "shadcn/ui": ShadcnIcon,
  "VS Code": VSCodeIcon,
  "Warp": WarpIcon,
  "Alacritty": AlacrittyIcon,
  "Windows Terminal": WindowsTerminalIcon,
  "Kitty": KittyIcon,
  "Ghostty": GhosttyIcon,
  "Cursor": CursorIcon,
  "JetBrains": JetBrainsIcon,
  "Slack": SlackIcon,
  "Zed": ZedIcon,
  "Replit": ReplitIcon,
  "Neovim": NeovimIcon,
  "Obsidian": ObsidianIcon
};