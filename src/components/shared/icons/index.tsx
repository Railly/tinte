import type { ComponentType, SVGProps } from "react";

export { AlacrittyIcon } from "./alacritty";
export { BananaIcon } from "./banana";
export { ChatGPTIcon } from "./chatgpt";
export { ClerkIcon } from "./clerk";
export { CrafterStationIcon } from "./crafter-station";
export { CSSIcon } from "./css";
export { CursorIcon } from "./cursor";
export { default as DiscordIcon } from "./discord";
export { ElementsIcon } from "./elements";
export { ElevenLabsIcon } from "./elevenlabs";
export { Folder as FolderIcon } from "./folder";
export { FolderOpened as FolderOpenedIcon } from "./folder-opened";
export { GhosttyIcon } from "./ghostty";
export { default as GithubIcon } from "./github";
export { GIMPIcon } from "./gimp";
export { BrandGolang as GolangIcon } from "./golang";
export { Javascript as JavascriptIcon } from "./javascript";
export { JetBrainsIcon } from "./jetbrains";
export { Json as JsonIcon } from "./json";
export { KeboIcon } from "./kebo";
export { KittyIcon } from "./kitty";
export { LinearIcon } from "./linear";
export { Markdown as MarkdownIcon } from "./markdown";
export { NeovimIcon } from "./neovim";
export { ObsidianIcon } from "./obsidian";
export { PerplexityIcon } from "./perplexity";
export { Python as PythonIcon } from "./python";
export { default as RaycastIcon } from "./raycast";
export { ReplitIcon } from "./replit";
export { ShadcnIcon } from "./shadcn";
export { ShikiIcon } from "./shiki";
export { SlackIcon } from "./slack";
export { SpotifyIcon } from "./spotify";
export { SupabaseIcon } from "./supabase";
export { TailwindIcon } from "./tailwind";
export { TriggerIcon } from "./trigger";
export { default as TweakCNIcon } from "./tweakcn";
export { default as TwitterIcon } from "./twitter";
export { Typescript as TypescriptIcon } from "./typescript";
export { VercelIcon } from "./vercel";
export { VSCodeIcon } from "./vscode";
export { WarpIcon } from "./warp";
export { WindowsTerminalIcon } from "./windows-terminal";
export { ZedIcon } from "./zed";

import { AlacrittyIcon } from "./alacritty";
import { BananaIcon } from "./banana";
import { ChatGPTIcon } from "./chatgpt";
import { ClerkIcon } from "./clerk";
import { CrafterStationIcon } from "./crafter-station";
import { CSSIcon } from "./css";
import { CursorIcon } from "./cursor";
import DiscordIcon from "./discord";
import { ElementsIcon } from "./elements";
import { ElevenLabsIcon } from "./elevenlabs";
import { Folder } from "./folder";
import { FolderOpened } from "./folder-opened";
import { GhosttyIcon } from "./ghostty";
import GithubIcon from "./github";
import { GIMPIcon } from "./gimp";
import { BrandGolang } from "./golang";
import { Javascript } from "./javascript";
import { JetBrainsIcon } from "./jetbrains";
import { Json } from "./json";
import { KeboIcon } from "./kebo";
import { KittyIcon } from "./kitty";
import { LinearIcon } from "./linear";
import { Markdown } from "./markdown";
import { NeovimIcon } from "./neovim";
import { ObsidianIcon } from "./obsidian";
import { PerplexityIcon } from "./perplexity";
import { Python } from "./python";
import RaycastIcon from "./raycast";
import { ReplitIcon } from "./replit";
import { ShadcnIcon } from "./shadcn";
import { ShikiIcon } from "./shiki";
import { SlackIcon } from "./slack";
import { SpotifyIcon } from "./spotify";
import { SupabaseIcon } from "./supabase";
import { TailwindIcon } from "./tailwind";
import { TriggerIcon } from "./trigger";
import TweakCNIcon from "./tweakcn";
import TwitterIcon from "./twitter";
import { Typescript } from "./typescript";
import { VercelIcon } from "./vercel";
import { VSCodeIcon } from "./vscode";
import { WarpIcon } from "./warp";
import { WindowsTerminalIcon } from "./windows-terminal";
import { ZedIcon } from "./zed";

type IconProps = { className?: string } | SVGProps<SVGSVGElement>;
type IconComponent = ComponentType<IconProps>;

export const icons = {
  alacritty: AlacrittyIcon,
  banana: BananaIcon,
  chatgpt: ChatGPTIcon,
  clerk: ClerkIcon,
  "crafter-station": CrafterStationIcon,
  css: CSSIcon,
  cursor: CursorIcon,
  discord: DiscordIcon,
  elements: ElementsIcon,
  elevenlabs: ElevenLabsIcon,
  folder: Folder,
  "folder-opened": FolderOpened,
  ghostty: GhosttyIcon,
  github: GithubIcon,
  gimp: GIMPIcon,
  golang: BrandGolang,
  javascript: Javascript,
  jetbrains: JetBrainsIcon,
  json: Json,
  kebo: KeboIcon,
  kitty: KittyIcon,
  linear: LinearIcon,
  markdown: Markdown,
  neovim: NeovimIcon,
  obsidian: ObsidianIcon,
  perplexity: PerplexityIcon,
  python: Python,
  raycast: RaycastIcon,
  replit: ReplitIcon,
  shadcn: ShadcnIcon,
  shiki: ShikiIcon,
  slack: SlackIcon,
  spotify: SpotifyIcon,
  supabase: SupabaseIcon,
  tailwind: TailwindIcon,
  trigger: TriggerIcon,
  tweakcn: TweakCNIcon,
  twitter: TwitterIcon,
  typescript: Typescript,
  vercel: VercelIcon,
  vscode: VSCodeIcon,
  warp: WarpIcon,
  "windows-terminal": WindowsTerminalIcon,
  zed: ZedIcon,
} as const;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  ...props
}: { name: IconName } & IconProps) {
  const IconComponent = icons[name] as IconComponent;
  return <IconComponent {...props} />;
}
