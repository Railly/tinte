---
name: ray
description: Generate code screenshots via ray.tinte.dev API. Use when user asks for code screenshots, code images, code snippets as images, or says "ray". Calls POST https://ray.tinte.dev/api/v1/screenshot and saves the PNG result.
---

# Ray - Code Screenshots

Generate code screenshots by calling the ray.tinte.dev API.

## API

```
POST https://ray.tinte.dev/api/v1/screenshot
Content-Type: application/json
```

## Parameters

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `code` | string | *required* | 1-10,000 chars |
| `language` | string | `"typescript"` | typescript, javascript, python, rust, go, java, cpp, c, html, css, json, bash, sql, markdown, toml |
| `theme` | string or TinteBlock | `"one-hunter"` | Slug from tinte.dev or inline object |
| `mode` | `"dark"` \| `"light"` | `"dark"` | |
| `padding` | number | `32` | 0-256 |
| `fontSize` | number | `14` | 8-32 |
| `lineNumbers` | boolean | `true` | |
| `title` | string | `""` | Window chrome title (max 100) |
| `background` | string | `"midnight"` | midnight, sunset, ocean, forest, ember, steel, aurora, none |
| `format` | `"png"` \| `"svg"` | `"png"` | |
| `scale` | number | `2` | 1-4 (retina) |

## Workflow

1. Identify the code to screenshot (from file, clipboard, or user input)
2. Detect language from file extension or content
3. Call the API via curl
4. Save the PNG and open it

## Example

```bash
curl -s -X POST https://ray.tinte.dev/api/v1/screenshot \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "const greeting = \"Hello, world!\";",
    "language": "typescript",
    "theme": "one-hunter",
    "title": "hello.ts"
  }' -o screenshot.png && open screenshot.png
```

## Language Detection

| Extension | Language |
|-----------|----------|
| .ts, .tsx | typescript |
| .js, .jsx | javascript |
| .py | python |
| .rs | rust |
| .go | go |
| .java | java |
| .cpp, .cc, .cxx | cpp |
| .c, .h | c |
| .html | html |
| .css | css |
| .json | json |
| .sh, .bash | bash |
| .sql | sql |
| .md | markdown |
| .toml | toml |

## Themes

- Default: `"one-hunter"` (Vercel-inspired dark theme)
- Any slug from tinte.dev: `"github-dark"`, `"dracula"`, `"catppuccin"`, etc.
- Inline TinteBlock object with 13 semantic colors (bg, tx, tx_2, tx_3, ui, ui_2, ui_3, ac_1, ac_2, ac_3, pr, sc, nt)
