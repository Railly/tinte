export const siteConfig = {
  name: "Tinte",
  url: "https://tinte.dev",
  description:
    "Agent-native design system infrastructure. Generate, compile, install, and preview design systems from one source of truth.",
  longDescription:
    "Agent-native design system infrastructure for shadcn/ui. 13 semantic OKLCH tokens compile to presets, VS Code themes, terminal configs, and 19+ formats. Install with one command via shadcn CLI v4. 500+ presets, AI generation, agent skill included.",
  keywords: [
    "shadcn preset",
    "design system infrastructure",
    "agent-native",
    "shadcn/ui themes",
    "shadcn cli v4",
    "npx shadcn add preset",
    "registry base",
    "registry font",
    "OKLCH colors",
    "semantic color system",
    "AI design system",
    "preset marketplace",
    "shadcn registry",
    "design tokens",
    "css variables",
    "tailwind themes",
    "VS Code themes",
    "dark mode",
    "light mode",
  ],
  author: {
    name: "Railly Hugo",
    url: "https://raillyhugo.dev",
    twitter: "@raillyhugo",
  },
  links: {
    twitter: "https://twitter.com/raillyhugo",
    github: "https://github.com/railly/tinte",
    discord: "https://discord.gg/W5sRKxqxH8",
  },
  features: [
    "Install presets with one command via shadcn CLI v4",
    "500+ design system presets ready to use",
    "13 semantic OKLCH tokens to 30+ CSS variables",
    "AI-powered preset generation from descriptions",
    "19 export formats from one source of truth",
    "Agent skill for Claude Code, Cursor, Windsurf",
    "Image-to-preset pipeline via Ray",
    "Open registry compatible with shadcn ecosystem",
  ],
  categories: [
    "Design System Infrastructure",
    "shadcn Ecosystem",
    "Developer Tools",
    "Agent Tools",
    "Color Systems",
    "Web Development",
  ],
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
