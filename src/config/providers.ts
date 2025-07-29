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
  "Obsidian",
  "GIMP",
] as const;

export type Provider = (typeof PROVIDERS)[number];

export const PROVIDER_ICONS: Record<
  Provider,
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

export const ALL_PROVIDERS = [
  { id: "shadcn", name: "shadcn/ui", icon: ShadcnIcon },
  { id: "vscode", name: "VS Code", icon: VSCodeIcon },
  { id: "zed", name: "Zed", icon: ZedIcon },
  { id: "warp", name: "Warp", icon: WarpIcon },
  { id: "alacritty", name: "Alacritty", icon: AlacrittyIcon },
  { id: "slack", name: "Slack", icon: SlackIcon },
  { id: "kitty", name: "Kitty", icon: KittyIcon },
  { id: "ghostty", name: "Ghostty", icon: GhosttyIcon },
  { id: "obsidian", name: "Obsidian", icon: ObsidianIcon },
  {
    id: "windows-terminal",
    name: "Windows Terminal",
    icon: WindowsTerminalIcon,
  },
  { id: "jetbrains", name: "JetBrains", icon: JetBrainsIcon },
  { id: "replit", name: "Replit", icon: ReplitIcon },
  { id: "neovim", name: "Neovim", icon: NeovimIcon },
  { id: "cursor", name: "Cursor", icon: CursorIcon },
  { id: "gimp", name: "GIMP", icon: GIMPIcon },
];
