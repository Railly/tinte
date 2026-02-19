<h3 align="center">
  <a href="https://tinte.dev" target="_blank">
    <img src="https://github.com/Railly/tinte/blob/main/src/app/icon.svg" width="80" alt="Tinte Logo"/>
  </a>
  <br/>
  <span style="font-weight:600;font-size:20px;color:#2563EB;">Tinte</span>
  <br/>
  <br/>
  <a href="https://vercel.com/oss" target="_blank">
    <img src="https://vercel.com/oss/program-badge.svg" alt="Vercel OSS Program"/>
  </a>
  <a href="https://github.com/Railly/tinte/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/Railly/tinte?style=social" alt="GitHub stars"/>
  </a>
  <a href="https://github.com/Railly/tinte/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/Railly/tinte" alt="License"/>
  </a>
</h3>

<p align="center">
  Theme generator for VS Code, shadcn/ui, and more — with Ray, a free code screenshot tool
</p>

## Ray by Tinte

**[ray.tinte.dev](https://ray.tinte.dev)** is a free code screenshot tool with professional syntax highlighting.

### Features

- 500+ syntax highlighting themes (VS Code, Material, GitHub, and more)
- 16 programming languages supported
- Export to PNG, SVG, or clipboard
- Free REST API (60 requests/minute, no authentication required)
- Claude Code and Cursor skill support for AI-native workflows

### Quick Start

Install the Ray skill for Claude Code or Cursor:

```bash
npx skills add Railly/tinte
```

Use the `/ray` command to generate code screenshots directly from your editor.

### API

The Ray API is free and requires no authentication. Perfect for integrating code screenshots into your documentation, blogs, or automation workflows.

**Documentation**: [ray.tinte.dev/docs](https://ray.tinte.dev/docs)

**Example**:

```bash
curl -X POST https://ray.tinte.dev/api/v1/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(\"Hello, world!\");",
    "language": "javascript",
    "theme": "one-dark-pro"
  }' \
  --output screenshot.png
```

## Tinte Theme Generator

The original Tinte project generates themes for VS Code, shadcn/ui, and other tools.

### Features

- 500+ themes for VS Code and shadcn/ui
- Theme extraction from images
- Open source and community-driven

### Links

- **Ray**: [ray.tinte.dev](https://ray.tinte.dev)
- **Theme Generator**: [tinte.railly.dev](https://tinte.railly.dev)
- **GitHub**: [github.com/Railly/tinte](https://github.com/Railly/tinte)
- **API Docs**: [ray.tinte.dev/docs](https://ray.tinte.dev/docs)

## License

MIT License - see [LICENSE](LICENSE) for details.
