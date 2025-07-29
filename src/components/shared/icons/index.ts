import { CSSIcon } from "./css";
import { ShadcnIcon } from "./shadcn";
import { TailwindIcon } from "./tailwind";
import { VSCodeIcon } from "./vscode";
import { WindowsTerminalIcon } from "./windows-terminal";
import { KittyIcon } from "./kitty";
import { JetBrainsIcon } from "./jetbrains";
import { SlackIcon } from "./slack";
import { ZedIcon } from "./zed";
import { ReplitIcon } from "./replit";
import { NeovimIcon } from "./neovim";
import { GhosttyIcon } from "./ghostty";
import { WarpIcon } from "./warp";
import { CursorIcon } from "./cursor";
import { ObsidianIcon } from "./obsidian";
import { GIMPIcon } from "./gimp";
import { AlacrittyIcon } from "./alacritty";

export const ALL_PROVIDERS = [
  { id: "shadcn", name: "shadcn/ui", icon: ShadcnIcon },
  { id: "vscode", name: "VS Code", icon: VSCodeIcon },
  { id: "css", name: "CSS", icon: CSSIcon },
  { id: "tailwind", name: "Tailwind CSS", icon: TailwindIcon },
  {
    id: "windows-terminal",
    name: "Windows Terminal",
    icon: WindowsTerminalIcon,
  },
  { id: "kitty", name: "Kitty", icon: KittyIcon },
  { id: "jetbrains", name: "JetBrains", icon: JetBrainsIcon },
  { id: "slack", name: "Slack", icon: SlackIcon },
  { id: "zed", name: "Zed", icon: ZedIcon },
  { id: "replit", name: "Replit", icon: ReplitIcon },
  { id: "neovim", name: "Neovim", icon: NeovimIcon },
  { id: "ghostty", name: "Ghostty", icon: GhosttyIcon },
  { id: "warp", name: "Warp", icon: WarpIcon },
  { id: "cursor", name: "Cursor", icon: CursorIcon },
  { id: "obsidian", name: "Obsidian", icon: ObsidianIcon },
  { id: "gimp", name: "GIMP", icon: GIMPIcon },
  { id: "alacritty", name: "Alacritty", icon: AlacrittyIcon },
];
