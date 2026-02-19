const SKILL_MD = `---
name: ray
description: Generate code screenshots via ray.tinte.dev API. Use when user asks for code screenshots, code images, code snippets as images, or says "ray". Calls POST https://ray.tinte.dev/api/v1/screenshot and saves the PNG result.
---

# Ray - Code Screenshots

Generate code screenshots by calling the ray.tinte.dev API.

## Screenshot API

\`\`\`
POST https://ray.tinte.dev/api/v1/screenshot
Content-Type: application/json
\`\`\`

For local dev: \`POST http://localhost:3002/api/v1/screenshot\`

Rate limit: 60 requests / 60s per IP.

### Parameters

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| \`code\` | string | *required* | 1-10,000 chars |
| \`language\` | string | \`"typescript"\` | typescript, javascript, python, rust, go, java, cpp, c, html, css, json, bash, sql, markdown, toml |
| \`theme\` | string or TinteBlock | \`"one-hunter"\` | Slug from tinte.dev or inline object |
| \`mode\` | \`"dark"\` \\| \`"light"\` | \`"dark"\` | |
| \`padding\` | number | \`32\` | 0-256 |
| \`fontSize\` | number | \`14\` | 8-32 |
| \`lineNumbers\` | boolean | \`true\` | |
| \`title\` | string | \`""\` | Window chrome title (max 100) |
| \`background\` | string | \`"midnight"\` | midnight, sunset, ocean, forest, ember, steel, aurora, none |
| \`format\` | \`"png"\` \\| \`"svg"\` | \`"png"\` | |
| \`scale\` | number | \`2\` | 1-4 (retina) |

### Example

\`\`\`bash
curl -s -X POST https://ray.tinte.dev/api/v1/screenshot \\
  -H 'Content-Type: application/json' \\
  -d '{
    "code": "const greeting = \\\\"Hello, world!\\\\";",
    "language": "typescript",
    "theme": "one-hunter",
    "title": "hello.ts"
  }' -o screenshot.png && open screenshot.png
\`\`\`

## Extract Theme API

\`\`\`
POST https://ray.tinte.dev/api/v1/extract-theme
Content-Type: multipart/form-data
\`\`\`

Upload an image to extract a code editor color theme. Two modes:

| Mode | Query param | Rate limit | Description |
|------|-------------|------------|-------------|
| Fast | \`?mode=fast\` (default) | None | Color extraction via Vibrant.js, no AI |
| AI | \`?mode=ai&model=MODEL\` | 20 req / 60s per IP | LLM-powered palette mapping |

### AI Models

| Model | Description |
|-------|-------------|
| \`google/gemini-2.5-flash-lite\` | Fast, enhanced palette mapping |
| \`anthropic/claude-haiku-4.5\` | Balanced quality/speed (default) |
| \`anthropic/claude-sonnet-4.5\` | Highest fidelity |

### Example

\`\`\`bash
# Fast mode (free, no limit)
curl -s -X POST https://ray.tinte.dev/api/v1/extract-theme \\
  -F "image=@photo.jpg" | jq

# AI mode
curl -s -X POST "https://ray.tinte.dev/api/v1/extract-theme?mode=ai&model=anthropic/claude-haiku-4.5" \\
  -F "image=@photo.jpg" | jq
\`\`\`

### Response

\`\`\`json
{
  "dark": { "bg": "#0a0a12", "bg_2": "#0f0f18", ... },
  "light": { "bg": "#fafafa", "bg_2": "#f0f0f0", ... },
  "gradient": "linear-gradient(...)",
  "name": "Sunset Harbour",
  "swatches": { "vibrant": { "hex": "#e84393", "population": 1234 }, ... },
  "mode": "ai"
}
\`\`\`

## Rate Limit Status API

\`\`\`
GET https://ray.tinte.dev/api/v1/ratelimit-status
\`\`\`

Check remaining AI extraction quota without consuming tokens.

\`\`\`json
{ "remaining": 18, "limit": 20, "reset": 1771478280000 }
\`\`\`

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

- Default: \`"one-hunter"\` (Vercel-inspired dark theme)
- Any slug from tinte.dev: \`"github-dark"\`, \`"dracula"\`, \`"catppuccin"\`, etc.
- Inline TinteBlock object with 13 semantic colors (bg, bg_2, tx, tx_2, tx_3, ui, ui_2, ui_3, ac_1, ac_2, ac_3, pr, sc)

## Workflow

1. Identify the code to screenshot (from file, clipboard, or user input)
2. Detect language from file extension or content
3. Call the API via curl
4. Save the PNG and open it
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
