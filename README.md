<h3 align="center">
  <a href="https://tinte.dev" target="_blank">
    <img src="https://github.com/Railly/tinte/blob/main/apps/web/src/app/icon.svg" width="80" alt="Tinte Logo"/>
  </a>
  <br/>
  <span style="font-weight:600;font-size:20px;color:#2563EB;">Tinte</span>
  <br/>
  <br/>
  <a href="https://vercel.com/oss" target="_blank">
    <img src="https://vercel.com/oss/program-badge.svg" alt="Vercel OSS Program"/>
  </a>
  <br/>
  <a href="https://github.com/Railly/tinte/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/Railly/tinte?style=social" alt="GitHub stars"/>
  </a>
  <a href="https://github.com/Railly/tinte/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/Railly/tinte" alt="License"/>
  </a>
</h3>

<p align="center">
  Agent-native design system infrastructure. Generate, compile, install, and preview design systems from one source of truth.
</p>

## Quick Start

Install a Tinte design system into any shadcn/ui project:

```bash
npx shadcn@latest add https://tinte.dev/api/preset/one-hunter
```

Install the Tinte skill for Claude Code, Cursor, or any coding agent:

```bash
npx skills add Railly/tinte
```

## How It Works

Tinte maintains a theme graph of 13 semantic OKLCH color tokens that compiles to:

- **shadcn/ui presets** — `registry:base` + `registry:font` items, compatible with shadcn/cli v4
- **VS Code themes** — Full editor themes with syntax highlighting
- **Terminal configs** — Alacritty, Kitty, Warp, Windows Terminal
- **Design tools** — GIMP, Slack, design system tokens
- **19+ formats** from the same source of truth

## Preset API (shadcn v4)

Every public Tinte theme is installable as a shadcn `registry:base` item:

```bash
npx shadcn@latest add https://tinte.dev/api/preset/{slug}
npx shadcn@latest add https://tinte.dev/api/preset/{slug}/font?variable=sans
```

Get the full preset pack (base + fonts + install commands):

```
GET https://tinte.dev/api/preset/{slug}?type=pack
```

Browse themes:

```
GET https://tinte.dev/api/themes/public?search=minimal
```

## Ray by Tinte

**[ray.tinte.dev](https://ray.tinte.dev)** — code screenshots + theme extraction.

- 500+ syntax themes, 16 languages, PNG/SVG export
- Free REST API (60 req/min, no auth)
- Extract color themes from images: `POST ray.tinte.dev/api/v1/extract-theme`
- Screenshot with any Tinte theme: `POST ray.tinte.dev/api/v1/screenshot`

```bash
curl -X POST https://ray.tinte.dev/api/v1/screenshot \
  -H "Content-Type: application/json" \
  -d '{"code": "const x = 42;", "language": "typescript", "theme": "one-hunter"}' \
  --output screenshot.png
```

## Ecosystem

| Product | Role | URL |
|---------|------|-----|
| **Tinte** | Generate and compile design systems | [tinte.dev](https://tinte.dev) |
| **Elements** | Install via shadcn registry | [tryelements.dev](https://tryelements.dev) |
| **Ray** | Preview and screenshot | [ray.tinte.dev](https://ray.tinte.dev) |

> Tinte generates the system, Elements installs it, Ray shows it.

## Packages

- `@tinte/core` — Theme primitives, OKLCH color model, type definitions
- `@tinte/providers` — 19+ format converters (shadcn, VS Code, terminals, design tools)
- `@tinte/cli` — CLI for theme installation

## Development

```bash
bun install      # Install dependencies
bun dev          # Start development server
bun build        # Production build
```

## Links

- **Tinte**: [tinte.dev](https://tinte.dev)
- **Ray**: [ray.tinte.dev](https://ray.tinte.dev)
- **Elements**: [tryelements.dev](https://tryelements.dev)
- **Skill API**: [tinte.dev/api/skill](https://tinte.dev/api/skill)
- **API Docs**: [ray.tinte.dev/docs](https://ray.tinte.dev/docs)

## License

MIT License - see [LICENSE](LICENSE) for details.
