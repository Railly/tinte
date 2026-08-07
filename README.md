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
  <br/><br/>
  <a href="https://github.com/Railly/tinte/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/Railly/tinte?style=social" alt="GitHub stars"/>
  </a>
  &nbsp;
  <a href="https://github.com/Railly/tinte/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/Railly/tinte" alt="License"/>
  </a>
</h3>

<p align="center">
  Compile your design system into an Agent Plugin. Extract an identity from any reference, emit SKILL.md + tokens.css, lint what bypasses your tokens.
</p>

A coding agent writes on-brand UI when it can read your tokens as an API and your
composition rules as instructions. Tinte compiles both from one identity config
into a single installable artifact.

## Quick Start

```bash
bunx tinte from --emit-script       # print the extraction script for a live page
bunx tinte from --normalize <json>  # turn captured styles into a draft identity
bunx tinte build --plugin           # compile the identity into an Agent Plugin
bunx tinte lint <paths>             # exit 1 on any color that bypasses the tokens
```

Extraction, compilation, and enforcement all read the same `tinte.config.json`.
Nothing is restated by hand.

`tinte build --plugin` emits:

```
acme-plugin/
├── plugin.json
└── skills/
    └── acme-design/
        ├── SKILL.md
        └── references/
            └── tokens.css
```

`SKILL.md` carries the type scale, the voice, and the composition law.
`tokens.css` is the token file the agent reads as an API.

## This site serves its own design context

[tinte.dev](https://tinte.dev) is styled by the plugin Tinte compiles from its own
config, and both artifacts are fetchable at their real paths:

- [tinte.dev/design.md](https://tinte.dev/design.md)
- [tinte.dev/tokens.css](https://tinte.dev/tokens.css)

An agent can install this design system the same way it would install yours.

## Theme builder

The classic workbench is still here: start from a reference, convert to any
provider, install it.

```bash
bunx tinte <theme-slug>             # install into VS Code, Cursor, or Zed
npx shadcn@latest add https://tinte.dev/api/preset/one-hunter
```

13 semantic OKLCH tokens compile to shadcn/ui presets, VS Code themes, terminal
configs (Alacritty, Kitty, Warp, Windows Terminal), and 19+ formats from the same
source of truth.

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
| **Tinte** | Compile design systems into Agent Plugins | [tinte.dev](https://tinte.dev) |
| **Elements** | Install via shadcn registry | [tryelements.dev](https://tryelements.dev) |
| **Ray** | Preview and screenshot | [ray.tinte.dev](https://ray.tinte.dev) |

> Tinte generates the system, Elements installs it, Ray shows it.

## Packages

- `@tinte/core` — Theme primitives, OKLCH color model, type definitions
- `@tinte/providers` — 19+ format converters (shadcn, VS Code, terminals, design tools)
- `@tinte/cli` — Agent Plugin compiler (`from`, `build`, `lint`) and theme installer

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
