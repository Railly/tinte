const SKILL_MD = `---
name: tinte
description: Agent-native design system infrastructure. Browse, install, and preview design systems from tinte.dev. Use when user asks about themes, design systems, presets, color palettes, or says "tinte". Works with shadcn/cli v4 presets and registries.
---

# Tinte - Design System Infrastructure

Generate, compile, install, and preview design systems from one source of truth.

Tinte maintains a theme graph of 13 semantic OKLCH color tokens that compiles to shadcn/ui presets, VS Code themes, terminal configs, and 19+ other formats.

## Preset API (shadcn v4 compatible)

Every public Tinte theme is installable as a shadcn \`registry:base\` item.

### Install a theme

\`\`\`bash
npx shadcn@latest add https://tinte.dev/api/preset/{slug}
\`\`\`

### Install theme fonts

\`\`\`bash
npx shadcn@latest add https://tinte.dev/api/preset/{slug}/font?variable=sans
npx shadcn@latest add https://tinte.dev/api/preset/{slug}/font?variable=mono
\`\`\`

### Get full preset pack (base + fonts + install commands)

\`\`\`
GET https://tinte.dev/api/preset/{slug}?type=pack
\`\`\`

Response:

\`\`\`json
{
  "base": { "$schema": "...", "name": "...", "type": "registry:base", "cssVars": { "light": {...}, "dark": {...} } },
  "fonts": [{ "$schema": "...", "name": "font-inter", "type": "registry:font", "font": {...} }],
  "slug": "theme-slug",
  "install": {
    "base": "npx shadcn@latest add https://tinte.dev/api/preset/{slug}",
    "fonts": ["npx shadcn@latest add https://tinte.dev/r/font/inter?variable=sans"]
  }
}
\`\`\`

## Browse Themes

\`\`\`
GET https://tinte.dev/api/themes/public?search={query}&limit=20&page=1
\`\`\`

Optional filters: \`?vendor=tinte|tweakcn|rayso\`

Response includes \`themes[]\` with \`slug\`, \`name\`, \`concept\`, and color tokens.

## Get Theme Details

\`\`\`
GET https://tinte.dev/api/themes/slug/{slug}
\`\`\`

Returns full theme data including light/dark color blocks and overrides.

## Registry Routes (shadcn compatible)

These routes serve raw \`registry:base\` and \`registry:font\` items:

\`\`\`
GET https://tinte.dev/r/{slug}                    # registry:base or registry:theme
GET https://tinte.dev/r/{slug}?type=registry:base  # explicit base type
GET https://tinte.dev/r/font/{family}?variable=sans # registry:font
\`\`\`

## Extract Theme from Image

Upload a screenshot or design image to extract a color theme:

\`\`\`bash
curl -s -X POST https://ray.tinte.dev/api/v1/extract-theme \\
  -F "image=@design.png" | jq
\`\`\`

AI mode for higher fidelity:

\`\`\`bash
curl -s -X POST "https://ray.tinte.dev/api/v1/extract-theme?mode=ai&model=anthropic/claude-haiku-4.5" \\
  -F "image=@design.png" | jq
\`\`\`

Response:

\`\`\`json
{
  "dark": { "bg": "#0a0a12", "bg_2": "#0f0f18", "ui": "...", "tx": "...", "pr": "...", "sc": "...", "ac_1": "...", "ac_2": "...", "ac_3": "..." },
  "light": { "bg": "#fafafa", "bg_2": "#f0f0f0", "..." },
  "name": "Extracted Theme Name",
  "gradient": "linear-gradient(...)",
  "swatches": { "vibrant": { "hex": "#e84393" } }
}
\`\`\`

## Screenshot Preview

Generate a code screenshot with any Tinte theme applied:

\`\`\`bash
curl -s -X POST https://ray.tinte.dev/api/v1/screenshot \\
  -H 'Content-Type: application/json' \\
  -d '{
    "code": "const x = 42;",
    "language": "typescript",
    "theme": "{slug}",
    "title": "preview.ts"
  }' -o preview.png
\`\`\`

## Agent Workflows

### 1. Browse and install a design system

\`\`\`
1. GET https://tinte.dev/api/themes/public?search=minimal -> pick theme
2. GET https://tinte.dev/api/preset/{slug}?type=pack -> get install commands
3. npx shadcn@latest add https://tinte.dev/api/preset/{slug} -> install base
4. npx shadcn@latest add https://tinte.dev/api/preset/{slug}/font?variable=sans -> install fonts
5. npx shadcn info --json -> verify
\`\`\`

### 2. Extract design system from screenshot

\`\`\`
1. POST ray.tinte.dev/api/v1/extract-theme -F image=@screenshot.png -> get TinteBlock
2. Use extracted colors to search for matching themes or create new one
3. Install via preset API
\`\`\`

### 3. Switch design system

\`\`\`
1. npx shadcn info --json -> read current project config
2. GET https://tinte.dev/api/themes/public?search=dark+minimal -> browse alternatives
3. npx shadcn@latest add https://tinte.dev/api/preset/{new-slug} -> overwrite with new theme
\`\`\`

### 4. Preview result

\`\`\`
1. POST ray.tinte.dev/api/v1/screenshot with theme slug -> get PNG
2. Open screenshot to verify visual result
\`\`\`

## Color Model

Tinte uses 13 semantic OKLCH tokens per mode (light/dark):

| Token | Role |
|-------|------|
| bg | Background |
| bg_2 | Elevated surface |
| ui | Border, separator |
| ui_2 | Subtle border |
| ui_3 | Hover state |
| tx | Primary text |
| tx_2 | Secondary text |
| tx_3 | Muted text |
| pr | Primary accent |
| sc | Secondary accent |
| ac_1 | Accent 1 |
| ac_2 | Accent 2 |
| ac_3 | Accent 3 |

These compile to 30+ shadcn CSS variables (background, foreground, card, primary, secondary, muted, accent, destructive, chart-1..5, sidebar-*, etc.) with OKLCH color space formatting.
`;

export async function GET() {
  return new Response(SKILL_MD, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'inline; filename="SKILL.md"',
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
